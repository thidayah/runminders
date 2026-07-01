import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth-utils';
import { createSnapTransaction } from '@/lib/midtrans';
import { sendEventRegistrationEmail } from '@/lib/email';

const generateRegistrationNumber = async () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const generateRandomLetters = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 3; i++) result += letters.charAt(Math.floor(Math.random() * letters.length));
    return result;
  };

  const generateUniqueNumber = async (attempts = 0) => {
    if (attempts > 5) throw new Error('Gagal generate nomor registrasi unik');
    const registrationNumber = `REG-${today}${generateRandomLetters()}${Math.floor(100000 + Math.random() * 900000)}`;
    const { data } = await supabaseServer
      .from('registrations')
      .select('id')
      .eq('registration_number', registrationNumber)
      .maybeSingle();
    if (data) return await generateUniqueNumber(attempts + 1);
    return registrationNumber;
  };

  return await generateUniqueNumber();
};

export async function POST(request) {
  try {
    const decoded = verifyAuth(request);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Token tidak valid' }, { status: 401 });
    }

    const data = await request.json();

    const requiredFields = ['event_id', 'category_id', 'participant_full_name', 'participant_email', 'payment_method'];
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Field berikut wajib diisi: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const { data: event, error: eventError } = await supabaseServer
      .from('events')
      .select('*')
      .eq('id', data.event_id)
      .eq('is_active', true)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ success: false, message: 'Event tidak ditemukan atau tidak aktif' }, { status: 404 });
    }

    const { data: category, error: categoryError } = await supabaseServer
      .from('event_categories')
      .select('*')
      .eq('id', data.category_id)
      .eq('event_id', data.event_id)
      .eq('is_active', true)
      .single();

    if (categoryError || !category) {
      return NextResponse.json({ success: false, message: 'Kategori tidak ditemukan atau tidak aktif' }, { status: 404 });
    }

    if ((category.current_slots + category.waiting_list) >= category.max_slots) {
      return NextResponse.json({ success: false, message: 'Slot untuk kategori ini sudah penuh' }, { status: 400 });
    }

    // member_id dari token — bukan dari body
    const member_id = decoded.id;

    const { data: existingRegistration } = await supabaseServer
      .from('registrations')
      .select('id')
      .eq('event_id', data.event_id)
      .eq('member_id', member_id)
      .eq('category_id', data.category_id)
      .neq('status', 'cancelled');

    if (existingRegistration && existingRegistration.length > 0) {
      return NextResponse.json({ success: false, message: 'Anda sudah terdaftar di kategori ini' }, { status: 409 });
    }

    let paymentAmount = category.price;
    const now = new Date();
    if (event.has_early_bird && event.early_bird_end_date) {
      const earlyBirdEndDate = new Date(event.early_bird_end_date);
      if (now <= earlyBirdEndDate && category.early_bird_price) {
        paymentAmount = category.early_bird_price;
      }
    }

    const registrationNumber = await generateRegistrationNumber();

    const registrationData = {
      event_id: data.event_id,
      category_id: data.category_id,
      member_id,
      registration_number: registrationNumber,
      registration_date: new Date().toISOString(),
      participant_full_name: data.participant_full_name,
      participant_email: data.participant_email,
      participant_phone: data.participant_phone || null,
      participant_gender: data.participant_gender || null,
      participant_birth_date: data.participant_birth_date || null,
      emergency_contact_name: data.emergency_contact_name || null,
      emergency_contact_phone: data.emergency_contact_phone || null,
      emergency_contact_relation: data.emergency_contact_relation || null,
      medical_conditions: data.medical_conditions || null,
      blood_type: data.blood_type || null,
      tshirt_size: data.tshirt_size || null,
      payment_amount: paymentAmount,
      payment_currency: 'IDR',
      payment_method: data.payment_method,
      payment_status: 'pending',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: registration, error: registrationError } = await supabaseServer
      .from('registrations')
      .insert(registrationData)
      .select()
      .single();

    if (registrationError) {
      console.error('Error membuat registrasi:', registrationError);
      return NextResponse.json({ success: false, message: 'Gagal membuat registrasi. Silakan coba lagi.' }, { status: 500 });
    }

    const { error: updateSlotError } = await supabaseServer
      .from('event_categories')
      .update({
        current_slots: event.is_free ? category.current_slots + 1 : category.current_slots,
        waiting_list: !event.is_free ? (category.waiting_list || 0) + 1 : category.waiting_list,
        updated_at: new Date().toISOString()
      })
      .eq('id', category.id);

    if (updateSlotError) {
      await supabaseServer.from('registrations').delete().eq('id', registration.id);
      return NextResponse.json({ success: false, message: 'Gagal update slot kategori. Registrasi dibatalkan.' }, { status: 500 });
    }

    const { error: updateEventError } = await supabaseServer
      .from('events')
      .update({ current_participants: event.current_participants + 1, updated_at: new Date().toISOString() })
      .eq('id', event.id);

    if (updateEventError) {
      await supabaseServer.from('event_categories').update({ current_slots: category.current_slots, waiting_list: category.waiting_list }).eq('id', category.id);
      await supabaseServer.from('registrations').delete().eq('id', registration.id);
      return NextResponse.json({ success: false, message: 'Gagal update peserta event. Registrasi dibatalkan.' }, { status: 500 });
    }

    let snapTransaction = null;
    if (!event.is_free && paymentAmount > 0) {
      try {
        const snapResult = await createSnapTransaction({
          order_id: registration.registration_number,
          gross_amount: paymentAmount,
          customer_name: data.participant_full_name,
          customer_email: data.participant_email,
          customer_phone: data.participant_phone || '',
          item_details: [{
            id: registration.id,
            price: paymentAmount,
            quantity: 1,
            name: event.title,
            category: category.name,
            brand: process.env.APP_NAME || 'Runminders',
            merchant_name: event.organizer_name || ''
          }]
        });
        if (snapResult.success) snapTransaction = snapResult.data;
      } catch (error) {
        console.error('Error creating Snap transaction:', error);
      }
    }

    let emailResult = null;
    try {
      emailResult = await sendEventRegistrationEmail({
        toEmail: data.participant_email,
        fullName: data.participant_full_name,
        eventTitle: event.title,
        eventDate: event.event_date,
        eventLocation: event.location,
        categoryName: category.name,
        registrationNumber: registration.registration_number,
        paymentAmount,
        paymentMethod: data.payment_method,
        snapTransaction,
        isFree: event.is_free
      });
    } catch (emailError) {
      console.warn('Gagal mengirim email konfirmasi:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil dibuat!',
      data: {
        registration,
        snap_transaction: snapTransaction,
        email_delivered: emailResult ? emailResult.success : false,
        event: { id: event.id, title: event.title, event_date: event.event_date, location: event.location, is_free: event.is_free },
        category: { id: category.id, name: category.name, distance: category.distance }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('POST me/registrations error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server. Silakan coba lagi nanti.' }, { status: 500 });
  }
}

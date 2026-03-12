import { supabaseServer } from "@/lib/supabase";
import { NextResponse } from 'next/server';
import { createSnapTransaction } from "@/lib/midtrans";

// Helper untuk generate registration number
// const generateRegistrationNumber = async () => {
//   const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
//   const { data } = await supabaseServer
//     .from('registrations')
//     .select('registration_number')
//     .like('registration_number', `REG-${today}-%`)
//     .order('registration_number', { ascending: false })
//     .limit(1);

//   let sequence = 1;
//   if (data && data.length > 0) {
//     const lastNumber = data[0].registration_number;
//     const lastSequence = parseInt(lastNumber.split('-')[2]) || 0;
//     sequence = lastSequence + 1;
//   }

//   return `REG-${today}-${sequence.toString().padStart(5, '0')}`;
// };

// Helper untuk generate registration number dengan format: REG-YYYYMMDDXXXNNNNNN
const generateRegistrationNumber = async () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  
  // Generate 3 random uppercase letters
  const generateRandomLetters = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 3; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
  };
  
  // Generate 6 digit random number
  const generateRandomDigits = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // Generate unique number dengan retry
  const generateUniqueNumber = async (attempts = 0) => {
    if (attempts > 5) {
      throw new Error('Gagal generate nomor registrasi unik');
    }
    
    const randomLetters = generateRandomLetters();
    const randomDigits = generateRandomDigits();
    const registrationNumber = `REG-${today}${randomLetters}${randomDigits}`;
    
    // Cek apakah sudah ada di database
    const { data, error } = await supabaseServer
      .from('registrations')
      .select('id')
      .eq('registration_number', registrationNumber)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking registration number:', error);
      return registrationNumber;
    }
    
    if (data) {
      return await generateUniqueNumber(attempts + 1);
    }
    
    return registrationNumber;
  };
  
  return await generateUniqueNumber();
};

export async function POST(request) {
  try {
    const data = await request.json();

    // Validasi field wajib
    const requiredFields = [
      'event_id',
      'category_id',
      'member_id',
      'participant_full_name',
      'participant_email',
      'payment_method'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Field berikut wajib diisi: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Validasi event dan kategori
    const { data: event, error: eventError } = await supabaseServer
      .from('events')
      .select('*')
      .eq('id', data.event_id)
      .eq('is_active', true)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event tidak ditemukan atau tidak aktif'
        },
        { status: 404 }
      );
    }

    // Validasi kategori
    const { data: category, error: categoryError } = await supabaseServer
      .from('event_categories')
      .select('*')
      .eq('id', data.category_id)
      .eq('event_id', data.event_id)
      .eq('is_active', true)
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Kategori tidak ditemukan atau tidak aktif'
        },
        { status: 404 }
      );
    }

    // Cek apakah masih ada slot tersedia
    // if (category.current_slots >= category.max_slots) {
    if ((category.current_slots + category.waiting_list) >= category.max_slots) {
      return NextResponse.json(
        {
          success: false,
          message: 'Slot untuk kategori ini sudah penuh'
        },
        { status: 400 }
      );
    }

    // Cek apakah member sudah terdaftar di event yang sama dengan kategori yang sama
    const { data: existingRegistration } = await supabaseServer
      .from('registrations')
      .select('id')
      .eq('event_id', data.event_id)
      .eq('member_id', data.member_id)
      .eq('category_id', data.category_id)
      .neq('status', 'cancelled');

    if (existingRegistration && existingRegistration.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Anda sudah terdaftar di kategori ini'
        },
        { status: 409 }
      );
    }

    // Hitung harga
    let paymentAmount = category.price;
    const now = new Date();

    if (event.has_early_bird && event.early_bird_end_date) {
      const earlyBirdEndDate = new Date(event.early_bird_end_date);
      if (now <= earlyBirdEndDate && category.early_bird_price) {
        paymentAmount = category.early_bird_price;
      }
    }

    // Generate registration number
    const registrationNumber = await generateRegistrationNumber();

    // Siapkan data registration
    const registrationData = {
      event_id: data.event_id,
      category_id: data.category_id,
      member_id: data.member_id,
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

    // Insert registration ke database dalam transaction
    const { data: registration, error: registrationError } = await supabaseServer
      .from('registrations')
      .insert(registrationData)
      .select()
      .single();

    if (registrationError) {
      console.error('Error membuat registrasi:', registrationError);
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal membuat registrasi. Silakan coba lagi.',
        },
        { status: 500 }
      );
    }

    // Update current_slots for FREE, waiting_list for PAID di event_categories
    const { error: updateSlotError } = await supabaseServer
      .from('event_categories')
      .update({
        current_slots: event.is_free ? category.current_slots + 1 : category.current_slots,
        waiting_list: !event.is_free ?
          (category.waiting_list || 0) + 1 :
          category.waiting_list,
        updated_at: new Date().toISOString()
      })
      .eq('id', category.id);

    if (updateSlotError) {
      console.error('Error update slot kategori:', updateSlotError);
      // Rollback registration
      await supabaseServer
        .from('registrations')
        .delete()
        .eq('id', registration.id);

      return NextResponse.json(
        {
          success: false,
          message: 'Gagal update slot kategori. Registrasi dibatalkan.'
        },
        { status: 500 }
      );
    }

    // Update current_participants di events
    const { error: updateEventError } = await supabaseServer
      .from('events')
      .update({
        current_participants: event.current_participants + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', event.id);

    if (updateEventError) {
      console.error('Error update peserta event:', updateEventError);
      // Rollback slot update
      await supabaseServer
        .from('event_categories')
        .update({
          current_slots: category.current_slots,
          waiting_list: category.waiting_list,
          updated_at: category.updated_at
        })
        .eq('id', category.id);

      // Rollback registration
      await supabaseServer
        .from('registrations')
        .delete()
        .eq('id', registration.id);

      return NextResponse.json(
        {
          success: false,
          message: 'Gagal update peserta event. Registrasi dibatalkan.'
        },
        { status: 500 }
      );
    }

    // Buat Snap transaction jika bukan free event
    let snapTransaction = null;
    if (!event.is_free && paymentAmount > 0) {
      try {
        // Siapkan item details untuk Midtrans
        const itemDetails = [
          {
            id: registration.id,
            price: paymentAmount,
            quantity: 1,
            name: `${event.title}`,
            category: `${category.name}`,
            // category: 'Event Registration',
            brand: process.env.APP_NAME || 'Runminders',
            merchant_name: event.organizer_name || '',
          },
        ];

        // Buat Snap transaction
        const snapResult = await createSnapTransaction({
          order_id: registration.registration_number,
          gross_amount: paymentAmount,
          customer_name: data.participant_full_name,
          customer_email: data.participant_email,
          customer_phone: data.participant_phone || '',
          item_details: itemDetails,
        });

        if (snapResult.success) {
          snapTransaction = snapResult.data;
        } else {
          console.warn('Gagal membuat Snap transaction:', snapResult.error);
          // Lanjutkan tanpa Snap transaction
        }
      } catch (error) {
        console.error('Error creating Snap transaction:', error);
        // Lanjutkan tanpa Snap transaction
      }
    }

    let emailResult = null
    try {
      emailResult = await sendEventRegistrationEmail({
        toEmail: data.participant_email,
        fullName: data.participant_full_name,
        eventTitle: event.title,
        eventDate: event.event_date,
        eventLocation: event.location,
        categoryName: category.name,
        registrationNumber: registration.registration_number,
        paymentAmount: paymentAmount,
        paymentMethod: data.payment_method,
        snapTransaction: snapTransaction,
        isFree: event.is_free
      });
    } catch (emailError) {
      console.warn('Gagal mengirim email konfirmasi:', emailError);
      // Lanjutkan tanpa error karena email bukan critical path
    }

    // Response sukses
    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil dibuat!',
      data: {
        registration: registration,
        snap_transaction: snapTransaction, // Tambahkan Snap transaction data
        email_delivered: emailResult ? emailResult.success : false,
        event: {
          id: event.id,
          title: event.title,
          event_date: event.event_date,
          location: event.location,
          is_free: event.is_free
        },
        category: {
          id: category.id,
          name: category.name,
          distance: category.distance
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error membuat registrasi:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server. Silakan coba lagi nanti.',
        error
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    const memberId = searchParams.get('member_id');
    const eventId = searchParams.get('event_id');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('payment_status');
    const search = searchParams.get('search');

    // Build query
    let query = supabaseServer
      .from('registrations')
      .select(`
        *,
        event:events(id, title, event_date, location, image_url),
        category:event_categories(id, name, distance, price),
        member:members(id, email, full_name, avatar_url)
      `);

    // Apply filters
    if (memberId) {
      query = query.eq('member_id', memberId);
    }

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus);
    }

    if (search) {
      query = query.or(`registration_number.ilike.%${search}%,participant_full_name.ilike.%${search}%,participant_email.ilike.%${search}%`);
    }

    // Get total count
    const { count: totalCount } = await supabaseServer
      .from('registrations')
      .select('*', { count: 'exact', head: true });

    // Apply pagination and sorting
    const { data: registrations, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching registrations:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengambil data registrasi',
          error
        },
        { status: 500 }
      );
    }

    // Get payment transactions untuk setiap registration
    const registrationsWithPayments = await Promise.all(
      registrations.map(async (registration) => {
        const { data: paymentTransactions } = await supabaseServer
          .from('payment_transactions')
          .select('*')
          .eq('registration_id', registration.id)
          .order('created_at', { ascending: false });

        return {
          ...registration,
          payment_transactions: paymentTransactions || []
        };
      })
    );

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      message: 'Data registrasi berhasil diambil',
      data: {
        items: registrationsWithPayments,
        pagination: {
          current_page: page,
          per_page: limit,
          total_items: totalCount || 0,
          total_pages: totalPages,
          has_next_page: page < totalPages,
          has_previous_page: page > 1
        },
        filters: {
          member_id: memberId,
          event_id: eventId,
          status: status,
          payment_status: paymentStatus,
          search: search
        }
      }
    });

  } catch (error) {
    console.error('Get registrations error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server'
      },
      { status: 500 }
    );
  }
}
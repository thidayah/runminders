import { NextResponse } from 'next/server';
import { supabaseServer } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth-utils";

export async function GET(request, { params }) {
  try {
    // 1. Ambil token dari header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token autentikasi diperlukan'
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token tidak valid atau telah kedaluwarsa'
        },
        { status: 401 }
      );
    }

    // 2. Get registration ID 
    const { id: registrationId } = await params;    

    if (!registrationId) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID registrasi diperlukan'
        },
        { status: 400 }
      );
    }

    // 3. Get registration detail with event information
    const { data: registration, error: registrationError } = await supabaseServer
      .from('registrations')
      .select(`
        *,
        event:events(
          *,
          categories:event_categories(*)
        ),
        category:event_categories(
          *
        )
      `)
      .eq('id', registrationId)
      .eq('member_id', decoded.id) // Pastikan hanya member pemilik yang bisa akses
      .single();

    if (registrationError || !registration) {
      console.error('Error fetching registration detail:', registrationError);
      return NextResponse.json(
        {
          success: false,
          message: 'Registrasi tidak ditemukan atau Anda tidak memiliki akses'
        },
        { status: 404 }
      );
    }

    // 4. Get payment transactions for this registration
    const { data: paymentTransactions } = await supabaseServer
      .from('payment_transactions')
      .select('*')
      .eq('registration_id', registrationId)
      .order('created_at', { ascending: false });

    // 5. Get event categories separately if not included
    let eventCategories = [];
    if (registration.event && !registration.event.categories) {
      const { data: categories } = await supabaseServer
        .from('event_categories')
        .select('*')
        .eq('event_id', registration.event.id)
        .eq('is_active', true)
        .order('display_order');
      eventCategories = categories || [];
    } else if (registration.event?.categories) {
      eventCategories = registration.event.categories;
    }

    // 6. Format response data
    const responseData = {
      registration: {
        id: registration.id,
        registration_number: registration.registration_number,
        status: registration.status,
        payment_status: registration.payment_status,
        participant_full_name: registration.participant_full_name,
        participant_email: registration.participant_email,
        participant_phone: registration.participant_phone,
        emergency_contact_name: registration.emergency_contact_name,
        emergency_contact_phone: registration.emergency_contact_phone,
        medical_notes: registration.medical_notes,
        additional_notes: registration.additional_notes,
        payment_method: registration.payment_method,
        total_amount: registration.total_amount,
        payment_date: registration.payment_date,
        registration_date: registration.created_at,
        updated_at: registration.updated_at
      },
      event: registration.event ? {
        id: registration.event.id,
        title: registration.event.title,
        subtitle: registration.event.subtitle,
        description: registration.event.description,
        event_date: registration.event.event_date,
        start_time: registration.event.start_time,
        end_time: registration.event.end_time,
        registration_deadline: registration.event.registration_deadline,
        location: registration.event.location,
        location_type: registration.event.location_type,
        image_url: registration.event.image_url,
        base_price: registration.event.base_price,
        is_free: registration.event.is_free,
        max_participants: registration.event.max_participants,
        current_participants: registration.event.current_participants,
        is_active: registration.event.is_active,
        organizer_name: registration.event.organizer_name,
        organizer_contact: registration.event.organizer_contact,
        organizer_email: registration.event.organizer_email,
        terms_conditions: registration.event.terms_conditions,
        categories: eventCategories
      } : null,
      category: registration.category ? {
        id: registration.category.id,
        name: registration.category.name,
        description: registration.category.description,
        distance: registration.category.distance,
        price: registration.category.price,
        max_participants: registration.category.max_participants,
        is_active: registration.category.is_active
      } : null,
      payment_transactions: paymentTransactions || []
    };

    return NextResponse.json({
      success: true,
      message: 'Detail event berhasil diambil',
      data: responseData
    });

  } catch (error) {
    console.error('Get my event detail error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server'
      },
      { status: 500 }
    );
  }
}
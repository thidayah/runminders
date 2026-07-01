import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth-utils';

export async function GET(request) {
  try {
    const decoded = verifyAuth(request);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Token tidak valid' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    let query = supabaseServer
      .from('registrations')
      .select(`
        *,
        event:events(
          id, title, subtitle, description, event_date, location, location_type,
          image_url, base_price, is_free, max_participants, current_participants,
          is_active, organizer_name
        ),
        category:event_categories(id, name, distance, price)
      `)
      .eq('member_id', decoded.id);

    if (status !== 'all') query = query.eq('status', status);
    if (search) {
      query = query.or(`registration_number.ilike.%${search}%,event!inner(title.ilike.%${search}%)`);
    }

    let countQuery = supabaseServer
      .from('registrations')
      .select('id', { count: 'exact', head: true })
      .eq('member_id', decoded.id);

    if (status !== 'all') countQuery = countQuery.eq('status', status);

    const { count: totalCount } = await countQuery;

    const { data: registrations, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching my events:', error);
      return NextResponse.json({ success: false, message: 'Gagal mengambil data event Anda' }, { status: 500 });
    }

    const totalPages = Math.ceil(totalCount / limit);

    const formattedEvents = registrations.map(registration => ({
      id: registration.event.id,
      title: registration.event.title,
      subtitle: registration.event.subtitle,
      description: registration.event.description,
      event_date: registration.event.event_date,
      location: registration.event.location,
      location_type: registration.event.location_type,
      image_url: registration.event.image_url,
      base_price: registration.event.base_price,
      is_free: registration.event.is_free,
      max_participants: registration.event.max_participants,
      current_participants: registration.event.current_participants,
      is_active: registration.event.is_active,
      organizer_name: registration.event.organizer_name,
      category: registration.category ? {
        id: registration.category.id,
        name: registration.category.name,
        distance: registration.category.distance,
        price: registration.category.price
      } : null,
      registration: {
        id: registration.id,
        registration_number: registration.registration_number,
        status: registration.status,
        payment_status: registration.payment_status,
        participant_full_name: registration.participant_full_name,
        participant_email: registration.participant_email,
        participant_phone: registration.participant_phone,
        created_at: registration.created_at,
      }
    }));

    return NextResponse.json({
      success: true,
      message: 'Data event Anda berhasil diambil',
      data: {
        items: formattedEvents,
        pagination: {
          current_page: page,
          per_page: limit,
          total_items: totalCount || 0,
          total_pages: totalPages,
          has_next_page: page < totalPages,
          has_previous_page: page > 1
        },
        filters: { status, search, page, limit }
      }
    });

  } catch (error) {
    console.error('GET me/events error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

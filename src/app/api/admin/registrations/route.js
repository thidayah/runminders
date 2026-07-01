import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

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

    let query = supabaseServer
      .from('registrations')
      .select(`
        *,
        event:events(id, title, event_date, location, image_url),
        category:event_categories(id, name, distance, price),
        member:members(id, email, full_name, avatar_url)
      `);

    if (memberId) query = query.eq('member_id', memberId);
    if (eventId) query = query.eq('event_id', eventId);
    if (status) query = query.eq('status', status);
    if (paymentStatus) query = query.eq('payment_status', paymentStatus);
    if (search) {
      query = query.or(`registration_number.ilike.%${search}%,participant_full_name.ilike.%${search}%,participant_email.ilike.%${search}%`);
    }

    const { count: totalCount } = await supabaseServer
      .from('registrations')
      .select('*', { count: 'exact', head: true });

    const { data: registrations, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ success: false, message: 'Gagal mengambil data registrasi' }, { status: 500 });
    }

    const registrationsWithPayments = await Promise.all(
      registrations.map(async (registration) => {
        const { data: paymentTransactions } = await supabaseServer
          .from('payment_transactions')
          .select('*')
          .eq('registration_id', registration.id)
          .order('created_at', { ascending: false });
        return { ...registration, payment_transactions: paymentTransactions || [] };
      })
    );

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      message: 'Data registrasi berhasil diambil',
      data: {
        items: registrationsWithPayments,
        pagination: {
          current_page: page, per_page: limit, total_items: totalCount || 0,
          total_pages: totalPages, has_next_page: page < totalPages, has_previous_page: page > 1
        },
        filters: { member_id: memberId, event_id: eventId, status, payment_status: paymentStatus, search }
      }
    });

  } catch (error) {
    console.error('GET admin/registrations error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

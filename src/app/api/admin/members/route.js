import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;
    const isActive = searchParams.get('is_active');
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    let countQuery = supabaseServer.from('members').select('*', { count: 'exact', head: true });
    if (isActive) countQuery = countQuery.eq('is_active', isActive === 'true');
    if (role) countQuery = countQuery.eq('role', role);
    if (search) countQuery = countQuery.or(`email.ilike.%${search}%,full_name.ilike.%${search}%,phone_number.ilike.%${search}%`);

    const { count: totalItems, error: countError } = await countQuery;
    if (countError) {
      return NextResponse.json({ success: false, message: 'Gagal menghitung data member' }, { status: 500 });
    }

    let dataQuery = supabaseServer
      .from('members')
      .select('id,email,full_name,is_active,is_email_verified,role,created_at,updated_at,last_login_at,avatar_url,phone_number,provider');

    if (isActive) dataQuery = dataQuery.eq('is_active', isActive === 'true');
    if (role) dataQuery = dataQuery.eq('role', role);
    if (search) dataQuery = dataQuery.or(`email.ilike.%${search}%,full_name.ilike.%${search}%,phone_number.ilike.%${search}%`);

    dataQuery = dataQuery.order(sortBy, { ascending: sortOrder === 'asc' }).range(offset, offset + limit - 1);

    const { data: members, error: dataError } = await dataQuery;
    if (dataError) {
      return NextResponse.json({ success: false, message: 'Gagal mengambil data member' }, { status: 500 });
    }

    const formattedMembers = members.map(member => ({
      ...member,
      account_age_days: Math.floor((new Date() - new Date(member.created_at)) / (1000 * 60 * 60 * 24))
    }));

    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      success: true,
      message: 'Data member berhasil diambil',
      data: {
        items: formattedMembers,
        pagination: {
          current_page: page, per_page: limit, total_items: totalItems || 0,
          total_pages: totalPages, has_next_page: page < totalPages, has_previous_page: page > 1
        },
        filters: { is_active: isActive, search: search || null, sort_by: sortBy, sort_order: sortOrder }
      }
    });

  } catch (error) {
    console.error('GET admin/members error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

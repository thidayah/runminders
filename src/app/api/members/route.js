import { NextResponse } from 'next/server';
import { supabaseServer } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth-utils";

export async function GET(request) {
  try {
    // 1. Verifikasi token admin
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

    // 2. Cek apakah user adalah admin
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Akses ditolak. Hanya admin yang dapat mengakses resource ini'
        },
        { status: 403 }
      );
    }

    // 3. Ambil query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;
    
    const isActive = searchParams.get('is_active');
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // 4. Build query untuk mendapatkan total count
    let countQuery = supabaseServer
      .from('members')
      .select('*', { count: 'exact', head: true });

    // Apply filters ke count query
    if (isActive) {
      countQuery = countQuery.eq('is_active', isActive === 'true');
    }

    if (role) {
      countQuery = countQuery.eq('role', role);
    }

    if (search) {
      countQuery = countQuery.or(
        `email.ilike.%${search}%,full_name.ilike.%${search}%,phone_number.ilike.%${search}%`
      );
    }

    const { count: totalItems, error: countError } = await countQuery;

    if (countError) {
      console.error('Error counting members:', countError);
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal menghitung data member'
        },
        { status: 500 }
      );
    }

    // 5. Build query untuk mendapatkan data
    let dataQuery = supabaseServer
      .from('members')
      .select(`
        id,
        email,
        full_name,
        is_active,
        is_email_verified,
        role,
        created_at,
        updated_at,
        last_login_at,
        avatar_url,
        phone_number,
        provider
      `);

    // Apply filters
    if (isActive) {
      dataQuery = dataQuery.eq('is_active', isActive === 'true');
    }

    if (role) {
      countQuery = dataQuery.eq('role', role);
    }

    if (search) {
      dataQuery = dataQuery.or(
        `email.ilike.%${search}%,full_name.ilike.%${search}%,phone_number.ilike.%${search}%`
      );
    }

    // Apply sorting
    dataQuery = dataQuery.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    dataQuery = dataQuery.range(offset, offset + limit - 1);

    const { data: members, error: dataError } = await dataQuery;

    if (dataError) {
      console.error('Error fetching members:', dataError);
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengambil data member'
        },
        { status: 500 }
      );
    }

    // 6. Format data untuk response (hapus field sensitif)
    const formattedMembers = members.map(member => ({
      id: member.id,
      email: member.email,
      full_name: member.full_name,
      is_active: member.is_active,
      is_email_verified: member.is_email_verified,
      role: member.role,
      avatar_url: member.avatar_url,
      phone_number: member.phone_number,
      provider: member.provider,
      created_at: member.created_at,
      updated_at: member.updated_at,
      last_login_at: member.last_login_at,
      // Hitung umur akun dalam hari
      account_age_days: Math.floor(
        (new Date() - new Date(member.created_at)) / (1000 * 60 * 60 * 24)
      )
    }));

    // 7. Hitung metadata pagination
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // 8. Response sukses
    return NextResponse.json({
      success: true,
      message: 'Data member berhasil diambil',
      data: {
        items: formattedMembers,
        pagination: {
          current_page: page,
          per_page: limit,
          total_items: totalItems || 0,
          total_pages: totalPages,
          has_next_page: hasNextPage,
          has_previous_page: hasPreviousPage
        },
        filters: {
          is_active: isActive,
          search: search || null,
          sort_by: sortBy,
          sort_order: sortOrder
        }
      }
    });

  } catch (error) {
    console.error('Get members error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server'
      },
      { status: 500 }
    );
  }
}
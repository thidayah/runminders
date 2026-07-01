import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search');

    let query = supabaseServer.from('contact_messages').select('*', { count: 'exact' });

    if (status !== 'all') query = query.eq('status', status);
    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);

    const { data: messages, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ success: false, message: 'Gagal mengambil data pesan' }, { status: 500 });
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      message: 'Data pesan berhasil diambil',
      data: {
        items: messages || [],
        pagination: {
          current_page: page, per_page: limit, total_items: count || 0,
          total_pages: totalPages, has_next_page: page < totalPages, has_previous_page: page > 1
        }
      }
    });

  } catch (error) {
    console.error('GET admin/contacts error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

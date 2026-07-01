import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'all';

    let query = supabaseServer.from('reviews').select('*', { count: 'exact' });

    if (status === 'active') query = query.eq('is_active', true);
    else if (status === 'inactive') query = query.eq('is_active', false);

    if (search) {
      query = query.or(`name.ilike.%${search}%,comment.ilike.%${search}%,event_name.ilike.%${search}%`);
    }

    const { data: reviews, error, count } = await query
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ success: false, message: 'Gagal mengambil data review' }, { status: 500 });
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      message: 'Data review berhasil diambil',
      data: {
        items: reviews || [],
        pagination: {
          current_page: page, per_page: limit, total_items: count || 0,
          total_pages: totalPages, has_next_page: page < totalPages, has_previous_page: page > 1
        }
      }
    });

  } catch (error) {
    console.error('GET admin/reviews error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, role, comment, rating, event_name, sort_order } = body;

    if (!name || !comment || rating === undefined) {
      return NextResponse.json({ success: false, message: 'Nama, komentar, dan rating wajib diisi' }, { status: 400 });
    }

    const ratingInt = parseInt(rating);
    if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
      return NextResponse.json({ success: false, message: 'Rating harus antara 1 dan 5' }, { status: 400 });
    }

    const { data: review, error } = await supabaseServer
      .from('reviews')
      .insert([{
        name: name.trim(),
        role: role?.trim() || null,
        comment: comment.trim(),
        rating: ratingInt,
        event_name: event_name?.trim() || null,
        sort_order: sort_order !== undefined ? parseInt(sort_order) : 0,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: 'Gagal membuat review' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Review berhasil dibuat', data: review }, { status: 201 });

  } catch (error) {
    console.error('POST admin/reviews error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

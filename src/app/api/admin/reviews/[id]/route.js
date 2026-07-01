import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { data: review, error } = await supabaseServer.from('reviews').select('*').eq('id', id).single();

    if (error || !review) {
      return NextResponse.json({ success: false, message: 'Review tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Review berhasil diambil', data: review });

  } catch (error) {
    console.error('GET admin/reviews/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, role, comment, rating, event_name, is_active, sort_order } = body;

    const { data: existing, error: checkError } = await supabaseServer
      .from('reviews').select('id').eq('id', id).single();

    if (checkError || !existing) {
      return NextResponse.json({ success: false, message: 'Review tidak ditemukan' }, { status: 404 });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (role !== undefined) updateData.role = role?.trim() || null;
    if (comment !== undefined) updateData.comment = comment.trim();
    if (rating !== undefined) {
      const ratingInt = parseInt(rating);
      if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
        return NextResponse.json({ success: false, message: 'Rating harus antara 1 dan 5' }, { status: 400 });
      }
      updateData.rating = ratingInt;
    }
    if (event_name !== undefined) updateData.event_name = event_name?.trim() || null;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (sort_order !== undefined) updateData.sort_order = parseInt(sort_order);
    updateData.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabaseServer
      .from('reviews').update(updateData).eq('id', id).select().single();

    if (error) {
      return NextResponse.json({ success: false, message: 'Gagal mengupdate review' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Review berhasil diupdate', data: updated });

  } catch (error) {
    console.error('PUT admin/reviews/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { data: existing, error: checkError } = await supabaseServer
      .from('reviews').select('id').eq('id', id).single();

    if (checkError || !existing) {
      return NextResponse.json({ success: false, message: 'Review tidak ditemukan' }, { status: 404 });
    }

    const { error } = await supabaseServer.from('reviews').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, message: 'Gagal menghapus review' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Review berhasil dihapus' });

  } catch (error) {
    console.error('DELETE admin/reviews/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

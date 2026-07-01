import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { data: review, error } = await supabaseServer
      .from('reviews')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !review) {
      return NextResponse.json(
        { success: false, message: 'Review tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review berhasil diambil',
      data: review
    });

  } catch (error) {
    console.error('GET review by id error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { is_active } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID event wajib diisi' }, { status: 400 });
    }

    if (typeof is_active !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Status aktif harus boolean (true/false)' }, { status: 400 });
    }

    const { data: updatedEvent, error: updateError } = await supabaseServer
      .from('events')
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, title, is_active')
      .single();

    if (updateError) {
      console.error('Error toggle status event:', updateError);
      return NextResponse.json({ success: false, error: 'Gagal mengubah status event' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Event berhasil ${is_active ? 'diaktifkan' : 'dinonaktifkan'}`,
      data: updatedEvent
    });

  } catch (error) {
    console.error('PATCH admin/events/[id]/toggle-status error:', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

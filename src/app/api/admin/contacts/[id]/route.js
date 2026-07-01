import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseServer.from('contact_messages').select('*').eq('id', id).single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: 'Pesan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('GET admin/contacts/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['new', 'read', 'replied'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Status tidak valid. Gunakan: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('contact_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: 'Pesan tidak ditemukan atau gagal diperbarui' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Status pesan berhasil diperbarui', data });

  } catch (error) {
    console.error('PATCH admin/contacts/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabaseServer.from('contact_messages').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, message: 'Pesan tidak ditemukan atau gagal dihapus' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Pesan berhasil dihapus' });

  } catch (error) {
    console.error('DELETE admin/contacts/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

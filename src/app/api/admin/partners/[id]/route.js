import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, website, logo_url, contact_person, is_active } = body;

    const { data: existingPartner, error: checkError } = await supabaseServer
      .from('partners').select('id').eq('id', id).single();

    if (checkError || !existingPartner) {
      return NextResponse.json({ success: false, message: 'Partner tidak ditemukan' }, { status: 404 });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (website !== undefined) updateData.website = website?.trim() || null;
    if (logo_url !== undefined) updateData.logo_url = logo_url?.trim() || null;
    if (contact_person !== undefined) updateData.contact_person = contact_person?.trim() || null;
    if (is_active !== undefined) updateData.is_active = is_active;
    updateData.updated_at = new Date().toISOString();

    const { data: updatedPartner, error } = await supabaseServer
      .from('partners').update(updateData).eq('id', id).select().single();

    if (error) {
      return NextResponse.json({ success: false, message: 'Gagal mengupdate partner' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Partner berhasil diupdate', data: updatedPartner });

  } catch (error) {
    console.error('PUT admin/partners/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { data: existingPartner, error: checkError } = await supabaseServer
      .from('partners').select('id').eq('id', id).single();

    if (checkError || !existingPartner) {
      return NextResponse.json({ success: false, message: 'Partner tidak ditemukan' }, { status: 404 });
    }

    const { error } = await supabaseServer.from('partners').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, message: 'Gagal menghapus partner' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Partner berhasil dihapus' });

  } catch (error) {
    console.error('DELETE admin/partners/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

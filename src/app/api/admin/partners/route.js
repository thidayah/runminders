import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, website, logo_url, contact_person } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: 'Nama partner diperlukan' }, { status: 400 });
    }

    const { data: partner, error } = await supabaseServer
      .from('partners')
      .insert([{
        name: name.trim(),
        website: website?.trim() || null,
        logo_url: logo_url?.trim() || null,
        contact_person: contact_person?.trim() || null,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating partner:', error);
      return NextResponse.json({ success: false, message: 'Gagal membuat partner' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Partner berhasil dibuat', data: partner }, { status: 201 });

  } catch (error) {
    console.error('POST admin/partners error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

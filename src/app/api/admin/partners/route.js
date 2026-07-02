import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/auth-utils';

export async function GET(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'all';

    let query = supabaseServer
      .from('partners')
      .select('*', { count: 'exact' });

    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,contact_person.ilike.%${search}%`);
    }

    const { data: partners, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching partners:', error);
      return NextResponse.json({ success: false, message: 'Gagal mengambil data partner' }, { status: 500 });
    }

    const totalPages = Math.ceil(count / limit);

    return NextResponse.json({
      success: true,
      message: 'Data partner berhasil diambil',
      data: {
        items: partners || [],
        pagination: {
          current_page: page,
          per_page: limit,
          total_items: count || 0,
          total_pages: totalPages,
          has_next_page: page < totalPages,
          has_previous_page: page > 1
        }
      }
    });

  } catch (error) {
    console.error('GET admin/partners error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

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

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET all partners
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;
    const search = searchParams.get('search');
    // const isActive = searchParams.get('is_active') !== 'false';
    const status = searchParams.get('status') || 'all';

    // Build query
    let query = supabaseServer
      .from('partners')
      .select('*', { count: 'exact' });

    // Apply filters
    // if (isActive) {
    //   query = query.eq('is_active', isActive);
    // }
    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    } // else show all

    if (search) {
      query = query.or(`name.ilike.%${search}%,contact_person.ilike.%${search}%`);
    }

    // Apply pagination and sorting
    const { data: partners, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching partners:', error);
      return NextResponse.json(
        { success: false, message: 'Gagal mengambil data partner' },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil(count / limit);
    // const totalPages = Math.ceil((count || 0) / limit)

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
    console.error('GET partners error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}

// CREATE new partner
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, website, logo_url, contact_person } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Nama partner diperlukan' },
        { status: 400 }
      );
    }

    // Insert partner
    const { data: partner, error } = await supabaseServer
      .from('partners')
      .insert([
        {
          name: name.trim(),
          website: website?.trim() || null,
          logo_url: logo_url?.trim() || null,
          contact_person: contact_person?.trim() || null,
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating partner:', error);
      return NextResponse.json(
        { success: false, message: 'Gagal membuat partner' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Partner berhasil dibuat',
      data: partner
    }, { status: 201 });

  } catch (error) {
    console.error('POST partners error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}
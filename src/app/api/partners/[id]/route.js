import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET partner by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { data: partner, error } = await supabaseServer
      .from('partners')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !partner) {
      return NextResponse.json(
        { success: false, message: 'Partner tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Partner berhasil diambil',
      data: partner
    });

  } catch (error) {
    console.error('GET partner by id error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}

// UPDATE partner
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, website, logo_url, contact_person, is_active } = body;

    // Check if partner exists
    const { data: existingPartner, error: checkError } = await supabaseServer
      .from('partners')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingPartner) {
      return NextResponse.json(
        { success: false, message: 'Partner tidak ditemukan' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (website !== undefined) updateData.website = website?.trim() || null;
    if (logo_url !== undefined) updateData.logo_url = logo_url?.trim() || null;
    if (contact_person !== undefined) updateData.contact_person = contact_person?.trim() || null;
    if (is_active !== undefined) updateData.is_active = is_active;
    updateData.updated_at = new Date().toISOString();

    // Update partner
    const { data: updatedPartner, error } = await supabaseServer
      .from('partners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating partner:', error);
      return NextResponse.json(
        { success: false, message: 'Gagal mengupdate partner' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Partner berhasil diupdate',
      data: updatedPartner
    });

  } catch (error) {
    console.error('PUT partner error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}

// DELETE partner (soft delete - set is_active = false)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Check if partner exists
    const { data: existingPartner, error: checkError } = await supabaseServer
      .from('partners')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingPartner) {
      return NextResponse.json(
        { success: false, message: 'Partner tidak ditemukan' },
        { status: 404 }
      );
    }

    // Soft delete - set is_active to false
    const { data: deletedPartner, error } = await supabaseServer
      .from('partners')
      // .update({
      //   is_active: false,
      //   updated_at: new Date().toISOString()
      // })
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting partner:', error);
      return NextResponse.json(
        { success: false, message: 'Gagal menghapus partner' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Partner berhasil dihapus',
      // data: deletedPartner
    });

  } catch (error) {
    console.error('DELETE partner error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}
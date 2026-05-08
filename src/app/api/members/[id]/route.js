import { NextResponse } from 'next/server';
import { supabaseServer } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth-utils";

export async function GET(request, { params }) {
  try {
    // 1. Verifikasi token admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token autentikasi diperlukan'
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token tidak valid atau telah kedaluwarsa'
        },
        { status: 401 }
      );
    }

    // 2. Cek apakah user adalah admin
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Akses ditolak. Hanya admin yang dapat mengakses resource ini'
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    // 3. Ambil data member
    const { data: member, error } = await supabaseServer
      .from('members')
      .select(`
        id,
        email,
        full_name,
        is_active,
        is_email_verified,
        role,
        created_at,
        updated_at,
        last_login_at,
        avatar_url,
        phone_number,
        provider,
        provider_id,
        oauth_data,
        failed_login_attempts,
        email_verified_at
      `)
      .eq('id', id)
      .single();

    if (error || !member) {
      return NextResponse.json(
        {
          success: false,
          message: 'Member tidak ditemukan'
        },
        { status: 404 }
      );
    }

    // 4. Hitung statistik tambahan
    const now = new Date();
    const createdAt = new Date(member.created_at);
    const lastLoginAt = member.last_login_at ? new Date(member.last_login_at) : null;

    const stats = {
      account_age_days: Math.floor((now - createdAt) / (1000 * 60 * 60 * 24)),
      days_since_last_login: lastLoginAt 
        ? Math.floor((now - lastLoginAt) / (1000 * 60 * 60 * 24))
        : null,
      is_oauth_user: !!member.provider,
      oauth_provider: member.provider
    };

    // 5. Response sukses
    return NextResponse.json({
      success: true,
      message: 'Data member berhasil diambil',
      data: {
        ...member,
        ...stats,
        // Hapus data sensitif
        oauth_data: member.oauth_data ? {
          provider: member.oauth_data.provider,
          email: member.oauth_data.email,
          // Jangan tampilkan token
        } : null
      }
    });

  } catch (error) {
    console.error('Get member detail error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // 1. Verifikasi token admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token autentikasi diperlukan'
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token tidak valid atau telah kedaluwarsa'
        },
        { status: 401 }
      );
    }

    // 2. Cek apakah user adalah admin
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Akses ditolak. Hanya admin yang dapat mengakses resource ini'
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { is_active, role, is_email_verified } = body;

    // 3. Validasi input
    const validationErrors = {};

    if (is_active !== undefined && typeof is_active !== 'boolean') {
      validationErrors.is_active = 'Status aktif harus berupa boolean';
    }

    if (role !== undefined && !['member', 'admin'].includes(role)) {
      validationErrors.role = 'Role harus member atau admin';
    }

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validasi gagal',
          errors: validationErrors
        },
        { status: 400 }
      );
    }

    // 4. Cek apakah member ada
    const { data: existingMember, error: checkError } = await supabaseServer
      .from('members')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingMember) {
      return NextResponse.json(
        {
          success: false,
          message: 'Member tidak ditemukan'
        },
        { status: 404 }
      );
    }

    // 5. Siapkan data untuk diupdate
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (is_active !== undefined) updateData.is_active = is_active;
    if (role !== undefined) updateData.role = role;
    if (is_email_verified !== undefined) {
      updateData.is_email_verified = is_email_verified;
      if (is_email_verified) {
        updateData.email_verified_at = new Date().toISOString();
      } else {
        updateData.email_verified_at = null;
      }
    }

    // 6. Update member
    const { data: updatedMember, error: updateError } = await supabaseServer
      .from('members')
      .update(updateData)
      .eq('id', id)
      .select(`
        id,
        email,
        full_name,
        is_active,
        is_email_verified,
        role,
        updated_at,
        email_verified_at
      `)
      .single();

    if (updateError) {
      console.error('Error updating member:', updateError);
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengupdate member'
        },
        { status: 500 }
      );
    }

    // 7. Response sukses
    return NextResponse.json({
      success: true,
      message: 'Member berhasil diupdate',
      data: updatedMember
    });

  } catch (error) {
    console.error('Update member error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server'
      },
      { status: 500 }
    );
  }
}
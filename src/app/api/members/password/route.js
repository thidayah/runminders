import { NextResponse } from 'next/server';
import { supabaseServer } from "@/lib/supabase";
import bcrypt from 'bcryptjs';
import { verifyToken, isStrongPassword } from "@/lib/auth-utils";

export async function PUT(request) {
  try {
    // 1. Ambil token dari header Authorization
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

    // 2. Ambil data dari body request
    const body = await request.json();
    const { current_password, new_password, confirm_password } = body;

    // 3. Validasi input
    const validationErrors = {};

    if (!current_password) {
      validationErrors.current_password = 'Password saat ini diperlukan';
    }

    if (!new_password) {
      validationErrors.new_password = 'Password baru diperlukan';
    } else if (!isStrongPassword(new_password)) {
      validationErrors.new_password = 'Password minimal 8 karakter, mengandung huruf besar, kecil, angka dan simbol';
    }

    if (!confirm_password) {
      validationErrors.confirm_password = 'Konfirmasi password diperlukan';
    } else if (new_password !== confirm_password) {
      validationErrors.confirm_password = 'Password baru dan konfirmasi tidak cocok';
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

    // 4. Get current member untuk verifikasi password saat ini
    const { data: member, error: fetchError } = await supabaseServer
      .from('members')
      .select('password_hash')
      .eq('id', decoded.id)
      .single();

    if (fetchError || !member) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pengguna tidak ditemukan'
        },
        { status: 404 }
      );
    }

    // 5. Verifikasi password saat ini
    const isCurrentPasswordValid = await bcrypt.compare(current_password, member.password_hash);

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password saat ini salah'
        },
        { status: 400 }
      );
    }

    // 6. Hash password baru
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(new_password, saltRounds);

    // 7. Update password di database
    const { error: updateError } = await supabaseServer
      .from('members')
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
        reset_password_token: null,
        reset_password_expires_at: null,
        failed_login_attempts: 0 // Reset failed attempts
      })
      .eq('id', decoded.id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengupdate password'
        },
        { status: 500 }
      );
    }

    // 8. Logout semua sesi aktif (optional) - bisa invalidate semua token
    // Untuk sekarang hanya return sukses

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah',
      data: {
        updated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Update password error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server'
      },
      { status: 500 }
    );
  }
}
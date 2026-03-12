import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { hashPassword, isStrongPassword } from '@/lib/auth-utils';

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, password, confirm_password } = body;

    // 1. Validasi input
    if (!token || !password || !confirm_password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Semua field harus diisi'
        },
        { status: 400 }
      );
    }

    // 2. Validasi password match
    if (password !== confirm_password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password dan konfirmasi password tidak cocok'
        },
        { status: 400 }
      );
    }

    // 3. Validasi password strength
    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password minimal 8 karakter, mengandung huruf besar, kecil, angka dan simbol'
        },
        { status: 400 }
      );
    }

    // 4. Validasi token
    const { data: member, error: tokenError } = await supabaseServer
      .from('members')
      .select('id, email, reset_password_token, reset_password_expires_at, is_active')
      .eq('reset_password_token', token)
      .gt('reset_password_expires_at', new Date().toISOString())
      .single();

    if (tokenError || !member) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token tidak valid atau sudah kedaluwarsa'
        },
        { status: 400 }
      );
    }

    // 5. Cek akun aktif
    if (!member.is_active) {
      return NextResponse.json(
        {
          success: false,
          message: 'Akun dinonaktifkan'
        },
        { status: 400 }
      );
    }

    // 6. Hash password baru
    const passwordHash = await hashPassword(password);

    // 7. Update password dan clear reset token
    const { error: updateError } = await supabaseServer
      .from('members')
      .update({
        password_hash: passwordHash,
        reset_password_token: null,
        reset_password_expires_at: null,
        failed_login_attempts: 0, // Reset failed attempts
        updated_at: new Date().toISOString()
      })
      .eq('id', member.id);

    if (updateError) {
      console.error('Update password error:', updateError);
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengubah password'
        },
        { status: 500 }
      );
    }

    // 8. Log password change (opsional)
    console.log(`Password changed for user: ${member.email}`);

    // 9. Return response sukses
    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah! Silakan login dengan password baru Anda.',
      data: {
        email: member.email,
        updated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Reset password error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server'
      },
      { status: 500 }
    );
  }
}
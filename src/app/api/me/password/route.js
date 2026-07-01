import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { verifyAuth, isStrongPassword } from '@/lib/auth-utils';

export async function PUT(request) {
  try {
    const decoded = verifyAuth(request);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Token tidak valid' }, { status: 401 });
    }

    const body = await request.json();
    const { current_password, new_password, confirm_password } = body;

    const validationErrors = {};

    if (!current_password) validationErrors.current_password = 'Password saat ini diperlukan';
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
      return NextResponse.json({ success: false, message: 'Validasi gagal', errors: validationErrors }, { status: 400 });
    }

    const { data: member, error: fetchError } = await supabaseServer
      .from('members')
      .select('password_hash')
      .eq('id', decoded.id)
      .single();

    if (fetchError || !member) {
      return NextResponse.json({ success: false, message: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    const isCurrentPasswordValid = await bcrypt.compare(current_password, member.password_hash);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ success: false, message: 'Password saat ini salah' }, { status: 400 });
    }

    const newPasswordHash = await bcrypt.hash(new_password, 10);

    const { error: updateError } = await supabaseServer
      .from('members')
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
        reset_password_token: null,
        reset_password_expires_at: null,
        failed_login_attempts: 0
      })
      .eq('id', decoded.id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json({ success: false, message: 'Gagal mengupdate password' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah',
      data: { updated_at: new Date().toISOString() }
    });

  } catch (error) {
    console.error('PUT me/password error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}

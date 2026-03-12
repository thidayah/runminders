import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { generateResetToken } from '@/lib/auth-utils';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    // 1. Validasi input
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email diperlukan'
        },
        { status: 400 }
      );
    }

    // 2. Cari user berdasarkan email
    const { data: member, error: findError } = await supabaseServer
      .from('members')
      .select('id, email, full_name, is_active, is_email_verified')
      .eq('email', email.toLowerCase().trim())
      .single();

    // 3. Berikan response yang sama untuk keamanan (baik email ditemukan atau tidak)
    if (findError || !member) {
      // Tetap return sukses untuk keamanan (prevent email enumeration)
      console.log('Email tidak ditemukan:', email);
      return NextResponse.json({
        success: true,
        message: 'Jika email terdaftar, instruksi reset password telah dikirim'
      });
    }

    // 4. Cek akun aktif
    if (!member.is_active) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Akun Anda dinonaktifkan' 
        },
        { status: 400 }
      );
    }

    // 5. Cek email verified
    if (!member.is_email_verified) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email belum diverifikasi. Silakan verifikasi email terlebih dahulu.' 
        },
        { status: 400 }
      );
    }

    // 6. Generate reset token
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 jam

    // 7. Update reset token di database
    const { error: updateError } = await supabaseServer
      .from('members')
      .update({
        reset_password_token: resetToken,
        reset_password_expires_at: resetExpires.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', member.id);

    if (updateError) {
      console.error('Update reset token error:', updateError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Gagal memproses permintaan reset password' 
        },
        { status: 500 }
      );
    }

    // 8. Kirim email reset password
    const emailResult = await sendPasswordResetEmail(
      member.email,
      resetToken,
      member.full_name
    );

    if (!emailResult.success) {
      console.error('Reset password email error:', emailResult.error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Gagal mengirim email reset password' 
        },
        { status: 500 }
      );
    }

    // 9. Return response sukses
    return NextResponse.json({
      success: true,
      message: 'Jika email terdaftar, instruksi reset password telah dikirim',
      data: {
        email: member.email,
        expires_at: resetExpires.toISOString()
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan internal server' 
      },
      { status: 500 }
    );
  }
}
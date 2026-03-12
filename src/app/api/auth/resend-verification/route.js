import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { generateVerificationToken } from '@/lib/auth-utils';
import { sendVerificationEmail } from '@/lib/email';

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
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (findError || !member) {
      // Untuk keamanan, tetap return success message meskipun email tidak ditemukan
      console.log('Email tidak ditemukan untuk resend verification:', email);
      return NextResponse.json({
        success: true,
        message: 'Jika email terdaftar dan belum diverifikasi, email verifikasi telah dikirim ulang'
      });
    }

    // 3. Cek apakah email sudah diverifikasi
    if (member.is_email_verified) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email sudah diverifikasi. Tidak perlu verifikasi ulang.' 
        },
        { status: 400 }
      );
    }

    // 4. Cek apakah akun aktif
    if (!member.is_active) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Akun tidak aktif. Tidak dapat mengirim verifikasi.' 
        },
        { status: 400 }
      );
    }

    // 5. Generate token verifikasi baru
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam

    // 6. Update token di database
    const { error: updateError } = await supabaseServer
      .from('members')
      .update({
        email_verification_token: verificationToken,
        email_verification_expires_at: verificationExpires.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', member.id);

    if (updateError) {
      console.error('Update verification token error:', updateError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Gagal membuat token verifikasi baru' 
        },
        { status: 500 }
      );
    }

    // 7. Kirim email verifikasi
    const emailResult = await sendVerificationEmail(
      member.email,
      verificationToken,
      member.full_name
    );

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Gagal mengirim email verifikasi' 
        },
        { status: 500 }
      );
    }

    // 8. Return response sukses
    return NextResponse.json({
      success: true,
      message: 'Email verifikasi telah dikirim ulang. Silakan cek inbox atau folder spam email Anda.',
      data: {
        email: member.email,
        full_name: member.full_name,
        expires_at: verificationExpires.toISOString(),
        email_sent: true
      }
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan internal server' 
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { hashPassword, generateVerificationToken, isValidEmail, isStrongPassword } from '@/lib/auth-utils';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { full_name, email, password, confirm_password } = body;

    // 1. Validasi input
    if (!full_name || !email || !password || !confirm_password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Semua field harus diisi' 
        },
        { status: 400 }
      );
    }

    // 2. Validasi email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Format email tidak valid' 
        },
        { status: 400 }
      );
    }

    // 3. Validasi password match
    if (password !== confirm_password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password dan konfirmasi password tidak cocok' 
        },
        { status: 400 }
      );
    }

    // 4. Validasi password strength
    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password minimal 8 karakter, mengandung huruf besar, kecil, angka dan simbol' 
        },
        { status: 400 }
      );
    }

    // 5. Cek apakah email sudah terdaftar
    const { data: existingUser } = await supabaseServer
      .from('members')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email sudah terdaftar' 
        },
        { status: 400 }
      );
    }

    // 6. Hash password
    const passwordHash = await hashPassword(password);

    // 7. Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam

    // 8. Insert user ke database
    const { data: newMember, error: insertError } = await supabaseServer
      .from('members')
      .insert([
        {
          email: email.toLowerCase().trim(),
          full_name: full_name.trim(),
          password_hash: passwordHash,
          is_email_verified: false,
          role: 'member',
          email_verification_token: verificationToken,
          email_verification_expires_at: verificationExpires.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Gagal membuat akun. Silakan coba lagi.' 
        },
        { status: 500 }
      );
    }

    // 9. Kirim email verifikasi dengan Resend
    const emailResult = await sendVerificationEmail(
      newMember.email,
      verificationToken,
      newMember.full_name
    );

    // 10. Return response
    const responseData = {
      id: newMember.id,
      email: newMember.email,
      full_name: newMember.full_name,
      is_email_verified: newMember.is_email_verified,
      created_at: newMember.created_at,
      email_sent: emailResult.success
    };

    return NextResponse.json({
      success: true,
      message: emailResult.success 
        ? 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.' 
        : 'Registrasi berhasil, tetapi gagal mengirim email verifikasi.',
      data: responseData,
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan internal server' 
      },
      { status: 500 }
    );
  }
}
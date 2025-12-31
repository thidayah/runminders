// File: app/api/auth/login/simple/route.js
import { NextResponse } from 'next/server';
import { supabaseServer } from "@/lib/supabase";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email dan password diperlukan'
        },
        { status: 400 }
      );
    }

    // 1. Cari member berdasarkan email
    const { data: member, error } = await supabaseServer
      .from('members')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !member) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email atau password salah'
        },
        { status: 400 }
      );
    }

    // 2. Cek akun aktif
    if (!member.is_active) {
      return NextResponse.json(
        {
          success: false,
          message: 'Akun Anda dinonaktifkan, silakan hubungi support'
        },
        { status: 400 }
      );
    }

    // 3. Cek email verification
    if (!member.is_email_verified) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email belum diverifikasi. Silakan cek email Anda.'
        },
        { status: 400 }
      );
    }

    // 4. Cek failed login attempts (maksimal 5 kali)
    if (member.failed_login_attempts >= 5) {
      return NextResponse.json(
        {
          success: false,
          message: 'Akun terkunci karena terlalu banyak percobaan gagal. Silakan reset password.'
        },
        { status: 400 }
      );
    }

    // 5. Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, member.password_hash);

    if (!isPasswordValid) {
      // Update failed login attempts
      await supabaseServer
        .from('members')
        .update({
          failed_login_attempts: member.failed_login_attempts + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', member.id);

      return NextResponse.json(
        {
          success: false,
          message: 'Email atau password salah'
        },
        { status: 400 }
      );
    }

    // 6. Update last login
    await supabaseServer
      .from('members')
      .update({
        last_login_at: new Date().toISOString(),
        failed_login_attempts: 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', member.id);

    // 7. Generate JWT token
    const token = jwt.sign(
      {
        id: member.id,
        email: member.email,
        role: member.role,
        name: member.full_name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // 8. Response sukses
    const responseData = {
      user: {
        id: member.id,
        email: member.email,
        full_name: member.full_name,
        role: member.role,
        is_email_verified: member.is_email_verified,
        avatar_url: member.avatar_url,
        phone_number: member.phone_number
      },
      token: token,
      last_login: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      data: responseData
    });

  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server'
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Token verifikasi tidak ditemukan' 
        },
        { status: 400 }
      );
    }

    // 1. Cari user berdasarkan token (atau cari user yang punya token ini)
    const { data: member, error } = await supabaseServer
      .from('members')
      .select('*')
      .or(`email_verification_token.eq.${token},email_verified_at.not.is.null,email_verification_expires_at.not.is.null`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !member) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Akun tidak terdaftar' 
        },
        { status: 404 }
      );
    }

    // 2. Cek kondisi berdasarkan data yang ada
    const now = new Date();
    
    // Kondisi 1: Email sudah diverifikasi
    if (member.email_verified_at && member.is_email_verified) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Akun sudah aktif. Email Anda telah diverifikasi sebelumnya.',
          data: {
            id: member.id,
            email: member.email,
            full_name: member.full_name,
            email_verified_at: member.email_verified_at,
            already_verified: true
          }
        },
        { status: 200 }
      );
    }

    // Kondisi 2: Token tidak match
    if (member.email_verification_token !== token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Token verifikasi tidak valid' 
        },
        { status: 400 }
      );
    }

    // Kondisi 3: Token expired
    if (member.email_verification_expires_at) {
      const expiresAt = new Date(member.email_verification_expires_at);
      if (expiresAt < now) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Token verifikasi tidak valid atau sudah kedaluwarsa',
            data: {
              email: member.email,
              full_name: member.full_name,
              expired: true
            }
          },
          { status: 400 }
        );
      }
    }

    // 3. Update verification (token valid dan belum expired)
    const { error: updateError } = await supabaseServer
      .from('members')
      .update({
        is_email_verified: true,
        email_verified_at: new Date().toISOString(),
        email_verification_token: null,
        email_verification_expires_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', member.id);

    if (updateError) {
      console.error('Update verification error:', updateError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Gagal memverifikasi email' 
        },
        { status: 500 }
      );
    }

    // 4. Kirim email selamat datang
    await sendWelcomeEmail(member.email, member.full_name);

    // 5. Return response sukses
    return NextResponse.json({
      success: true,
      message: 'Email berhasil diverifikasi! Akun Anda sudah aktif.',
      data: {
        id: member.id,
        email: member.email,
        full_name: member.full_name,
        email_verified_at: new Date().toISOString(),
        first_verification: true
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan internal server' 
      },
      { status: 500 }
    );
  }
}
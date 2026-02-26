import { NextResponse } from 'next/server';
import { supabaseServer } from "@/lib/supabase";
import jwt from 'jsonwebtoken';
import { isValidEmail, verifyToken } from "@/lib/auth-utils";

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
    const { email, full_name, phone_number, avatar_url } = body;

    // 3. Validasi input
    const validationErrors = {};

    if (email && !isValidEmail(email)) {
      validationErrors.email = 'Format email tidak valid';
    }

    if (email && email.toLowerCase().trim() !== decoded.email) {
      // Cek jika email sudah digunakan oleh user lain
      const { data: existingUser } = await supabaseServer
        .from('members')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .neq('id', decoded.id)
        .maybeSingle();

      if (existingUser) {
        validationErrors.email = 'Email sudah digunakan oleh pengguna lain';
      }
    }

    if (phone_number && phone_number.length < 10) {
      validationErrors.phone_number = 'Nomor telepon minimal 10 digit';
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

    // 4. Siapkan data untuk diupdate
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (email && email.toLowerCase().trim() !== decoded.email) {
      updateData.email = email.toLowerCase().trim();
      updateData.is_email_verified = false; // Reset verification jika email berubah
      updateData.email_verified_at = null;
    }

    if (full_name) {
      updateData.full_name = full_name.trim();
    }

    if (phone_number !== undefined) {
      updateData.phone_number = phone_number || null;
    }

    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url || null;
    }

    // 5. Update data member
    const { data: updatedMember, error: updateError } = await supabaseServer
      .from('members')
      .update(updateData)
      .eq('id', decoded.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengupdate profil'
        },
        { status: 500 }
      );
    }

    // 6. Generate token baru jika email berubah
    let newToken = token;
    if (email && email.toLowerCase().trim() !== decoded.email) {
      newToken = jwt.sign(
        {
          id: updatedMember.id,
          email: updatedMember.email,
          role: updatedMember.role,
          name: updatedMember.full_name
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
    }

    // 7. Response sukses
    const responseData = {
      user: {
        id: updatedMember.id,
        email: updatedMember.email,
        full_name: updatedMember.full_name,
        role: updatedMember.role,
        is_email_verified: updatedMember.is_email_verified,
        avatar_url: updatedMember.avatar_url,
        phone_number: updatedMember.phone_number
      },
      token: newToken,
      requires_reauthentication: email && email.toLowerCase().trim() !== decoded.email,
      message: email && email.toLowerCase().trim() !== decoded.email 
        ? 'Profil berhasil diupdate. Silakan verifikasi email baru Anda.' 
        : 'Profil berhasil diupdate'
    };

    return NextResponse.json({
      success: true,
      message: responseData.message,
      data: responseData
    });

  } catch (error) {
    console.error('Update profile error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server'
      },
      { status: 500 }
    );
  }
}

// Optional: GET profile endpoint
export async function GET(request) {
  try {
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

    // Get member data
    const { data: member, error } = await supabaseServer
      .from('members')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !member) {
      return NextResponse.json(
        {
          success: false,
          message: 'Profil tidak ditemukan'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diambil',
      data: {
        user: {
          id: member.id,
          email: member.email,
          full_name: member.full_name,
          role: member.role,
          is_email_verified: member.is_email_verified,
          avatar_url: member.avatar_url,
          phone_number: member.phone_number,
          created_at: member.created_at,
          last_login_at: member.last_login_at
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server'
      },
      { status: 500 }
    );
  }
}
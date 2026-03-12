import { NextResponse } from 'next/server';
import { supabaseServer } from "@/lib/supabase";
import jwt from 'jsonwebtoken';
// import { OAuth2Client } from 'google-auth-library';

// Initialize Google OAuth2 Client
// const googleClient = new OAuth2Client({
//   clientId: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// });

export async function POST(request) {
  try {
    const body = await request.json();
    const { accessToken, googleId, email, name, image } = body;

    // 1. Validasi input
    if (!accessToken || !googleId || !email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data Google tidak lengkap'
        },
        { status: 400 }
      );
    }

    // 2. Verify Google access token (optional but recommended) (SKIP)
    // let tokenInfo;
    // try {
    //   tokenInfo = await googleClient.getTokenInfo(accessToken);
      
    //   // Verify token is valid and for our app
    //   if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
    //     return NextResponse.json(
    //       {
    //         success: false,
    //         message: 'Token Google tidak valid'
    //       },
    //       { status: 401 }
    //     );
    //   }
    // } catch (googleError) {
    //   console.warn('Google token verification failed:', googleError);
    //   // Continue without verification for development
    //   if (process.env.NODE_ENV === 'production') {
    //     return NextResponse.json(
    //       {
    //         success: false,
    //         message: 'Token Google tidak valid'
    //       },
    //       { status: 401 }
    //     );
    //   }
    // }

    const oauthData = {
      access_token: accessToken,
      google_id: googleId,
      verified_at: new Date().toISOString(),
      last_used: new Date().toISOString()
    };

    // 3. Cek apakah user sudah ada di database
    const { data: existingMember, error: fetchError } = await supabaseServer
      .from('members')
      .select('*')
      .or(`email.eq.${email.toLowerCase().trim()},provider_id.eq.${googleId}`)
      .maybeSingle();

    let member;
    let isNewMember = false;

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching member:', fetchError);
      throw new Error('Database error');
    }

    // 4. Handle existing member atau create new
    if (existingMember) {
      member = existingMember;
      
      // Update existing member dengan Google data
      const updateData = {
        provider: 'google',
        provider_id: googleId,
        avatar_url: member.avatar_url || image,
        updated_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
        failed_login_attempts: 0, // Reset failed attempts
        oauth_data: oauthData
      };

      // Jika email belum verified, set to verified karena Google sudah verify
      if (!member.is_email_verified) {
        updateData.is_email_verified = true;
        updateData.email_verified_at = new Date().toISOString();
      }

      // Update member
      const { data: updatedMember, error: updateError } = await supabaseServer
        .from('members')
        .update(updateData)
        .eq('id', member.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating member:', updateError);
        throw new Error('Gagal update data member');
      }

      member = updatedMember;
    } else {
      // Create new member
      const newMemberData = {
        email: email.toLowerCase().trim(),
        full_name: name || email.split('@')[0],
        provider: 'google',
        provider_id: googleId,
        avatar_url: image || null,
        is_active: true,
        is_email_verified: true,
        email_verified_at: new Date().toISOString(),
        role: 'member',
        last_login_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdMember, error: createError } = await supabaseServer
        .from('members')
        .insert([newMemberData])
        .select()
        .single();

      if (createError) {
        console.error('Error creating member:', createError);
        
        // Handle duplicate email case (race condition)
        if (createError.code === '23505') { // Unique violation
          // Try to get existing member
          const { data: existingByEmail } = await supabaseServer
            .from('members')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .single();
          
          if (existingByEmail) {
            // Link Google account to existing email
            const updateData = {
              provider: 'google',
              provider_id: googleId,
              avatar_url: image || existingByEmail.avatar_url,
              updated_at: new Date().toISOString(),
              last_login_at: new Date().toISOString()
            };

            const { data: updated } = await supabaseServer
              .from('members')
              .update(updateData)
              .eq('id', existingByEmail.id)
              .select()
              .single();

            member = updated;
          } else {
            throw new Error('Email sudah terdaftar');
          }
        } else {
          throw new Error('Gagal membuat akun baru');
        }
      } else {
        member = createdMember;
        isNewMember = true;
      }
    }

    // 5. Generate JWT token (sama dengan login biasa)
    const token = jwt.sign(
      {
        id: member.id,
        email: member.email,
        role: member.role,
        name: member.full_name,
        provider: member.provider
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // 6. Prepare response data
    const responseData = {
      user: {
        id: member.id,
        email: member.email,
        full_name: member.full_name,
        role: member.role,
        is_email_verified: member.is_email_verified,
        avatar_url: member.avatar_url,
        phone_number: member.phone_number,
        provider: member.provider,
        provider_id: member.provider_id
      },
      token: token,
      last_login: new Date().toISOString(),
      is_new_user: isNewMember
    };

    // 7. Return success response
    return NextResponse.json({
      success: true,
      message: isNewMember ? 'Akun berhasil dibuat' : 'Login berhasil',
      data: responseData
    });

  } catch (error) {
    console.error('Google login error:', error);

    // Handle specific errors
    let errorMessage = 'Terjadi kesalahan internal server';
    let statusCode = 500;

    if (error.message === 'Email sudah terdaftar') {
      errorMessage = 'Email sudah terdaftar dengan metode login lain';
      statusCode = 409;
    } else if (error.message === 'Token Google tidak valid') {
      errorMessage = 'Token Google tidak valid';
      statusCode = 401;
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage
      },
      { status: statusCode }
    );
  }
}

// Optional: GET endpoint untuk debug/info
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Google OAuth endpoint is active',
    client_id_configured: !!process.env.GOOGLE_CLIENT_ID,
    timestamp: new Date().toISOString()
  });
}
import EmailLayout from './EmailLayout';

export function WelcomeEmail({ fullName, toEmail }) {
  const htmlContent = EmailLayout({
    title: 'Selamat Datang',
    children: `
    <div style="font-size: 28px; font-weight: bold; color: #f1c40f; margin-bottom: 15px;">${ 'Selamat Datang' || process.env.APP_NAME || 'Runminders'}</div>
      <p style="color: #666666;">Akun Anda sudah aktif dan siap digunakan</p>
    </div>
    
    <p style="font-size: 16px; color: #333333; margin-top: 20px;">Halo <strong>${fullName}</strong>,</p>
    
    <p style="font-size: 16px; color: #555555; line-height: 1.6;">
      Selamat! Email Anda telah berhasil diverifikasi dan akun Anda sekarang sudah aktif.
    </p>
    
    <div style="margin: 30px 0;">
      <h3 style="color: #333333; margin-bottom: 15px;">Mulai jelajahi fitur-fitur kami:</h3>
      
      <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #f0c311;">
        <strong style="color: #333333;">Lengkapi Profil</strong>
        <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Lengkapi informasi profil Anda untuk pengalaman yang lebih personal.</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #f0c311;">
        <strong style="color: #333333;">Mulai Menggunakan</strong>
        <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Akses semua fitur yang tersedia untuk Anda.</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #f0c311;">
        <strong style="color: #333333;">Keamanan Akun</strong>
        <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Pastikan keamanan akun Anda dengan mengatur password yang kuat.</p>
      </div>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
         style="display: inline-block; background-color: #f0c311; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600;">
        Mulai Jelajahi →
      </a>
    </div>
    
    <p style="color: #888888; font-size: 14px; border-top: 1px solid #eeeeee; padding-top: 20px;">
      Jika Anda memiliki pertanyaan, balas email ini atau hubungi tim support kami.
      <br><br>
      Salam hangat,<br>
      <strong style="color: #f0c311;">Tim ${process.env.APP_NAME || 'Runminders'}</strong>
    </p>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666666; text-align: center;">
      <p style="margin: 5px 0;">
        © ${new Date().getFullYear()} ${process.env.APP_NAME || 'Runminders'}. All rights reserved.
      </p>
      <p style="margin: 5px 0; font-size: 13px; color: #888888;">
        Email ini dikirim secara otomatis, mohon tidak membalas email ini.
      </p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="${process.env.APP_WEBSITE || '#'}" style="display: inline-block; margin: 0 10px; color: #666666; text-decoration: none; font-size: 14px;">Website</a>
        <a href="${process.env.APP_INSTAGRAM || '#'}" style="display: inline-block; margin: 0 10px; color: #666666; text-decoration: none; font-size: 14px;">Instagram</a>
      </div>
    </div>
    `
  });

  const text = `
SELAMAT DATANG DI ${process.env.APP_NAME || 'Runminders'}!

Halo ${fullName},

Selamat! Email Anda telah berhasil diverifikasi dan akun Anda sekarang sudah aktif.

AKUN ANDA SUDAH SIAP:
• Email: ${toEmail}
• Status: Aktif
• Tanggal verifikasi: ${new Date().toLocaleDateString('id-ID')}

FITUR YANG TERSEDIA:
✓ Lengkapi profil Anda
✓ Akses semua layanan
✓ Kelola preferensi
✓ Atur keamanan akun

LANGKAH BERIKUTNYA:
1. Login ke akun Anda
2. Lengkapi profil
3. Mulai menggunakan layanan kami

Login di sini: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login

Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.

---
Salam,
Tim ${process.env.APP_NAME || 'Runminders'}
${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
  `;

  return { html: htmlContent, text };
}
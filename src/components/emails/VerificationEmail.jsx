import EmailLayout from './EmailLayout';

export function VerificationEmail({ fullName, verificationLink }) {
  const htmlContent = EmailLayout({
    title: 'Verifikasi Email',
    children: `
      <div style="font-size: 28px; font-weight: bold; color: #f1c40f; margin-bottom: 15px;">${ 'Verifikasi Email' || process.env.APP_NAME || 'Runminders'}</div>
    </div>
    
    <p style="font-size: 16px; color: #555555; margin-top: 20px;">Halo <strong style="color: #333333;">${fullName || 'Pengguna'}</strong>,</p>
    
    <p style="font-size: 16px; color: #555555; line-height: 1.6;">
      Terima kasih telah mendaftar di <strong style="color: #f1c40f;">${process.env.APP_NAME || 'Runminders'}</strong>. 
      Untuk menyelesaikan proses pendaftaran, silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini:
    </p>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${verificationLink}" style="display: inline-block; background-color: #f1c40f; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; margin: 25px 0; font-weight: 600; font-size: 16px; text-align: center; box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11);">
        Verifikasi Email Sekarang
      </a>
    </div>
    
    <div style="height: 1px; background: linear-gradient(to right, transparent, #e0e0e0, transparent); margin: 30px 0;"></div>
    
    <p style="font-size: 15px; color: #666666; margin-bottom: 10px;">
      Atau salin dan tempel link berikut di browser Anda:
    </p>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; font-family: 'Monaco', 'Menlo', 'Consolas', monospace; word-break: break-all; margin: 20px 0; border: 1px solid #e0e0e0; font-size: 14px; color: #333333;">
      ${verificationLink}
    </div>
    
    <p style="font-size: 15px; color: #888888; margin: 20px 0;">
      <strong>⚠️ Penting:</strong> Link verifikasi ini akan kedaluwarsa dalam 24 jam.
    </p>
    
    <p style="font-size: 15px; color: #666666;">
      Jika Anda tidak merasa mendaftar di <strong style="color: #f1c40f;">${process.env.APP_NAME || 'Runminders'}</strong>, 
      Anda dapat mengabaikan email ini.
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
VERIFIKASI EMAIL - ${process.env.APP_NAME || 'Runminders'}

Halo ${fullName || 'Pengguna'},

Terima kasih telah mendaftar di ${process.env.APP_NAME || 'Runminders'}! 
Untuk menyelesaikan proses pendaftaran, silakan verifikasi alamat email Anda.

VERIFIKASI EMAIL ANDA:
${verificationLink}

Cara verifikasi:
1. Klik link di atas, atau
2. Salin dan tempel link tersebut di browser Anda

Link verifikasi ini akan kedaluwarsa dalam 24 jam.

Jika Anda tidak merasa mendaftar di ${process.env.APP_NAME || 'Runminders'}, 
Anda dapat mengabaikan email ini.

---
© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Runminders'}
${process.env.APP_WEBSITE || ''}
Email otomatis - mohon tidak membalas email ini
  `;

  return { html: htmlContent, text };
}
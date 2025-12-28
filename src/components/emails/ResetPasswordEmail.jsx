import EmailLayout from './EmailLayout';

export function ResetPasswordEmail({ fullName, resetLink }) {
  const htmlContent = EmailLayout({
    title: 'Reset Password',
    children: `
      <h2 style="margin: 0; color: #333333;">Reset Password</h2>
    </div>
    
    <p style="font-size: 16px; color: #555555; margin-top: 20px;">Halo <strong style="color: #333333;">${fullName || 'Pengguna'}</strong>,</p>
    
    <p style="font-size: 16px; color: #555555; line-height: 1.6;">
      Kami menerima permintaan reset password untuk akun Anda. 
      Jika Anda tidak meminta reset password, abaikan email ini.
    </p>
    
    <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 15px; margin: 20px 0; color: #92400E;">
      <strong>⚠️ Perhatian:</strong> Link reset password hanya berlaku selama 1 jam.
    </div>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${resetLink}" style="display: inline-block; background-color: #DC2626; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; margin: 25px 0; font-weight: 600; font-size: 16px; text-align: center;">
        Reset Password
      </a>
    </div>
    
    <p style="font-size: 15px; color: #666666; margin-bottom: 10px;">
      Atau salin dan tempel link berikut di browser Anda:
    </p>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; font-family: 'Monaco', 'Menlo', 'Consolas', monospace; word-break: break-all; margin: 20px 0; border: 1px solid #e0e0e0; font-size: 14px; color: #333333;">
      ${resetLink}
    </div>
    
    <p style="font-size: 15px; color: #666666;">
      <strong style="color: #333333;">Tips keamanan:</strong>
      <br>• Jangan bagikan link ini ke siapapun
      <br>• Gunakan password yang kuat dan unik
      <br>• Jangan gunakan password yang sama di berbagai platform
    </p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666666; text-align: center;">
      <p style="margin: 5px 0;">
        © ${new Date().getFullYear()} ${process.env.APP_NAME || 'Runminders'}. All rights reserved.
      </p>
      <p style="margin: 5px 0; font-size: 13px; color: #888888;">
        Email keamanan - mohon tidak membalas email ini.
      </p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="${process.env.APP_WEBSITE || '#'}" style="display: inline-block; margin: 0 10px; color: #666666; text-decoration: none; font-size: 14px;">Website</a>
        <a href="${process.env.APP_INSTAGRAM || '#'}" style="display: inline-block; margin: 0 10px; color: #666666; text-decoration: none; font-size: 14px;">Instagram</a>
      </div>
    </div>
    `
  });

  const text = `
RESET PASSWORD - ${process.env.APP_NAME || 'Runminders'}

Halo ${fullName || 'Pengguna'},

Kami menerima permintaan reset password untuk akun Anda.

LINK RESET PASSWORD:
${resetLink}

Cara reset password:
1. Klik link di atas
2. Masukkan password baru Anda
3. Konfirmasi password baru

⚠️ PERINGATAN:
• Link hanya berlaku 1 jam
• Jangan bagikan link ini ke siapapun
• Jika tidak meminta reset, abaikan email ini

Tips keamanan:
• Gunakan password yang kuat (huruf besar, kecil, angka, simbol)
• Jangan gunakan password yang sama di berbagai platform
• Ganti password secara berkala

---
© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Runminders'}
Email keamanan - mohon tidak membalas email ini.
  `;

  return { html: htmlContent, text };
}
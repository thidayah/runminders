import EmailLayout from './EmailLayout';

export function ResetPasswordEmail({ fullName, resetLink }) {
  const htmlContent = EmailLayout({
    title: 'Reset Password',
    children: `
      <h2 style="margin: 0; color: #333;">Reset Password</h2>
    </div>
    
    <p style="font-size: 16px; color: #555;">Halo <strong>${fullName || 'Pengguna'}</strong>,</p>
    
    <p style="font-size: 16px; color: #555;">
      Kami menerima permintaan reset password untuk akun Anda. 
      Jika Anda tidak meminta reset password, abaikan email ini.
    </p>
    
    <div class="warning">
      <strong>⚠️ Perhatian:</strong> Link reset password hanya berlaku selama 1 jam.
    </div>
    
    <div style="text-align: center;">
      <a href="${resetLink}" class="button-secondary">Reset Password</a>
    </div>
    
    <p style="font-size: 15px; color: #666;">
      Atau salin dan tempel link berikut di browser Anda:
    </p>
    
    <div class="token-box">
      ${resetLink}
    </div>
    
    <p style="font-size: 15px; color: #666;">
      <strong>Tips keamanan:</strong>
      <br>• Jangan bagikan link ini ke siapapun
      <br>• Gunakan password yang kuat dan unik
      <br>• Jangan gunakan password yang sama di berbagai platform
    </p>

    <div class="footer">
      <p style="margin: 5px 0;">
        © ${new Date().getFullYear()} ${process.env.APP_NAME || 'Runminders'}. All rights reserved.
      </p>
      <p style="margin: 5px 0; font-size: 13px; color: #888;">
        Email keamanan, mohon tidak membalas email ini.
      </p>
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
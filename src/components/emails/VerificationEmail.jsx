import EmailLayout from './EmailLayout';

export function VerificationEmail({ fullName, verificationLink }) {
  const htmlContent = EmailLayout({
    title: 'Verifikasi Email',
    children: `
      <h2 style="margin: 0; color: #333;">Verifikasi Email Anda</h2>
    </div>
    
    <p style="font-size: 16px; color: #555;">Halo <strong>${fullName || 'Pengguna'}</strong>,</p>
    
    <p style="font-size: 16px; color: #555;">
      Terima kasih telah mendaftar di <strong>${process.env.APP_NAME || 'Runminders'}</strong>. 
      Untuk menyelesaikan proses pendaftaran, silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini:
    </p>
    
    <div style="text-align: center;">
      <a href="${verificationLink}" class="button">Verifikasi Email Sekarang</a>
    </div>
    
    <p style="font-size: 15px; color: #666;">
      Atau salin dan tempel link berikut di browser Anda:
    </p>
    
    <div class="token-box">
      ${verificationLink}
    </div>
    
    <p style="font-size: 15px; color: #888;">
      <strong>⚠️ Penting:</strong> Link verifikasi ini akan kedaluwarsa dalam 24 jam.
    </p>
    
    <p style="font-size: 15px; color: #666;">
      Jika Anda tidak merasa mendaftar di <strong>${process.env.APP_NAME || 'Runminders'}</strong>, 
      Anda dapat mengabaikan email ini.
    </p>
    
    <div class="footer">
      <p style="margin: 5px 0;">
        © ${new Date().getFullYear()} ${process.env.APP_NAME || 'Runminders'}. All rights reserved.
      </p>
      <p style="margin: 5px 0; font-size: 13px; color: #888;">
        Email ini dikirim secara otomatis, mohon tidak membalas email ini.
      </p>
      <div class="social-icons">
        <a href="${process.env.APP_WEBSITE || '#'}">Website</a>
        <a href="${process.env.APP_TWITTER || '#'}">Twitter</a>
        <a href="${process.env.APP_INSTAGRAM || '#'}">Instagram</a>
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
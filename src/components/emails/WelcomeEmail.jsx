import EmailLayout from './EmailLayout';

export function WelcomeEmail({ fullName, toEmail }) {
  const htmlContent = EmailLayout({
    title: 'Selamat Datang',
    children: `
      <div class="welcome-icon">🎉</div>
      <h2 style="color: #4F46E5; margin: 0;">Selamat Datang!</h2>
      <p style="color: #666;">Akun Anda sudah aktif dan siap digunakan</p>
    </div>
    
    <p>Halo <strong>${fullName}</strong>,</p>
    
    <p>Selamat! Email Anda telah berhasil diverifikasi dan akun Anda sekarang sudah aktif.</p>
    
    <div class="features">
      <h3 style="color: #333;">Mulai jelajahi fitur-fitur kami:</h3>
      
      <div class="feature-item">
        <strong>📱 Lengkapi Profil</strong>
        <p style="margin: 5px 0 0 0; color: #666;">Lengkapi informasi profil Anda untuk pengalaman yang lebih personal.</p>
      </div>
      
      <div class="feature-item">
        <strong>🚀 Mulai Menggunakan</strong>
        <p style="margin: 5px 0 0 0; color: #666;">Akses semua fitur yang tersedia untuk Anda.</p>
      </div>
      
      <div class="feature-item">
        <strong>🔒 Keamanan Akun</strong>
        <p style="margin: 5px 0 0 0; color: #666;">Pastikan keamanan akun Anda dengan mengatur password yang kuat.</p>
      </div>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
         style="background-color: #4F46E5; color: white; padding: 12px 30px; 
                border-radius: 6px; text-decoration: none; font-weight: 600;">
        Mulai Jelajahi →
      </a>
    </div>
    
    <p style="color: #888; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
      Jika Anda memiliki pertanyaan, balas email ini atau hubungi tim support kami.
      <br><br>
      Salam hangat,<br>
      <strong>Tim ${process.env.APP_NAME || 'Runminders'}</strong>
    </p>
    
    <div class="footer">
      <p style="margin: 5px 0;">
        © ${new Date().getFullYear()} ${process.env.APP_NAME || 'Runminders'}
      </p>
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

Login di sini: ${process.env.NEXT_PUBLIC_APP_URL}/login

Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.

---
Salam,
Tim ${process.env.APP_NAME || 'Runminders'}
${process.env.NEXT_PUBLIC_APP_URL}
  `;

  return { html: htmlContent, text };
}
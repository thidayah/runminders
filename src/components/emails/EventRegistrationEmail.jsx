import { formatCurrency, formatDate } from "@/lib/formatters-utils";
import EmailLayout from './EmailLayout';

export function EventRegistrationEmail({
  fullName,
  eventTitle,
  eventDate,
  categoryName,
  registrationNumber,
  paymentAmount,
  snapTransaction,
  isFree
}) {
  const htmlContent = EmailLayout({
    title: 'Konfirmasi Registrasi Event',
    children: `
      <div style="font-size: 28px; font-weight: bold; color: #f1c40f; margin-bottom: 15px;">${isFree ? 'Registrasi Berhasil' : 'Konfirmasi Registrasi' || process.env.APP_NAME || 'Runminders'}</div>
      <p style="color: #666666;">Terima kasih telah mendaftar</p>
    </div>
    
    <p style="font-size: 16px; color: #333333; margin-top: 20px;">Halo <strong>${fullName}</strong>,</p>
    
    <p style="font-size: 16px; color: #555555; line-height: 1.6;">
      Registrasi Anda untuk <strong>${eventTitle}</strong> telah berhasil kami terima. Berikut detail registrasi Anda:
    </p>
    
    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #e5e7eb;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="40%" style="color: #666666; padding: 8px 0; font-size: 14px;">No. Registrasi:</td>
          <td style="color: #333333; padding: 8px 0; font-size: 14px; font-weight: 600;">${registrationNumber}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 8px 0; font-size: 14px;">Tanggal:</td>
          <td style="color: #333333; padding: 8px 0; font-size: 14px;">${formatDate(eventDate)}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 8px 0; font-size: 14px;">Kategori:</td>
          <td style="color: #333333; padding: 8px 0; font-size: 14px;">${categoryName}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 8px 0; font-size: 14px;">Total Pembayaran:</td>
          <td style="color: #4F46E5; padding: 8px 0; font-size: 14px; font-weight: 600;">${isFree ? 'Gratis' : formatCurrency(paymentAmount)}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 8px 0; font-size: 14px;">Status:</td>
          <td style="color: ${isFree ? '#00a63e' : '#f0c311'}; padding: 8px 0; font-size: 14px; font-weight: 600;">${isFree ? 'Berhasil' : 'Menunggu Pembayaran'}</td>
        </tr>
      </table>
    </div>
    
    ${!isFree && snapTransaction ? `
    <div style="text-align: center; margin: 30px 0;">
      <p style="color: #666666; font-size: 14px; margin-bottom: 20px;">
        Silakan selesaikan pembayaran Anda dalam waktu <strong>2 jam</strong>.
      </p>
      <a href="${snapTransaction.redirect_url}" 
         style="display: inline-block; background-color: #f0c311; color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Bayar Sekarang →
      </a>
      <p style="color: #888888; font-size: 12px; margin-top: 10px;">
        Atau salin link berikut: ${snapTransaction.redirect_url}
      </p>
    </div>   
    
    <div style="margin: 30px 0;">   
      <h3 style="color: #333333; margin-bottom: 15px;">Informasi Penting</h3>
      <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #f0c311;">
        <strong style="color: #333333;">Konfirmasi Peserta</strong>
        <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Peserta akan terkonfirmasi otomatis setelah pembayaran berhasil diverifikasi.</p>
      </div>    
      <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #f0c311;">
        <strong style="color: #333333;">Bantuan</strong>
        <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Hubungi kami jika mengalami kendala dalam proses pembayaran.</p>
      </div>
    </div>
    ` :
        ''}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/my-registrations" 
         style="display: inline-block; background-color: #2c3f51; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600;">
        Lihat Detail Registrasi →
      </a>
    </div>
    
    <p style="color: #888888; font-size: 14px; border-top: 1px solid #eeeeee; padding-top: 20px;">
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
    </div>
    `
  });

  const text = `
KONFIRMASI REGISTRASI EVENT

Halo ${fullName},

Terima kasih telah mendaftar ke event "${eventTitle}".

DETAIL REGISTRASI:
• No. Registrasi: ${registrationNumber}
• Tanggal: ${formatDate(eventDate)}
• Kategori: ${categoryName}
• Total: ${formatCurrency(paymentAmount)}
• Status: Menunggu Pembayaran

${snapTransaction ? `
LANJUTKAN PEMBAYARAN:
Silakan selesaikan pembayaran Anda dalam waktu 24 jam untuk mengamankan slot Anda.

Link pembayaran: ${snapTransaction.redirect_url}

Cara pembayaran:
1. Klik link di atas
2. Pilih metode pembayaran
3. Ikuti instruksi hingga selesai
4. Simpan bukti pembayaran
` : `
✅ REGISTRASI SELESAI
Terima kasih! Pembayaran Anda telah berhasil dan registrasi telah dikonfirmasi.
Anda akan menerima email konfirmasi tambahan menjelang hari H event.
`}

INFORMASI PENTING:
• Batas waktu pembayaran: 24 jam setelah registrasi
• Peserta dikonfirmasi setelah pembayaran diverifikasi
• Simpan email ini sebagai bukti registrasi

Lihat detail registrasi: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/my-registrations

Jika ada pertanyaan, hubungi tim support kami.

---
Salam,
Tim ${process.env.APP_NAME || 'Runminders'}
${process.env.APP_WEBSITE || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
  `;

  return { html: htmlContent, text };
}
import EmailLayout from './EmailLayout';
import { formatDate, formatCurrency } from '@/lib/formatters-utils';

export function PaymentSuccessEmail({ 
  fullName,
  eventTitle,
  eventDate,
  categoryName,
  registrationNumber,
  paymentAmount,
}) {
  const htmlContent = EmailLayout({
    title: 'Pembayaran Berhasil',
    children: `
      <div style="font-size: 28px; font-weight: bold; color: #10b981; margin-bottom: 15px;">${ 'Pembayaran Berhasil' || process.env.APP_NAME || 'Runminders'}</div>
      <p style="color: #666666;">Registrasi Anda telah dikonfirmasi</p>
    </div>
    
    <p style="font-size: 16px; color: #333333; margin-top: 20px;">Halo <strong>${fullName}</strong>,</p>
    
    <p style="font-size: 16px; color: #555555; line-height: 1.6;">
      Pembayaran Anda untuk event <strong>${eventTitle}</strong> telah berhasil diproses dan registrasi Anda sekarang aktif.
    </p>
    
    <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #bbf7d0;">      
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
          <td style="color: #10b981; padding: 8px 0; font-size: 14px; font-weight: 600;">${formatCurrency(paymentAmount)}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 8px 0; font-size: 14px;">Status:</td>
          <td style="color: #10b981; padding: 8px 0; font-size: 14px; font-weight: 600;">Terbayar & Dikonfirmasi</td>
        </tr>
      </table>
    </div>
    
    <div style="margin: 30px 0;">
      <h3 style="color: #333333; margin-bottom: 15px;">Informasi Penting</h3>
      
      <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #10b981;">
        <strong style="color: #333333;">Simpan Email</strong>
        <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Simpan email ini sebagai bukti registrasi yang sah.</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #10b981;">
        <strong style="color: #333333;">Hubungi Kami</strong>
        <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">
          Jika ada pertanyaan atau perubahan data, segera hubungi tim support kami.
        </p>
      </div>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/my-registrations/${registrationNumber}" 
         style="display: inline-block; background-color: #10b981; color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Lihat Detail Registrasi →
      </a>
    </div>
    
    <p style="color: #888888; font-size: 14px; border-top: 1px solid #eeeeee; padding-top: 20px;">
      Harap simpan email ini sebagai bukti registrasi.
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
    </div>
    `
  });

  const text = `
PEMBAYARAN BERHASIL - KONFIRMASI REGISTRASI

Halo ${fullName},

Pembayaran Anda untuk event "${eventTitle}" telah berhasil diproses dan registrasi Anda telah dikonfirmasi.

DETAIL REGISTRASI:
• No. Registrasi: ${registrationNumber}
• Event: ${eventTitle}
• Tanggal: ${formatDate(eventDate)}
• Kategori: ${categoryName}
• Total Pembayaran: ${formatCurrency(paymentAmount)}
• Status: ✅ Terbayar & Dikonfirmasi

INFORMASI PENTING:
1. Simpan email ini sebagai bukti registrasi yang sah
2. Anda akan menerima update tambahan menjelang hari H event
3. Hubungi tim support jika ada pertanyaan atau perubahan data

LIHAT DETAIL REGISTRASI:
${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/my-registrations/${registrationNumber}

Salam,
Tim ${process.env.APP_NAME || 'Runminders'}
${process.env.APP_WEBSITE || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
  `;

  return { html: htmlContent, text };
}
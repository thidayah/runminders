import EmailLayout from './EmailLayout'

export function ContactAutoReplyEmail({ name, subject, message }) {
  const htmlContent = EmailLayout({
    title: 'Pesan Diterima',
    children: `
    <div style="font-size: 28px; font-weight: bold; color: #f1c40f; margin-bottom: 15px;">Pesan Anda Diterima</div>
      <p style="color: #666666;">Terima kasih sudah menghubungi kami</p>
    </div>

    <p style="font-size: 16px; color: #333333; margin-top: 20px;">Halo <strong>${name}</strong>,</p>

    <p style="font-size: 16px; color: #555555; line-height: 1.6;">
      Terima kasih telah menghubungi Runminders. Pesan Anda telah kami terima dan akan segera diproses oleh tim kami.
    </p>

    <div style="background: #f8f9fa; border-left: 4px solid #f0c311; padding: 20px; margin: 25px 0; border-radius: 4px;">
      <h4 style="color: #333333; margin: 0 0 12px 0;">Ringkasan pesan Anda:</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #888888; font-size: 14px; width: 80px; vertical-align: top;">Subjek</td>
          <td style="padding: 6px 0; color: #333333; font-size: 14px; vertical-align: top;">: ${subject}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #888888; font-size: 14px; vertical-align: top;">Pesan</td>
          <td style="padding: 6px 0; color: #333333; font-size: 14px; vertical-align: top; white-space: pre-wrap;">: ${message}</td>
        </tr>
      </table>
    </div>

    <div style="background: #fffbea; border: 1px solid #f0c311; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #7a6400;">
        Tim kami akan merespons dalam <strong>1×24 jam kerja</strong>. Jika urusan Anda mendesak, hubungi kami langsung via WhatsApp.
      </p>
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
        Email ini dikirim secara otomatis sebagai konfirmasi penerimaan pesan Anda.
      </p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="${process.env.APP_WEBSITE || '#'}" style="display: inline-block; margin: 0 10px; color: #666666; text-decoration: none; font-size: 14px;">Website</a>
        <a href="${process.env.APP_INSTAGRAM || '#'}" style="display: inline-block; margin: 0 10px; color: #666666; text-decoration: none; font-size: 14px;">Instagram</a>
      </div>
    </div>
    `
  })

  const text = `
Halo ${name},

Terima kasih telah menghubungi Runminders. Pesan Anda telah kami terima.

RINGKASAN PESAN:
Subjek : ${subject}
Pesan  : ${message}

Tim kami akan merespons dalam 1x24 jam kerja.

---
Salam,
Tim ${process.env.APP_NAME || 'Runminders'}
${process.env.APP_WEBSITE || ''}
  `

  return { html: htmlContent, text }
}

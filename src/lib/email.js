import { Resend } from 'resend';
import { VerificationEmail } from '@/components/emails/VerificationEmail';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';
import { ResetPasswordEmail } from '@/components/emails/ResetPasswordEmail';
import { EventRegistrationEmail } from "@/components/emails/EventRegistrationEmail";
import { PaymentSuccessEmail } from '@/components/emails/PaymentSuccessEmail';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(toEmail, verificationToken, fullName) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
  
  try {
    const emailContent = VerificationEmail({
      fullName,
      verificationLink
    });

    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
      // to: [toEmail],
      to: ['muhamadt84@gmail.com'], // For testing
      subject: 'Verifikasi Email Anda',
      html: emailContent.html,
      text: emailContent.text
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Verification email sent via Resend:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    return { success: false, error: error.message };
  }
}

export async function sendWelcomeEmail(toEmail, fullName) {
  try {
    const emailContent = WelcomeEmail({
      fullName,
      toEmail
    });

    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
      // to: [toEmail],
      to: ['muhamadt84@gmail.com'], // For testing
      subject: `Selamat Datang di ${process.env.APP_NAME || 'Runminders'}!`,
      html: emailContent.html,
      text: emailContent.text
    });

    if (error) {
      console.error('Resend welcome email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Welcome email sent via Resend:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('Error sending welcome email with Resend:', error);
    return { success: false, error: error.message };
  }
}

export async function sendPasswordResetEmail(toEmail, resetToken, fullName) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
  
  try {
    const emailContent = ResetPasswordEmail({
      fullName,
      resetLink
    });

    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
      // to: [toEmail],
      to: ['muhamadt84@gmail.com'], // For testing
      subject: 'Reset Password - ' + (process.env.APP_NAME || 'Runminders'),
      html: emailContent.html,
      text: emailContent.text
    });

    if (error) {
      console.error('Resend reset password email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Reset password email sent via Resend:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendEventRegistrationEmail({
  toEmail,
  fullName,
  eventTitle,
  eventDate,
  categoryName,
  registrationNumber,
  paymentAmount,
  snapTransaction,
  isFree = false
}) {
  try {
    const emailContent = EventRegistrationEmail({
      fullName,
      eventTitle,
      eventDate,
      categoryName,
      registrationNumber,
      paymentAmount,
      snapTransaction,
      isFree
    });

    const subject = isFree 
      ? `Registrasi Berhasil - ${eventTitle}`
      : `Konfirmasi Registrasi - ${eventTitle}`;

    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
      // to: [toEmail],
      to: ['muhamadt84@gmail.com'], // For testing
      subject: subject,
      html: emailContent.html,
      text: emailContent.text
    });

    if (error) {
      console.error('Resend event registration email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Event registration email sent via Resend:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('Error sending event registration email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendPaymentSuccessEmail({
  toEmail,
  fullName,
  eventTitle,
  eventDate,
  categoryName,
  registrationNumber,
  paymentAmount
}) {
  try {
    const emailContent = PaymentSuccessEmail({
      fullName,
      eventTitle,
      eventDate,
      categoryName,
      registrationNumber,
      paymentAmount
    });

    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
      // to: [toEmail],
      to: ['muhamadt84@gmail.com'], // For testing
      subject: `Pembayaran Berhasil - ${eventTitle}`,
      html: emailContent.html,
      text: emailContent.text
    });

    if (error) {
      console.error('Resend payment success email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Payment success email sent via Resend:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('Error sending payment success email:', error);
    return { success: false, error: error.message };
  }
}
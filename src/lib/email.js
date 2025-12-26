import { Resend } from 'resend';
import { VerificationEmail } from '@/components/emails/VerificationEmail';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';
import { ResetPasswordEmail } from '@/components/emails/ResetPasswordEmail';

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
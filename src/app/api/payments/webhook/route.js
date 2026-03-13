import { supabaseServer } from "@/lib/supabase";
import { NextResponse } from 'next/server';
import { sendPaymentSuccessEmail } from "@/lib/email";
import { verifySignature } from "@/lib/midtrans";

// Helper untuk validasi apakah transaksi layak diproses
const isProcessableTransaction = (notification) => {
  const { transaction_status, payment_type, fraud_status } = notification;

  // Validasi kondisi dasar: status harus pending, settlement, capture, atau deny
  const validStatuses = ['pending', 'settlement', 'capture', 'deny', 'cancel', 'expire', 'refund'];
  if (!validStatuses.includes(transaction_status)) {
    return false;
  }

  // Untuk Credit Card: transaction_status = "capture" AND fraud_status = "accept"
  if (payment_type === 'credit_card') {
    return transaction_status === 'capture' && fraud_status === 'accept';
  }

  // Untuk Non-Credit Card (VA, QRIS, e-wallet, dll): transaction_status = "settlement"
  // Juga terima pending untuk status awal
  if (['pending', 'settlement'].includes(transaction_status)) {
    return true;
  }

  // Untuk status failure (deny, cancel, expire, refund) selalu proses
  if (['deny', 'cancel', 'expire', 'refund'].includes(transaction_status)) {
    return true;
  }

  return false;
};

// Helper untuk map Midtrans status ke status pembayaran
const mapPaymentStatus = (midtransStatus) => {
  switch (midtransStatus) {
    case 'settlement':
    case 'capture':
      return 'paid';
    case 'pending':
      return 'pending';
    case 'deny':
    case 'cancel':
    case 'expire':
      return 'failed';
    case 'refund':
    case 'partial_refund':
      return 'refunded';
    default:
      return 'pending';
  }
};

// Helper untuk map Midtrans status ke status registrasi
const mapRegistrationStatus = (midtransStatus) => {
  switch (midtransStatus) {
    case 'settlement':
    case 'capture':
      return 'confirmed';
    case 'deny':
    case 'cancel':
    case 'expire':
      return 'cancelled';
    default:
      return 'pending';
  }
};

// Fungsi untuk forward webhook ke aplikasi lain
async function forwardWebhookToExternalApp(url, notification) {
  try {
    // console.log(`Forwarding webhook to: ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-From': 'runminders-main',
        'X-Original-Timestamp': new Date().toISOString()
      },
      body: JSON.stringify(notification)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to forward webhook to ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return { success: false, error: errorText };
    }

    const result = await response.json();
    // console.log(`Successfully forwarded webhook to ${url}:`, result);
    return { success: true, data: result };
  } catch (error) {
    console.error(`Error forwarding webhook to ${url}:`, error.message);
    return { success: false, error: error.message };
  }
}

export async function POST(request) {
  try {
    const notification = await request.json();
    // console.log('Midtrans Webhook Received:', JSON.stringify(notification, null, 2));

    // Validasi field wajib
    const {
      order_id,
      transaction_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      fraud_status,
      transaction_time
    } = notification;

    if (!order_id || !status_code || !gross_amount || !signature_key || !transaction_status || !transaction_id) {
      console.error('Incomplete notification data:', { order_id, transaction_id, transaction_status });
      return NextResponse.json(
        { success: false, message: 'Data notifikasi tidak lengkap' },
        { status: 400 }
      );
    }

    if (order_id && typeof order_id === 'string') {      
      // Check for RITW prefix
      if (order_id.includes('RITW')) {
        const appRitwUrl = process.env.APP_RITW;
        if (appRitwUrl) {
          const forwardUrl = `${appRitwUrl}/api/webhooks/midtrans`;
          // console.log('Detected RITW order, forwarding to:', forwardUrl);

          // Forward the webhook
          const forwardResult = await forwardWebhookToExternalApp(forwardUrl, notification);

          if (forwardResult.success) {
            // console.log('Successfully forwarded RITW webhook');
            return NextResponse.json({
              success: true,
              message: 'Webhook forwarded to RITW app',
              data: {
                forwarded: true,
                target: 'RITW'
              }
            });
          } else {
            console.error('Failed to forward RITW webhook:', forwardResult.error);
            // Continue processing locally as fallback
            // console.log('Falling back to local processing for RITW order');
          }
        } else {
          console.warn('APP_RITW environment variable not set, cannot forward webhook');
        }
      }

      // Check for SYD prefix
      else if (order_id.includes('SYD')) {
        const appSydUrl = process.env.APP_SYD;
        if (appSydUrl) {
          const forwardUrl = `${appSydUrl}/api/webhooks/midtrans`;
          // console.log('Detected SYD order, forwarding to:', forwardUrl);

          // Forward the webhook
          const forwardResult = await forwardWebhookToExternalApp(forwardUrl, notification);

          if (forwardResult.success) {
            // console.log('Successfully forwarded SYD webhook');
            return NextResponse.json({
              success: true,
              message: 'Webhook forwarded to SYD app',
              data: {
                forwarded: true,
                target: 'SYD'
              }
            });
          } else {
            console.error('Failed to forward SYD webhook:', forwardResult.error);
            // Continue processing locally as fallback
            // console.log('Falling back to local processing for SYD order');
          }
        } else {
          console.warn('APP_SYD environment variable not set, cannot forward webhook');
        }
      }
    }

    // Cek apakah transaksi layak diproses
    if (!isProcessableTransaction(notification)) {
      // console.log('Transaction not processable, skipping:', { order_id, transaction_status, payment_type, fraud_status });
      return NextResponse.json({
        success: true,
        message: 'Transaksi tidak memenuhi kriteria untuk diproses',
        data: { transaction_status, payment_type, fraud_status }
      });
    }

    // Verifikasi signature di production environment
    const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";
    if (isProd) {
      const paramsSignature = {
        order_id,
        status_code,
        gross_amount,
        signature_key
      };
      const isValidSignature = verifySignature(paramsSignature);
      if (!isValidSignature) {
        console.error('Invalid signature from Midtrans:', order_id);
        return NextResponse.json(
          { success: false, message: 'Signature tidak valid' },
          { status: 401 }
        );
      }
      // console.log('Signature verification passed');
    } else {
      // console.log('Bypassing signature verification in development mode');
    }

    // Cari registrasi berdasarkan order_id (registration_number)
    const { data: registration, error: registrationError } = await supabaseServer
      .from('registrations')
      .select(`
        *,
        category:event_categories(id, name, waiting_list, current_slots),
        event:events(id, title, event_date, location, current_participants)
      `)
      .eq('registration_number', order_id)
      .single();

    if (registrationError || !registration) {
      console.error('Registration not found:', order_id);
      return NextResponse.json(
        { success: false, message: 'Registrasi tidak ditemukan' },
        { status: 404 }
      );
    }

    // console.log('Registration found:', { registration_id: registration.id, current_status: registration.status, current_payment_status: registration.payment_status });

    // Cek apakah transaksi dengan transaction_id sudah ada di database
    const { data: existingTransaction } = await supabaseServer
      .from('payment_transactions')
      .select('*')
      .eq('transaction_id', transaction_id)
      .maybeSingle();

    if (existingTransaction) {
      // console.log('Transaction already processed, updating if needed:', transaction_id);

      // Periksa apakah status perlu diupdate
      const shouldUpdate = existingTransaction.transaction_status !== transaction_status;

      if (shouldUpdate) {
        // console.log('Updating existing transaction with new status:', { old_status: existingTransaction.transaction_status, new_status: transaction_status });
      } else {
        // console.log('Transaction status unchanged, skipping update');
        return NextResponse.json({
          success: true,
          message: 'Transaksi sudah diproses sebelumnya'
        });
      }
    }

    // Mulai proses update dalam transaction
    const paymentStatus = mapPaymentStatus(transaction_status);
    const registrationStatus = mapRegistrationStatus(transaction_status);

    // console.log('Mapping status:', { midtrans_status: transaction_status, payment_status: paymentStatus, registration_status: registrationStatus });

    // Simpan/update payment transaction
    const transactionData = {
      registration_id: registration.id,
      transaction_id: transaction_id,
      transaction_status: transaction_status,
      payment_gateway: 'midtrans',
      payment_type: payment_type,
      // fraud_status: fraud_status || null,
      gross_amount: parseFloat(gross_amount),
      raw_response: notification,
      transaction_time: transaction_time ? new Date(transaction_time).toISOString() : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let paymentTransaction;

    if (existingTransaction) {
      // Update existing transaction
      const { data: updatedTransaction, error: updateError } = await supabaseServer
        .from('payment_transactions')
        .update(transactionData)
        .eq('id', existingTransaction.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating payment transaction:', updateError);
        throw new Error('Gagal update transaksi pembayaran');
      }
      paymentTransaction = updatedTransaction;
      // console.log('Payment transaction updated:', paymentTransaction.id);
    } else {
      // Insert new transaction
      transactionData.created_at = new Date().toISOString();

      const { data: newTransaction, error: insertError } = await supabaseServer
        .from('payment_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating payment transaction:', insertError);
        throw new Error('Gagal menyimpan transaksi pembayaran');
      }
      paymentTransaction = newTransaction;
      // console.log('Payment transaction created:', paymentTransaction.id);
    }

    // Update registrations table
    const updateRegistrationData = {
      payment_status: paymentStatus,
      status: registrationStatus,
      payment_method: payment_type,
      updated_at: new Date().toISOString()
    };

    // Jika pembayaran sukses, set payment_date
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      updateRegistrationData.payment_date = new Date().toISOString();
    }

    // Jika pembayaran gagal, clear payment_date
    if (['deny', 'cancel', 'expire'].includes(transaction_status)) {
      updateRegistrationData.payment_date = null;
    }

    const { error: updateRegError } = await supabaseServer
      .from('registrations')
      .update(updateRegistrationData)
      .eq('id', registration.id);

    if (updateRegError) {
      console.error('Error updating registration:', updateRegError);
      throw new Error('Gagal update status registrasi');
    }

    // console.log('Registration updated:', { registration_id: registration.id, new_payment_status: paymentStatus, new_registration_status: registrationStatus });

    // Handle slot management berdasarkan status transaksi
    if (registration.category && registration.event) {
      const category = registration.category;
      const event = registration.event;

      // Status yang perlu penanganan khusus untuk slot
      if (transaction_status === 'settlement' || transaction_status === 'capture') {
        // Pembayaran sukses: tambah current_slots, kurangi waiting_list
        // console.log('Processing successful payment for slots management');

        await supabaseServer
          .from('event_categories')
          .update({
            current_slots: (category.current_slots || 0) + 1,
            waiting_list: Math.max(0, (category.waiting_list || 0) - 1),
            updated_at: new Date().toISOString()
          })
          .eq('id', category.id);

        // console.log('Slots updated after successful payment');

        // Kirim email konfirmasi pembayaran sukses
        try {
          await sendPaymentSuccessEmail({
            toEmail: registration.participant_email,
            fullName: registration.participant_full_name,
            eventTitle: event.title,
            eventDate: event.event_date,
            categoryName: category.name,
            registrationNumber: registration.registration_number,
            paymentAmount: gross_amount,
          });
          // console.log('Success email sent to:', registration.participant_email);
        } catch (emailError) {
          console.warn('Gagal mengirim email konfirmasi pembayaran:', emailError);
          // Jangan throw error karena ini opsional
        }

      } else if (['deny', 'cancel', 'expire'].includes(transaction_status)) {
        // Pembayaran gagal/dibatalkan: kembalikan slot jika diperlukan
        // console.log('Processing failed/cancelled payment for slots management');

        // Hanya kurangi jika status sebelumnya pending/confirmed
        if (['pending', 'confirmed'].includes(registration.status)) {
          await supabaseServer
            .from('event_categories')
            .update({
              waiting_list: Math.max(0, (category.waiting_list || 0) - 1),
              updated_at: new Date().toISOString()
            })
            .eq('id', category.id)
            .gte('waiting_list', 1);

          // Kurangi current_participants di event
          if (registrationStatus === 'cancelled') {
            await supabaseServer
              .from('events')
              .update({
                current_participants: Math.max(0, (event.current_participants || 0) - 1),
                updated_at: new Date().toISOString()
              })
              .eq('id', event.id);
          }
          // console.log('Slots updated after failed/cancelled payment');
        }
      }
    }

    // Log success
    // console.log('Webhook processed successfully:', { order_id, transaction_id, transaction_status, payment_type, payment_status: paymentStatus, registration_status: registrationStatus, processed_at: new Date().toISOString() });

    // Response ke Midtrans
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      data: {
        registration_id: registration.id,
        order_id,
        transaction_id,
        transaction_status,
        payment_status: paymentStatus,
        registration_status: registrationStatus,
        processed_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Webhook processing error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Terjadi kesalahan saat memproses webhook',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Handle GET untuk verifikasi endpoint (opsional)
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Midtrans webhook endpoint is active and ready',
    environment: process.env.MIDTRANS_IS_PRODUCTION === "true" ? 'production' : 'sandbox',
    timestamp: new Date().toISOString(),
    note: 'This endpoint accepts POST requests for payment notifications'
  });
}
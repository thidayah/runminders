import { supabaseServer } from "@/lib/supabase";
import { NextResponse } from 'next/server';
import { sendPaymentSuccessEmail } from "@/lib/email";
import { verifySignature } from "@/lib/midtrans";

// Helper untuk map Midtrans status ke status registrasi
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

export async function POST(request) {
  try {
    const notification = await request.json();

    // console.log('Midtrans Webhook Received:', JSON.stringify(notification, null, 2));

    // Validasi signature key
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      transaction_id
    } = notification;

    // Validasi field wajib
    if (!order_id || !status_code || !gross_amount || !signature_key || !transaction_status) {
      return NextResponse.json(
        { success: false, message: 'Data notifikasi tidak lengkap' },
        { status: 400 }
      );
    }

    // Verifikasi signature
    const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";
    if (isProd) {
      const paramsSignature = {
        order_id,
        status_code,
        gross_amount,
        signature_key
      }
      // const isValidSignature = verifySignature(order_id, status_code, gross_amount, signature_key);
      const isValidSignature = verifySignature(paramsSignature);
      if (!isValidSignature) {
        console.error('Invalid signature from Midtrans');
        return NextResponse.json(
          { success: false, message: 'Signature tidak valid' },
          { status: 401 }
        );
      }
    } else {
      console.log('Bypassing signature verification in non-production mode');
    }

    // Cari registrasi berdasarkan order_id (registration_number)
    const { data: registration, error: registrationError } = await supabaseServer
      .from('registrations')
      .select('*')
      .eq('registration_number', order_id)
      .single();

    if (registrationError || !registration) {
      console.error('Registration not found:', order_id);
      return NextResponse.json(
        { success: false, message: 'Registrasi tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek apakah transaksi sudah diproses sebelumnya
    const { data: existingTransaction } = await supabaseServer
      .from('payment_transactions')
      .select('*')
      .eq('transaction_id', transaction_id)
      .maybeSingle();

    if (existingTransaction) {
      console.log('Transaction already processed:', transaction_id);
      return NextResponse.json({ success: true, message: 'Transaksi sudah diproses' });
    }

    // Mulai transaction database
    const status = mapPaymentStatus(transaction_status);
    const registrationStatus = mapRegistrationStatus(transaction_status);

    // Update payment_transactions
    const transactionData = {
      registration_id: registration.id,
      transaction_id: transaction_id,
      transaction_status: transaction_status,
      payment_gateway: 'midtrans',
      payment_type: payment_type,
      gross_amount: parseFloat(gross_amount),
      raw_response: notification,
      transaction_time: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: paymentTransaction, error: transactionError } = await supabaseServer
      .from('payment_transactions')
      .insert(transactionData)
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating payment transaction:', transactionError);
      throw new Error('Gagal menyimpan transaksi pembayaran');
    }

    // Update registrations
    const updateData = {
      payment_status: status,
      status: registrationStatus,
      updated_at: new Date().toISOString()
    };

    // Jika pembayaran sukses, set payment_date
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      updateData.payment_date = new Date().toISOString();
    }

    const { error: updateError } = await supabaseServer
      .from('registrations')
      .update(updateData)
      .eq('id', registration.id);

    if (updateError) {
      console.error('Error updating registration:', updateError);
      throw new Error('Gagal update status registrasi');
    }

    // Dapatkan kategori
    const { data: category } = await supabaseServer
      .from('event_categories')
      .select('name, waiting_list, current_slots')
      .eq('id', registration.category_id)
      .single();

    // Ambil data event untuk email
    const { data: event } = await supabaseServer
      .from('events')
      .select('title, event_date, location, current_participants')
      .eq('id', registration.event_id)
      .single();

    // Jika pembayaran failed/cancelled, kembalikan slot
    if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
      if (category) {
        // Kurangi waiting_list
        await supabaseServer
          .from('event_categories')
          .update({
            waiting_list: Math.max(0, category.waiting_list - 1),
            updated_at: new Date().toISOString()
          })
          .eq('id', registration.category_id)
          .gte('waiting_list', 1); // Hanya update jika waiting_list >= 1

        // Kurangi current_participants di event
        if (event) {
          await supabaseServer
            .from('events')
            .update({
              current_participants: Math.max(0, event.current_participants - 1),
              updated_at: new Date().toISOString()
            })
            .eq('id', registration.event_id);
        }
      }
    }

    // Kirim email notifikasi jika pembayaran sukses
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      try {
        if (event && category) {
          // Tambah current_slots, dan kurangi waiting_list
          await supabaseServer
            .from('event_categories')
            .update({
              current_slots: Math.max(0, (category.current_slots || 0) + 1),
              waiting_list: Math.max(0, (category.waiting_list || 0) - 1),
              updated_at: new Date().toISOString()
            })
            .eq('id', registration.category_id);

          await sendPaymentSuccessEmail({
            toEmail: registration.participant_email,
            fullName: registration.participant_full_name,
            eventTitle: event.title,
            eventDate: event.event_date,
            categoryName: category.name,
            registrationNumber: registration.registration_number,
            paymentAmount: registration.payment_amount,
          });
        }
      } catch (emailError) {
        console.warn('Gagal mengirim email konfirmasi pembayaran:', emailError);
      }
    }

    console.log('Webhook processed successfully:', {
      order_id,
      transaction_id,
      status,
      registrationStatus
    });

    // Response ke Midtrans
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      data: {
        registration_id: registration.id,
        order_id,
        transaction_id,
        payment_status: status,
        registration_status: registrationStatus
      }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Terjadi kesalahan saat memproses webhook'
      },
      { status: 500 }
    );
  }
}

// Handle GET untuk verifikasi endpoint (opsional)
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Midtrans webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
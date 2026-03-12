import Midtrans from 'midtrans-client';

// Inisialisasi Snap
const snap = new Midtrans.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

/**
 * Membuat Snap transaction untuk registrasi event
 * @param {Object} params - Parameter untuk transaksi
 * @param {string} params.order_id - Order ID (registration_number)
 * @param {number} params.gross_amount - Jumlah pembayaran
 * @param {string} params.customer_name - Nama customer
 * @param {string} params.customer_email - Email customer
 * @param {string} params.customer_phone - Telepon customer
 * @param {Object} params.item_details - Detail item
 * @returns {Promise<Object>} Snap token dan redirect_url
 */
export const createSnapTransaction = async (params) => {
  try {
    const transactionDetails = {
      transaction_details: {
        order_id: params.order_id,
        gross_amount: params.gross_amount,
      },
      customer_details: {
        first_name: params.customer_name,
        email: params.customer_email,
        phone: params.customer_phone,
      },
      item_details: params.item_details,
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`,
      },
      expiry: {
        unit: 'hours',
        duration: 2, // Transaksi berlaku 2 jam
      },
    };

    // Create Snap transaction
    const transaction = await snap.createTransaction(transactionDetails);

    return {
      success: true,
      data: {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      },
    };
  } catch (error) {
    console.error('Midtrans Snap error:', error);
    return {
      success: false,
      error: error.message || 'Gagal membuat transaksi pembayaran',
    };
  }
};

/**
 * Verifikasi signature key dari Midtrans
 * @param {Object} params - Parameter untuk verifikasi
 * @param {string} params.order_id - Order ID
 * @param {string} params.status_code - Status code
 * @param {string} params.gross_amount - Jumlah pembayaran
 * @param {string} params.signature_key - Signature key dari Midtrans
 * @returns {boolean} True jika signature valid
 */
export const verifySignature = (params) => {
  const { order_id, status_code, gross_amount, signature_key } = params;
  
  const input = order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY;
  const hashed = crypto
    .createHash('sha512')
    .update(input)
    .digest('hex');

  return hashed === signature_key;
};

/**
 * Get transaction status dari Midtrans
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Status transaksi
 */
export const getTransactionStatus = async (orderId) => {
  try {
    const status = await snap.transaction.status(orderId);
    return {
      success: true,
      data: status,
    };
  } catch (error) {
    console.error('Midtrans status error:', error);
    return {
      success: false,
      error: error.message || 'Gagal mendapatkan status transaksi',
    };
  }
};
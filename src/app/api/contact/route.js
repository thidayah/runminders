import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { sendContactAutoReplyEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validasi input
    const errors = {}
    if (!name?.trim()) errors.name = 'Nama wajib diisi'
    if (!email?.trim()) errors.email = 'Email wajib diisi'
    if (!subject?.trim()) errors.subject = 'Subjek wajib diisi'
    if (!message?.trim()) errors.message = 'Pesan wajib diisi'

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap', errors },
        { status: 400 }
      )
    }

    // Simpan ke database
    const { error: insertError } = await supabaseServer
      .from('contact_messages')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim()
      })

    if (insertError) {
      console.error('Error saving contact message:', insertError)
      return NextResponse.json(
        { success: false, message: 'Gagal menyimpan pesan' },
        { status: 500 }
      )
    }

    // Kirim auto-reply ke pengirim (non-blocking)
    sendContactAutoReplyEmail({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() })
      .catch(err => console.error('Auto-reply email error:', err))

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim. Kami akan membalas dalam 1x24 jam.'
    })

  } catch (error) {
    console.error('Contact POST error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
}

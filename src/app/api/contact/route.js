import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth-utils'
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

export async function GET(request) {
  try {
    // Auth — admin only
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token autentikasi diperlukan' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid atau telah kedaluwarsa' },
        { status: 401 }
      )
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Hanya admin yang dapat mengakses resource ini' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const offset = (page - 1) * limit
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search')

    let query = supabaseServer
      .from('contact_messages')
      .select('*', { count: 'exact' })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`)
    }

    const { data: messages, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching contact messages:', error)
      return NextResponse.json(
        { success: false, message: 'Gagal mengambil data pesan' },
        { status: 500 }
      )
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      success: true,
      message: 'Data pesan berhasil diambil',
      data: {
        items: messages || [],
        pagination: {
          current_page: page,
          per_page: limit,
          total_items: count || 0,
          total_pages: totalPages,
          has_next_page: page < totalPages,
          has_previous_page: page > 1
        }
      }
    })

  } catch (error) {
    console.error('Contact GET error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
}

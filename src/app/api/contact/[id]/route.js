import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth-utils'

async function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Token autentikasi diperlukan', status: 401 }
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)

  if (!decoded) {
    return { error: 'Token tidak valid atau telah kedaluwarsa', status: 401 }
  }

  if (decoded.role !== 'admin') {
    return { error: 'Akses ditolak. Hanya admin yang dapat mengakses resource ini', status: 403 }
  }

  return { decoded }
}

export async function GET(request, { params }) {
  try {
    const auth = await verifyAdmin(request)
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status })
    }

    const { id } = await params

    const { data, error } = await supabaseServer
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: 'Pesan tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Contact GET [id] error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const auth = await verifyAdmin(request)
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    const validStatuses = ['new', 'read', 'replied']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Status tidak valid. Gunakan: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseServer
      .from('contact_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      console.error('Error updating contact message:', error)
      return NextResponse.json(
        { success: false, message: 'Pesan tidak ditemukan atau gagal diperbarui' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Status pesan berhasil diperbarui',
      data
    })

  } catch (error) {
    console.error('Contact PATCH error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request)
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status })
    }

    const { id } = await params

    const { error } = await supabaseServer
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting contact message:', error)
      return NextResponse.json(
        { success: false, message: 'Pesan tidak ditemukan atau gagal dihapus' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dihapus'
    })

  } catch (error) {
    console.error('Contact DELETE error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
}

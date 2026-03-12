import { supabaseServer } from "@/lib/supabase"
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const { is_active } = await request.json()

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ID event wajib diisi' 
        },
        { status: 400 }
      )
    }

    if (typeof is_active !== 'boolean') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Status aktif harus boolean (true/false)' 
        },
        { status: 400 }
      )
    }

    // Update status event
    const { data: updatedEvent, error: updateError } = await supabaseServer
      .from('events')
      .update({
        is_active: is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, title, is_active')
      .single()

    if (updateError) {
      console.error('Error toggle status event:', updateError)
      return NextResponse.json(
        { 
          success: false,
          error: 'Gagal mengubah status event' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Event berhasil ${is_active ? 'diaktifkan' : 'dinonaktifkan'}`,
      data: updatedEvent
    })

  } catch (error) {
    console.error('Error toggle status event:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Terjadi kesalahan internal server' 
      },
      { status: 500 }
    )
  }
}
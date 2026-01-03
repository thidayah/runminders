import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Id event diperlukan'
        },
        { status: 400 }
      );
    }    

    // Get event detail
    const { data: event, error } = await supabaseServer
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !event) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event tidak ditemukan'
        },
        { status: 404 }
      );
    }

    // Get categories for this event
    const { data: categories } = await supabaseServer
      .from('event_categories')
      .select('*')
      .eq('event_id', event.id)
      .eq('is_active', true)
      .order('display_order');

    // Get similar events (same organizer or similar type)
    const { data: similarEvents } = await supabaseServer
      .from('events')
      .select('id, title, slug, image_url, event_date, location')
      .eq('is_active', true)
      .neq('id', event.id)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .or(`organizer_name.ilike.%${event.organizer_name}%,location_type.eq.${event.location_type}`)
      .limit(3);

    return NextResponse.json({
      success: true,
      message: 'Data event berhasil diambil',
      data: {
        ...event,
        categories: categories || [],
        similar_events: similarEvents || []
      }
    });

  } catch (error) {
    console.error('Get event detail error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const data = await request.json()

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ID event wajib diisi' 
        },
        { status: 400 }
      )
    }

    // Cek apakah event exists
    const { data: existingEvent, error: checkError } = await supabaseServer
      .from('events')
      .select('id, slug')
      .eq('id', id)
      .single()

    if (checkError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Event tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    // Jika ada perubahan slug, cek keunikan
    if (data.slug && data.slug !== existingEvent.slug) {
      const { data: slugCheck, error: slugError } = await supabaseServer
        .from('events')
        .select('id')
        .eq('slug', data.slug)
        .neq('id', id)

      if (slugError || slugCheck.length > 0) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Slug sudah digunakan oleh event lain' 
          },
          { status: 409 }
        )
      }
    }

    // Siapkan data untuk update
    const updateData = {
      title: data.title || existingEvent.title,
      subtitle: data.subtitle,
      description: data.description,
      image_file: data.image_file,
      image_url: data.image_url,
      event_date: data.event_date,
      event_time: data.event_time,
      location: data.location,
      location_link: data.location_link,
      address: data.address,
      coordinates: data.coordinates,
      is_virtual: data.is_virtual,
      location_type: data.location_type,
      is_free: data.is_free,
      base_price: data.base_price,
      currency: data.currency,
      has_early_bird: data.has_early_bird,
      early_bird_price: data.early_bird_price,
      early_bird_end_date: data.early_bird_end_date,
      max_participants: data.max_participants,
      highlights: data.highlights,
      schedule: data.schedule,
      requirements: data.requirements,
      registration_open_date: data.registration_open_date,
      registration_close_date: data.registration_close_date,
      slug: data.slug || existingEvent.slug,
      organizer_name: data.organizer_name,
      updated_at: new Date().toISOString()
    }

    // Hapus field yang undefined/null
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    // Update event
    const { data: updatedEvent, error: updateError } = await supabaseServer
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error update event:', updateError)
      return NextResponse.json(
        { 
          success: false,
          error: 'Gagal update event' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Event berhasil diperbarui',
      data: updatedEvent
    })

  } catch (error) {
    console.error('Error update event:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Terjadi kesalahan internal server' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ID event wajib diisi' 
        },
        { status: 400 }
      )
    }

    // Cek apakah event exists
    const { data: existingEvent, error: checkError } = await supabaseServer
      .from('events')
      .select('id, title')
      .eq('id', id)
      .single()

    if (checkError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Event tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    // Soft delete: set is_active ke false
    const { data: deletedEvent, error: deleteError } = await supabaseServer
      .from('events')
      // .update({
      //   is_deleted: true,
      //   updated_at: new Date().toISOString()
      // })
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (deleteError) {
      console.error('Error delete event:', deleteError)
      return NextResponse.json(
        { 
          success: false,
          error: 'Gagal menghapus event' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Event berhasil dihapus',
      // data: {
      //   id: deletedEvent.id,
      //   title: deletedEvent.title,
      //   is_active: deletedEvent.is_active
      // }
    })

  } catch (error) {
    console.error('Error delete event:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Terjadi kesalahan internal server' 
      },
      { status: 500 }
    )
  }
}
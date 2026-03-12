import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const { id } = await params;    
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Slug event diperlukan' 
        },
        { status: 400 }
      );
    }
    
    // Get event by slug
    const { data: event, error } = await supabaseServer
      .from('events')
      .select('*')
      .eq('slug', id)
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
        related_events: similarEvents || []
      }
    });
    
  } catch (error) {
    console.error('Get event by slug error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan internal server' 
      },
      { status: 500 }
    );
  }
}
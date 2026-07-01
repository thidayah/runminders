import { supabaseServer } from "@/lib/supabase";
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    const status = searchParams.get('status') || 'all';
    const locationType = searchParams.get('location_type');
    const isFree = searchParams.get('is_free');
    const organizer = searchParams.get('organizer');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sort_by') || 'event_date';
    const sortOrder = searchParams.get('sort_order') || 'asc';

    // New filter parameters
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const categories = searchParams.get('categories');
    // const difficulties = searchParams.get('difficulties');
    const locations = searchParams.get('locations');

    // Build query
    let query = supabaseServer
      .from('events')
      .select('*');

    // Apply filters
    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    } // else show all

    if (locationType) {
      query = query.eq('location_type', locationType);
    }

    if (isFree) {
      query = query.eq('is_free', isFree === 'true');
    }

    if (organizer) {
      query = query.ilike('organizer_name', `%${organizer}%`);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,subtitle.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply price range filter
    if (minPrice !== null && minPrice !== '') {
      query = query.gte('base_price', parseInt(minPrice));
    }

    if (maxPrice !== null && maxPrice !== '') {
      query = query.lte('base_price', parseInt(maxPrice));
    }

    // Apply category filter
    if (categories) {
      const categoryArray = categories.split(',');

      // Create category conditions for each category
      const categoryConditions = categoryArray.map(title => {
        return `title.ilike.%${title}%`;
      });

      // Gunakan .or() untuk menggabungkan semua kondisi category
      query = query.or(categoryConditions.join(','));
    }

    // Apply location filter
    if (locations) {
      const locationArray = locations.split(',');

      // Create location conditions for each location
      const locationConditions = locationArray.map(location => {
        // Jika location adalah "Online", cek location_type
        if (location.toLowerCase() === 'online') {
          return 'location_type.eq.virtual';
        }
        // Jika bukan online, cek lokasi dalam field location
        return `location.ilike.%${location}%`;
      });

      // Gunakan .or() untuk menggabungkan semua kondisi lokasi
      query = query.or(locationConditions.join(','));
    }

    // Get total count for pagination (with same filters)
    const countQuery = supabaseServer
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Apply same filters to count query
    if (locationType) {
      countQuery.eq('location_type', locationType);
    }

    if (isFree) {
      countQuery.eq('is_free', isFree === 'true');
    }

    if (organizer) {
      countQuery.ilike('organizer_name', `%${organizer}%`);
    }

    if (search) {
      countQuery.or(`title.ilike.%${search}%,subtitle.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (minPrice !== null && minPrice !== '') {
      countQuery.gte('base_price', parseInt(minPrice));
    }

    if (maxPrice !== null && maxPrice !== '') {
      countQuery.lte('base_price', parseInt(maxPrice));
    }

    if (categories) {
      const categoryArray = categories.split(',');
      const categoryConditions = categoryArray.map(title => {
        return `title.ilike.%${title}%`;
      });
      query = query.or(categoryConditions.join(','));
    }

    if (locations) {
      const locationArray = locations.split(',');
      const locationConditions = locationArray.map(location => {
        if (location.toLowerCase() === 'online') {
          return 'location_type.eq.virtual';
        }
        return `location.ilike.%${location}%`;
      });
      countQuery.or(locationConditions.join(','));
    }

    const { count: totalCount } = await countQuery;

    // Apply sorting based on sortBy parameter
    if (sortBy === 'base_price') {
      query = query.order('base_price', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'current_participants') {
      query = query.order('current_participants', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'event_date') {
      query = query.order('event_date', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'created_at') {
      query = query.order('created_at', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'title') {
      query = query.order('title', { ascending: sortOrder === 'asc' });
    } else {
      query = query.order('event_date', { ascending: true });
    }

    // Apply sorting by multiple columns if needed for tie-breaking
    if (sortBy === 'popular' || sortBy === 'participants') {
      query = query.order('event_date', { ascending: true }); // Secondary sort by date
    }

    // Get paginated data
    const { data: events, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengambil data events'
        },
        { status: 500 }
      );
    }

    // Get categories for each event
    const eventsWithCategories = await Promise.all(
      events.map(async (event) => {
        const { data: categories } = await supabaseServer
          .from('event_categories')
          .select('*')
          .eq('event_id', event.id)
          .eq('is_active', true)
          .order('display_order');

        return {
          ...event,
          categories: categories || []
        };
      })
    );

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      message: 'Data events berhasil diambil',
      data: {
        items: eventsWithCategories,
        pagination: {
          current_page: page,
          per_page: limit,
          total_items: totalCount || 0,
          total_pages: totalPages,
          has_next_page: page < totalPages,
          has_previous_page: page > 1
        },
        filters: {
          status,
          location_type: locationType,
          is_free: isFree,
          organizer,
          search,
          sort_by: sortBy,
          sort_order: sortOrder,
          min_price: minPrice,
          max_price: maxPrice,
          categories: categories ? categories.split(',') : [],
          // difficulties: difficulties ? difficulties.split(',') : [],
          locations: locations ? locations.split(',') : []
        }
      }
    });

  } catch (error) {
    console.error('Get events error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan internal server'
      },
      { status: 500 }
    );
  }
}

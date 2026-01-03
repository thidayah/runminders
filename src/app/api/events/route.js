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

    // // Apply category filter
    // if (categories) {
    //   const categoryArray = categories.split(',');
    //   query = query.overlaps('categories', categoryArray);
    // }

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

    // Apply difficulty filter (SOON)
    // if (difficulties) {
    //   const difficultyArray = difficulties.split(',');
    //   query = query.in('difficulty', difficultyArray);
    // }

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

    // if (categories) {
    //   const categoryArray = categories.split(',');
    //   countQuery.overlaps('categories', categoryArray);
    // }

    if (categories) {
      const categoryArray = categories.split(',');
      const categoryConditions = categoryArray.map(title => {
        return `title.ilike.%${title}%`;
      });
      query = query.or(categoryConditions.join(','));
    }

    // if (difficulties) {
    //   const difficultyArray = difficulties.split(',');
    //   countQuery.in('difficulty', difficultyArray);
    // }

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
      // Sort by lowest price (base_price) is true, by highest price (base_price) is false
      query = query.order('base_price', { ascending: sortOrder === 'asc' });
      // } else if (sortBy === 'views') {
      // Sort by views or you can use a custom popularity metric (SOON)
      // If you have a popularity/views/registration_count field, use that. Otherwise, use views
      // query = query.order('views', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'current_participants') {
      // Sort by current_participants
      query = query.order('current_participants', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'event_date') {
      // Sort by event date
      query = query.order('event_date', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'created_at') {
      // Sort by created date
      query = query.order('created_at', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'title') {
      // Sort by title
      query = query.order('title', { ascending: sortOrder === 'asc' });
    } else {
      // Default sorting by event date
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

export async function POST(request) {
  try {
    const data = await request.json()

    // Validasi field wajib
    if (!data.title || !data.event_date) {
      return NextResponse.json(
        {
          success: false,
          error: 'Judul event dan tanggal event wajib diisi'
        },
        { status: 400 }
      )
    }

    // Validasi categories
    if (!data.categories || !Array.isArray(data.categories) || data.categories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Minimal harus ada 1 kategori untuk event'
        },
        { status: 400 }
      )
    }

    // Validasi setiap kategori
    for (let i = 0; i < data.categories.length; i++) {
      const category = data.categories[i]
      if (!category.name || !category.price || !category.max_slots) {
        return NextResponse.json(
          {
            success: false,
            error: `Kategori ke-${i + 1}: Nama, harga, dan jumlah slot maksimal wajib diisi`
          },
          { status: 400 }
        )
      }
    }

    // Generate slug dari judul
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim()
    }

    // Cek slug unik
    const checkSlugUnique = async (slug) => {
      const { data, error } = await supabaseServer
        .from('events')
        .select('id')
        .eq('slug', slug)

      return data.length === 0
    }

    const slug = data.slug || generateSlug(data.title)

    // Cek apakah slug sudah digunakan
    const isSlugUnique = await checkSlugUnique(slug)
    if (!isSlugUnique) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug sudah digunakan. Silakan pilih judul yang berbeda atau tambahkan angka di belakang'
        },
        { status: 409 }
      )
    }

    const isValidEmbedUrl = (url) => {
      try {
        const parsed = new URL(url);
        return (
          parsed.hostname === 'www.google.com' &&
          parsed.pathname.startsWith('/maps/embed') &&
          parsed.searchParams.has('pb')
        );
      } catch {
        return false;
      }
    }

    const extractValidEmbedSrc = (iframeString) => {      
      const match = iframeString.match(/src="([^"]+)"/);
      if (!match) return null;
      const src = match[1];
      return isValidEmbedUrl(src) ? src : null;
    }

    // Siapkan data event
    const eventData = {
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      image_file: data.image_file || null,
      image_url: data.image_url || null,
      event_date: data.event_date,
      event_time: data.event_time || null,
      location: data.location || null,
      // location_link: data.location_link || null, 
      location_link: extractValidEmbedSrc(data.location_link) || null, // Embed link
      address: data.address || null,
      coordinates: data.coordinates || null,
      is_virtual: data.is_virtual || false,
      location_type: data.location_type || 'offline',
      is_free: data.is_free || false,
      base_price: data.base_price || 0,
      currency: data.currency || 'IDR',
      has_early_bird: data.has_early_bird || false,
      early_bird_price: data.early_bird_price || null,
      early_bird_end_date: data.early_bird_end_date || null,
      max_participants: data.max_participants || null,
      current_participants: 0,
      highlights: data.highlights || [],
      schedule: data.schedule || [],
      requirements: data.requirements || [],
      is_active: true,
      registration_open_date: data.registration_open_date || null,
      registration_close_date: data.registration_close_date || null,
      slug: slug,
      organizer_name: data.organizer_name || null,
      // created_at: new Date().toISOString(),
      // updated_at: new Date().toISOString()
    }
    console.log(extractValidEmbedSrc(data.location_link));


    // Response sukses
    return NextResponse.json({
      success: true,
      message: 'Event berhasil dibuat!',
      data: {
        event: eventData,
        // categories: categories,
        // total_categories: categories.length
      }
    }, { status: 201 })

    // Insert event ke database
    const { data: event, error: eventError } = await supabaseServer
      .from('events')
      .insert(eventData)
      .select()
      .single()

    if (eventError) {
      console.error('Error membuat event:', eventError)
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal membuat event. Silakan coba lagi.'
        },
        { status: 500 }
      )
    }

    // Siapkan data categories
    const categoriesToInsert = data.categories.map((category, index) => ({
      event_id: event.id,
      name: category.name,
      description: category.description || null,
      distance: category.distance || null,
      price: category.price,
      early_bird_price: category.early_bird_price || null,
      max_slots: category.max_slots,
      current_slots: 0,
      waiting_list: 0,
      is_active: true,
      display_order: category.display_order || index + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    // Insert categories ke database
    const { data: categories, error: categoriesError } = await supabaseServer
      .from('event_categories')
      .insert(categoriesToInsert)
      .select()

    if (categoriesError) {
      console.error('Error membuat kategori:', categoriesError)

      // Rollback: hapus event yang sudah dibuat
      await supabaseServer
        .from('events')
        .delete()
        .eq('id', event.id)

      return NextResponse.json(
        {
          success: false,
          error: 'Gagal membuat kategori event. Event telah dibatalkan.'
        },
        { status: 500 }
      )
    }

    // Jika ada features, insert ke category_features
    const featuresToInsert = []

    data.categories.forEach((category, categoryIndex) => {
      if (category.features && Array.isArray(category.features) && category.features.length > 0 && categories[categoryIndex]) {
        category.features.forEach((feature, featureIndex) => {
          if (feature && feature.trim() !== '') {
            featuresToInsert.push({
              category_id: categories[categoryIndex].id,
              feature: feature.trim(),
              display_order: featureIndex + 1,
              created_at: new Date().toISOString()
            })
          }
        })
      }
    })

    if (featuresToInsert.length > 0) {
      const { error: featuresError } = await supabaseServer
        .from('category_features')
        .insert(featuresToInsert)

      if (featuresError) {
        console.warn('Gagal menyimpan fitur kategori:', featuresError)
        // Lanjutkan tanpa error karena features opsional
      }
    }

    // Response sukses
    return NextResponse.json({
      success: true,
      message: 'Event berhasil dibuat!',
      data: {
        event: event,
        categories: categories,
        total_categories: categories.length
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error membuat event:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kesalahan internal server. Silakan coba lagi nanti.'
      },
      { status: 500 }
    )
  }
}


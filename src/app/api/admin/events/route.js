import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// Middleware sudah memvalidasi admin — handler langsung ke logika bisnis

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.title || !data.event_date) {
      return NextResponse.json({ success: false, error: 'Judul event dan tanggal event wajib diisi' }, { status: 400 });
    }

    if (!data.categories || !Array.isArray(data.categories) || data.categories.length === 0) {
      return NextResponse.json({ success: false, error: 'Minimal harus ada 1 kategori untuk event' }, { status: 400 });
    }

    for (let i = 0; i < data.categories.length; i++) {
      const category = data.categories[i];
      if (!category.name || !category.price || !category.max_slots) {
        return NextResponse.json(
          { success: false, error: `Kategori ke-${i + 1}: Nama, harga, dan jumlah slot maksimal wajib diisi` },
          { status: 400 }
        );
      }
    }

    const generateSlug = (title) =>
      title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();

    const checkSlugUnique = async (slug) => {
      const { data } = await supabaseServer.from('events').select('id').eq('slug', slug);
      return data.length === 0;
    };

    const isValidEmbedUrl = (url) => {
      try {
        const parsed = new URL(url);
        return parsed.hostname === 'www.google.com' && parsed.pathname.startsWith('/maps/embed') && parsed.searchParams.has('pb');
      } catch { return false; }
    };

    const extractValidEmbedSrc = (iframeString) => {
      const match = iframeString?.match(/src="([^"]+)"/);
      if (!match) return null;
      return isValidEmbedUrl(match[1]) ? match[1] : null;
    };

    const slug = data.slug || generateSlug(data.title);
    const isSlugUnique = await checkSlugUnique(slug);
    if (!isSlugUnique) {
      return NextResponse.json(
        { success: false, error: 'Slug sudah digunakan. Silakan pilih judul yang berbeda atau tambahkan angka di belakang' },
        { status: 409 }
      );
    }

    const eventData = {
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      image_file: data.image_file || null,
      image_url: data.image_url || null,
      event_date: data.event_date,
      event_time: data.event_time || null,
      location: data.location || null,
      location_link: extractValidEmbedSrc(data.location_link) || null,
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
      slug,
      organizer_name: data.organizer_name || null
    };

    const { data: event, error: eventError } = await supabaseServer.from('events').insert(eventData).select().single();

    if (eventError) {
      console.error('Error membuat event:', eventError);
      return NextResponse.json({ success: false, error: 'Gagal membuat event. Silakan coba lagi.' }, { status: 500 });
    }

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
    }));

    const { data: categories, error: categoriesError } = await supabaseServer
      .from('event_categories').insert(categoriesToInsert).select();

    if (categoriesError) {
      await supabaseServer.from('events').delete().eq('id', event.id);
      return NextResponse.json({ success: false, error: 'Gagal membuat kategori event. Event telah dibatalkan.' }, { status: 500 });
    }

    const featuresToInsert = [];
    data.categories.forEach((category, categoryIndex) => {
      if (category.features && Array.isArray(category.features) && categories[categoryIndex]) {
        category.features.forEach((feature, featureIndex) => {
          if (feature && feature.trim() !== '') {
            featuresToInsert.push({
              category_id: categories[categoryIndex].id,
              feature: feature.trim(),
              display_order: featureIndex + 1,
              created_at: new Date().toISOString()
            });
          }
        });
      }
    });

    if (featuresToInsert.length > 0) {
      const { error: featuresError } = await supabaseServer.from('category_features').insert(featuresToInsert);
      if (featuresError) console.warn('Gagal menyimpan fitur kategori:', featuresError);
    }

    return NextResponse.json({
      success: true,
      message: 'Event berhasil dibuat!',
      data: { event, categories, total_categories: categories.length }
    }, { status: 201 });

  } catch (error) {
    console.error('POST admin/events error:', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan internal server.' }, { status: 500 });
  }
}

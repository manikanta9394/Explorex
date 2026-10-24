import { supabase } from './supabaseClient'
import { allDatasetPlaces } from '../../data/tourismData'

/**
 * Fetches published places from Supabase places table with fallback to static dataset.
 */
export async function fetchPlaces() {
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('is_published', true)

    if (error || !data || data.length === 0) {
      return allDatasetPlaces
    }
    return data
  } catch {
    return allDatasetPlaces
  }
}

/**
 * Fetches single place by id or slug.
 */
export async function fetchPlaceById(idOrSlug) {
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*, place_images(*)')
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .single()

    if (error || !data) {
      return allDatasetPlaces.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null
    }
    return data
  } catch {
    return allDatasetPlaces.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null
  }
}

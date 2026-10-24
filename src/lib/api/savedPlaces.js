import { supabase } from './supabaseClient'

/**
 * Fetches all saved place IDs for a given user from the database.
 */
export async function fetchSavedPlaces(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('saved_places')
    .select('place_id')
    .eq('user_id', userId)

  if (error) {
    console.warn('[savedPlaces] Error fetching saved places:', error.message)
    throw error
  }

  return (data || []).map((row) => row.place_id)
}

/**
 * Inserts a saved place row into the database.
 */
export async function savePlace(userId, placeId) {
  if (!userId || !placeId) throw new Error('userId and placeId are required')

  const { data, error } = await supabase
    .from('saved_places')
    .upsert({ user_id: userId, place_id: placeId })

  if (error) {
    console.warn('[savedPlaces] Error saving place:', error.message)
    throw error
  }

  return data
}

/**
 * Deletes a saved place row from the database.
 */
export async function unsavePlace(userId, placeId) {
  if (!userId || !placeId) throw new Error('userId and placeId are required')

  const { data, error } = await supabase
    .from('saved_places')
    .delete()
    .eq('user_id', userId)
    .eq('place_id', placeId)

  if (error) {
    console.warn('[savedPlaces] Error unsaving place:', error.message)
    throw error
  }

  return data
}

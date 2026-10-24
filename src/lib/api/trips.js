import { supabase } from './supabaseClient'

export async function fetchUserTrips(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('[trips] Error fetching trips:', error.message)
    return []
  }
  return data || []
}

export async function saveTrip(tripData) {
  const { data, error } = await supabase
    .from('trips')
    .insert(tripData)
    .select()

  if (error) throw error
  return data?.[0] || data
}

export async function fetchTripBySlug(shareSlug) {
  if (!shareSlug) return null
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('share_slug', shareSlug)
    .single()

  if (error) return null
  return data
}

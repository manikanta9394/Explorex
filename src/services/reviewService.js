import { supabase } from '../lib/api/supabaseClient'

// Curated initial seed reviews to make every place feel alive immediately
const SEED_REVIEWS = {
  'golconda-fort-hyderabad': [
    {
      id: 'rev-seed-1',
      place_id: 'golconda-fort-hyderabad',
      user_name: 'Ananya Sharma',
      user_avatar: 'peacock',
      rating: 5,
      comment: 'The acoustic clapping at Fateh Darwaza reverberating at the Bala Hissar pavilion is an engineering wonder. Plan your visit for early morning to beat the heat!',
      created_at: '2026-03-12T09:30:00.000Z',
      status: 'approved',
    },
    {
      id: 'rev-seed-2',
      place_id: 'golconda-fort-hyderabad',
      user_name: 'Karthik Reddy',
      user_avatar: 'tiger',
      rating: 5,
      comment: 'Verified ticket fee is just ₹25 per person. The sunset view of Hyderabad skyline from the top is breathtaking.',
      created_at: '2026-03-18T16:45:00.000Z',
      status: 'approved',
    },
  ],
  'charminar-hyderabad': [
    {
      id: 'rev-seed-3',
      place_id: 'charminar-hyderabad',
      user_name: 'Zainab Fatima',
      user_avatar: 'lotus',
      rating: 5,
      comment: 'The heart of old Hyderabad. Beautiful stucco ornamentation. Irani chai and Osmania biscuits at Nimrah Cafe opposite the monument are a must!',
      created_at: '2026-03-20T10:15:00.000Z',
      status: 'approved',
    },
  ],
  'taj-mahal-agra': [
    {
      id: 'rev-seed-4',
      place_id: 'taj-mahal-agra',
      user_name: 'Rohan Mehra',
      user_avatar: 'elephant',
      rating: 5,
      comment: 'Arrive before 6 AM for sunrise. The symmetry of the white Makrana marble and reflection in the Yamuna are timeless.',
      created_at: '2026-03-22T06:10:00.000Z',
      status: 'approved',
    },
  ],
}

/**
 * Fetch reviews for a specific place
 */
export async function fetchPlaceReviews(placeId) {
  if (!placeId) return { reviews: [], avgRating: 0, count: 0 }

  try {
    const { data, error } = await supabase
      .from('place_reviews')
      .select('*')
      .eq('place_id', placeId)
      .order('created_at', { ascending: false })

    if (error) throw error

    const dbReviews = data || []
    const seed = SEED_REVIEWS[placeId] || []

    // Merge seed with database reviews, deduplicating
    const all = [...dbReviews]
    for (const s of seed) {
      if (!all.some((r) => r.id === s.id || (r.user_name === s.user_name && r.place_id === s.place_id))) {
        all.push(s)
      }
    }

    const count = all.length
    const sum = all.reduce((acc, r) => acc + (Number(r.rating) || 5), 0)
    const avgRating = count > 0 ? Number((sum / count).toFixed(1)) : 0

    return { reviews: all, avgRating, count }
  } catch (err) {
    console.warn('fetchPlaceReviews fallback to seed:', err)
    const seed = SEED_REVIEWS[placeId] || []
    const count = seed.length
    const sum = seed.reduce((acc, r) => acc + r.rating, 0)
    return {
      reviews: seed,
      avgRating: count > 0 ? Number((sum / count).toFixed(1)) : 0,
      count,
    }
  }
}

/**
 * Submit or update a user review (strictly 1 review per user per place)
 */
export async function submitPlaceReview({
  placeId,
  rating,
  comment,
  userId,
  userName = 'Explorer',
  userAvatar = 'compass',
}) {
  if (!placeId) throw new Error('Place ID is required')
  if (!userId) throw new Error('You must be signed in to submit a review')
  if (!rating || rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5')
  if (!comment || comment.trim().length < 5) throw new Error('Review comment must be at least 5 characters')

  const cleanComment = comment.trim()

  // Basic spam check
  if (/(buy now|casino|viagra|free bitcoin|http:\/\/|https:\/\/)/i.test(cleanComment)) {
    throw new Error('Your review contains links or promotional content which is not permitted.')
  }

  // Check if user already reviewed this place
  const { data: existing } = await supabase
    .from('place_reviews')
    .select('*')
    .eq('place_id', placeId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    // Update existing review
    const { data, error } = await supabase
      .from('place_reviews')
      .update({
        rating,
        comment: cleanComment,
        user_name: userName,
        user_avatar: userAvatar,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (error) throw error
    return { review: data || existing, isUpdate: true }
  }

  // Insert new review
  const { data, error } = await supabase.from('place_reviews').insert({
    place_id: placeId,
    user_id: userId,
    user_name: userName,
    user_avatar: userAvatar,
    rating,
    comment: cleanComment,
    status: 'approved',
    created_at: new Date().toISOString(),
  })

  if (error) throw error
  return { review: data, isUpdate: false }
}

/**
 * Delete a user review
 */
export async function deletePlaceReview(reviewId, userId) {
  const { error } = await supabase
    .from('place_reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', userId)

  if (error) throw error
  return true
}

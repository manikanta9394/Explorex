import { supabase } from './supabaseClient'

export async function submitFeedback({
  userId = null,
  type = 'other',
  rating = 5,
  message,
  pageUrl = window.location.href,
  placeId = null,
  screenshotUrl = null,
}) {
  const { data, error } = await supabase.from('feedback').insert({
    user_id: userId,
    type,
    rating,
    message,
    page_url: pageUrl,
    place_id: placeId,
    screenshot_url: screenshotUrl,
    status: 'new',
  })

  if (error) throw error
  return data
}

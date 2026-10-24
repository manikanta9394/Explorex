import { supabase } from '../lib/api/supabaseClient'

const PROFANITY_WORDS = [
  'scam',
  'fakeapp',
  'viagra',
  'casino',
  'porn',
  'fuck',
  'shit',
  'bitch',
  'asshole',
]

/**
 * Check if text contains prohibited profanity or spam links
 */
export function validateMessageContent(text) {
  if (!text || text.trim().length < 8) {
    return { valid: false, error: 'Please enter at least 8 characters explaining your feedback.' }
  }

  const lower = text.toLowerCase()
  for (const word of PROFANITY_WORDS) {
    if (lower.includes(word)) {
      return { valid: false, error: 'Feedback cannot contain offensive terms or spam keywords.' }
    }
  }

  return { valid: true }
}

/**
 * Check rate limit for user feedback (max 5 per 10 minutes)
 */
function checkFeedbackRateLimit(userId = 'anonymous') {
  const key = `explorex_feedback_rate_${userId}`
  const now = Date.now()
  const windowMs = 10 * 60 * 1000 // 10 minutes

  let history = []
  try {
    const raw = localStorage.getItem(key)
    if (raw) history = JSON.parse(raw)
  } catch {}

  // Filter within window
  history = history.filter((t) => now - t < windowMs)

  if (history.length >= 5) {
    const oldest = history[0]
    const waitSec = Math.ceil((windowMs - (now - oldest)) / 1000)
    return {
      allowed: false,
      error: `You have submitted several reports recently. Please wait ${Math.ceil(waitSec / 60)} minutes before submitting again.`,
    }
  }

  history.push(now)
  try {
    localStorage.setItem(key, JSON.stringify(history))
  } catch {}

  return { allowed: true }
}

/**
 * Submit feedback report to the database
 */
export async function submitFeedback({
  userId = null,
  type = 'other',
  rating = null,
  message,
  pageUrl = typeof window !== 'undefined' ? window.location.href : '',
  placeId = null,
  screenshotUrl = null,
}) {
  const contentCheck = validateMessageContent(message)
  if (!contentCheck.valid) {
    throw new Error(contentCheck.error)
  }

  const rateCheck = checkFeedbackRateLimit(userId || 'anonymous')
  if (!rateCheck.allowed) {
    throw new Error(rateCheck.error)
  }

  const payload = {
    user_id: userId,
    type,
    rating: rating ? Number(rating) : null,
    message: message.trim(),
    page_url: pageUrl,
    place_id: placeId,
    screenshot_url: screenshotUrl,
    status: 'new',
    created_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from('feedback').insert(payload)

  if (error) {
    console.error('submitFeedback error:', error)
    throw new Error(error.message || 'Failed to submit feedback. Please try again.')
  }

  return data
}

/**
 * Fetch feedback reports submitted by this user only
 */
export async function fetchUserFeedback(userId) {
  if (!userId) return []

  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('fetchUserFeedback error:', err)
    return []
  }
}

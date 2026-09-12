import { createTravelChat } from '../services/openRouterService.js'

export async function askAI(req, res) {
  const { message, history, place } = req.body
  if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'message is required' })

  try {
    const answer = await createTravelChat({ message: message.trim(), history, place })
    res.json({ data: { answer, source: 'openrouter' } })
  } catch (error) {
    if (error.message === 'OPENROUTER_API_KEY is not configured') {
      return res.json({ data: { answer: 'I can help you plan Telangana. Start with Charminar at golden hour, then explore Laad Bazaar for local food, crafts, and history.', source: 'local-fallback' } })
    }
    throw error
  }
}

export async function generateItinerary(req, res) {
  const { preferences } = req.body
  const answer = await createTravelChat({
    message: `Create a practical travel itinerary from these preferences: ${JSON.stringify(preferences || {})}`,
  })
  res.json({ data: { answer } })
}

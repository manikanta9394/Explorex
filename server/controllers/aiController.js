import { createTravelChat } from '../services/openRouterService.js'

export async function askAI(req, res) {
  const { message, history, place, currentPlace, travelMode, userLocation } = req.body
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' })
  }

  try {
    const result = await createTravelChat({
      message: message.trim(),
      history,
      place,
      currentPlace,
      travelMode,
      userLocation,
    })
    res.json({ data: result })
  } catch (error) {
    console.error('aiController askAI error:', error)
    res.status(500).json({
      error: error.message || 'Failed to generate response',
      data: {
        answer: 'Explorex took longer than expected to respond. Please check your connection or tap Retry to ask again.',
        recommendedPlaces: [],
        source: 'error-fallback',
      },
    })
  }
}

export async function generateItinerary(req, res) {
  const { preferences, currentPlace, travelMode } = req.body
  try {
    const result = await createTravelChat({
      message: `Create a practical travel itinerary from these preferences: ${JSON.stringify(preferences || {})}`,
      currentPlace,
      travelMode,
    })
    res.json({ data: result })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

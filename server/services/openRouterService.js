import { env } from '../config/env.js'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function createTravelChat({ message, history = [], place }) {
  if (!env.openRouterApiKey) {
    const error = new Error('OPENROUTER_API_KEY is not configured')
    error.statusCode = 503
    throw error
  }

  const context = place ? `The traveller is asking about ${place.name || 'this destination'} in ${place.city || 'Telangana'}.` : 'The traveller is planning a trip in Telangana, India.'
  const messages = [
    { role: 'system', content: `You are TourMate AI, a concise and warm travel assistant. ${context} Give practical, accurate tourism guidance. Mention when an answer is an estimate. Keep answers under 180 words unless the user asks for a detailed itinerary.` },
    ...history.filter((item) => ['user', 'assistant'].includes(item.role) && typeof item.content === 'string').slice(-8),
    { role: 'user', content: message },
  ]

  const models = ['openrouter/free', env.openRouterModel, ...env.openRouterFallbackModels].filter((model, index, all) => all.indexOf(model) === index)
  let lastError

  for (const model of models) {
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'TourMate AI',
        },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 350 }),
      })
      if (!response.ok) {
        lastError = new Error(`OpenRouter model ${model} failed with status ${response.status}`)
        continue
      }
      const payload = await response.json()
      const answer = payload.choices?.[0]?.message?.content?.trim()
      if (answer) return answer
      lastError = new Error(`OpenRouter model ${model} returned an empty response`)
    } catch (error) {
      lastError = error
    }
  }

  lastError.statusCode = lastError.statusCode || 503
  throw lastError
}

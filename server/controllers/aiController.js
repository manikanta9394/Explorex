import { executeRAGChat, getAiLogs, logAiTelemetry } from '../services/openRouterService.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function askAI(req, res) {
  const { message, history, place, currentPlace, travelMode, userLocation, userId, image } = req.body
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' })
  }

  try {
    const result = await executeRAGChat({
      message: message.trim(),
      history,
      currentPlace: place || currentPlace,
      travelMode,
      userLocation,
      userId: userId || req.headers['x-user-id'] || 'guest_user',
      image,
    })

    res.json({
      data: {
        answer: result.answer,
        recommendedPlaces: result.citedPlaces,
        citedPlaces: result.citedPlaces,
        sources: result.sources,
        model: result.model,
        language: result.language,
        latency_ms: result.latency_ms,
      },
    })
  } catch (error) {
    console.error('aiController askAI error:', error)
    res.status(500).json({
      error: error.message || 'Failed to generate response',
      data: {
        answer: "Explorex took longer than expected to respond. Please check your connection or tap Retry to ask again.",
        recommendedPlaces: [],
        citedPlaces: [],
        sources: [],
        source: 'error-fallback',
      },
    })
  }
}

/**
 * Server-Sent Events (SSE) Streaming Endpoint for live typewriter tokens
 */
export async function streamAIChat(req, res) {
  const { message, history, place, currentPlace, travelMode, userLocation, userId, image } = req.body

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' })
  }

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders()
  }

  try {
    // 1. Initial acknowledgment event
    res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`)
    if (typeof res.flush === 'function') res.flush()
    console.log('[streamAIChat] 1. Initial ack sent')

    // 2. Run complete RAG retrieval & generation pipeline
    const result = await executeRAGChat({
      message: message.trim(),
      history,
      currentPlace: place || currentPlace,
      travelMode,
      userLocation,
      userId: userId || req.headers['x-user-id'] || 'guest_user',
      image,
    })
    console.log('[streamAIChat] 2. executeRAGChat finished, answer len:', result.answer?.length)

    // 3. Emit tokens in realistic chunks
    const text = result.answer || ''
    const tokens = text.split(/(\s+)/)

    for (let i = 0; i < tokens.length; i++) {
      if (res.writableEnded || res.destroyed) break
      const token = tokens[i]
      if (token) {
        res.write(`data: ${JSON.stringify({ type: 'token', token })}\n\n`)
        if (typeof res.flush === 'function') res.flush()
      }
      // Natural typing cadence (4ms delay every 4 tokens)
      if (i % 4 === 0) {
        await sleep(4)
      }
    }
    console.log('[streamAIChat] 3. Token loop finished')

    // 4. Send final completion event with citations & sources
    if (!res.writableEnded && !res.destroyed) {
      res.write(
        `data: ${JSON.stringify({
          type: 'done',
          done: true,
          answer: result.answer,
          citedPlaces: result.citedPlaces,
          recommendedPlaces: result.citedPlaces,
          sources: result.sources,
          model: result.model,
          language: result.language,
          latency_ms: result.latency_ms,
        })}\n\n`
      )
      if (typeof res.flush === 'function') res.flush()
      res.end()
      console.log('[streamAIChat] 4. res.end() called')
    }
  } catch (err) {
    console.error('aiController streamAIChat error:', err)
    if (!res.writableEnded && !res.destroyed) {
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          error: err.message || 'Stream generation failed',
          answer: 'Explorex experienced an issue while streaming your response. Please try again.',
        })}\n\n`
      )
      res.end()
    }
  }
}

export async function generateItinerary(req, res) {
  const { preferences, currentPlace, travelMode } = req.body
  try {
    const prompt = `Plan a verified day-by-day travel itinerary with budget in INR, stop timings, and lunch recommendations from these preferences: ${JSON.stringify(preferences || {})}`
    const result = await executeRAGChat({
      message: prompt,
      currentPlace,
      travelMode,
    })
    res.json({
      data: {
        answer: result.answer,
        recommendedPlaces: result.citedPlaces,
        citedPlaces: result.citedPlaces,
        sources: result.sources,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function fetchAiLogs(_req, res) {
  const logs = getAiLogs(50)
  res.json({ data: logs })
}

export async function recordMessageFeedback(req, res) {
  const { messageId, conversationId, feedback, reason, comment } = req.body
  logAiTelemetry({
    messageId,
    conversationId,
    feedback, // 1 or -1
    reason,
    comment,
    type: 'user_feedback',
    status: feedback === 1 ? 'positive' : 'negative',
  })
  res.json({ success: true, message: 'Feedback recorded' })
}

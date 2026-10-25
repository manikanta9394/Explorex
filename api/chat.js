import { executeRAGChat } from '../server/services/openRouterService.js'

// In-memory sliding window rate limiter
const rateLimits = new Map()
const RATE_LIMIT_WINDOW_MS = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 35

function isRateLimited(ip) {
  const now = Date.now()
  const userRecord = rateLimits.get(ip) || []
  const recent = userRecord.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimits.set(ip, recent)
    return true
  }

  recent.push(now)
  rateLimits.set(ip, recent)
  return false
}

// Clean up stale IP records every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, timestamps] of rateLimits.entries()) {
    const fresh = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
    if (fresh.length === 0) rateLimits.delete(ip)
    else rateLimits.set(ip, fresh)
  }
}, 300000)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default async function handler(req, res) {
  const origin = req.headers.origin || ''

  // 1. CORS Validation
  const isAllowedOrigin =
    !origin ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.endsWith('.vercel.app') ||
    origin === 'https://explorex.in' ||
    origin === 'https://www.explorex.in'

  if (isAllowedOrigin && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  // 2. Request Size Limits (Max 1MB for image attachments, 64KB typical text)
  const contentLength = Number(req.headers['content-length'] || 0)
  if (contentLength > 1048576) {
    return res.status(413).json({ error: 'Payload too large. Maximum request size is 1MB.' })
  }

  // 3. Client IP Rate Limiting
  const clientIp =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    '127.0.0.1'

  if (isRateLimited(clientIp)) {
    res.setHeader('Retry-After', '60')
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before sending another request.',
    })
  }

  // 4. Input Validation
  const { message, history, place, currentPlace, travelMode, userLocation, userId, image } = req.body || {}

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required and must be a non-empty string.' })
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'message too long. Maximum length is 2,000 characters.' })
  }

  const isStreamRequest =
    req.query?.stream === 'true' ||
    req.url?.includes('/stream') ||
    Boolean(req.body?.stream) ||
    req.headers.accept?.includes('text/event-stream')

  try {
    if (isStreamRequest) {
      // SSE Streaming Response
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache, no-transform')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('X-Accel-Buffering', 'no')
      if (typeof res.flushHeaders === 'function') res.flushHeaders()

      res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`)

      const result = await executeRAGChat({
        message: message.trim(),
        history,
        currentPlace: place || currentPlace,
        travelMode,
        userLocation,
        userId: userId || req.headers['x-user-id'] || 'guest_user',
        image,
      })

      const text = result.answer || ''
      const tokens = text.split(/(\s+)/)

      for (let i = 0; i < tokens.length; i++) {
        if (res.writableEnded || res.destroyed) break
        const token = tokens[i]
        if (token) {
          res.write(`data: ${JSON.stringify({ type: 'token', token })}\n\n`)
          if (typeof res.flush === 'function') res.flush()
        }
        if (i % 4 === 0) {
          await sleep(4)
        }
      }

      res.write(
        `data: ${JSON.stringify({
          type: 'done',
          citedPlaces: result.citedPlaces || [],
          sources: result.sources || [],
          model: result.model,
          latency_ms: result.latency_ms,
        })}\n\n`,
      )
      return res.end()
    }

    // Standard JSON Response
    const result = await executeRAGChat({
      message: message.trim(),
      history,
      currentPlace: place || currentPlace,
      travelMode,
      userLocation,
      userId: userId || req.headers['x-user-id'] || 'guest_user',
      image,
    })

    return res.status(200).json({
      data: {
        answer: result.answer,
        recommendedPlaces: result.citedPlaces || [],
        citedPlaces: result.citedPlaces || [],
        sources: result.sources || [],
        model: result.model,
        language: result.language,
        latency_ms: result.latency_ms,
      },
    })
  } catch (err) {
    console.error('Serverless /api/chat error:', err)
    if (isStreamRequest && !res.writableEnded) {
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          error: err.message || 'Failed to process AI request',
        })}\n\n`,
      )
      return res.end()
    }
    return res.status(500).json({
      error: err.message || 'Internal AI Server Error',
      data: {
        answer:
          'Explorex took longer than expected to respond. Please check your connection or tap Retry to ask again.',
        recommendedPlaces: [],
        citedPlaces: [],
        sources: [],
        source: 'error-fallback',
      },
    })
  }
}

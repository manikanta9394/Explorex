/**
 * Explorex Security & Sanitization Middleware
 * Enforces input sanitization, rate limiting, and file-upload constraints.
 */

// 1. In-memory sliding window rate limiter
const rateLimitStore = new Map()

export function rateLimiter({ windowMs = 60 * 1000, max = 30, message = 'Too many requests. Please try again later.' }) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1'
    const key = `${ip}_${req.baseUrl || req.path}`
    const now = Date.now()

    let record = rateLimitStore.get(key)
    if (!record || now - record.resetTime > windowMs) {
      record = { count: 1, resetTime: now + windowMs }
      rateLimitStore.set(key, record)
    } else {
      record.count += 1
    }

    const remaining = Math.max(0, max - record.count)
    res.setHeader('X-RateLimit-Limit', max)
    res.setHeader('X-RateLimit-Remaining', remaining)
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000))

    if (record.count > max) {
      return res.status(429).json({
        error: message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      })
    }

    next()
  }
}

// 2. Input Sanitization Helper
export function sanitizeString(str, maxLength = 2000) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/<\/?\w+[^>]*>/gi, '') // strip all raw HTML tags
    .trim()
    .slice(0, maxLength)
}

// 3. Sanitization Middleware for Request Bodies
export function sanitizeBody(fields = ['message', 'query', 'content', 'feedback', 'title', 'description']) {
  return (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      fields.forEach((field) => {
        if (typeof req.body[field] === 'string') {
          req.body[field] = sanitizeString(req.body[field])
        }
      })
    }
    next()
  }
}

// 4. File-Upload Validation (for screenshots, avatars, place images)
export function validateImageUpload(req, res, next) {
  const image = req.body?.image || req.body?.screenshot || req.body?.avatar_url
  if (!image) return next()

  // Base64 Data URI check
  if (typeof image === 'string' && image.startsWith('data:')) {
    const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
    if (!match) {
      return res.status(400).json({ error: 'Invalid image format. Expected data URI image/jpeg, image/png, or image/webp.' })
    }

    const mime = match[1].toLowerCase()
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedMimes.includes(mime)) {
      return res.status(400).json({ error: `Unsupported image MIME type "${mime}". Allowed: JPG, PNG, WEBP.` })
    }

    const base64Data = match[2]
    const sizeInBytes = (base64Data.length * 3) / 4
    const maxSize = 5 * 1024 * 1024 // 5MB limit
    if (sizeInBytes > maxSize) {
      return res.status(400).json({ error: 'Image file exceeds maximum permitted size of 5MB.' })
    }
  }

  next()
}

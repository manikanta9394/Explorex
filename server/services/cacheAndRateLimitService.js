/**
 * Cache and Rate Limiting Service for Explorex AI Chatbot
 */

class LRUCache {
  constructor(maxSize = 200, ttlMs = 1000 * 60 * 30) {
    this.maxSize = maxSize
    this.ttlMs = ttlMs
    this.cache = new Map()
  }

  get(key) {
    if (!this.cache.has(key)) return null
    const item = this.cache.get(key)
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }
    // Refresh LRU order
    this.cache.delete(key)
    this.cache.set(key, item)
    return item.value
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // Evict oldest item
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    })
  }

  clear() {
    this.cache.clear()
  }
}

export const queryAnswerCache = new LRUCache(250, 1000 * 60 * 20) // 20 min TTL

// Per-user rate limiting: max 30 requests per minute
const userRateLimits = new Map()

export function checkRateLimit(userIdOrIp, limitPerMinute = 30) {
  const now = Date.now()
  const windowMs = 60 * 1000

  let record = userRateLimits.get(userIdOrIp)
  if (!record || now - record.windowStart > windowMs) {
    record = { windowStart: now, count: 1 }
    userRateLimits.set(userIdOrIp, record)
    return { allowed: true, remaining: limitPerMinute - 1 }
  }

  if (record.count >= limitPerMinute) {
    const retryAfterSec = Math.ceil((windowMs - (now - record.windowStart)) / 1000)
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec,
      error: `Rate limit exceeded. Please wait ${retryAfterSec} seconds before sending another message.`,
    }
  }

  record.count += 1
  return { allowed: true, remaining: limitPerMinute - record.count }
}

// Token budget per user session: 40,000 tokens
const userTokenBudgets = new Map()

export function checkAndConsumeTokenBudget(userIdOrSession, tokensToConsume = 0, maxBudget = 40000) {
  let currentUsed = userTokenBudgets.get(userIdOrSession) || 0
  if (currentUsed + tokensToConsume > maxBudget) {
    return {
      allowed: false,
      used: currentUsed,
      remaining: Math.max(0, maxBudget - currentUsed),
      error: 'Token budget for this chat session has been reached. Please start a new chat.',
    }
  }

  currentUsed += tokensToConsume
  userTokenBudgets.set(userIdOrSession, currentUsed)
  return {
    allowed: true,
    used: currentUsed,
    remaining: maxBudget - currentUsed,
  }
}

/**
 * Explorex Product Analytics & Telemetry Tracker
 * Captures user adoption metrics: page views, searches, wishlist saves, AI guide questions, and planner events.
 */

const MAX_STORED_EVENTS = 100
const STORAGE_KEY = 'explorex_analytics_events'

class AnalyticsTracker {
  constructor() {
    this.sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    this.userId = null
    this.listeners = new Set()
  }

  setUserId(id) {
    this.userId = id
  }

  track(eventName, properties = {}) {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        path: typeof window !== 'undefined' ? (window.location.hash || window.location.pathname) : '',
        sessionId: this.sessionId,
        userId: this.userId || 'guest_explorer',
      },
    }

    // Persist to local ring buffer for inspection & debugging
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const list = raw ? JSON.parse(raw) : []
      list.unshift(event)
      if (list.length > MAX_STORED_EVENTS) list.pop()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch {}

    // Dispatch to registered observers (e.g. Sentry / console in dev)
    this.listeners.forEach((fn) => {
      try {
        fn(event)
      } catch {}
    })

    if (import.meta.env?.DEV) {
      console.debug(`[Telemetry: ${eventName}]`, properties)
    }

    return event
  }

  // 1. Page Views
  trackPageView(path, title) {
    return this.track('page_view', { path, title })
  }

  // 2. Searches
  trackSearch(query, resultsCount = 0, stateFilter = 'All') {
    return this.track('search', { query, resultsCount, stateFilter })
  }

  // 3. Wishlist Saves
  trackPlaceSave(placeId, placeName, state, isSaved = true) {
    return this.track('place_save', {
      placeId,
      placeName,
      state,
      action: isSaved ? 'save' : 'unsave',
    })
  }

  // 4. AI Inquiries
  trackAIQuestion(question, language = 'en', latencyMs = 0, citedCount = 0) {
    return this.track('ai_question', {
      questionLength: question?.length || 0,
      language,
      latencyMs,
      citedCount,
    })
  }

  // 5. Trip Planning
  trackTripPlan(days, budget, travellers) {
    return this.track('trip_planned', { days, budget, travellers })
  }

  // 6. Feedback Submissions
  trackFeedback(type, rating, placeId = null) {
    return this.track('feedback_submitted', { type, rating, placeId })
  }

  getRecentEvents() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

export const analytics = new AnalyticsTracker()

/**
 * Explorex Sentry & Client-side Observability
 * Connects to Sentry when VITE_SENTRY_DSN is provided; otherwise operates as an in-memory error auditor.
 * 
 * Features:
 * - Group duplicate errors by fingerprint (type, message, component, route)
 * - Loop / spam suppression: rate limits repeated identical errors within a 30s window
 * - Route and component name context attachment
 */

function getCurrentRoute() {
  if (typeof window === 'undefined') return '/'
  const path = window.location.pathname || ''
  const hash = window.location.hash || ''
  return `${path}${hash}` || '/'
}

export class SentryClient {
  constructor(options = {}) {
    this.dsn = options.dsn || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SENTRY_DSN) || null
    this.breadcrumbs = []
    this.errorGroups = new Map()
    this.suppressionWindowMs = options.suppressionWindowMs ?? 30000 // 30s suppression window
    this.maxGroups = 200
    this.isInitialized = false
    this.init()
  }

  init() {
    if (this.isInitialized) return
    this.isInitialized = true

    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.captureException(event.error || new Error(event.message || 'Window Error'), {
          source: 'window.onerror',
          component: 'WindowGlobal',
          filename: event.filename,
          lineno: event.lineno,
        })
      })

      window.addEventListener('unhandledrejection', (event) => {
        this.captureException(event.reason || new Error('Unhandled Promise Rejection'), {
          source: 'unhandledrejection',
          component: 'WindowPromise',
        })
      })
    }
  }

  addBreadcrumb(crumb = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      category: crumb.category || 'ui',
      message: crumb.message || '',
      level: crumb.level || 'info',
      data: crumb.data || {},
    }
    this.breadcrumbs.push(entry)
    if (this.breadcrumbs.length > 50) this.breadcrumbs.shift()
  }

  captureException(error, context = {}) {
    const route = context.route || getCurrentRoute()
    const component = context.component || 'UnknownComponent'
    const name = error?.name || (typeof error === 'string' ? 'Error' : 'UnhandledException')
    const message = error?.message || (typeof error === 'string' ? error : String(error || 'Unknown error'))
    const stack = error?.stack || null

    // Fingerprint for deduplication and grouping
    const fingerprint = context.fingerprint || `${name}::${message}::${component}::${route}`
    const now = Date.now()

    let group = this.errorGroups.get(fingerprint)
    let isSuppressed = false

    if (group) {
      group.count += 1
      group.lastSeen = new Date().toISOString()

      // Suppress if reported within suppression window
      if (now - group.lastSent < this.suppressionWindowMs) {
        isSuppressed = true
      } else {
        group.lastSent = now
      }
    } else {
      if (this.errorGroups.size >= this.maxGroups) {
        const oldestKey = this.errorGroups.keys().next().value
        this.errorGroups.delete(oldestKey)
      }
      group = {
        fingerprint,
        name,
        message,
        component,
        route,
        count: 1,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        lastSent: now,
      }
      this.errorGroups.set(fingerprint, group)
    }

    const errorPayload = {
      name,
      message,
      stack,
      component,
      route,
      fingerprint,
      count: group.count,
      suppressed: isSuppressed,
      context,
      breadcrumbs: [...this.breadcrumbs],
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    }

    // Only transmit to Sentry and log if NOT suppressed (prevents loops and duplicate noise)
    if (!isSuppressed) {
      if (this.dsn && typeof fetch === 'function') {
        try {
          fetch(this.dsn, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errorPayload),
          }).catch(() => {})
        } catch {}
      }

      if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
        console.warn(
          `[Sentry Exception] [${component}] [Route: ${route}] ${group.count > 1 ? `(Repeated ${group.count}x)` : ''}:`,
          errorPayload
        )
      }
    }

    return errorPayload
  }

  captureMessage(message, level = 'info', context = {}) {
    const route = context.route || getCurrentRoute()
    const component = context.component || 'UnknownComponent'
    this.addBreadcrumb({ category: 'message', message, level, data: { route, component, ...context } })
  }

  getErrorGroups() {
    return Array.from(this.errorGroups.values())
  }

  clearErrorGroups() {
    this.errorGroups.clear()
  }
}

export const Sentry = new SentryClient()

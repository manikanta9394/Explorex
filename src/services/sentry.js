/**
 * Explorex Sentry & Client-side Observability
 * Connects to Sentry when VITE_SENTRY_DSN is provided; otherwise operates as an in-memory error auditor.
 */

class SentryClient {
  constructor() {
    this.dsn = import.meta.env?.VITE_SENTRY_DSN || null
    this.breadcrumbs = []
    this.isInitialized = false
    this.init()
  }

  init() {
    if (this.isInitialized) return
    this.isInitialized = true

    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.captureException(event.error || new Error(event.message), {
          source: 'window.onerror',
          filename: event.filename,
          lineno: event.lineno,
        })
      })

      window.addEventListener('unhandledrejection', (event) => {
        this.captureException(event.reason || new Error('Unhandled Promise Rejection'), {
          source: 'unhandledrejection',
        })
      })
    }
  }

  addBreadcrumb(crumb) {
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
    const errorPayload = {
      name: error?.name || 'Error',
      message: error?.message || String(error),
      stack: error?.stack || null,
      context,
      breadcrumbs: [...this.breadcrumbs],
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    }

    if (this.dsn) {
      // Send to Sentry endpoint via fetch
      try {
        fetch(this.dsn, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorPayload),
        }).catch(() => {})
      } catch {}
    }

    if (import.meta.env?.DEV) {
      console.warn('[Sentry Captured Exception]', errorPayload)
    }

    return errorPayload
  }

  captureMessage(message, level = 'info') {
    this.addBreadcrumb({ category: 'message', message, level })
  }
}

export const Sentry = new SentryClient()

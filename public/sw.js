/* Explorex Service Worker - Production PWA & Offline Support */
const CACHE_VERSION = 'explorex-pwa-v2'
const STATIC_ASSETS = [
  'favicon.svg',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
]

// 1. Install Event: Cache immutable standalone assets only (DO NOT precache HTML shell to avoid stale chunk references)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Precache skipped non-critical asset:', err)
      })
    })
  )
  self.skipWaiting()
})

// Listen for explicit SKIP_WAITING from update prompt
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// 2. Activate Event: Aggressively purge older caches to prevent stale chunks or outdated HTML
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_VERSION) {
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// 3. Fetch Event
self.addEventListener('fetch', (event) => {
  // Rule A: ONLY intercept GET requests
  if (event.request.method !== 'GET') {
    return
  }

  const url = new URL(event.request.url)

  // Rule B: NEVER intercept or cache API requests, auth calls, weather endpoints, or streaming SSE
  // Stale caches here cause desyncs, data corruption, and app crashes.
  if (
    url.pathname.includes('/api') ||
    url.pathname.includes('/chat') ||
    url.pathname.includes('/auth') ||
    url.hostname.includes('open-meteo.com') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    event.request.headers.get('accept')?.includes('text/event-stream')
  ) {
    return
  }

  // Rule C: HTML Navigations & Document Requests: ALWAYS Network-first (NEVER serve stale HTML)
  // Stale HTML caches reference deleted JS/CSS chunk hashes, which crashes React!
  if (
    event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))
  ) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' }).catch(async () => {
        // Fallback ONLY when genuinely offline
        return new Response(
          '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Explorex · Offline</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#F7F5F0;color:#1F3A2E;font-family:system-ui,-apple-system,sans-serif;padding:24px;text-align:center;}.card{background:#fff;padding:36px 28px;border-radius:20px;max-width:400px;box-shadow:0 12px 30px rgba(0,0,0,0.06);}h1{margin:0 0 12px;font-size:20px;}p{color:#666;font-size:14px;margin:0 0 20px;}button{background:#1F3A2E;color:#fff;border:none;padding:10px 22px;border-radius:24px;font-weight:600;cursor:pointer;}</style></head><body><div class="card"><h1>You are offline</h1><p>Explorex requires an active network connection to load the latest verified cultural destinations.</p><button onclick="window.location.reload()">Try again</button></div></body></html>',
          { status: 200, headers: { 'Content-Type': 'text/html' } }
        )
      })
    )
    return
  }

  // Rule D: Web App Manifest: Network-first with cache fallback, guaranteeing manifest JSON MIME type
  if (url.pathname.endsWith('manifest.webmanifest') || url.pathname.endsWith('manifest.json')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone()
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy))
          }
          return response
        })
        .catch(() => caches.match(event.request))
    )
    return
  }

  // Rule E: Static Maps Tiles & Wikimedia Images: Cache-first with network fallback
  if (
    url.hostname.includes('tile.openstreetmap.org') ||
    url.hostname.includes('wikimedia.org') ||
    url.pathname.includes('/images/')
  ) {
    event.respondWith(
      caches.match(event.request).then(async (cached) => {
        if (cached) return cached
        try {
          const response = await fetch(event.request)
          if (response && response.status === 200) {
            const copy = response.clone()
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy))
          }
          return response
        } catch {
          return new Response('', { status: 408 })
        }
      })
    )
    return
  }

  // Rule F: Versioned immutable assets (Vite hashed bundles under /assets/): Cache-first
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request).then(async (cached) => {
        if (cached) return cached
        const response = await fetch(event.request)
        if (response && response.status === 200) {
          const copy = response.clone()
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy))
        }
        return response
      })
    )
    return
  }

  // All other requests: pass through directly to network
})

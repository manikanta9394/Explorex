/* Explorex Service Worker - Offline Caching & PWA Support */
const CACHE_NAME = 'explorex-cache-v1'
const STATIC_ASSETS = [
  './',
  './index.html',
  './favicon.svg',
  './manifest.json',
]

// Install: precache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Precache skipped for missing asset:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate: clean older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch strategy:
// 1. Static assets & images: Stale-While-Revalidate
// 2. Chat API & weather: Network only
// 3. Navigation: Network with offline fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Skip non-GET requests or streaming chat API
  if (event.request.method !== 'GET' || url.pathname.includes('/api/ai/') || url.pathname.includes('/chat')) {
    return
  }

  // Map tiles & images: Cache first with network fallback
  if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('wikimedia.org') || url.pathname.includes('/images/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request)
        if (cached) return cached
        try {
          const response = await fetch(event.request)
          if (response && response.status === 200) {
            cache.put(event.request, response.clone())
          }
          return response
        } catch {
          return cached || new Response('', { status: 408 })
        }
      })
    )
    return
  }

  // App shell / document navigation: Network first, fallback to cached index
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match('./index.html')
        return cached || new Response('Offline - Explorex', { status: 200, headers: { 'Content-Type': 'text/html' } })
      })
    )
    return
  }

  // Default: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return networkResponse
        })
        .catch(() => cachedResponse)

      return cachedResponse || fetchPromise
    })
  )
})

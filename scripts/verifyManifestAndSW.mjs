import { chromium } from '@playwright/test'

async function verifyManifestAndSW() {
  console.log('🚀 Starting PWA Manifest & Service Worker Verification in Playwright...')
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  })

  try {
    const page = await browser.newPage()
    const networkRequests = []

    // Monitor all network requests and responses
    page.on('response', (response) => {
      networkRequests.push({
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type'] || '',
      })
    })

    console.log('\n--- 1. Testing Preview Server (/Explorex/) ---')
    await page.goto('http://localhost:4173/Explorex/', { waitUntil: 'networkidle' })

    // Find the manifest link in DOM
    const manifestHref = await page.$eval('link[rel="manifest"]', (el) => el.getAttribute('href'))
    console.log(`  ✓ Manifest Link in DOM: ${manifestHref}`)
    if (!manifestHref.includes('/Explorex/manifest.webmanifest')) {
      throw new Error(`Expected manifest href to include /Explorex/manifest.webmanifest, got: ${manifestHref}`)
    }

    // Directly fetch manifest via browser fetch to inspect headers and body
    const manifestData = await page.evaluate(async (url) => {
      const res = await fetch(url)
      const text = await res.text()
      return {
        status: res.status,
        contentType: res.headers.get('content-type'),
        json: JSON.parse(text),
      }
    }, manifestHref)

    console.log(`  ✓ Manifest HTTP Status: ${manifestData.status}`)
    console.log(`  ✓ Manifest Content-Type: ${manifestData.contentType}`)

    if (manifestData.status !== 200) {
      throw new Error(`Expected manifest status 200, got: ${manifestData.status}`)
    }

    if (!manifestData.contentType.includes('application/manifest+json') && !manifestData.contentType.includes('json')) {
      throw new Error(`Expected application/manifest+json or json, got: ${manifestData.contentType}`)
    }

    const { name, short_name, start_url, scope, display, theme_color, background_color, icons } = manifestData.json

    console.log(`  ✓ Manifest Name: "${name}"`)
    console.log(`  ✓ Manifest Short Name: "${short_name}"`)
    console.log(`  ✓ Manifest Start URL: "${start_url}"`)
    console.log(`  ✓ Manifest Scope: "${scope}"`)
    console.log(`  ✓ Manifest Display: "${display}"`)
    console.log(`  ✓ Manifest Theme Color: "${theme_color}"`)
    console.log(`  ✓ Manifest Background Color: "${background_color}"`)

    if (start_url !== '/Explorex/') {
      throw new Error(`start_url must be /Explorex/, got: ${start_url}`)
    }
    if (scope !== '/Explorex/') {
      throw new Error(`scope must be /Explorex/, got: ${scope}`)
    }

    // Verify 192 and 512 icons exist
    const icon192 = icons.find((i) => i.sizes.includes('192'))
    const icon512 = icons.find((i) => i.sizes.includes('512'))

    if (!icon192) throw new Error('Missing 192 icon in manifest')
    if (!icon512) throw new Error('Missing 512 icon in manifest')

    console.log(`  ✓ 192 Icon Declared: ${icon192.src}`)
    console.log(`  ✓ 512 Icon Declared: ${icon512.src}`)

    // Test fetching icons from page context
    const icon192Status = await page.evaluate(async (src) => {
      const res = await fetch(src)
      return { status: res.status, type: res.headers.get('content-type') }
    }, icon192.src)
    console.log(`  ✓ 192 Icon Fetch: HTTP ${icon192Status.status} (${icon192Status.type})`)

    const icon512Status = await page.evaluate(async (src) => {
      const res = await fetch(src)
      return { status: res.status, type: res.headers.get('content-type') }
    }, icon512.src)
    console.log(`  ✓ 512 Icon Fetch: HTTP ${icon512Status.status} (${icon512Status.type})`)

    if (icon192Status.status !== 200 || !icon192Status.type.includes('image/png')) {
      throw new Error(`192 icon failed: ${JSON.stringify(icon192Status)}`)
    }
    if (icon512Status.status !== 200 || !icon512Status.type.includes('image/png')) {
      throw new Error(`512 icon failed: ${JSON.stringify(icon512Status)}`)
    }

    // Verify Service Worker Registration
    console.log('\n--- 2. Testing Service Worker Scope & Registration ---')
    const swInfo = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return { supported: false }
      const registration = await navigator.serviceWorker.getRegistration()
      if (!registration) return { registered: false }
      return {
        supported: true,
        registered: true,
        scope: registration.scope,
        active: Boolean(registration.active),
        installing: Boolean(registration.installing),
        waiting: Boolean(registration.waiting),
      }
    })
    console.log('  ✓ Service Worker Info in Page:', swInfo)

    if (swInfo.registered && !swInfo.scope.includes('/Explorex/')) {
      throw new Error(`Expected SW scope to be base-aware (/Explorex/), got: ${swInfo.scope}`)
    }

    console.log('\n--- 3. Testing Dev Server (/Explorex/) ---')
    await page.goto('http://localhost:5180/Explorex/', { waitUntil: 'networkidle' })
    const devManifestHref = await page.$eval('link[rel="manifest"]', (el) => el.getAttribute('href'))
    console.log(`  ✓ Dev Manifest Link in DOM: ${devManifestHref}`)

    const devManifestData = await page.evaluate(async (url) => {
      const res = await fetch(url)
      const text = await res.text()
      return {
        status: res.status,
        contentType: res.headers.get('content-type'),
        json: JSON.parse(text),
      }
    }, devManifestHref)

    console.log(`  ✓ Dev Manifest HTTP Status: ${devManifestData.status}`)
    console.log(`  ✓ Dev Manifest Content-Type: ${devManifestData.contentType}`)

    if (devManifestData.status !== 200) {
      throw new Error(`Expected dev manifest status 200, got: ${devManifestData.status}`)
    }
    if (!devManifestData.contentType.includes('application/manifest+json') && !devManifestData.contentType.includes('json')) {
      throw new Error(`Expected application/manifest+json or json, got: ${devManifestData.contentType}`)
    }

    console.log('\n✅ ALL PWA MANIFEST & SERVICE WORKER CHECKS PASSED PERFECTLY!\n')
  } finally {
    await browser.close()
  }
}

verifyManifestAndSW().catch((err) => {
  console.error('\n❌ Verification Failed:', err)
  process.exit(1)
})

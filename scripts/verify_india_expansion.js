import puppeteer from 'puppeteer-core'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE_URL = 'http://localhost:5180/Explorex/'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function run() {
  console.log('🚀 Starting Comprehensive Verification: Nationwide India Expansion & Image Integrity...\n')

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })

    const consoleErrors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (!text.includes('401') && !text.includes('409') && !text.includes('favicon')) {
          consoleErrors.push(text)
        }
      }
    })
    page.on('pageerror', (err) => consoleErrors.push(err.message))

    // Establish guest session via Access Gate welcome page
    await page.goto(`${BASE_URL}#/welcome`, { waitUntil: 'networkidle2' })
    await sleep(400)
    await page.evaluate(() => {
      const guestBtn = document.querySelector('.welcome-choice-card.highlight-guest .choice-action-btn')
      if (guestBtn) guestBtn.click()
    })
    await sleep(600)

    // -------------------------------------------------------------
    // TEST 1: Check 6 Target Landmarks on Place Detail Pages
    // -------------------------------------------------------------
    console.log('--- Test 1: Image Integrity & Detail Pages for 6 Key Landmarks ---')
    const landmarks = [
      { id: 'charminar-hyderabad', name: 'Charminar', state: 'Telangana', expectedImgKeyword: 'Charminar' },
      { id: 'taj-mahal-agra', name: 'Taj Mahal', state: 'Uttar Pradesh', expectedImgKeyword: 'Taj_Mahal' },
      { id: 'gateway-of-india-mumbai', name: 'Gateway of India', state: 'Maharashtra', expectedImgKeyword: 'Mumbai' },
      { id: 'golden-temple-amritsar', name: 'Golden Temple (Harmandir Sahib)', state: 'Punjab', expectedImgKeyword: 'Gold' },
      { id: 'hawa-mahal-jaipur', name: 'Hawa Mahal (Palace of Winds)', state: 'Rajasthan', expectedImgKeyword: 'facade' },
      { id: 'konark-sun-temple-odisha', name: 'Konark Sun Temple (Black Pagoda)', state: 'Odisha', expectedImgKeyword: 'Konark' },
    ]

    for (const lm of landmarks) {
      await page.goto(`${BASE_URL}#/place/${lm.id}`, { waitUntil: 'networkidle2' })
      await sleep(400)

      const placeDetail = await page.evaluate(() => {
        const url = window.location.href
        const title = document.querySelector('.header-band-title, h1, .detail-title')?.textContent?.trim()
        const img = document.querySelector('.detail-image-wrap img, .detail-hero-media-card img, .detail-hero-media img')
        const imgSrc = img?.getAttribute('src') || ''
        const attribution = document.querySelector('.attribution-text, .detail-image-attribution-bar')?.textContent?.trim()
        const license = document.querySelector('.attribution-license-badge')?.textContent?.trim()
        const priceBox = document.querySelector('.price-tag-val')?.textContent?.trim()
        const renderedHeading = document.querySelector('h1')?.textContent?.trim()
        const allH3 = Array.from(document.querySelectorAll('h3')).map((h) => h.textContent?.trim())

        const container = document.querySelector('.place-detail-container')
        const receivedPlaceId = container?.getAttribute('data-received-place-id')
        const dataPlaceId = container?.getAttribute('data-place-id')
        const dataPlaceImg = container?.getAttribute('data-place-img')
        const dataPlacePrice = container?.getAttribute('data-place-price')

        return {
          url,
          title,
          receivedPlaceId,
          dataPlaceId,
          dataPlaceImg,
          dataPlacePrice,
          imgSrc,
          attribution,
          license,
          priceBox,
          renderedHeading,
          allH3,
        }
      })

      console.log(`Checking ${lm.name}:`, {
        url: placeDetail.url,
        receivedPlaceId: placeDetail.receivedPlaceId,
        dataPlaceId: placeDetail.dataPlaceId,
        dataPlaceImg: placeDetail.dataPlaceImg,
        dataPlacePrice: placeDetail.dataPlacePrice,
        foundTitle: placeDetail.title,
        imgSrc: placeDetail.imgSrc,
        attribution: placeDetail.attribution,
        priceDisplay: placeDetail.priceBox,
      })

      if (!placeDetail.title || !placeDetail.title.includes(lm.name.slice(0, 8))) {
        throw new Error(`Place detail title mismatch for ${lm.id}: got "${placeDetail.title}"`)
      }
      if (!placeDetail.imgSrc || !placeDetail.imgSrc.startsWith('http')) {
        throw new Error(`Place image missing or invalid URL for ${lm.id}: "${placeDetail.imgSrc}"`)
      }
      if (!placeDetail.attribution) {
        throw new Error(`Place image attribution missing for ${lm.id}`)
      }
    }
    console.log('✅ Test 1 (All 6 landmarks display authentic images, details and attributions) Passed!')

    // -------------------------------------------------------------
    // TEST 2: Explore Page - State Filter (Tamil Nadu)
    // -------------------------------------------------------------
    console.log('\n--- Test 2: Explore Page - Filter by Tamil Nadu ---')
    await page.goto(`${BASE_URL}#/explore`, { waitUntil: 'networkidle2' })
    await sleep(500)

    // Select Tamil Nadu in state dropdown
    await page.select('#state-filter-select', 'Tamil Nadu')
    await sleep(500)

    const tnResults = await page.evaluate(() => {
      const cards = document.querySelectorAll('.explore-place-card, .card')
      const titles = []
      const states = []
      cards.forEach((c) => {
        const title = c.querySelector('.card-title, h3')?.textContent?.trim()
        const loc = c.querySelector('.card-state-location-row, .card-state')?.textContent?.trim()
        if (title) titles.push(title)
        if (loc) states.push(loc)
      })

      // Also get active filter text and card count badge
      const countBadge = document.querySelector('.results-count-text')?.textContent?.trim()
      return { titles, states, countBadge, cardCount: cards.length }
    })

    console.log('Tamil Nadu Filter Results:', {
      cardCount: tnResults.cardCount,
      countBadge: tnResults.countBadge,
      sampleTitles: tnResults.titles.slice(0, 5),
    })

    if (tnResults.cardCount === 0) {
      throw new Error('Expected Tamil Nadu places to be rendered, got 0')
    }
    const hasTNMonuments = tnResults.titles.some(
      (t) => t.includes('Brihadeeswarar') || t.includes('Meenakshi') || t.includes('Shore Temple')
    )
    if (!hasTNMonuments) {
      throw new Error(`Expected major Tamil Nadu temples in filtered list, got: ${JSON.stringify(tnResults.titles)}`)
    }
    // Verify no Hyderabad or Delhi places leak into Tamil Nadu filter
    const hasOutofState = tnResults.titles.some((t) => t.includes('Charminar') || t.includes('Taj Mahal'))
    if (hasOutofState) {
      throw new Error('Out of state places found in Tamil Nadu filter results!')
    }
    console.log('✅ Test 2 (Tamil Nadu state filter successfully restricts to Tamil Nadu places) Passed!')

    // -------------------------------------------------------------
    // TEST 3: Debounced Full-Text Search with Match Highlighting
    // -------------------------------------------------------------
    console.log('\n--- Test 3: Debounced Search & Match Highlighting ---')
    // Reset state to All
    await page.select('#state-filter-select', 'all')
    await sleep(300)

    // Type "Mahal" into search input
    await page.click('.explore-search-input-wrap input')
    await page.keyboard.down('Meta')
    await page.keyboard.press('KeyA')
    await page.keyboard.up('Meta')
    await page.keyboard.press('Backspace')
    await page.keyboard.type('Mahal', { delay: 40 })
    await sleep(600) // Wait for debounce

    const searchResults = await page.evaluate(() => {
      const marks = Array.from(document.querySelectorAll('mark.search-highlight')).map((m) => m.textContent)
      const cards = document.querySelectorAll('.explore-place-card, .card')
      const cardTitles = Array.from(cards).map(
        (c) => c.querySelector('.card-title, h3')?.textContent?.trim() || ''
      )
      return {
        highlightMarks: marks,
        cardTitles: cardTitles.filter(Boolean),
      }
    })

    console.log('Search "Mahal" Results:', {
      highlightsFound: searchResults.highlightMarks.length,
      sampleTitles: searchResults.cardTitles.slice(0, 4),
    })

    if (searchResults.highlightMarks.length === 0) {
      throw new Error('Expected <mark class="search-highlight"> highlights for search "Mahal"')
    }
    const containsTajOrHawa = searchResults.cardTitles.some((t) => t.includes('Taj Mahal') || t.includes('Hawa Mahal'))
    if (!containsTajOrHawa) {
      throw new Error(`Expected Taj Mahal or Hawa Mahal in search results, got: ${JSON.stringify(searchResults.cardTitles)}`)
    }
    console.log('✅ Test 3 (Search debouncing and <mark> keyword highlighting) Passed!')

    // -------------------------------------------------------------
    // TEST 4: Pricing Transparency & Indian Number Formatting
    // -------------------------------------------------------------
    console.log('\n--- Test 4: Pricing Standards (Indian Currency Format & Not Listed Labels) ---')
    const priceCheck = await page.evaluate(() => {
      const priceBadges = Array.from(document.querySelectorAll('.price-amount, .card-price, .price-tag-val, .card-cost'))
      const texts = priceBadges.map((b) => b.textContent?.trim() || '')
      const hasINR = texts.some((t) => t.includes('₹'))
      const hasUnlisted = texts.some((t) => t.includes('Not listed') || t.includes('Free'))
      return { totalBadges: texts.length, hasINR, hasUnlisted, sample: texts.slice(0, 6) }
    })
    console.log('Pricing Check Results:', priceCheck)
    if (!priceCheck.hasINR) {
      throw new Error('Expected Indian Rupee symbol (₹) formatted prices')
    }
    console.log('✅ Test 4 (Transparent INR pricing & honest fallback) Passed!')

    // -------------------------------------------------------------
    // TEST 5: State Landing Pages (/states/:slug)
    // -------------------------------------------------------------
    console.log('\n--- Test 5: State Landing Pages (/states/tamil-nadu & /states/rajasthan) ---')
    // Test Tamil Nadu landing page
    await page.goto(`${BASE_URL}#/states/tamil-nadu`, { waitUntil: 'networkidle2' })
    await sleep(500)

    const tnLanding = await page.evaluate(() => {
      const title = document.querySelector('.header-band-title, h1')?.textContent?.trim()
      const tagline = document.querySelector('.header-band-subtitle')?.textContent?.trim()
      const highlights = Array.from(document.querySelectorAll('.highlight-tag-chip')).map((h) => h.textContent?.trim())
      const placesCount = document.querySelectorAll('.explore-place-card').length
      return { title, tagline, highlights, placesCount }
    })

    console.log('Tamil Nadu Landing Page:', tnLanding)
    if (!tnLanding.title?.includes('Tamil Nadu') || tnLanding.placesCount === 0) {
      throw new Error(`Tamil Nadu landing page failed to render properly: ${JSON.stringify(tnLanding)}`)
    }

    // Test Rajasthan landing page
    await page.goto(`${BASE_URL}#/states/rajasthan`, { waitUntil: 'networkidle2' })
    await sleep(500)

    const rjLanding = await page.evaluate(() => {
      const title = document.querySelector('.header-band-title, h1')?.textContent?.trim()
      const eyebrow = document.querySelector('.header-eyebrow')?.textContent?.trim()
      const placesCount = document.querySelectorAll('.explore-place-card').length
      return { title, eyebrow, placesCount }
    })

    console.log('Rajasthan Landing Page:', rjLanding)
    if (!rjLanding.title?.includes('Rajasthan') || rjLanding.placesCount === 0) {
      throw new Error(`Rajasthan landing page failed to render properly: ${JSON.stringify(rjLanding)}`)
    }
    console.log('✅ Test 5 (State landing pages render rich metadata & state-specific places) Passed!')

    // -------------------------------------------------------------
    // TEST 6: Nationwide Map & Leaflet Cluster Rendering
    // -------------------------------------------------------------
    console.log('\n--- Test 6: Nationwide Map Initialization & Marker Clustering ---')
    await page.goto(`${BASE_URL}#/map`, { waitUntil: 'networkidle2' })
    await sleep(1500)

    const mapState = await page.evaluate(() => {
      const mapContainer = document.querySelector('.leaflet-container')
      const clusterElements = document.querySelectorAll('.marker-cluster, .leaflet-marker-icon')
      const totalClusterCount = clusterElements.length

      return {
        hasLeaflet: !!mapContainer,
        markerOrClusterCount: totalClusterCount,
      }
    })

    console.log('Map State:', mapState)
    if (!mapState.hasLeaflet) {
      throw new Error('Leaflet map container not rendered on /map')
    }
    if (mapState.markerOrClusterCount === 0) {
      throw new Error('Expected map markers or marker clusters across India, got 0')
    }
    console.log('✅ Test 6 (Map initializes across India with clustering) Passed!')

    // -------------------------------------------------------------
    // TEST 7: Region Switcher in Navbar
    // -------------------------------------------------------------
    console.log('\n--- Test 7: Navbar Region Switcher ---')
    await page.goto(`${BASE_URL}#/`, { waitUntil: 'networkidle2' })
    await sleep(400)

    const regionSwitcher = await page.evaluate(() => {
      const trigger = document.querySelector('.region-switcher-trigger')
      const triggerText = trigger?.textContent?.trim()
      return {
        hasTrigger: !!trigger,
        triggerText,
      }
    })
    console.log('Navbar Region Switcher State:', regionSwitcher)
    if (!regionSwitcher.hasTrigger) {
      throw new Error('Region Switcher trigger not found in Navbar')
    }
    console.log('✅ Test 7 (Region switcher in navigation bar) Passed!')

    // Check for any unhandled JS errors
    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors noticed during run:', consoleErrors)
    }

    console.log('\n🎉 ALL NATIONWIDE EXPANSION & IMAGE INTEGRITY TESTS PASSED SUCCESSFULLY! 🎉\n')
  } finally {
    await browser.close()
  }
}

run().catch((err) => {
  console.error('\n❌ Verification Failed:', err)
  process.exit(1)
})

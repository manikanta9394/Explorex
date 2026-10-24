import puppeteer from 'puppeteer-core'

const BASE_URL = 'http://localhost:5180/Explorex'
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function runVerification() {
  console.log('🚀 Starting Explorex 8-Route Verification Suite...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1360, height: 900 })

  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString())
  })

  let allPassed = true

  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FAILED: ${message}`)
      allPassed = false
    } else {
      console.log(`✅ PASSED: ${message}`)
    }
  }

  try {
    // ------------------------------------------------------------------------
    // Route 1: / (Landing / Intro Page)
    // ------------------------------------------------------------------------
    console.log('\n--- 1. Testing Route / (Landing / Intro Page) ---')
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' })
    await sleep(600)

    const homeNav = await page.$('.explorex-navbar')
    assert(!!homeNav, 'Shared Navbar is visible on Home Page')

    const homeFooter = await page.$('.explorex-footer')
    assert(!!homeFooter, 'Shared Footer is visible on Home Page')

    const heroTitle = await page.$eval('.hero-title', (el) => el.textContent).catch(() => null)
    assert(!!heroTitle && heroTitle.length > 5, `Hero headline is present: "${heroTitle?.replace(/\n/g, ' ')}"`)

    const heroValueProp = await page.$eval('.hero-value-prop', (el) => el.textContent).catch(() => '')
    assert(heroValueProp.includes('Hyderabad and Telangana'), `One-line value proposition present: "${heroValueProp}"`)

    const statsCards = await page.$$('.stat-card')
    assert(statsCards.length >= 4, `Stats banner has ${statsCards.length} stat cards`)

    const featuredCards = await page.$$('.featured-dest-card')
    assert(featuredCards.length === 6, `Featured grid has ${featuredCards.length} destinations (expected 6)`)

    // ------------------------------------------------------------------------
    // Route 2: /explore (Explore Catalog)
    // ------------------------------------------------------------------------
    console.log('\n--- 2. Testing Route /explore (Explore Catalog) ---')
    await page.goto(`${BASE_URL}/#/explore`, { waitUntil: 'networkidle2' })
    await sleep(600)

    const exploreHeader = await page.$eval('.header-band-title', (el) => el.textContent).catch(() => null)
    assert(!!exploreHeader && (exploreHeader.includes('Explore') || exploreHeader.includes('Destinations')), `Explore header band present: "${exploreHeader}"`)

    const searchInput = await page.$('.explore-search-input-wrap input')
    assert(!!searchInput, 'Search input is present on Explore Page')

    const categoryChips = await page.$$('.explore-filter-chip')
    assert(categoryChips.length >= 4, `Category filter chips found: ${categoryChips.length}`)

    const placeCards = await page.$$('.explore-place-card')
    assert(placeCards.length >= 10, `Initial place cards loaded: ${placeCards.length}`)

    // Check ₹ price formatting on explore cards
    const priceSample = await page.$eval('.price-amount', (el) => el.textContent).catch(() => '')
    assert(priceSample.includes('₹') || priceSample.toLowerCase().includes('free'), `Price formatted in ₹: "${priceSample}"`)

    // ------------------------------------------------------------------------
    // Route 3: /explore/place-charminar (Place Detail Page)
    // ------------------------------------------------------------------------
    console.log('\n--- 3. Testing Route /explore/place-charminar (Place Detail Page) ---')
    await page.goto(`${BASE_URL}/#/explore/place-charminar`, { waitUntil: 'networkidle2' })
    await sleep(600)

    const detailHeader = await page.$eval('.header-band-title', (el) => el.textContent).catch(() => null)
    assert(!!detailHeader && detailHeader.includes('Charminar'), `Place Detail header band shows: "${detailHeader}"`)

    const heroImg = await page.$('.detail-hero-media-card img')
    assert(!!heroImg, 'Hero image element is present')

    const rulesItems = await page.$$('.rule-item')
    assert(rulesItems.length >= 3, `Rules & visitor info items present: ${rulesItems.length}`)

    const sidebarPrice = await page.$eval('.price-tag-val', (el) => el.textContent).catch(() => '')
    assert(sidebarPrice.includes('₹') || sidebarPrice.toLowerCase().includes('free'), `Sidebar price formatted in ₹: "${sidebarPrice}"`)

    const directionsBtn = await page.$('.detail-primary-directions-btn')
    assert(!!directionsBtn, 'Get Directions button is present on Place Detail Page')

    const nearbyStays = await page.$$('.nearby-panel-card')
    assert(nearbyStays.length >= 2, `Nearby panels (stays & food) present: ${nearbyStays.length}`)

    // ------------------------------------------------------------------------
    // Route 4: /map (Interactive Clustered Map)
    // ------------------------------------------------------------------------
    console.log('\n--- 4. Testing Route /map (Interactive Map Page) ---')
    await page.goto(`${BASE_URL}/#/map`, { waitUntil: 'networkidle2' })
    await sleep(800)

    const mapHeader = await page.$eval('.header-band-title', (el) => el.textContent).catch(() => null)
    assert(!!mapHeader && mapHeader.includes('Map'), `Map header band present: "${mapHeader}"`)

    const mapCanvas = await page.$('.leaflet-container')
    assert(!!mapCanvas, 'Leaflet map canvas loaded successfully')

    const mapMarkers = await page.$$('.leaflet-marker-icon')
    assert(mapMarkers.length > 0, `Map markers/clusters rendered: ${mapMarkers.length}`)

    // ------------------------------------------------------------------------
    // Route 5: /planner (Trip Planner)
    // ------------------------------------------------------------------------
    console.log('\n--- 5. Testing Route /planner (Trip Planner Page) ---')
    await page.goto(`${BASE_URL}/#/planner`, { waitUntil: 'networkidle2' })
    await sleep(600)

    const plannerHeader = await page.$eval('.header-band-title', (el) => el.textContent).catch(() => null)
    assert(!!plannerHeader && plannerHeader.includes('Planner'), `Trip Planner header band present: "${plannerHeader}"`)

    const dayPills = await page.$$('.control-pill-btn')
    assert(dayPills.length >= 3, `Duration day selection buttons present: ${dayPills.length}`)

    const timelineStops = await page.$$('.timeline-stop-item')
    assert(timelineStops.length >= 2, `Generated timeline stops present: ${timelineStops.length}`)

    const tipBox = await page.$('.stop-tip-box')
    assert(!!tipBox, 'Practical tip box rendered inside itinerary stop')

    const copyBtn = await page.$('.copy-itinerary-btn')
    assert(!!copyBtn, 'Copy Summary button is present')

    // ------------------------------------------------------------------------
    // Route 6: /ai (AI Guide Page)
    // ------------------------------------------------------------------------
    console.log('\n--- 6. Testing Route /ai (AI Guide Page) ---')
    await page.goto(`${BASE_URL}/#/ai`, { waitUntil: 'networkidle2' })
    await sleep(600)

    const aiHeader = await page.$eval('.header-band-title', (el) => el.textContent).catch(() => null)
    assert(!!aiHeader && aiHeader.includes('AI'), `AI Guide header band present: "${aiHeader}"`)

    const quickPromptChips = await page.$$('.quick-topic-btn')
    assert(quickPromptChips.length >= 4, `Quick prompt chips present: ${quickPromptChips.length}`)

    const chatInput = await page.$('.ai-chat-input-form input')
    assert(!!chatInput, 'AI Chat prompt input is present')

    const firstMsg = await page.$('.chat-bubble.assistant')
    assert(!!firstMsg, 'Initial AI assistant greeting message is present')

    // ------------------------------------------------------------------------
    // Route 7: /saved (Saved Places Wishlist)
    // ------------------------------------------------------------------------
    console.log('\n--- 7. Testing Route /saved (Saved Places Page) ---')
    await page.goto(`${BASE_URL}/#/saved`, { waitUntil: 'networkidle2' })
    await sleep(600)

    const savedHeader = await page.$eval('.header-band-title', (el) => el.textContent).catch(() => null)
    assert(!!savedHeader && savedHeader.includes('Saved'), `Saved Places header band present: "${savedHeader}"`)

    const guestBanner = await page.$('.saved-guest-banner')
    assert(!!guestBanner, 'Guest notice banner is present for non-logged-in users')

    // ------------------------------------------------------------------------
    // Route 8: /login and /signup (Auth Pages)
    // ------------------------------------------------------------------------
    console.log('\n--- 8. Testing Auth Pages /login and /signup ---')
    await page.goto(`${BASE_URL}/#/login`, { waitUntil: 'networkidle2' })
    await sleep(500)

    const loginNavbar = await page.$('.explorex-navbar')
    assert(!loginNavbar, 'Shared Navbar is NOT rendered on /login')

    const loginFooter = await page.$('.explorex-footer')
    assert(!loginFooter, 'Shared Footer is NOT rendered on /login')

    const loginCard = await page.$('.auth-glass-card')
    assert(!!loginCard, 'Centered glassmorphic card rendered on /login')

    await page.goto(`${BASE_URL}/#/signup`, { waitUntil: 'networkidle2' })
    await sleep(500)

    const signupNavbar = await page.$('.explorex-navbar')
    assert(!signupNavbar, 'Shared Navbar is NOT rendered on /signup')

    const signupCard = await page.$('.auth-glass-card')
    assert(!!signupCard, 'Centered glassmorphic card rendered on /signup')

    // ------------------------------------------------------------------------
    // Console Error Check
    // ------------------------------------------------------------------------
    console.log('\n--- 9. Console Error Verification ---')
    const realErrors = consoleErrors.filter(
      (err) =>
        !err.includes('favicon.ico') &&
        !err.includes('geolocation') &&
        !err.includes('Geolocation')
    )

    if (realErrors.length > 0) {
      console.error(`❌ Console Errors Captured (${realErrors.length}):`)
      realErrors.forEach((e) => console.error(`   - ${e}`))
      allPassed = false
    } else {
      console.log('✅ Console is clean: 0 uncaught errors across all 8 routes!')
    }
  } catch (err) {
    console.error('Fatal test error:', err)
    allPassed = false
  } finally {
    await browser.close()
  }

  if (allPassed) {
    console.log('\n🎉 ALL 8 ROUTES VERIFIED SUCCESSFULLY WITH 0 ERRORS!')
    process.exit(0)
  } else {
    console.error('\n❌ SOME VERIFICATION CHECKS FAILED.')
    process.exit(1)
  }
}

runVerification()

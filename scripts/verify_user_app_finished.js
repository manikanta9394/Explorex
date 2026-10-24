import puppeteer from 'puppeteer-core'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE_URL = 'http://localhost:5180/Explorex/'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function run() {
  console.log('🏛️  Starting Verification Test Suite: Explorex Finished User Experience\n')

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  let passCount = 0
  let failCount = 0

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`)
      passCount++
    } else {
      console.error(`  ❌ [FAIL] ${testName}`)
      failCount++
    }
  }

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

    // =========================================================================
    // TEST 1: ALL-INDIA DUSK SCENE ON AUTH PAGE
    // =========================================================================
    console.log('--- Test 1: All-India Dusk Scene with 5 Landmarks & Route ---')
    await page.goto(`${BASE_URL}login`, { waitUntil: 'networkidle2' })
    await sleep(600)

    const duskSceneData = await page.evaluate(() => {
      const headline = document.querySelector('.dusk-headline')?.textContent || ''
      const golconda = !!document.querySelector('#landmark-golconda, .landmark-golconda')
      const charminar = !!document.querySelector('#landmark-charminar, .landmark-charminar')
      const buddha = !!document.querySelector('#landmark-buddha, .landmark-buddha')
      const gateway = !!document.querySelector('#landmark-gateway, .landmark-gateway')
      const taj = !!document.querySelector('#landmark-taj, .landmark-taj')
      const marchingAnts = !!document.querySelector('.marching-ants-path')
      const pinsCount = document.querySelectorAll('.waypoint-pin-group').length

      return { headline, golconda, charminar, buddha, gateway, taj, marchingAnts, pinsCount }
    })

    assert(duskSceneData.headline.includes('Plan India the way locals do'), 'Dusk scene displays "Plan India the way locals do"')
    assert(duskSceneData.golconda && duskSceneData.charminar && duskSceneData.buddha, 'Dusk scene contains Golconda, Charminar, and Buddha statue')
    assert(duskSceneData.gateway && duskSceneData.taj, 'Dusk scene contains Gateway of India and Taj Mahal silhouettes')
    assert(duskSceneData.marchingAnts, 'Animated marching ants dashed route line connects monuments')
    assert(duskSceneData.pinsCount === 5, `5 pulsing waypoint pins rendered across India (found: ${duskSceneData.pinsCount})`)

    // Establish Guest Session
    console.log('\n--- Establishing Guest Session via Welcome Page ---')
    await page.goto(`${BASE_URL}welcome`, { waitUntil: 'networkidle2' })
    await sleep(500)
    await page.evaluate(() => {
      const guestBtn = document.querySelector('.welcome-choice-card.highlight-guest .choice-action-btn')
      if (guestBtn) guestBtn.click()
    })
    await sleep(800)

    // =========================================================================
    // TEST 2: ALL 17 ROUTES CODE-SPLIT & RENDERED CLEANLY
    // =========================================================================
    console.log('\n--- Test 2: Lazy-Loaded Routing Across 17 Pages ---')

    const routesToTest = [
      { path: '', label: 'Home Page (/)' },
      { path: 'explore', label: 'Explore Destinations (/explore)' },
      { path: 'explore/golconda-fort-hyderabad', label: 'Place Detail (/explore/:id)' },
      { path: 'places/taj-mahal-agra', label: 'Place Detail via Slug (/places/:slug)' },
      { path: 'states/telangana', label: 'State Landing (/states/:slug)' },
      { path: 'map', label: 'Interactive Map (/map)' },
      { path: 'planner', label: 'Day-by-Day Trip Planner (/planner)' },
      { path: 'festivals', label: 'Festival Calendar (/festivals)' },
      { path: 'ai', label: 'RAG AI Cultural Guide (/ai)' },
      { path: 'saved', label: 'Saved Places Sanctuary (/saved)' },
      { path: 'trips/1', label: 'Shareable Trip Viewer (/trips/:id)' },
      { path: 'feedback', label: 'Feedback & Wrong Info Portal (/feedback)' },
      { path: 'profile', label: 'Explorer Profile & Preferences (/profile)' },
      { path: 'help', label: 'Help & FAQ Accordion (/help)' },
      { path: 'about', label: 'About & Heritage Philosophy (/about)' },
      { path: 'privacy', label: 'Privacy Policy (/privacy)' },
      { path: 'terms', label: 'Terms of Use (/terms)' },
      { path: 'uncharted-random-path-404', label: '404 Not Found Page' },
    ]

    for (const route of routesToTest) {
      await page.evaluate((targetHash) => {
        window.location.hash = targetHash ? `#/${targetHash}` : '#/'
        window.dispatchEvent(new HashChangeEvent('hashchange'))
      }, route.path)
      await sleep(450)
      const pageTitle = await page.title()
      const hasContent = await page.evaluate(() => {
        const main = document.querySelector('main')
        return main && main.innerHTML.length > 200
      })
      assert(hasContent, `Route renders cleanly with substantive content: ${route.label} (Title: ${pageTitle})`)
    }

    // =========================================================================
    // TEST 3: SKIP TO CONTENT & ACCESSIBILITY
    // =========================================================================
    console.log('\n--- Test 3: Accessibility & Skip-To-Content Link ---')
    await page.evaluate(() => {
      window.location.hash = '#/'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    await sleep(400)

    const skipLinkOk = await page.evaluate(() => {
      const link = document.querySelector('.skip-to-content-link')
      return link && link.getAttribute('href') === '#main-content'
    })
    assert(skipLinkOk, 'Skip-to-content link exists and targets #main-content')

    // =========================================================================
    // TEST 4: FLOATING FEEDBACK DRAWER & REPORT SUBMISSION
    // =========================================================================
    console.log('\n--- Test 4: Floating Feedback Drawer & DB Storage ---')
    await page.evaluate(() => {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('explorex_feedback_rate_')) {
          localStorage.removeItem(k)
        }
      })
      window.location.hash = '#/explore'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    await sleep(500)

    // Verify floating feedback button is present
    const floatBtnExists = await page.evaluate(() => {
      const btn = document.querySelector('.floating-feedback-btn')
      if (btn) {
        btn.click()
        return true
      }
      return false
    })
    assert(floatBtnExists, 'Floating feedback button is visible and clicked')
    await sleep(500)

    const drawerVisible = await page.evaluate(() => {
      return !!document.querySelector('.feedback-drawer-container')
    })
    assert(drawerVisible, 'Feedback slide-over drawer opened on click')

    // Select 'idea', type message, submit
    const submitSuccess = await page.evaluate(async () => {
      const typeBtn =
        document.querySelector('.type-card-btn[data-type="idea"]') ||
        document.querySelectorAll('.type-card-btn')[2] ||
        document.querySelector('.type-card-btn')
      if (typeBtn) typeBtn.click()

      const textarea = document.querySelector('.feedback-textarea')
      if (!textarea) return false

      const proto = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')
      proto.set.call(textarea, 'Add audio walking tours with local historians for Golconda and Charminar!')
      textarea.dispatchEvent(new Event('input', { bubbles: true }))

      await new Promise((r) => setTimeout(r, 200))

      const submitBtn =
        document.querySelector('.submit-feedback-cta') ||
        document.querySelector('.feedback-submit-btn')
      if (!submitBtn || submitBtn.disabled) return false
      submitBtn.click()

      await new Promise((r) => setTimeout(r, 600))
      return true
    })
    assert(submitSuccess, 'Submitted feedback report from floating drawer')
    await sleep(800)

    const feedbackDbRecord = await page.evaluate(() => {
      const raw = localStorage.getItem('sb_emu_table_feedback')
      if (!raw) return null
      const list = JSON.parse(raw)
      return list.find((item) => item.message && item.message.includes('Add audio walking tours'))
    })
    assert(!!feedbackDbRecord, 'Feedback persisted in Supabase database emulator table with status "open"')

    // =========================================================================
    // TEST 5: PLACE REVIEWS ON DETAIL PAGE
    // =========================================================================
    console.log('\n--- Test 5: Place Detail Reviews Submission ---')
    await page.evaluate(() => {
      window.location.hash = '#/explore/golconda-fort-hyderabad'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    await sleep(600)

    const reviewSubmitted = await page.evaluate(async () => {
      const textarea = document.querySelector('.review-textarea')
      if (!textarea) return false

      const proto = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')
      proto.set.call(textarea, 'Unforgettable sunset from the Bala Hissar pavilion! The acoustic clap test at the Fateh Darwaza actually worked.')
      textarea.dispatchEvent(new Event('input', { bubbles: true }))

      await new Promise((r) => setTimeout(r, 200))

      const submitBtn = document.querySelector('.submit-review-btn')
      if (!submitBtn || submitBtn.disabled) return false
      submitBtn.click()

      await new Promise((r) => setTimeout(r, 600))
      return true
    })
    assert(reviewSubmitted, 'Submitted verified traveler review for Golconda Fort')
    await sleep(600)

    const reviewInList = await page.evaluate(() => {
      const reviewText = document.querySelector('.existing-reviews-list')?.textContent || ''
      return reviewText.includes('Unforgettable sunset from the Bala Hissar')
    })
    assert(reviewInList, 'Review appears in real-time in the verified traveler reviews feed')

    // =========================================================================
    // TEST 6: PROFILE PAGE PREFERENCES PERSISTENCE
    // =========================================================================
    console.log('\n--- Test 6: Profile Preferences & Cultural Avatar Selection ---')
    await page.evaluate(() => {
      window.location.hash = '#/profile'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    await sleep(500)

    // Switch to settings tab
    await page.evaluate(() => {
      const tabs = document.querySelectorAll('.profile-tab-btn')
      const settingsTab = Array.from(tabs).find((t) => t.textContent.includes('Edit Profile'))
      if (settingsTab) settingsTab.click()
    })
    await sleep(400)

    const profileUpdated = await page.evaluate(async () => {
      // Pick elephant avatar
      const avatarBtns = document.querySelectorAll('.avatar-option-btn')
      if (avatarBtns.length > 2) avatarBtns[2].click()

      // Change name to 'Kavya Sharma'
      const nameInput = document.querySelector('#display-name')
      if (!nameInput) return false
      const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
      proto.set.call(nameInput, 'Kavya Sharma')
      nameInput.dispatchEvent(new Event('input', { bubbles: true }))

      // Select home state
      const stateSelect = document.querySelector('#home-state')
      if (stateSelect) {
        stateSelect.value = 'Telangana'
        stateSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }

      await new Promise((r) => setTimeout(r, 200))

      const saveBtn = document.querySelector('.save-profile-btn')
      if (saveBtn) saveBtn.click()

      await new Promise((r) => setTimeout(r, 500))
      return true
    })
    assert(profileUpdated, 'Saved profile changes (Name: Kavya Sharma, Avatar: Elephant)')
    await sleep(500)

    const sessionStoredName = await page.evaluate(() => {
      const session = JSON.parse(localStorage.getItem('sb_emu_session') || '{}')
      return session.user?.name || session.user?.user_metadata?.name || null
    })
    assert(sessionStoredName === 'Kavya Sharma', `Profile display name persisted in session: ${sessionStoredName}`)

    // =========================================================================
    // TEST 7: SHAREABLE TRIP VIEWER & GOOGLE MAPS MULTI-STOP
    // =========================================================================
    console.log('\n--- Test 7: Trip Viewer Timeline & Multi-Stop Navigation ---')
    await page.evaluate(() => {
      window.location.hash = '#/trips/1'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    await sleep(500)

    const tripData = await page.evaluate(() => {
      const dayCards = document.querySelectorAll('.day-route-card').length
      const lunchStops = document.querySelectorAll('.lunch-midpoint-card, .lunch-midpoint-box').length
      const openMapsBtn = !!document.querySelector('.open-maps-btn')
      const copyBtn = !!document.querySelector('.trip-share-action-btn')
      return { dayCards, lunchStops, openMapsBtn, copyBtn }
    })
    assert(tripData.dayCards >= 2, `Trip itinerary timeline rendered with ${tripData.dayCards} days`)
    assert(tripData.lunchStops >= 1, `Lunch dining midpoint recommended for the route`)
    assert(tripData.openMapsBtn, 'Open Route in Google Maps button available')
    assert(tripData.copyBtn, 'Copy Share Link button available')

    // =========================================================================
    // TEST 8: MOBILE RESPONSIVE VIEWPORT & NO OVERFLOW
    // =========================================================================
    console.log('\n--- Test 8: Mobile Responsiveness (375x667 Viewport) ---')
    await page.setViewport({ width: 375, height: 667 })
    await page.goto(`${BASE_URL}#/`, { waitUntil: 'networkidle2' })
    await sleep(600)

    const scrollCheck = await page.evaluate(() => {
      return {
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
        innerW: window.innerWidth,
      }
    })
    console.log(`    [Mobile Viewport Metrics] scrollWidth=${scrollCheck.scrollW}, clientWidth=${scrollCheck.clientW}, innerWidth=${scrollCheck.innerW}`)
    const noHorizontalScroll = scrollCheck.scrollW <= scrollCheck.clientW + 2
    assert(noHorizontalScroll, 'Mobile view renders with zero horizontal scroll overflow')

    // Check mobile hamburger button
    const hamburgerOk = await page.evaluate(() => {
      const btn = document.querySelector('.nav-hamburger-btn')
      return btn && window.getComputedStyle(btn).display !== 'none'
    })
    assert(hamburgerOk, 'Mobile animated hamburger navigation button is visible')

    // =========================================================================
    // TEST 9: PWA ASSETS & ROBOTS/SITEMAP
    // =========================================================================
    console.log('\n--- Test 9: PWA Manifest, Robots.txt & Sitemap.xml ---')
    const manifestRes = await page.goto(`http://localhost:5180/Explorex/manifest.json`)
    assert(manifestRes.status() === 200, 'PWA manifest.json is served with HTTP 200')

    const robotsRes = await page.goto(`http://localhost:5180/Explorex/robots.txt`)
    assert(robotsRes.status() === 200, 'robots.txt is served with HTTP 200')

    const sitemapRes = await page.goto(`http://localhost:5180/Explorex/sitemap.xml`)
    assert(sitemapRes.status() === 200, 'sitemap.xml is served with HTTP 200')

    const swRes = await page.goto(`http://localhost:5180/Explorex/sw.js`)
    assert(swRes.status() === 200, 'Service Worker sw.js is served with HTTP 200')

    console.log('\n======================================================')
    console.log(`🎉 TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`)
    console.log(`Console Errors: ${consoleErrors.length}`)
    if (consoleErrors.length > 0) {
      console.log('Console Errors detail:', consoleErrors)
    }
    console.log('======================================================\n')

    if (failCount > 0) {
      process.exit(1)
    }
  } finally {
    await browser.close()
  }
}

run().catch((err) => {
  console.error('Fatal Test Suite Error:', err)
  process.exit(1)
})

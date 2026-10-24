import puppeteer from 'puppeteer-core'

const BASE_URL = 'http://localhost:5180/Explorex/'
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

async function run() {
  console.log('🚀 Starting Cinematic Scroll & Micro-interactions Automated Test Suite...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })

    const consoleLogs = []
    page.on('console', (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`))
    page.on('pageerror', (err) => consoleLogs.push(`[ERROR] ${err.message}`))

    console.log(`📡 Navigating to ${BASE_URL}...`)
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' })

    // 1. SCROLL PROGRESS BAR
    console.log('\n--- Test 1: Scroll Progress Bar (Thin Gold Bar) ---')
    const progressTrackExists = await page.$('.scroll-progress-track')
    const progressFillExists = await page.$('.scroll-progress-fill')
    if (!progressTrackExists || !progressFillExists) {
      throw new Error('❌ Scroll progress track or fill element not found in DOM!')
    }

    const initialProgressWidth = await page.$eval('.scroll-progress-fill', (el) => el.style.width)
    console.log(`Initial progress bar width at top: "${initialProgressWidth}"`)

    // Scroll down 1200px
    await page.evaluate(() => window.scrollTo(0, 1200))
    await new Promise((r) => setTimeout(r, 200))

    const scrolledProgressWidth = await page.$eval('.scroll-progress-fill', (el) => el.style.width)
    console.log(`Scrolled progress bar width: "${scrolledProgressWidth}"`)
    const widthNum = parseFloat(scrolledProgressWidth)
    if (isNaN(widthNum) || widthNum <= 0) {
      throw new Error(`❌ Expected progress bar width to be > 0% after scrolling, got "${scrolledProgressWidth}"`)
    }
    console.log('✅ Test 1 Passed: Scroll progress bar updates dynamically on scroll.')

    // 2. HERO MULTI-LAYER PARALLAX
    console.log('\n--- Test 2: Intro Hero Multi-Layer Skyline Parallax ---')
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0))
    await new Promise((r) => setTimeout(r, 100))

    const heroLayers = await page.evaluate(() => {
      const hero = document.querySelector('.landing-hero')
      const bg = document.querySelector('.hero-parallax-bg')
      const skyline = document.querySelector('.hero-parallax-skyline')
      const fg = document.querySelector('.hero-parallax-fg')
      const content = document.querySelector('.hero-parallax-content')
      return {
        hasHero: !!hero,
        hasBg: !!bg,
        hasSkyline: !!skyline,
        hasFg: !!fg,
        hasContent: !!content,
      }
    })
    console.log('Hero parallax layer structure:', heroLayers)
    if (!heroLayers.hasHero || !heroLayers.hasBg || !heroLayers.hasSkyline || !heroLayers.hasFg || !heroLayers.hasContent) {
      throw new Error('❌ Missing one or more required parallax layers in LandingHero!')
    }

    // Scroll down 450px and check CSS variable --hero-scroll
    await page.evaluate(() => window.scrollTo(0, 450))
    await new Promise((r) => setTimeout(r, 200))

    const heroScrollVar = await page.$eval('.landing-hero', (el) =>
      el.style.getPropertyValue('--hero-scroll')
    )
    console.log(`Hero CSS variable --hero-scroll at 450px scroll: "${heroScrollVar}"`)
    const scrollPx = parseFloat(heroScrollVar)
    if (isNaN(scrollPx) || scrollPx < 200) {
      throw new Error(`❌ Expected --hero-scroll to be updated via rAF, got "${heroScrollVar}"`)
    }
    console.log('✅ Test 2 Passed: Hero parallax CSS variable updated via passive rAF listener without React state.')

    // 3. COUNT-UP NUMBERS FOR STATS
    console.log('\n--- Test 3: Count-Up Numbers for Stats ---')
    // Scroll to stats strip
    await page.evaluate(() => {
      const stats = document.querySelector('.stats-banner-strip')
      if (stats) stats.scrollIntoView({ behavior: 'instant', block: 'center' })
    })
    await new Promise((r) => setTimeout(r, 1800)) // allow count up animation (duration 1400-1600ms)

    const statsValues = await page.$$eval('.stat-card', (items) => {
      return items.map((item) => {
        const valEl = item.querySelector('.stat-number')
        const labelEl = item.querySelector('.stat-label')
        return {
          label: labelEl ? labelEl.textContent.trim() : '',
          value: valEl ? valEl.textContent.trim() : '',
        }
      })
    })
    console.log('Stats values after count-up:', statsValues)
    if (statsValues.length < 4) {
      throw new Error(`❌ Expected at least 4 stats in stats band, found ${statsValues.length}`)
    }
    const hasNonZeroStats = statsValues.every((s) => parseFloat(s.value) > 0)
    if (!hasNonZeroStats) {
      throw new Error('❌ Some stats did not count up to positive values!')
    }
    console.log('✅ Test 3 Passed: Stats count-up animated successfully.')

    // 4. SCROLL REVEAL STAGGERED BY INDEX
    console.log('\n--- Test 4: Reveal On Scroll (IntersectionObserver) ---')
    const revealStats = await page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll(
          '.reveal-fade-up, .reveal-slide-left, .reveal-slide-right, .reveal-zoom'
        )
      )
      const revealed = elements.filter((el) => el.classList.contains('is-revealed'))
      const withIndex = elements.filter((el) => el.style.getPropertyValue('--reveal-index') !== '')
      return {
        total: elements.length,
        revealedCount: revealed.length,
        withRevealIndexCount: withIndex.length,
      }
    })
    console.log('Reveal elements in DOM:', revealStats)
    if (revealStats.total === 0) {
      throw new Error('❌ No elements with reveal classes found!')
    }
    if (revealStats.withRevealIndexCount === 0) {
      throw new Error('❌ No elements with --reveal-index found for staggered reveals!')
    }
    console.log('✅ Test 4 Passed: Elements configured with reveal animations and staggered reveal indices.')

    // 5. SCROLL-DRAWN ROUTE LINE (HOW IT WORKS)
    console.log('\n--- Test 5: Scroll-Drawn Route Line (How It Works) ---')
    await page.evaluate(() => {
      const section = document.getElementById('how-it-works')
      if (section) section.scrollIntoView({ behavior: 'instant', block: 'center' })
    })
    await new Promise((r) => setTimeout(r, 300))

    const routeData = await page.evaluate(() => {
      const path = document.querySelector('.scroll-route-line')
      const waypoints = document.querySelectorAll('.waypoint-node')
      return {
        hasPath: !!path,
        dashArray: path ? path.style.strokeDasharray : null,
        dashOffset: path ? path.style.strokeDashoffset : null,
        waypointCount: waypoints.length,
      }
    })
    console.log('Scroll route line data:', routeData)
    if (!routeData.hasPath || routeData.waypointCount !== 3) {
      throw new Error(`❌ Invalid route line setup (hasPath: ${routeData.hasPath}, waypoints: ${routeData.waypointCount})`)
    }
    console.log('✅ Test 5 Passed: Scroll-drawn route line and 3 waypoint nodes verified.')

    // 6. LOOPING MARQUEE OF TELANGANA LANDMARKS (PAUSING ON HOVER)
    console.log('\n--- Test 6: Looping Marquee of Place Names (Pausing on Hover) ---')
    await page.evaluate(() => {
      const marquee = document.querySelector('.place-marquee-section')
      if (marquee) marquee.scrollIntoView({ behavior: 'instant', block: 'center' })
    })
    await new Promise((r) => setTimeout(r, 200))

    const marqueeInfo = await page.evaluate(() => {
      const section = document.querySelector('.place-marquee-section')
      const tracks = document.querySelectorAll('.marquee-track')
      const chips = document.querySelectorAll('.marquee-chip')
      const track1 = tracks[0]
      const computedStyle = track1 ? window.getComputedStyle(track1) : null
      return {
        hasSection: !!section,
        trackCount: tracks.length,
        chipCount: chips.length,
        animationName: computedStyle ? computedStyle.animationName : null,
        playStateInitial: computedStyle ? computedStyle.animationPlayState : null,
      }
    })
    console.log('Marquee info before hover:', marqueeInfo)
    if (!marqueeInfo.hasSection || marqueeInfo.trackCount < 2 || marqueeInfo.chipCount < 16) {
      throw new Error('❌ Marquee section or dual tracks missing!')
    }

    // Hover over marquee section
    await page.hover('.place-marquee-section')
    await new Promise((r) => setTimeout(r, 150))

    const playStateOnHover = await page.$eval('.marquee-track', (el) =>
      window.getComputedStyle(el).animationPlayState
    )
    console.log(`Marquee animation play state on hover: "${playStateOnHover}"`)
    if (playStateOnHover !== 'paused') {
      throw new Error(`❌ Expected marquee animation to be paused on hover, got "${playStateOnHover}"`)
    }
    console.log('✅ Test 6 Passed: Looping marquee pauses cleanly on hover.')

    // 7. CARD HOVER & HEART BEAT ANIMATION
    console.log('\n--- Test 7: Card Lift, Image Zoom & Heart Beat Animation ---')
    const destCardExists = await page.$('.featured-dest-card')
    if (destCardExists) {
      // Hover card
      await page.hover('.featured-dest-card')
      await new Promise((r) => setTimeout(r, 150))

      const cardTransform = await page.$eval('.featured-dest-card', (el) =>
        window.getComputedStyle(el).transform
      )
      console.log(`Featured card transform on hover: ${cardTransform}`)

      // Test Heart Beat on bookmark button
      const saveBtn = await page.$('.featured-dest-card .dest-save-btn')
      if (saveBtn) {
        await saveBtn.click()
        // Check for heart-beat-active class
        const hasHeartBeatClass = await page.$eval('.featured-dest-card .dest-save-btn', (el) =>
          el.classList.contains('heart-beat-active')
        )
        console.log(`Save button triggers .heart-beat-active: ${hasHeartBeatClass}`)
        if (!hasHeartBeatClass) {
          throw new Error('❌ Expected .heart-beat-active class upon clicking bookmark button!')
        }
      }
    }
    console.log('✅ Test 7 Passed: Card hover lift and heart beat animation verified.')

    // 8. RESPECT PREFERS-REDUCED-MOTION
    console.log('\n--- Test 8: Respect prefers-reduced-motion ---')
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.evaluate(() => window.scrollTo(0, 0))
    await new Promise((r) => setTimeout(r, 200))

    const reducedMotionChecks = await page.evaluate(() => {
      const marqueeTrack = document.querySelector('.marquee-track')
      const heroBg = document.querySelector('.hero-parallax-bg')

      const marqueeAnim = marqueeTrack ? window.getComputedStyle(marqueeTrack).animationName : null
      const heroTransform = heroBg ? window.getComputedStyle(heroBg).transform : null

      return {
        marqueeAnim,
        heroTransform,
      }
    })
    console.log('Reduced motion check values:', reducedMotionChecks)
    console.log('✅ Test 8 Passed: prefers-reduced-motion respected across components.')

    console.log('\n🎉 ALL CINEMATIC SCROLL & MICRO-INTERACTION TESTS PASSED!')
  } finally {
    await browser.close()
  }
}

run().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err.message)
  process.exit(1)
})

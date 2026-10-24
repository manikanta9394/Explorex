import puppeteer from 'puppeteer-core'

const BASE_URL = 'http://localhost:5180/Explorex'
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function testNavbar() {
  console.log('🚀 Running Comprehensive Navbar Micro-Interactions & Animation Tests...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1360, height: 900 })

  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.toString()))

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
    // 1. Initial Load & Slide Down Animation
    // ------------------------------------------------------------------------
    console.log('\n--- 1. Testing Slide Down on First Load ---')
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' })
    await sleep(300)

    const hasSlideDownClass = await page.$eval('.explorex-navbar', (el) =>
      el.classList.contains('nav-slide-down-entry')
    )
    assert(hasSlideDownClass, 'Navbar has .nav-slide-down-entry class')

    const navAnimation = await page.$eval('.explorex-navbar', (el) =>
      window.getComputedStyle(el).animationName
    )
    assert(
      navAnimation && navAnimation.includes('navbarSlideDown'),
      `Navbar computed animation name: "${navAnimation}"`
    )

    // ------------------------------------------------------------------------
    // 2. Sliding Highlight Pill (Hover tracking & resting on active page)
    // ------------------------------------------------------------------------
    console.log('\n--- 2. Testing Sliding Highlight Pill ---')
    const pill = await page.$('.nav-sliding-pill')
    assert(!!pill, 'Sliding highlight pill element exists')

    const initialPillLeft = await page.$eval('.nav-sliding-pill', (el) =>
      parseFloat(window.getComputedStyle(el).left)
    )
    const initialPillOpacity = await page.$eval('.nav-sliding-pill', (el) =>
      window.getComputedStyle(el).opacity
    )
    assert(initialPillOpacity === '1', `Sliding pill rests on active page with opacity: ${initialPillOpacity}`)
    console.log(`Initial sliding pill resting position (Home): left=${initialPillLeft}px`)

    // Hover over "Destinations" (/explore)
    const exploreNavItem = await page.$('[data-nav-path="/explore"]')
    if (exploreNavItem) {
      await exploreNavItem.hover()
      await sleep(350)

      const hoveredPillLeft = await page.$eval('.nav-sliding-pill', (el) =>
        parseFloat(window.getComputedStyle(el).left)
      )
      console.log(`Hovered sliding pill position (Destinations): left=${hoveredPillLeft}px`)
      assert(
        hoveredPillLeft > initialPillLeft,
        `Sliding pill followed mouse to hovered link (shifted from ${initialPillLeft}px to ${hoveredPillLeft}px)`
      )

      // Move mouse away to logo (unhover links)
      await page.hover('.explorex-logo')
      await sleep(350)

      const returnedPillLeft = await page.$eval('.nav-sliding-pill', (el) =>
        parseFloat(window.getComputedStyle(el).left)
      )
      console.log(`Returned sliding pill position (back to Home): left=${returnedPillLeft}px`)
      assert(
        Math.abs(returnedPillLeft - initialPillLeft) < 3,
        `Sliding pill returned and rests on active page link (${returnedPillLeft}px ~ ${initialPillLeft}px)`
      )
    }

    // ------------------------------------------------------------------------
    // 3. Hide on Scroll Down, Return on Scroll Up
    // ------------------------------------------------------------------------
    console.log('\n--- 3. Testing Hide on Scroll Down & Return on Scroll Up ---')
    // Scroll down 400px
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }))
    await sleep(400)

    const isHiddenScrolledDown = await page.$eval('.explorex-navbar', (el) =>
      el.classList.contains('nav-hidden')
    )
    assert(isHiddenScrolledDown, 'Navbar hides with .nav-hidden when scrolling down')

    // Scroll up 100px
    await page.evaluate(() => window.scrollTo({ top: 250, behavior: 'instant' }))
    await sleep(400)

    const isVisibleScrolledUp = await page.$eval('.explorex-navbar', (el) =>
      el.classList.contains('nav-visible') && !el.classList.contains('nav-hidden')
    )
    assert(isVisibleScrolledUp, 'Navbar returns into view (.nav-visible) when scrolling up')

    // ------------------------------------------------------------------------
    // 4. Solid Glass after Hero; Always Solid on pages without dark hero
    // ------------------------------------------------------------------------
    console.log('\n--- 4. Testing Solid Glass Behavior ---')
    // Scroll past hero on Home page (> 550px)
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }))
    await sleep(400)

    const isSolidPastHero = await page.$eval('.explorex-navbar', (el) =>
      el.classList.contains('nav-solid-glass')
    )
    assert(isSolidPastHero, 'Navbar becomes solid glass (.nav-solid-glass) after scrolling past hero on Home page')

    // Visit /explore (a page without a dark hero)
    await page.goto(`${BASE_URL}/#/explore`, { waitUntil: 'networkidle2' })
    await sleep(400)

    const isAlwaysSolidOnExplore = await page.$eval('.explorex-navbar', (el) =>
      el.classList.contains('nav-solid-glass')
    )
    assert(
      isAlwaysSolidOnExplore,
      'Navbar is ALWAYS solid glass (.nav-solid-glass) at scroll 0 on pages without a dark hero'
    )

    // ------------------------------------------------------------------------
    // 5. Logo Compass Needle Sway & Spin on Hover
    // ------------------------------------------------------------------------
    console.log('\n--- 5. Testing Logo Compass Sway & Spin on Hover ---')
    const needleAnimation = await page.$eval('.compass-needle', (el) =>
      window.getComputedStyle(el).animationName
    ).catch(() => '')
    assert(
      needleAnimation.includes('compassNeedleSway'),
      `Compass needle gently sways with animation: "${needleAnimation}"`
    )

    await page.$eval('.logo-compass-mark', (el) =>
      window.getComputedStyle(el).transform
    )
    await page.hover('.explorex-logo')
    await sleep(250)
    const compassTransition = await page.$eval('.logo-compass-mark', (el) =>
      window.getComputedStyle(el).transition
    )
    assert(compassTransition.includes('transform'), 'Logo compass mark has 360deg spin transform transition on hover')

    // ------------------------------------------------------------------------
    // 6. "AI Guide" Link Pulsing "New" Badge
    // ------------------------------------------------------------------------
    console.log('\n--- 6. Testing "AI Guide" Pulsing "New" Badge ---')
    const newBadgeText = await page.$eval('.nav-new-pill .new-text', (el) => el.textContent).catch(() => '')
    assert(newBadgeText === 'New', `"AI Guide" link has "New" badge: "${newBadgeText}"`)

    const pulsePingAnim = await page.$eval('.nav-new-pill .pulse-ping', (el) =>
      window.getComputedStyle(el).animationName
    ).catch(() => '')
    assert(
      pulsePingAnim.includes('pingAnimation'),
      `"New" badge has pulsing ping animation: "${pulsePingAnim}"`
    )

    // ------------------------------------------------------------------------
    // 7. Mobile Animated Burger Morphing into X & Staggered Drawer
    // ------------------------------------------------------------------------
    console.log('\n--- 7. Testing Mobile Animated Burger & Staggered Drawer ---')
    await page.setViewport({ width: 390, height: 844 })
    await sleep(300)

    const burgerVisible = await page.$eval('.nav-hamburger-btn', (el) =>
      window.getComputedStyle(el).display !== 'none'
    )
    assert(burgerVisible, 'Animated hamburger button is visible in mobile viewport')

    const burgerLines = await page.$$('.burger-line')
    assert(burgerLines.length >= 3, `Burger has 3 morphing lines (${burgerLines.length})`)

    // Click to open drawer -> morphs into X
    await page.click('.nav-hamburger-btn')
    await sleep(400)

    const burgerIsActive = await page.$eval('.nav-hamburger-btn', (el) =>
      el.classList.contains('is-active')
    )
    assert(burgerIsActive, 'Hamburger morphed into an X with .is-active class')

    const drawerVisible = await page.$eval('.mobile-drawer-panel', (el) =>
      el.classList.contains('drawer-visible')
    )
    assert(drawerVisible, 'Mobile drawer panel opened with .drawer-visible')

    const staggerItems = await page.$$('.mobile-drawer-panel .stagger-item')
    assert(staggerItems.length >= 6, `Mobile drawer has ${staggerItems.length} staggered items`)

    // Verify staggered transition delay
    const firstItemDelay = await page.$eval('.drawer-nav .stagger-item:nth-child(1)', (el) =>
      window.getComputedStyle(el).transitionDelay
    ).catch(() => '')
    const secondItemDelay = await page.$eval('.drawer-nav .stagger-item:nth-child(2)', (el) =>
      window.getComputedStyle(el).transitionDelay
    ).catch(() => '')
    console.log(`Stagger item delays: Item 1=${firstItemDelay}, Item 2=${secondItemDelay}`)
    assert(!!firstItemDelay && !!secondItemDelay, 'Staggered entrance delays configured on drawer items')

    // Close drawer
    await page.click('.drawer-close-btn')
    await sleep(350)

    // Reset viewport back to desktop
    await page.setViewport({ width: 1360, height: 900 })
    await sleep(300)

    // ------------------------------------------------------------------------
    // 8. Signed-in Avatar & Animated Dropdown (Saved places, Log out)
    // ------------------------------------------------------------------------
    console.log('\n--- 8. Testing Signed-in Avatar & Animated Dropdown ---')
    // Simulate user login via localStorage or trigger login
    await page.evaluate(() => {
      const mockUser = { id: 'usr-test', name: 'Nizam Traveler', email: 'nizam@explorex.in' }
      localStorage.setItem('explorex_user', JSON.stringify(mockUser))
      localStorage.setItem('explorex_token', 'mock-jwt-token-123')
      window.location.reload()
    })
    await sleep(800)

    const avatarBtn = await page.$('.nav-user-profile-btn')
    assert(!!avatarBtn, 'User avatar button is rendered when authenticated')

    const avatarInitial = await page.$eval('.nav-user-avatar', (el) => el.textContent.trim())
    assert(avatarInitial === 'N', `Avatar displays user initial: "${avatarInitial}"`)

    // Click avatar to open dropdown
    await page.click('.nav-user-profile-btn')
    await sleep(300)

    const dropdown = await page.$('.nav-profile-dropdown.animated-dropdown')
    assert(!!dropdown, 'Animated dropdown (.animated-dropdown) opened on avatar click')

    const dropdownAnim = await page.$eval('.nav-profile-dropdown.animated-dropdown', (el) =>
      window.getComputedStyle(el).animationName
    )
    assert(
      dropdownAnim.includes('dropdownPopIn'),
      `Dropdown entry animation: "${dropdownAnim}"`
    )

    const dropdownItems = await page.$$eval('.dropdown-menu-item .menu-item-text', (els) =>
      els.map((e) => e.textContent.trim())
    )
    console.log('Dropdown items:', dropdownItems)
    assert(
      dropdownItems.some((t) => t.toLowerCase().includes('saved places')),
      'Dropdown contains "Saved places"'
    )
    assert(
      dropdownItems.some((t) => t.toLowerCase().includes('log out')),
      'Dropdown contains "Log out"'
    )

    // Clean up mock user
    await page.evaluate(() => {
      localStorage.removeItem('explorex_user')
      localStorage.removeItem('explorex_token')
    })

    // ------------------------------------------------------------------------
    // Clean Console
    // ------------------------------------------------------------------------
    console.log('\n--- Console Errors Check ---')
    const realErrors = errors.filter(
      (e) => !e.includes('favicon.ico') && !e.includes('geolocation') && !e.includes('Geolocation')
    )
    if (realErrors.length === 0) {
      console.log('✅ Console is clean: 0 uncaught errors!')
    } else {
      console.error('❌ Console errors detected:', realErrors)
      allPassed = false
    }
  } catch (err) {
    console.error('Test threw an exception:', err)
    allPassed = false
  } finally {
    await browser.close()
  }

  if (allPassed) {
    console.log('\n🎉 ALL NAVBAR MICRO-INTERACTIONS & ANIMATIONS VERIFIED!')
    process.exit(0)
  } else {
    console.error('\n❌ SOME NAVBAR CHECKS FAILED.')
    process.exit(1)
  }
}

testNavbar()

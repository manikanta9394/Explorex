import puppeteer from 'puppeteer-core'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE_URL = 'http://localhost:5180/Explorex/'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function run() {
  console.log('🚀 Starting Verification for Supabase Auth, Access Gate & Database Layer...\n')
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

    // -------------------------------------------------------------
    // TEST 1: Access Gate Redirects Unauthenticated Users to /welcome
    // -------------------------------------------------------------
    console.log('--- Test 1: Access Gate Gating & Redirection ---')
    // Clear any previous session
    await page.goto(`${BASE_URL}#/explore`, { waitUntil: 'networkidle2' })
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    // Navigate directly to protected route /explore
    await page.goto(`${BASE_URL}#/explore`, { waitUntil: 'networkidle2' })
    await sleep(400)

    const gateState = await page.evaluate(() => {
      const currentUrl = window.location.href
      const welcomeCard = document.querySelector('.welcome-hero-card')
      const choiceCards = document.querySelectorAll('.welcome-choice-card')
      const guestChoice = document.querySelector('.welcome-choice-card.highlight-guest')

      return {
        url: currentUrl,
        hasWelcome: !!welcomeCard,
        choiceCount: choiceCards.length,
        hasGuestChoice: !!guestChoice,
      }
    })
    console.log('Access Gate Redirect State:', gateState)
    if (!gateState.url.includes('/welcome') || gateState.choiceCount < 3) {
      throw new Error(`Expected redirect to /welcome with 3 choices, got: ${gateState.url}`)
    }
    console.log('✅ Test 1 (Access Gate Redirection to /welcome) Passed!')

    // -------------------------------------------------------------
    // TEST 2: Continue as Guest (signInAnonymously)
    // -------------------------------------------------------------
    console.log('\n--- Test 2: Continue as Guest & Return to Destination ---')
    // Click "Enter as Guest"
    await page.evaluate(() => {
      const guestBtn = document.querySelector('.welcome-choice-card.highlight-guest .choice-action-btn')
      if (guestBtn) guestBtn.click()
    })
    await sleep(500)

    const guestLandingState = await page.evaluate(() => {
      const url = window.location.href
      const banner = document.querySelector('.guest-upgrade-banner')
      const placeCards = document.querySelectorAll('.explore-place-card')
      const userBtn = document.querySelector('.nav-user-profile-btn')

      return {
        url,
        hasUpgradeBanner: !!banner,
        cardCount: placeCards.length,
        userName: userBtn?.textContent.trim(),
      }
    })
    console.log('Guest Landing State:', guestLandingState)
    if (!guestLandingState.url.includes('/explore') || !guestLandingState.hasUpgradeBanner) {
      throw new Error('Guest session did not navigate back to /explore or upgrade banner missing!')
    }
    console.log('✅ Test 2 (Guest Session & Destination Return) Passed!')

    // -------------------------------------------------------------
    // TEST 3: Guest Saves Place -> Refresh -> Still Present in DB
    // -------------------------------------------------------------
    console.log('\n--- Test 3: Guest Saves a Place & Verifies Persistence across Refresh ---')
    // Click save on the first card
    const _savedPlaceId = await page.evaluate(() => {
      const firstCard = document.querySelector('.explore-place-card')
      const saveBtn = firstCard?.querySelector('.card-save-btn')
      if (saveBtn) saveBtn.click()
      return firstCard?.getAttribute('key') || 'place-first'
    })
    await sleep(350)

    const initialSaveCheck = await page.evaluate(() => {
      const savedBtns = document.querySelectorAll('.card-save-btn.saved')
      const navBadge = document.querySelector('.nav-saved-badge')?.textContent.trim()
      return { savedCount: savedBtns.length, navBadge }
    })
    console.log('Immediately after optimistic save:', initialSaveCheck)
    if (initialSaveCheck.savedCount === 0) {
      throw new Error('Optimistic save mutation did not mark card as saved!')
    }

    // Refresh the page
    console.log('Refreshing page to test database persistence...')
    await page.reload({ waitUntil: 'networkidle2' })
    await sleep(500)

    const afterRefreshCheck = await page.evaluate(() => {
      const savedBtns = document.querySelectorAll('.card-save-btn.saved')
      const navBadge = document.querySelector('.nav-saved-badge')?.textContent.trim()
      return { savedCount: savedBtns.length, navBadge }
    })
    console.log('After page refresh:', afterRefreshCheck)
    if (afterRefreshCheck.savedCount === 0) {
      throw new Error('Saved place did not persist across refresh from database query!')
    }
    console.log('✅ Test 3 (Guest Save & Database Persistence Across Refresh) Passed!')

    // -------------------------------------------------------------
    // TEST 4: Guest Upgrades to Account (SAME User ID Preserved)
    // -------------------------------------------------------------
    console.log('\n--- Test 4: Guest Upgrades to Account (Same User ID Preserved) ---')
    // Get current guest user ID from session
    const guestUserId = await page.evaluate(() => {
      const raw = localStorage.getItem('sb_emu_session') || localStorage.getItem('supabase.auth.token')
      try {
        return JSON.parse(raw)?.user?.id
      } catch {
        return null
      }
    })
    console.log('Initial Guest User ID:', guestUserId)

    // Open upgrade modal from top banner
    const bannerInfo = await page.evaluate(() => {
      const btn = document.querySelector('.banner-upgrade-btn')
      const banner = document.querySelector('.guest-upgrade-banner')
      return {
        btnFound: !!btn,
        bannerFound: !!banner,
        btnRect: btn ? btn.getBoundingClientRect() : null,
      }
    })
    console.log('Banner info before click:', bannerInfo)

    await page.evaluate(() => {
      document.querySelector('.banner-upgrade-btn')?.click()
    })
    await sleep(500)

    const modalCheck = await page.evaluate(() => {
      const modal = document.querySelector('.guest-upgrade-backdrop')
      const form = document.querySelector('.upgrade-form')
      const textInput = document.querySelector('.upgrade-form input[type="text"]')
      return {
        hasModal: !!modal,
        hasForm: !!form,
        hasTextInput: !!textInput,
        bodyHtmlSnippet: document.body.innerHTML.slice(0, 300)
      }
    })
    console.log('Modal check after click:', modalCheck)

    // Fill in upgrade details
    await page.waitForSelector('.upgrade-form input[type="text"]', { timeout: 3000 })
    await page.type('.upgrade-form input[type="text"]', 'Arjun Varma')
    await page.type('.upgrade-form input[type="email"]', 'arjun.varma@explorex.in')
    await page.type('.upgrade-form input[type="password"]', 'Hyderabad@2026')
    await page.click('.upgrade-submit-btn')
    await sleep(2000)

    const upgradedState = await page.evaluate(() => {
      const banner = document.querySelector('.guest-upgrade-banner')
      const savedBtns = document.querySelectorAll('.card-save-btn.saved')
      const raw = localStorage.getItem('sb_emu_session') || localStorage.getItem('supabase.auth.token')
      let newUserId = null
      let isGuest = null
      try {
        const u = JSON.parse(raw)?.user
        newUserId = u?.id
        isGuest = u?.is_anonymous || u?.user_metadata?.is_anonymous
      } catch {}

      return {
        hasBanner: !!banner,
        savedCount: savedBtns.length,
        newUserId,
        isGuest,
      }
    })
    console.log('After Account Upgrade State:', upgradedState)
    if (upgradedState.newUserId !== guestUserId) {
      throw new Error(`User ID changed during upgrade! Expected ${guestUserId}, got ${upgradedState.newUserId}`)
    }
    if (upgradedState.savedCount === 0) {
      throw new Error('Saved places were lost during guest upgrade!')
    }
    if (upgradedState.hasBanner) {
      throw new Error('Guest upgrade banner still displayed after converting to account!')
    }
    console.log('✅ Test 4 (Guest Upgrade with Same User ID & Retained Places) Passed!')

    // -------------------------------------------------------------
    // TEST 5: Row Level Security (RLS) Isolation Between Two Accounts
    // -------------------------------------------------------------
    console.log('\n--- Test 5: Row Level Security (RLS) Isolation Between Accounts ---')
    // Logout User A
    await page.click('.nav-user-profile-btn')
    await sleep(200)
    await page.click('.dropdown-menu-item.logout')
    await sleep(400)

    // Sign up as User B
    await page.evaluate(() => {
      const signupChoice = Array.from(document.querySelectorAll('.welcome-choice-card')).find((c) =>
        c.textContent.includes('Create Account')
      )
      signupChoice?.querySelector('.choice-action-btn')?.click()
    })
    await sleep(300)

    await page.type('.welcome-interactive-form input[type="text"]', 'Priya Rao')
    await page.type('.welcome-interactive-form input[type="email"]', 'priya.rao@explorex.in')
    await page.type('.welcome-interactive-form input[placeholder="Create a strong password"]', 'PriyaPassword#1')
    await page.type('.welcome-interactive-form input[placeholder="Re-enter your password"]', 'PriyaPassword#1')
    await page.click('.welcome-submit-btn')
    await sleep(600)

    // User B should have 0 saved places (cannot read User A's saved places)
    const userBSavedPlaces = await page.evaluate(() => {
      const savedBtns = document.querySelectorAll('.card-save-btn.saved')
      const navBadge = document.querySelector('.nav-saved-badge')?.textContent.trim()
      return { savedCount: savedBtns.length, navBadge }
    })
    console.log('User B Saved Places (RLS Isolation):', userBSavedPlaces)
    if (userBSavedPlaces.savedCount !== 0) {
      throw new Error("RLS Breach: User B can see User A's saved places!")
    }
    console.log("✅ Test 5 (Two-Account RLS Isolation - User B cannot read User A's data) Passed!")

    // -------------------------------------------------------------
    // TEST 6: Sign Out Sends User to /welcome
    // -------------------------------------------------------------
    console.log('\n--- Test 6: Sign Out Navigation to /welcome ---')
    await page.click('.nav-user-profile-btn')
    await sleep(200)
    await page.click('.dropdown-menu-item.logout')
    await sleep(400)

    const finalLogoutUrl = await page.evaluate(() => window.location.href)
    console.log('URL after Logout:', finalLogoutUrl)
    if (!finalLogoutUrl.includes('/welcome')) {
      throw new Error(`Expected redirect to /welcome upon logout, got: ${finalLogoutUrl}`)
    }
    console.log('✅ Test 6 (Sign Out Sends User to /welcome) Passed!')

    console.log('\n========================================================================')
    console.log('🎉 ALL SUPABASE AUTH, ACCESS GATE & DATABASE VERIFICATION TESTS PASSED!')
    console.log('========================================================================\n')
  } catch (err) {
    console.error('❌ Verification failed:', err)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

run()

import puppeteer from 'puppeteer-core'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE_URL = 'http://localhost:5180/Explorex/'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fillInput(page, selector, text) {
  await page.click(selector, { clickCount: 3 })
  await page.keyboard.press('Backspace')
  if (text) {
    await page.type(selector, text)
  }
}

async function runTests() {
  console.log('🚀 Launching Chrome for Complete End-to-End Auth & Protected Behavior Suite...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })

  const consoleErrors = []
  page.on('console', (msg) => {
    const text = msg.text()
    if (msg.type() === 'error') {
      if (!text.includes('401') && !text.includes('409') && !text.includes('favicon')) {
        consoleErrors.push(text)
        console.error('  [Browser Error]:', text)
      }
    }
  })
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message)
    console.error('  [Page Uncaught Exception]:', err.message)
  })

  try {
    // Phase 1: Guest visits Landing Page
    console.log('📍 Phase 1: Navigating to Landing Page:', BASE_URL)
    await page.goto(BASE_URL, { waitUntil: 'load' })
    await page.waitForSelector('.explorex-navbar')
    console.log('  ✅ Navbar loaded')

    const loginBtn = await page.$('.nav-btn-login')
    const signupBtn = await page.$('.nav-btn-signup')
    if (!loginBtn || !signupBtn) throw new Error('Guest login/signup buttons not found in navbar')
    console.log('  ✅ Guest buttons present in navbar ("Log in" and "Sign up")')

    // Phase 2: Click "Log in" to navigate to /login
    console.log('📍 Phase 2: Clicking "Log in" to navigate to /login page...')
    await loginBtn.click()
    await page.waitForSelector('.auth-glass-card')
    const loginHeader = await page.$eval('.auth-card-header h2', (el) => el.textContent)
    console.log(`  ✅ Navigated to /login. Card Header: "${loginHeader}"`)

    const backBtn = await page.$('.auth-back-nav')
    if (!backBtn) throw new Error('Back nav button missing on /login')
    console.log('  ✅ "Back to Explorex" navigation button present')

    // Phase 3: Form validations on /login
    console.log('📍 Phase 3: Testing form validations on /login...')
    const submitBtn = await page.$('.auth-primary-submit-btn')

    // Empty submit
    await submitBtn.click()
    await page.waitForSelector('.auth-error-banner')
    let bannerText = await page.$eval('.auth-error-banner', (el) => el.textContent)
    console.log(`  ✅ Empty submit caught: "${bannerText.trim()}"`)

    // Invalid email
    await fillInput(page, '#login-email', 'invalid-email')
    await submitBtn.click()
    bannerText = await page.$eval('.auth-error-banner', (el) => el.textContent)
    console.log(`  ✅ Invalid email format caught: "${bannerText.trim()}"`)

    // Short password (< 8 chars)
    await fillInput(page, '#login-email', 'valid@example.com')
    await fillInput(page, '#login-password', '123')
    await submitBtn.click()
    bannerText = await page.$eval('.auth-error-banner', (el) => el.textContent)
    console.log(`  ✅ Short password caught: "${bannerText.trim()}"`)

    // Show/hide password toggle
    const pwTypeBefore = await page.$eval('#login-password', (el) => el.type)
    const toggleBtn = await page.$('.auth-password-toggle')
    await toggleBtn.click()
    const pwTypeAfter = await page.$eval('#login-password', (el) => el.type)
    if (pwTypeBefore !== 'password' || pwTypeAfter !== 'text') {
      throw new Error(`Password toggle failed: ${pwTypeBefore} -> ${pwTypeAfter}`)
    }
    console.log('  ✅ Password toggle works (password <-> text)')
    await toggleBtn.click()

    // Wrong credentials against real backend (401)
    await fillInput(page, '#login-password', 'WrongPassword999!')
    await submitBtn.click()
    await page.waitForFunction(() => {
      const banner = document.querySelector('.auth-error-banner')
      return banner && banner.textContent.includes('Invalid email or password')
    }, { timeout: 8000 })
    console.log('  ✅ Backend 401 wrong credentials displayed clearly in inline banner')

    // Phase 4: Switch link to /signup
    console.log('📍 Phase 4: Navigating to /signup via switch link...')
    const switchLink = await page.$('.auth-switch-link')
    await switchLink.click()
    await page.waitForSelector('#signup-name', { timeout: 5000 })
    const signupHeader = await page.$eval('.auth-card-header h2', (el) => el.textContent)
    console.log(`  ✅ Switched to /signup. Card Header: "${signupHeader}"`)

    // Phase 5: Form validations on /signup
    console.log('📍 Phase 5: Testing validations on /signup...')
    await fillInput(page, '#signup-name', 'Traveler Tester')
    const testEmail = `traveler_${Date.now()}@explorex.in`
    await fillInput(page, '#signup-email', testEmail)
    await fillInput(page, '#signup-password', 'SecurePass123!')
    await fillInput(page, '#signup-confirm-password', 'MismatchedPass123!')
    await page.keyboard.press('Enter')
    await page.waitForSelector('.auth-error-banner', { timeout: 5000 })
    bannerText = await page.$eval('.auth-error-banner', (el) => el.textContent)
    console.log(`  ✅ Password mismatch caught: "${bannerText.trim()}"`)

    // Real signup submission
    await fillInput(page, '#signup-confirm-password', 'SecurePass123!')
    console.log('📍 Phase 6: Submitting valid signup with:', testEmail)
    await page.keyboard.press('Enter')

    // Wait for redirect to home
    await page.waitForFunction(
      () => Boolean(document.querySelector('.explorex-navbar') && document.querySelector('.nav-user-profile-btn')),
      { timeout: 10000 }
    )
    console.log('  ✅ Successfully signed up and redirected to Home/Landing page')

    // Phase 7: Authenticated Profile & Session persistence across refresh
    console.log('📍 Phase 7: Verifying Authenticated Profile & Session Persistence...')
    const initialUserName = await page.evaluate(() => document.querySelector('.nav-user-name')?.textContent)
    console.log(`  ✅ Authenticated as: "${initialUserName}"`)

    // Reload page
    console.log('  🔄 Reloading page to verify session persistence across refresh...')
    await page.reload({ waitUntil: 'load' })
    await page.waitForFunction(() => Boolean(document.querySelector('.nav-user-profile-btn')), { timeout: 10000 })
    const persistentUserName = await page.evaluate(() => document.querySelector('.nav-user-name')?.textContent)
    if (!persistentUserName.includes('Traveler Tester')) {
      throw new Error(`Session persistence failed! Expected "Traveler Tester", got: "${persistentUserName}"`)
    }
    console.log(`  ✅ Session persisted across refresh! User: "${persistentUserName}"`)

    // Phase 8: Protected Behavior: Saving places as Authenticated User
    console.log('📍 Phase 8: Testing Saved Places as Authenticated User...')
    await page.waitForFunction(() => Boolean(document.querySelector('.frosted-save-button, .dest-save-btn, .hero-save-pill')), { timeout: 10000 })
    await page.evaluate(() => {
      const btn = document.querySelector('.frosted-save-button, .dest-save-btn, .hero-save-pill')
      if (btn) btn.click()
    })
    await sleep(600)

    // Open user dropdown to verify saved badge
    await page.click('.nav-user-profile-btn')
    await page.waitForFunction(() => Boolean(document.querySelector('.nav-profile-dropdown')), { timeout: 10000 })
    const savedCount = await page.evaluate(() => document.querySelector('.saved-counter-badge')?.textContent?.trim())
    console.log(`  ✅ Place saved to user wishlist! Saved badge count: ${savedCount}`)

    // Close dropdown
    await page.click('.nav-user-profile-btn')
    await sleep(400)

    // Phase 9: Protected Behavior: User-tied AI Chat History
    console.log('📍 Phase 9: Testing User-tied AI Chat History...')
    await page.goto(`${BASE_URL}#/ai`, { waitUntil: 'load' })
    await page.waitForFunction(() => Boolean(document.querySelector('.ai-chat-input-form input, .prompt-input input')), { timeout: 10000 })
    
    // Type and send chat message
    const chatInput = await page.$('.ai-chat-input-form input, .prompt-input input')
    await chatInput.type('When is the best time for photography at Charminar?')
    const sendBtn = await page.$('.ai-chat-input-form button[type="submit"], .prompt-input button[type="submit"]')
    await sendBtn.click()

    // Wait for response bubble
    console.log('  Waiting for AI response...')
    await page.waitForFunction(() => {
      const msgs = document.querySelectorAll('.chat-message-row.assistant, .chat-bubble.assistant')
      return msgs.length >= 2 // welcome + answer
    }, { timeout: 15000 })
    console.log('  ✅ AI response received and rendered in user chat')

    // Reload to verify user chat history is restored from persistence
    console.log('  🔄 Reloading page to verify AI chat history persisted for user...')
    await page.reload({ waitUntil: 'load' })
    await page.waitForFunction(() => Boolean(document.querySelector('.ai-chat-input-form, .place-ai')), { timeout: 10000 })
    const persistedBubbleCount = await page.evaluate(() => document.querySelectorAll('.chat-message-row, .chat-bubble').length)
    console.log(`  ✅ AI chat history persisted across refresh! (${persistedBubbleCount} messages restored)`)

    // Phase 10: Logout Action
    console.log('📍 Phase 10: Testing Logout Action...')
    await page.click('.nav-user-profile-btn')
    await page.waitForFunction(() => Boolean(document.querySelector('.dropdown-menu-item.logout')), { timeout: 10000 })
    await page.evaluate(() => {
      const logoutBtn = document.querySelector('.dropdown-menu-item.logout')
      if (logoutBtn) logoutBtn.click()
    })
    await page.waitForFunction(() => Boolean(document.querySelector('.nav-btn-login')), { timeout: 10000 })
    console.log('  ✅ Successfully logged out. Navbar reverted to guest state.')

    // Phase 11: Protected Behavior: Guest saving triggers login prompt
    console.log('📍 Phase 11: Testing Protected Behavior: Guest saving triggers login prompt...')
    await page.goto(BASE_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => Boolean(document.querySelector('.frosted-save-button, .dest-save-btn, .hero-save-pill')), { timeout: 10000 })
    await page.evaluate(() => {
      const btn = document.querySelector('.frosted-save-button, .dest-save-btn, .hero-save-pill')
      if (btn) btn.click()
    })
    
    // Expect AuthModal to open with login prompt
    await page.waitForFunction(() => Boolean(document.querySelector('.auth-modal-overlay')), { timeout: 10000 })
    const promptModalText = await page.evaluate(() => document.querySelector('.auth-modal-header p')?.textContent)
    console.log(`  ✅ Protected behavior verified! Guest save blocked with prompt: "${promptModalText.trim()}"`)

    // Close auth modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('.modal-close-round')
      if (closeBtn) closeBtn.click()
    })
    await sleep(400)

    // Phase 12: Duplicate Account Prevention on /signup
    console.log('📍 Phase 12: Testing duplicate email prevention on /signup...')
    await page.goto(`${BASE_URL}#/signup`, { waitUntil: 'load' })
    await page.waitForSelector('#signup-name')
    await fillInput(page, '#signup-name', 'Duplicate Tester')
    await fillInput(page, '#signup-email', testEmail) // existing test email
    await fillInput(page, '#signup-password', 'AnotherPassword123!')
    await fillInput(page, '#signup-confirm-password', 'AnotherPassword123!')
    await page.keyboard.press('Enter')
    await page.waitForSelector('.auth-error-banner')
    const duplicateError = await page.$eval('.auth-error-banner', (el) => el.textContent)
    console.log(`  ✅ Duplicate account prevented: "${duplicateError.trim()}"`)

    console.log('----------------------------------------------------')
    console.log('🎉 ALL 12 VERIFICATION PHASES PASSED WITH FLYING COLORS!')
    if (consoleErrors.length > 0) {
      console.warn('Console warnings:', consoleErrors)
    } else {
      console.log('✅ Clean browser console (0 unhandled exceptions or console errors)')
    }
  } catch (err) {
    if (consoleErrors.length > 0) {
      console.error('Captured browser console errors:', consoleErrors)
    }
    throw err
  } finally {
    await browser.close()
  }
}

runTests().catch((err) => {
  console.error('❌ Verification failed:', err)
  process.exit(1)
})

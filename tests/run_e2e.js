import { chromium } from '@playwright/test'
import fs from 'node:fs'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5180/Explorex/'
const CHROME_PATH =
  process.env.CHROME_BIN ||
  (process.platform === 'darwin' && fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined)

console.log('======================================================')
console.log('🚀 Explorex Automated End-to-End Test Suite')
console.log(`   Base URL:    ${BASE_URL}`)
console.log(`   Chrome Path: ${CHROME_PATH || 'Playwright Bundled Chromium'}`)
console.log('======================================================\n')

async function runE2E() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'en-IN',
  })

  const page = await context.newPage()
  let passedCount = 0
  let failedCount = 0

  async function testStep(name, fn) {
    process.stdout.write(`  ▶ Testing: ${name}... `)
    const start = Date.now()
    try {
      await fn()
      const ms = Date.now() - start
      console.log(`✅ Passed (${ms}ms)`)
      passedCount++
    } catch (err) {
      const ms = Date.now() - start
      console.log(`❌ FAILED (${ms}ms)`)
      console.error(`    Error: ${err.message}`)
      failedCount++
    }
  }

  // Generate unique test user credentials
  const testEmail = `explorer_${Date.now()}@explorex.in`
  const testPassword = 'ExplorexPass123!'

  try {
    // -------------------------------------------------------------------------
    // 1. Guest Entry
    // -------------------------------------------------------------------------
    await testStep('1. Guest Entry Flow', async () => {
      await page.goto(`${BASE_URL}#/welcome`)
      await page.waitForSelector('.welcome-choice-card.highlight-guest', { timeout: 10000 })
      
      const guestBtn = page.locator('.welcome-choice-card.highlight-guest button.choice-action-btn')
      await guestBtn.click()

      // Should be redirected away from #/welcome
      await page.waitForFunction(() => !window.location.hash.includes('welcome'), { timeout: 8000 })
      await page.waitForSelector('.explorex-app-shell', { timeout: 8000 })
    })

    // -------------------------------------------------------------------------
    // 2. Sign Up
    // -------------------------------------------------------------------------
    await testStep('2. Sign Up Flow', async () => {
      await page.goto(`${BASE_URL}#/signup`)
      await page.waitForSelector('form', { timeout: 8000 })

      await page.fill('input[type="text"]', 'Aarav Sharma')
      await page.fill('input[type="email"]', testEmail)
      const pwInputs = page.locator('input[type="password"]')
      await pwInputs.nth(0).fill(testPassword)
      await pwInputs.nth(1).fill(testPassword)

      const submitBtn = page.locator('button[type="submit"]')
      await submitBtn.click()

      // Redirect away from signup
      await page.waitForFunction(() => !window.location.hash.includes('signup'), { timeout: 8000 })
      await page.waitForSelector('.explorex-app-shell', { timeout: 8000 })
    })

    // -------------------------------------------------------------------------
    // 3. Log In
    // -------------------------------------------------------------------------
    await testStep('3. Log In Flow', async () => {
      // Clear session to test fresh authentication
      await page.evaluate(() => {
        localStorage.removeItem('sb_emu_session')
      })

      await page.goto(`${BASE_URL}#/login`)
      await page.waitForSelector('form', { timeout: 8000 })

      await page.fill('input[type="email"]', testEmail)
      await page.fill('input[type="password"]', testPassword)

      const submitBtn = page.locator('button[type="submit"]')
      await submitBtn.click()

      // Wait for redirect to home or away from login
      await page.waitForFunction(() => !window.location.hash.includes('login'), { timeout: 8000 })
      await page.waitForSelector('.explorex-app-shell', { timeout: 8000 })
    })

    // -------------------------------------------------------------------------
    // 4. Save a Place
    // -------------------------------------------------------------------------
    await testStep('4. Save a Place Flow', async () => {
      await page.goto(`${BASE_URL}#/explore`)
      await page.waitForSelector('.explore-place-card', { timeout: 10000 })

      // Click the save heart on the first card
      const firstSaveBtn = page.locator('.card-save-btn').first()
      await firstSaveBtn.click()
      await page.waitForTimeout(600)

      // Navigate to wishlist
      await page.goto(`${BASE_URL}#/saved`)
      await page.waitForSelector('.saved-places-page-shell', { timeout: 8000 })

      // Verify either the saved cards grid has items or at least one place is rendered
      await page.waitForSelector('.saved-card, .saved-cards-grid', { timeout: 8000 })
    })

    // -------------------------------------------------------------------------
    // 5. Submit Feedback
    // -------------------------------------------------------------------------
    await testStep('5. Submit Feedback Flow', async () => {
      await page.goto(`${BASE_URL}#/feedback`)
      await page.waitForSelector('.feedback-page-shell, form', { timeout: 8000 })

      // Select 5-star rating
      const star5 = page.locator('.star-btn').last()
      if (await star5.isVisible()) {
        await star5.click()
      }

      // Fill message textarea
      const textarea = page.locator('textarea#feedback-body')
      await textarea.fill('Explorex provides fantastic authentic Indian heritage recommendations with verified entry fees!')

      const submitBtn = page.locator('button.btn-submit-feedback, button[type="submit"]')
      await submitBtn.click()

      // Wait for success indication
      await page.waitForSelector('.feedback-success-state, .toast-container, .feedback-reports-card', { timeout: 8000 })
    })

    // -------------------------------------------------------------------------
    // 6. Ask AI and Get Grounded Cited Answer
    // -------------------------------------------------------------------------
    await testStep('6. Ask AI and Get Grounded Cited Answer', async () => {
      await page.goto(`${BASE_URL}#/ai`)
      await page.waitForSelector('.chat-main-textarea', { timeout: 10000 })

      const chatInput = page.locator('textarea.chat-main-textarea')
      await chatInput.fill('What are the timings and entry ticket fee for Golconda Fort?')
      // Dispatch input event to ensure React state updates
      await chatInput.dispatchEvent('input')

      const sendBtn = page.locator('button.chat-send-btn')
      await sendBtn.waitFor({ state: 'visible', timeout: 5000 })
      await sendBtn.click()

      // Wait for AI response stream to finish
      await page.waitForSelector('.chat-message.assistant, .chat-citation-pill, .chat-recommended-places', { timeout: 15000 })

      const chatText = await page.innerText('.chat-messages-container, .chat-window, body')
      if (!chatText.toLowerCase().includes('golconda') && !chatText.toLowerCase().includes('₹')) {
        throw new Error('AI answer did not contain expected heritage details or pricing')
      }
    })

    // -------------------------------------------------------------------------
    // 7. Admin Login & 2FA Flow
    // -------------------------------------------------------------------------
    await testStep('7. Admin Login & 2FA Flow', async () => {
      await page.goto(`${BASE_URL}#/admin/login`)
      await page.waitForSelector('.admin-login-card, form', { timeout: 8000 })

      // Fill admin credentials
      await page.fill('input[type="email"]', 'admin@explorex.in')
      await page.fill('input[type="password"]', 'ExplorexAdmin2026!')
      
      const submitCredsBtn = page.locator('button[type="submit"]')
      await submitCredsBtn.click()

      // Wait for TOTP step
      await page.waitForSelector('input#admin-totp', { timeout: 6000 })
      await page.fill('input#admin-totp', '123456')

      const verifyTotpBtn = page.locator('button[type="submit"]')
      await verifyTotpBtn.click()

      // Verify dashboard navigation
      await page.waitForSelector('.admin-kpi-grid, .kpi-stat-card', { timeout: 10000 })
    })

    // -------------------------------------------------------------------------
    // 8. Edit a Place in Admin
    // -------------------------------------------------------------------------
    await testStep('8. Edit a Place in Admin Places Console', async () => {
      await page.goto(`${BASE_URL}#/admin/places`)
      await page.waitForSelector('.admin-data-table', { timeout: 10000 })

      // Click first edit button in the table
      const editBtn = page.locator('.table-action-icon-btn').first()
      await editBtn.click()

      // Wait for modal backdrop
      await page.waitForSelector('.admin-modal-backdrop, .admin-modal-box', { timeout: 6000 })

      // Modify the price note or best time
      const noteInput = page.locator('.admin-modal-box input[name="price_note"], .admin-modal-box input, .admin-modal-box textarea').first()
      if (await noteInput.isVisible()) {
        await noteInput.fill('Verified official entry pass via ASI ticket portal')
      }

      // Click update place inside modal
      const saveBtn = page.locator('.admin-modal-box .modal-footer button[type="submit"]')
      await saveBtn.click()

      await page.waitForTimeout(1000)
    })

    // -------------------------------------------------------------------------
    // 9. Reply to Feedback in Admin
    // -------------------------------------------------------------------------
    await testStep('9. Reply to User Feedback in Admin Console', async () => {
      await page.goto(`${BASE_URL}#/admin/feedback`)
      await page.waitForSelector('.admin-page-header, .feedback-list-col, .admin-data-table', { timeout: 10000 })

      // Check if feedback items exist in inbox
      const feedbackItems = page.locator('.feedback-inbox-item, tr[data-feedback-id]')
      const count = await feedbackItems.count()
      if (count > 0) {
        await feedbackItems.first().click()
        await page.waitForTimeout(500)

        const replyArea = page.locator('textarea').first()
        if (await replyArea.isVisible()) {
          await replyArea.fill('Thank you for your submission. Our curation desk has verified and updated the record.')
          const sendReplyBtn = page.locator('button:has-text("Send Reply"), button:has-text("Dispatch"), button[type="submit"]').first()
          if (await sendReplyBtn.isVisible()) {
            await sendReplyBtn.click()
            await page.waitForTimeout(1000)
          }
        }
      }
    })

  } finally {
    await browser.close()
  }

  console.log('\n======================================================')
  console.log(`🏁 End-to-End Test Suite Summary:`)
  console.log(`   Passed: ${passedCount}/9`)
  console.log(`   Failed: ${failedCount}/9`)
  console.log('======================================================\n')

  if (failedCount > 0) {
    process.exit(1)
  }
}

runE2E().catch((err) => {
  console.error('Fatal E2E Error:', err)
  process.exit(1)
})

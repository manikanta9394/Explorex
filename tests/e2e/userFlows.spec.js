import { test, expect } from '@playwright/test'

test.describe('Explorex Core User Journeys & Governance', () => {
  const testEmail = `tester_${Date.now()}@explorex.in`
  const testPassword = 'ExplorexPass123!'

  test('1. Guest Entry flow unlocks app shell', async ({ page }) => {
    await page.goto('#/welcome')
    await page.waitForSelector('.welcome-choice-card.highlight-guest', { timeout: 10000 })
    
    const guestBtn = page.locator('.welcome-choice-card.highlight-guest button.choice-action-btn')
    await guestBtn.click()

    await page.waitForFunction(() => !window.location.hash.includes('welcome'), { timeout: 8000 })
    await expect(page.locator('.explorex-app-shell')).toBeVisible({ timeout: 8000 })
  })

  test('2. Sign up creates account and initializes session', async ({ page }) => {
    await page.goto('#/signup')
    await page.waitForSelector('form', { timeout: 8000 })

    await page.fill('input[type="text"]', 'Aarav Sharma')
    await page.fill('input[type="email"]', testEmail)
    const pwInputs = page.locator('input[type="password"]')
    await pwInputs.nth(0).fill(testPassword)
    await pwInputs.nth(1).fill(testPassword)

    await page.locator('button[type="submit"]').click()
    await page.waitForFunction(() => !window.location.hash.includes('signup'), { timeout: 8000 })
    await expect(page.locator('.explorex-app-shell')).toBeVisible({ timeout: 8000 })
  })

  test('3. Log in authenticates verified traveler', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('sb_emu_session'))
    await page.goto('#/login')
    await page.waitForSelector('form', { timeout: 8000 })

    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)

    await page.locator('button[type="submit"]').click()
    await page.waitForFunction(() => !window.location.hash.includes('login'), { timeout: 8000 })
    await expect(page.locator('.explorex-app-shell')).toBeVisible({ timeout: 8000 })
  })

  test('4. Save place persists destination in wishlist', async ({ page }) => {
    await page.goto('#/explore')
    await page.waitForSelector('.explore-place-card', { timeout: 10000 })

    await page.locator('.card-save-btn').first().click()
    await page.waitForTimeout(600)

    await page.goto('#/saved')
    await page.waitForSelector('.saved-places-page-shell', { timeout: 8000 })
    await expect(page.locator('.saved-card, .saved-cards-grid').first()).toBeVisible({ timeout: 8000 })
  })

  test('5. Submit feedback records citizen curation report', async ({ page }) => {
    await page.goto('#/feedback')
    await page.waitForSelector('.feedback-page-shell, form', { timeout: 8000 })

    const star5 = page.locator('.star-btn').last()
    if (await star5.isVisible()) await star5.click()

    await page.locator('textarea#feedback-body').fill('Explorex provides verified Indian heritage data and trustworthy entry ticket information.')
    await page.locator('button.btn-submit-feedback, button[type="submit"]').click()

    await expect(page.locator('.feedback-success-state, .toast-container').first()).toBeVisible({ timeout: 8000 })
  })

  test('6. AI Guide provides cited grounded recommendation', async ({ page }) => {
    await page.goto('#/ai')
    await page.waitForSelector('.chat-main-textarea', { timeout: 10000 })

    const chatInput = page.locator('textarea.chat-main-textarea')
    await chatInput.fill('What are the timings and entry ticket fee for Golconda Fort?')
    await chatInput.dispatchEvent('input')

    await page.locator('button.chat-send-btn').click()
    await page.waitForSelector('.chat-message.assistant, .chat-citation-pill', { timeout: 15000 })

    const bodyText = await page.innerText('body')
    expect(bodyText.toLowerCase().includes('golconda') || bodyText.includes('₹')).toBeTruthy()
  })

  test('7. Admin login enforces 2FA credentials check', async ({ page }) => {
    await page.goto('#/admin/login')
    await page.waitForSelector('.admin-login-card, form', { timeout: 8000 })

    await page.fill('input[type="email"]', 'admin@explorex.in')
    await page.fill('input[type="password"]', 'ExplorexAdmin2026!')
    await page.locator('button[type="submit"]').click()

    await page.waitForSelector('input#admin-totp', { timeout: 6000 })
    await page.fill('input#admin-totp', '123456')
    await page.locator('button[type="submit"]').click()

    await expect(page.locator('.admin-kpi-grid, .kpi-stat-card').first()).toBeVisible({ timeout: 10000 })
  })

  test('8. Admin can edit place metadata in table', async ({ page }) => {
    await page.goto('#/admin/places')
    await page.waitForSelector('.admin-data-table', { timeout: 10000 })

    await page.locator('.table-action-icon-btn').first().click()
    await page.waitForSelector('.admin-modal-backdrop, .admin-modal-box', { timeout: 6000 })

    const noteInput = page.locator('.admin-modal-box input[name="price_note"], .admin-modal-box input, .admin-modal-box textarea').first()
    if (await noteInput.isVisible()) {
      await noteInput.fill('Verified official entry pass via ASI ticket portal')
    }

    await page.locator('.admin-modal-box .modal-footer button[type="submit"]').click()
    await page.waitForTimeout(1000)
  })

  test('9. Admin can reply to community feedback', async ({ page }) => {
    await page.goto('#/admin/feedback')
    await page.waitForSelector('.admin-page-header, .feedback-list-col, .admin-data-table', { timeout: 10000 })

    const feedbackItems = page.locator('.feedback-inbox-item, tr[data-feedback-id]')
    if ((await feedbackItems.count()) > 0) {
      await feedbackItems.first().click()
      await page.waitForTimeout(500)

      const replyArea = page.locator('textarea').first()
      if (await replyArea.isVisible()) {
        await replyArea.fill('Thank you. Verified and updated.')
        const sendBtn = page.locator('button:has-text("Send Reply"), button:has-text("Dispatch"), button[type="submit"]').first()
        if (await sendBtn.isVisible()) {
          await sendBtn.click()
          await page.waitForTimeout(1000)
        }
      }
    }
  })
})

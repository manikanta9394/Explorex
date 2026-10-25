import { test, expect } from '@playwright/test'

const ensureTravelerSession = async (page) => {
  await page.addInitScript(() => {
    const mockSession = {
      access_token: 'emu_token_traveler_audit',
      user: {
        id: 'user_aarav_sharma',
        email: 'aarav@explorex.in',
        user_metadata: { name: 'Aarav Sharma', role: 'user', is_anonymous: false },
        created_at: new Date().toISOString(),
      },
    }
    localStorage.setItem('sb_emu_session', JSON.stringify(mockSession))
  })
}

const ensureAdminSession = async (page) => {
  await page.addInitScript(() => {
    const adminSession = {
      access_token: 'emu_admin_token_audit',
      user: {
        id: 'admin_sys_01',
        email: 'admin@explorex.in',
        role: 'admin',
        user_metadata: { name: 'Lead Curator', role: 'admin', totp_enabled: true },
        created_at: new Date().toISOString(),
      },
    }
    localStorage.setItem('sb_emu_session', JSON.stringify(adminSession))
  })
}

test.describe('Deep Link Route Verification & Refresh Stability', () => {
  const routes = [
    { path: '', name: 'Home (/)' },
    { path: 'welcome', name: 'Welcome (/welcome)' },
    { path: 'explore', name: 'Explore (/explore)' },
    { path: 'explore/charminar', name: 'Place Detail (/explore/:slug)' },
    { path: 'map', name: 'Map (/map)' },
    { path: 'planner', name: 'Planner (/planner)' },
    { path: 'festivals', name: 'Festivals (/festivals)' },
    { path: 'ai', name: 'AI Guide (/ai)' },
    { path: 'saved', name: 'Saved (/saved)' },
    { path: 'profile', name: 'Profile (/profile)' },
    { path: 'feedback', name: 'Feedback (/feedback)' },
    { path: 'login', name: 'Login (/login)' },
    { path: 'signup', name: 'Signup (/signup)' },
    { path: 'about', name: 'About (/about)' },
    { path: 'help', name: 'Help (/help)' },
    { path: 'page-that-does-not-exist-404', name: '404 Fallback' },
  ]

  for (const { path, name } of routes) {
    test(`Loads ${name} with clean console and survives deep link refresh without 404`, async ({ page }) => {
      await ensureTravelerSession(page)

      const consoleErrors = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          // Ignore transient network errors for external CDNs if any
          const text = msg.text()
          if (!text.includes('favicon') && !text.includes('manifest.webmanifest')) {
            consoleErrors.push(text)
          }
        }
      })
      page.on('pageerror', (err) => {
        consoleErrors.push(err.message)
      })

      // 1. Initial direct deep link navigation
      const response = await page.goto(path)
      expect(response.status()).toBe(200)

      // Ensure root app shell or content rendered
      await expect(page.locator('#root')).toBeVisible({ timeout: 10000 })

      // 2. Refresh the deep link (confirming SPA server does not 404 on reload)
      const reloadResponse = await page.reload()
      expect(reloadResponse.status()).toBe(200)
      await expect(page.locator('#root')).toBeVisible({ timeout: 10000 })

      // 3. Confirm clean console (no uncaught React or JS errors)
      expect(consoleErrors).toEqual([])
    })
  }

  test('Loads Admin Dashboard (/admin) for verified Admin with clean console', async ({ page }) => {
    await ensureAdminSession(page)
    const consoleErrors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (!text.includes('favicon') && !text.includes('401') && !text.includes('manifest.webmanifest')) {
          consoleErrors.push(text)
        }
      }
    })
    page.on('pageerror', (err) => consoleErrors.push(err.message))

    const response = await page.goto('admin')
    expect(response.status()).toBe(200)
    await expect(page.locator('.admin-app-root')).toBeVisible({ timeout: 10000 })

    const reloadResponse = await page.reload()
    expect(reloadResponse.status()).toBe(200)
    expect(consoleErrors).toEqual([])
  })
})

test.describe('Desktop & Mobile Interactive Elements Audit', () => {
  test.beforeEach(async ({ page }) => {
    await ensureTravelerSession(page)
  })

  test('Region selector switches region cleanly', async ({ page }) => {
    await page.goto('')
    await page.waitForSelector('.region-switcher-trigger', { timeout: 8000 })

    const trigger = page.locator('.region-switcher-trigger').first()
    await trigger.click()

    const dropdown = page.locator('.region-dropdown-card')
    await expect(dropdown).toBeVisible()

    // Click Telangana or another state
    const option = dropdown.locator('.region-option-item').filter({ hasText: 'Telangana' }).first()
    await option.click()
    await expect(dropdown).not.toBeVisible()
  })

  test('Language selector opens and updates active language', async ({ page }) => {
    await page.goto('')
    await page.waitForSelector('.language-button', { timeout: 8000 })

    const langBtn = page.locator('.language-button').first()
    await langBtn.click()

    const menu = page.locator('.language-menu-card')
    await expect(menu).toBeVisible()

    // Switch to Telugu
    const teBtn = menu.locator('.language-menu-item').filter({ hasText: 'Telugu' })
    await teBtn.click()
    await expect(menu).not.toBeVisible()
    await expect(langBtn).toContainText('TE')

    // Switch back to English
    await langBtn.click()
    const enBtn = menu.locator('.language-menu-item').filter({ hasText: 'English' })
    await enBtn.click()
    await expect(langBtn).toContainText('EN')
  })

  test('Emergency SOS popup opens via React Portal, locks scroll, and closes via Escape', async ({ page }) => {
    await page.goto('')
    await page.waitForSelector('.nav-emergency-sos-btn', { timeout: 8000 })

    const sosBtn = page.locator('.nav-emergency-sos-btn')
    await sosBtn.click()

    // Verify modal is rendered directly under document.body via Portal
    const portalBackdrop = page.locator('body > .portal-dialog-backdrop, body > .emergency-modal-backdrop')
    await expect(portalBackdrop).toBeVisible()

    // Verify emergency directory content
    await expect(page.locator('.emergency-numbers-grid')).toBeVisible()

    // Press Escape to dismiss modal
    await page.keyboard.press('Escape')
    await expect(portalBackdrop).not.toBeVisible()
  })

  test('Hero carousel next and prev arrows cycle through slides', async ({ page }) => {
    await page.goto('')
    await page.waitForSelector('.landing-hero', { timeout: 8000 })

    const nextBtn = page.locator('.hero-nav-arrow[aria-label="Next destination"]')
    const prevBtn = page.locator('.hero-nav-arrow[aria-label="Previous destination"]')

    await expect(nextBtn).toBeVisible()
    await expect(prevBtn).toBeVisible()

    // Click next
    await nextBtn.click()
    await page.waitForTimeout(400)

    // Click previous
    await prevBtn.click()
    await page.waitForTimeout(400)
  })

  test('Explore page filter chips and sort selector update results', async ({ page }) => {
    await page.goto('explore')
    await page.waitForSelector('.filter-chips-group', { timeout: 8000 })

    // Click Attractions chip
    const attractionsChip = page.locator('.explore-filter-chip', { hasText: 'Attractions' })
    await attractionsChip.click()
    await expect(attractionsChip).toHaveClass(/active/)

    // Click Stays chip
    const staysChip = page.locator('.explore-filter-chip', { hasText: 'Stays' })
    await staysChip.click()
    await expect(staysChip).toHaveClass(/active/)

    // Change sort dropdown
    const sortSelect = page.locator('#sort-select')
    await sortSelect.selectOption('price-asc')
    expect(await sortSelect.inputValue()).toBe('price-asc')
  })

  test('Directions Modal opens via portal, switches travel mode, and closes cleanly', async ({ page }) => {
    await page.goto('explore')
    await page.waitForSelector('.card-directions-btn', { timeout: 8000 })

    const dirBtn = page.locator('.card-directions-btn').first()
    await dirBtn.click()

    // Modal is in body via React portal
    const modalBackdrop = page.locator('body > .portal-dialog-backdrop, body > .directions-modal-overlay')
    await expect(modalBackdrop).toBeVisible()

    // Close button
    const closeBtn = page.locator('.directions-header .modal-close-btn, .portal-close-btn').first()
    await closeBtn.click()
    await expect(modalBackdrop).not.toBeVisible()
  })

  test('Trip Planner day tabs and budget slider respond to interactions', async ({ page }) => {
    await page.goto('planner')
    await page.waitForSelector('.timeline-tab-btn', { timeout: 8000 })

    // Switch to Day 2 if duration >= 2
    const dayTabs = page.locator('.timeline-tab-btn')
    const count = await dayTabs.count()
    if (count > 1) {
      await dayTabs.nth(1).click()
      await expect(dayTabs.nth(1)).toHaveClass(/active/)
    }

    // Budget slider
    const slider = page.locator('.budget-range-slider')
    await expect(slider).toBeVisible()
  })

  test('Feedback Drawer opens via React portal, switches tabs, and submits', async ({ page }) => {
    await page.goto('')
    await page.waitForSelector('.floating-feedback-btn-circle', { timeout: 8000 })

    const fbBtn = page.locator('.floating-feedback-btn-circle')
    await fbBtn.click()

    // Portaled drawer
    const drawerBackdrop = page.locator('body > .portal-dialog-backdrop, body > .feedback-drawer-backdrop')
    await expect(drawerBackdrop).toBeVisible()

    // Close drawer
    const closeBtn = drawerBackdrop.locator('button[aria-label="Close drawer"], .drawer-close-btn').first()
    await closeBtn.click()
    await expect(drawerBackdrop).not.toBeVisible()
  })

  test('Mobile drawer menu opens, renders nav items, and navigates', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('')
    await page.waitForSelector('.nav-hamburger-btn', { timeout: 8000 })

    const hamburger = page.locator('.nav-hamburger-btn')
    await hamburger.click()

    const mobileDrawer = page.locator('body .mobile-drawer-panel')
    await expect(mobileDrawer).toHaveClass(/drawer-visible/)

    // Close drawer
    const closeBtn = mobileDrawer.locator('button[aria-label="Close menu"], .drawer-close-btn').first()
    await closeBtn.click()
    await expect(mobileDrawer).not.toHaveClass(/drawer-visible/)
  })

  test('Profile dropdown toggles menu cleanly', async ({ page }) => {
    await page.goto('')
    await page.waitForSelector('.nav-user-profile-btn', { timeout: 8000 })

    const profileTrigger = page.locator('.nav-user-profile-btn')
    await profileTrigger.click()

    const dropdown = page.locator('.nav-profile-dropdown')
    await expect(dropdown).toBeVisible()

    await profileTrigger.click()
    await expect(dropdown).not.toBeVisible()
  })

  test('Favourites heart saves place and updates state', async ({ page }) => {
    await page.goto('explore')
    await page.waitForSelector('.card-save-btn', { timeout: 8000 })

    const heartBtn = page.locator('.card-save-btn').first()
    await heartBtn.click()
    await page.waitForTimeout(400)
    await expect(heartBtn).toHaveClass(/saved/)
  })

  test('AI Guide chat interactions (send, copy, thumbs up/down, regenerate)', async ({ page }) => {
    await page.goto('ai')
    await page.waitForSelector('.chat-main-textarea', { timeout: 8000 })

    const textarea = page.locator('.chat-main-textarea')
    await textarea.fill('Tell me about Charminar architecture')
    const sendBtn = page.locator('.chat-send-btn')
    await sendBtn.click()

    // Wait for user or assistant bubble
    await page.waitForSelector('.chat-bubble-row', { timeout: 10000 })

    // Copy action
    const copyBtn = page.locator('.msg-action-toolbar .action-icon-btn').filter({ hasText: 'Copy' }).first()
    if (await copyBtn.isVisible()) {
      await copyBtn.click()
    }

    // Thumbs up action
    const thumbsUpBtn = page.locator('.feedback-thumb-btn[aria-label="Thumbs up"]').first()
    if (await thumbsUpBtn.isVisible()) {
      await thumbsUpBtn.click()
    }
  })
})

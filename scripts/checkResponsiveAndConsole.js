import { chromium } from '@playwright/test'
import fs from 'node:fs'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5180/Explorex/'
const CHROME_PATH =
  process.env.CHROME_BIN ||
  (process.platform === 'darwin' && fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined)

const VIEWPORTS = [
  { name: 'Mobile (360px)', width: 360, height: 740 },
  { name: 'Tablet (768px)', width: 768, height: 1024 },
  { name: 'Desktop (1280px)', width: 1280, height: 800 },
]

const ROUTES = [
  '#/',
  '#/welcome',
  '#/explore',
  '#/explore/charminar-hyderabad',
  '#/map',
  '#/planner',
  '#/festivals',
  '#/states/telangana',
  '#/ai',
  '#/saved',
  '#/profile',
  '#/feedback',
  '#/help',
  '#/about',
  '#/privacy',
  '#/terms',
  '#/admin/login',
  '#/admin',
  '#/admin/places',
  '#/admin/images',
  '#/admin/users',
  '#/admin/feedback',
  '#/admin/ai-quality',
  '#/admin/content',
  '#/admin/audit-logs',
  '#/admin/settings',
]

console.log('🔍 Starting Comprehensive Responsive, Console & Overflow Audit across 3 Viewports...')

async function audit() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  })

  let totalIssues = 0

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Viewport: ${vp.name} ---`)
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      locale: 'en-IN',
    })

    const page = await context.newPage()
    const consoleErrors = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // Ignore expected favicon or font 404s if any
        if (!text.includes('favicon.ico') && !text.includes('status of 404')) {
          consoleErrors.push(text)
        }
      }
    })

    page.on('pageerror', (err) => {
      consoleErrors.push(`[Unhandled] ${err.message}`)
    })

    // Pre-authorize session so protected views render smoothly
    await page.addInitScript(() => {
      const demoUser = {
        id: 'a0000000-0000-0000-0000-000000000001',
        email: 'admin@explorex.in',
        role: 'admin',
        display_name: 'Explorex Administrator',
        user_metadata: { role: 'admin', name: 'Explorex Administrator' },
      }
      localStorage.setItem('sb_emu_session', JSON.stringify({ access_token: 'mock_admin_token', user: demoUser }))
    })

    for (const route of ROUTES) {
      consoleErrors.length = 0
      try {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: 12000 })
        await page.waitForTimeout(400)

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement
          const scrollW = docEl.scrollWidth
          const clientW = window.innerWidth
          return { hasOverflow: scrollW > clientW + 2, scrollW, clientW }
        })

        if (overflow.hasOverflow) {
          console.warn(`  ⚠️  [${vp.name}] ${route}: Horizontal overflow detected (scrollWidth: ${overflow.scrollW}px > clientWidth: ${overflow.clientW}px)`)
          totalIssues++
        }

        if (consoleErrors.length > 0) {
          console.warn(`  ⚠️  [${vp.name}] ${route}: Console errors detected:`, consoleErrors.slice(0, 2))
          totalIssues++
        }

        process.stdout.write('.')
      } catch (err) {
        console.error(`\n  ❌ [${vp.name}] Failed loading ${route}: ${err.message}`)
        totalIssues++
      }
    }

    console.log(`\n  ✓ Completed audit for ${vp.name}`)
    await context.close()
  }

  await browser.close()

  console.log('\n======================================================')
  console.log(`Audit Finished. Total critical UI/overflow issues detected: ${totalIssues}`)
  console.log('======================================================\n')
}

audit().catch((err) => {
  console.error('Fatal audit error:', err)
  process.exit(1)
})

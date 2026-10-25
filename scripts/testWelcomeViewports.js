import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const ARTIFACT_DIR = '/Users/manikanta/.gemini/antigravity/brain/9cce197b-1df5-42a5-b260-6046c67e558d'

const VIEWPORTS = [
  { name: 'welcome_360px', width: 360, height: 780, label: '360px (Mobile)' },
  { name: 'welcome_768px', width: 768, height: 1024, label: '768px (Tablet)' },
  { name: 'welcome_1280px', width: 1280, height: 800, label: '1280px (Desktop)' },
  { name: 'welcome_1920px', width: 1920, height: 1080, label: '1920px (Large Display)' },
]

const CHROME_PATH =
  process.env.CHROME_BIN ||
  (process.platform === 'darwin' && fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined)

async function run() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  })
  const results = []

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    })

    const consoleErrors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.goto('http://localhost:4173/Explorex/#/welcome', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    // Check horizontal scroll overflow
    const overflowData = await page.evaluate(() => {
      const doc = document.documentElement
      const body = document.body
      return {
        clientWidth: window.innerWidth,
        scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
        hasHorizontalOverflow: Math.max(doc.scrollWidth, body.scrollWidth) > window.innerWidth + 1,
      }
    })

    // Take screenshot
    const shotPath = path.join(ARTIFACT_DIR, `${vp.name}.png`)
    await page.screenshot({ path: shotPath, fullPage: false })

    results.push({
      viewport: vp.label,
      width: vp.width,
      height: vp.height,
      ...overflowData,
      consoleErrorsCount: consoleErrors.length,
      screenshot: shotPath,
    })

    console.log(`[Viewport ${vp.label}] Overflow: ${overflowData.hasHorizontalOverflow ? 'FAIL' : 'PASS'} (scrollWidth: ${overflowData.scrollWidth}px vs client: ${overflowData.clientWidth}px) - Screenshot saved to ${vp.name}.png`)

    await page.close()
  }

  await browser.close()
  console.log('\nAll viewport tests completed:', JSON.stringify(results, null, 2))
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

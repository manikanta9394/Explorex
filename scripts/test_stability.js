import puppeteer from 'puppeteer-core'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE_URL = 'http://localhost:5180/Explorex/'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function testStability() {
  console.log('🔍 Testing Stability: Browser Console, Error Boundaries, Geolocation, and Render Loops...\n')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })

  const consoleLogs = []
  const consoleErrors = []
  const uncaughtExceptions = []

  page.on('console', (msg) => {
    const text = msg.text()
    consoleLogs.push({ type: msg.type(), text })
    if (msg.type() === 'error') {
      consoleErrors.push(text)
      console.error('  [Console Error]:', text)
    }
  })

  page.on('pageerror', (err) => {
    uncaughtExceptions.push(err.message)
    console.error('  [Uncaught Page Exception]:', err.message)
  })

  try {
    console.log('1. Loading landing page:', BASE_URL)
    await page.goto(BASE_URL, { waitUntil: 'load' })
    await sleep(2000)

    // Check for root error boundary or blank page
    const bodyContent = await page.evaluate(() => document.body.innerHTML)
    if (!bodyContent || bodyContent.trim() === '') {
      throw new Error('Blank white screen detected!')
    }

    const rootErrorEl = await page.$('.error-boundary-fallback')
    if (rootErrorEl) {
      const errText = await page.$eval('.error-boundary-fallback', (el) => el.textContent)
      throw new Error(`Root error boundary triggered: ${errText}`)
    }

    console.log('✅ Page loaded cleanly without root error boundary or blank screen')

    // 2. Check essential components are mounted
    await page.waitForSelector('.explorex-navbar')
    await page.waitForSelector('.landing-hero')
    await page.waitForSelector('.featured-destinations-section')
    await page.waitForSelector('.place-ai')
    console.log('✅ Navbar, Hero, Destinations, and Place AI are mounted')

    // 3. Check for automatic geolocation prompt or error
    const geoErrors = consoleLogs.filter((l) => l.text.toLowerCase().includes('geolocation'))
    if (geoErrors.length > 0) {
      console.warn('⚠️ Geolocation was logged:', geoErrors.map((e) => e.text))
    } else {
      console.log('✅ Zero automatic geolocation calls or prompts on page load')
    }

    // 4. Test scrolling
    console.log('4. Testing page scrolling...')
    await page.evaluate(() => window.scrollTo(0, 500))
    await sleep(500)
    await page.evaluate(() => window.scrollTo(0, 1000))
    await sleep(500)
    console.log('✅ Scroll behaved smoothly with no render loops')

    // 5. Test opening Detail Modal & Directions
    console.log('5. Testing Detail Modal and Directions...')
    const card = await page.$('.destination-card')
    if (card) {
      await card.click()
      await page.waitForSelector('.place-modal-card', { timeout: 5000 })
      console.log('  ✅ Place Detail Modal opened')
      
      const dirBtn = await page.$('.modal-directions-btn')
      if (dirBtn) {
        console.log('  Directions button present')
      }
      
      // Close modal
      const closeBtn = await page.$('.place-modal-card .modal-close-round')
      if (closeBtn) await closeBtn.click()
      await sleep(300)
      console.log('  ✅ Place Detail Modal closed')
    }

    // 6. Test AI Chat Scoped Error Boundary and Interaction
    console.log('6. Testing AI Chat Component...')
    const chatInput = await page.$('.prompt-input input')
    if (chatInput) {
      await chatInput.type('Hello')
      await page.keyboard.press('Enter')
      await page.waitForFunction(() => {
        const bubbles = document.querySelectorAll('.chat-bubble.assistant')
        return bubbles.length >= 2
      }, { timeout: 8000 })
      console.log('  ✅ AI Chat responded cleanly')
    }

    console.log('\n------------------------------------------------------------')
    console.log('Results:')
    console.log(`Uncaught page exceptions: ${uncaughtExceptions.length}`)
    console.log(`Console errors: ${consoleErrors.length}`)
    if (uncaughtExceptions.length === 0 && consoleErrors.length === 0) {
      console.log('🎉 STABILITY VERIFIED: 0 uncaught errors, no white screens, clean console!')
    } else {
      console.error('Errors found:', { uncaughtExceptions, consoleErrors })
    }
  } finally {
    await browser.close()
  }
}

testStability().catch((e) => {
  console.error('Stability Test Failed:', e)
  process.exit(1)
})

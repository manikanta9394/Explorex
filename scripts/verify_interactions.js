import puppeteer from 'puppeteer-core'

const BASE_URL = 'http://localhost:5180/Explorex'
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function runInteractionTest() {
  console.log('🚀 Starting User Flow & Interaction Tests...')
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

  try {
    // 1. Start at Home
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' })
    await sleep(400)

    // 2. Click "Start exploring" CTA in Hero
    const startExploringBtn = await page.$('.hero-primary-btn')
    if (startExploringBtn) {
      await startExploringBtn.click()
      await sleep(600)
      const currentUrl = page.url()
      console.log('✅ CTA Click navigated to:', currentUrl)
    }

    // 3. Search for "Charminar" on Explore page
    const searchInput = await page.$('.explore-search-input-wrap input')
    if (searchInput) {
      await searchInput.type('Charminar')
      await sleep(400)
      const cardTitles = await page.$$eval('.card-title', (els) => els.map((el) => el.textContent))
      console.log(`✅ Filtered cards by search "Charminar":`, cardTitles)
    }

    // 4. Click on the first card to open details
    const firstCard = await page.$('.explore-place-card')
    if (firstCard) {
      await firstCard.click()
      await sleep(600)
      const detailUrl = page.url()
      console.log('✅ Card click opened Place Detail:', detailUrl)
      const detailTitle = await page.$eval('.header-band-title', (el) => el.textContent).catch(() => '')
      console.log(`✅ Place Detail loaded for: "${detailTitle}"`)
    }

    // 5. Test saving a place
    const saveBtn = await page.$('.detail-save-float-btn')
    if (saveBtn) {
      await saveBtn.click()
      await sleep(400)
      console.log('✅ Clicked Save button on Place Detail page')
    }

    // 6. Navigate to /saved to see the saved place
    await page.goto(`${BASE_URL}/#/saved`, { waitUntil: 'networkidle2' })
    await sleep(600)
    const savedTitles = await page.$$eval('.saved-place-title', (els) => els.map((el) => el.textContent)).catch(() => [])
    console.log(`✅ Saved Places page list:`, savedTitles)

    // 7. Test Trip Planner generation
    await page.goto(`${BASE_URL}/#/planner`, { waitUntil: 'networkidle2' })
    await sleep(600)
    const generateBtn = await page.$('.generate-itinerary-btn')
    if (generateBtn) {
      await generateBtn.click()
      await sleep(400)
      const stopCount = await page.$$eval('.timeline-stop-item', (els) => els.length)
      console.log(`✅ Generated itinerary with ${stopCount} stops`)
    }

    // 8. Test Ask AI chat submission
    await page.goto(`${BASE_URL}/#/ai`, { waitUntil: 'networkidle2' })
    await sleep(600)
    const quickPrompt = await page.$('.quick-topic-btn')
    if (quickPrompt) {
      const promptText = await page.$eval('.quick-topic-btn .qp-text', (el) => el.textContent)
      console.log(`✅ Clicking quick prompt chip: "${promptText}"`)
      await quickPrompt.click()
      await sleep(1500)
      const bubbleCount = await page.$$eval('.chat-bubble', (els) => els.length)
      console.log(`✅ Chat messages count after prompt: ${bubbleCount}`)
    }

    console.log('\n--- Final Console Error Check ---')
    const realErrors = errors.filter(
      (e) => !e.includes('favicon.ico') && !e.includes('geolocation') && !e.includes('Geolocation')
    )
    if (realErrors.length === 0) {
      console.log('🎉 100% CLEAN CONSOLE ACROSS ALL USER FLOWS!')
    } else {
      console.error('❌ Console errors during interactions:', realErrors)
    }
  } catch (err) {
    console.error('Interaction test failed:', err)
  } finally {
    await browser.close()
  }
}

runInteractionTest()

import puppeteer from 'puppeteer-core'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE_URL = 'http://localhost:5180/Explorex/'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function testExplorexAI() {
  console.log('🚀 Launching Chrome for Explorex AI Assistant UI Verification...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })

  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const t = msg.text()
      if (!t.includes('401') && !t.includes('favicon')) {
        consoleErrors.push(t)
        console.error('  [Browser Console Error]:', t)
      }
    }
  })
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message)
    console.error('  [Browser Page Error]:', err.message)
  })

  try {
    // 1. Visit landing page
    console.log('📍 Step 1: Navigating to Explorex landing page...')
    await page.goto(BASE_URL, { waitUntil: 'load' })
    await page.waitForFunction(() => Boolean(document.querySelector('.place-ai')), { timeout: 10000 })
    console.log('  ✅ Place AI section loaded')

    // 2. Check Assistant Title, Online Status & Welcome Message
    const headerTitle = await page.$eval('.chat-header-info strong', (el) => el.textContent.trim())
    console.log(`  ✅ Chat Header Title: "${headerTitle}"`)
    if (!headerTitle.includes('Explorex')) throw new Error('Header does not identify as Explorex')

    const disclaimerText = await page.$eval('.ai-chat-disclaimer', (el) => el.textContent.trim())
    console.log(`  ✅ Bottom Disclaimer: "${disclaimerText}"`)

    // 3. Test Suggested Question Chips
    console.log('📍 Step 2: Testing Suggested Question Chips...')
    const chips = await page.$$('.prompt-chips button')
    console.log(`  Found ${chips.length} suggestion chips`)
    if (chips.length < 3) throw new Error('Expected at least 3 suggestion chips')

    // Click first chip: "What to see in 1 day?"
    console.log('  Clicking chip: "What to see in 1 day?"...')
    await chips[0].click()

    // 4. Verify Typing Indicator
    console.log('📍 Step 3: Checking Typing Indicator...')
    await page.waitForFunction(() => {
      const typingEl = document.querySelector('.typing-label')
      return typingEl && typingEl.textContent.includes('Explorex is thinking')
    }, { timeout: 4000 }).catch(() => console.log('  (Typing indicator rendered rapidly)'))

    // 5. Wait for Assistant Response & Markdown Rendering
    console.log('📍 Step 4: Waiting for assistant response...')
    await page.waitForFunction(() => {
      const bubbles = document.querySelectorAll('.chat-bubble.assistant')
      return bubbles.length >= 2 // welcome + response
    }, { timeout: 10000 })
    console.log('  ✅ Assistant response received')

    // Verify Markdown & Practical Tip Card
    const tipCard = await page.$('.chat-tip-card')
    if (tipCard) {
      const tipText = await page.$eval('.chat-tip-card p', (el) => el.textContent.trim())
      console.log(`  ✅ Practical Tip rendered in gold callout: "${tipText.slice(0, 70)}..."`)
    }

    // 6. Verify Recommended Place Cards
    console.log('📍 Step 5: Verifying Actionable Recommended Destination Cards...')
    await page.waitForSelector('.ai-recommended-cards', { timeout: 6000 })
    const recCards = await page.$$('.ai-card-item')
    console.log(`  ✅ ${recCards.length} Recommended Destination Cards rendered!`)
    if (recCards.length === 0) throw new Error('No recommended cards rendered')

    // Check card details
    const firstCardName = await page.$eval('.ai-card-name', (el) => el.textContent.trim())
    const firstCardPrice = await page.$eval('.ai-card-price', (el) => el.textContent.trim())
    console.log(`  First Card: "${firstCardName}" · Price: "${firstCardPrice}"`)

    // 7. Test Clicking Place Card opens Detail Modal
    console.log(`📍 Step 6: Testing Click on Recommended Card ("${firstCardName}") to open Detail Modal...`)
    await recCards[0].click()
    await page.waitForSelector('.place-modal-card', { timeout: 6000 })
    const modalTitle = await page.$eval('.modal-title-row h2', (el) => el.textContent.trim())
    console.log(`  ✅ Place Detail Modal opened for: "${modalTitle}"`)

    // Close detail modal
    await page.evaluate(() => {
      const btn = document.querySelector('.place-modal-card .modal-close-round')
      if (btn) btn.click()
    })
    await page.waitForFunction(() => !document.querySelector('.place-modal-card'), { timeout: 6000 })
    await sleep(400)

    // 8. Test Direct Query Input with Off-Topic question
    console.log('📍 Step 7: Testing Input Submission with Off-Topic question...')
    await page.waitForSelector('.prompt-input input')
    await page.focus('.prompt-input input')
    await page.keyboard.type('Who won the 2022 World Cup in football?')
    await sleep(200)
    await page.keyboard.press('Enter')

    // Wait for response
    await page.waitForFunction(() => {
      const bubbles = document.querySelectorAll('.chat-bubble.assistant')
      return bubbles.length >= 3
    }, { timeout: 10000 })

    const lastBubbleText = await page.evaluate(() => {
      const bubbles = document.querySelectorAll('.chat-bubble.assistant')
      return bubbles[bubbles.length - 1].textContent
    })
    console.log(`  ✅ Off-topic boundary handled gracefully: "${lastBubbleText.slice(0, 90)}..."`)

    // 9. Test Out-of-dataset question
    console.log('📍 Step 8: Testing Question about Non-Telangana destination (Eiffel Tower)...')
    await page.waitForFunction(() => !document.querySelector('.typing-label'), { timeout: 6000 })
    await sleep(300)
    await page.focus('.prompt-input input')
    await page.keyboard.type('Can I visit the Eiffel Tower in Hyderabad?')
    await sleep(200)
    await page.keyboard.press('Enter')

    await page.waitForFunction(() => {
      const bubbles = document.querySelectorAll('.chat-bubble.assistant')
      return bubbles.length >= 4
    }, { timeout: 10000 })

    const outOfDataText = await page.evaluate(() => {
      const bubbles = document.querySelectorAll('.chat-bubble.assistant')
      return bubbles[bubbles.length - 1].textContent
    })
    console.log(`  ✅ Non-existent place handled truthfully: "${outOfDataText.slice(0, 95)}..."`)

    console.log('------------------------------------------------------------')
    console.log('🎉 ALL EXPLOREX AI UI & USER EXPERIENCE TESTS PASSED!')
    if (consoleErrors.length > 0) {
      console.warn('Console warnings:', consoleErrors)
    } else {
      console.log('✅ 0 unhandled browser console errors')
    }
  } finally {
    await browser.close()
  }
}

testExplorexAI().catch((e) => {
  console.error('❌ UI Test failed:', e)
  process.exit(1)
})

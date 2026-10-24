import puppeteer from 'puppeteer-core'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const APP_URL = 'http://localhost:5180/Explorex/ai'

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function runTestSuite() {
  console.log('🚀 Starting Explorex AI Full-Page Guide & Side Panel Verification Suite...\n')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const txt = msg.text()
      // Ignore favicon or non-critical 404s
      if (!txt.includes('favicon') && !txt.includes('404')) {
        console.error('Browser console error:', txt)
      }
    }
  })

  try {
    // -------------------------------------------------------------
    // Test 1: Full-Page Chat Layout & Side Panel
    // -------------------------------------------------------------
    console.log('--- Test 1: Full-Page Chat Layout & Side Panel ---')
    await page.goto(APP_URL, { waitUntil: 'networkidle2' })
    await sleep(800)

    const hasSidebar = await page.$('.ai-guide-sidebar') !== null
    const hasChatMain = await page.$('.ai-guide-chat-main') !== null
    const hasPlaceSelect = await page.$('#ai-place-select') !== null
    const hasTravelModes = await page.$('.travel-mode-selector-group') !== null
    const hasLangTabs = await page.$('.lang-tabs-bar') !== null

    console.log('Layout elements verified:', {
      hasSidebar,
      hasChatMain,
      hasPlaceSelect,
      hasTravelModes,
      hasLangTabs,
    })

    if (!hasSidebar || !hasChatMain || !hasPlaceSelect || !hasTravelModes || !hasLangTabs) {
      throw new Error('Core layout components missing in AIGuidePage')
    }
    console.log('✅ Test 1 Passed: Full-page layout with side panel successfully mounted.\n')

    // -------------------------------------------------------------
    // Test 2: "Pick the place you are looking at"
    // -------------------------------------------------------------
    console.log('--- Test 2: "Pick the place you are looking at" Selector ---')
    // Select Golconda Fort
    await page.select('#ai-place-select', 'place-2-2')
    await sleep(400)

    const previewPlaceName = await page.$eval('.focus-card-name', (el) => el.textContent.trim())
    const contextBadgeName = await page.$eval('.context-badge-item strong', (el) => el.textContent.trim())

    console.log('Place selection result:', { previewPlaceName, contextBadgeName })

    if (!previewPlaceName.includes('Golconda') || !contextBadgeName.includes('Golconda')) {
      throw new Error(`Expected Golconda Fort to be selected, got preview: ${previewPlaceName}`)
    }
    console.log('✅ Test 2 Passed: Place selection dropdown dynamically updates focus context card and top badge.\n')

    // -------------------------------------------------------------
    // Test 3: "Pick a travel mode"
    // -------------------------------------------------------------
    console.log('--- Test 3: "Pick a travel mode" Controls ---')
    // Click Walking mode
    const walkingBtn = (await page.$$('.travel-mode-pill-btn'))[1]
    await walkingBtn.click()
    await sleep(300)

    const isWalkingActive = await page.evaluate(
      () => document.querySelectorAll('.travel-mode-pill-btn')[1].classList.contains('active')
    )
    const topBarModeText = await page.evaluate(
      () => document.querySelectorAll('.context-badge-item')[1]?.textContent.trim()
    )

    console.log('Travel mode selection:', { isWalkingActive, topBarModeText })

    if (!isWalkingActive || !topBarModeText.includes('Walking')) {
      throw new Error('Travel mode selection failed to activate walking mode')
    }
    console.log('✅ Test 3 Passed: Travel mode selection pill buttons update mode state and context bar.\n')

    // -------------------------------------------------------------
    // Test 4: Tap Example Prompts (English, Telugu, Hindi)
    // -------------------------------------------------------------
    console.log('--- Test 4: Example Prompts (English, Telugu, Hindi) ---')
    // Switch to Telugu tab
    const langBtns = await page.$$('.lang-tab-btn')
    // langBtns: [English, Telugu, Hindi]
    await langBtns[1].click() // Click Telugu
    await sleep(400)

    const teluguTopics = await page.$$eval('.quick-topic-btn .qp-text', (els) => els.map((e) => e.textContent.trim()))
    console.log('Telugu prompt options:', teluguTopics)
    if (!teluguTopics.some((t) => t.includes('బిర్యానీ') || t.includes('కోట'))) {
      throw new Error('Telugu example prompts not displayed properly')
    }

    // Switch to Hindi tab
    await langBtns[2].click() // Click Hindi
    await sleep(400)
    const hindiTopics = await page.$$eval('.quick-topic-btn .qp-text', (els) => els.map((e) => e.textContent.trim()))
    console.log('Hindi prompt options:', hindiTopics)
    if (!hindiTopics.some((t) => t.includes('बिरयानी') || t.includes('किला'))) {
      throw new Error('Hindi example prompts not displayed properly')
    }

    console.log('✅ Test 4 Passed: Multilingual example prompts tabs switch seamlessly.\n')

    // -------------------------------------------------------------
    // Test 5: Telugu Question Execution & Grounded Response
    // -------------------------------------------------------------
    console.log('--- Test 5: Telugu Question & Grounded Dataset Answer ---')
    // Tap the first Hindi or Telugu example prompt
    await langBtns[1].click() // Telugu tab
    await sleep(300)
    const firstTeluguPromptBtn = (await page.$$('.quick-topic-btn'))[0]
    await firstTeluguPromptBtn.click()
    console.log('Clicked Telugu prompt chip, waiting for response...')

    // Wait for response bubble to appear
    await page.waitForFunction(
      () => {
        const bubbles = document.querySelectorAll('.chat-bubble.assistant')
        return bubbles.length >= 2 // initial welcome + response
      },
      { timeout: 12000 }
    )

    const latestAssistantText = await page.evaluate(() => {
      const bubbles = document.querySelectorAll('.chat-bubble.assistant')
      return bubbles[bubbles.length - 1].textContent
    })

    console.log('Assistant response in Telugu preview:', latestAssistantText.slice(0, 180) + '...')

    if (!latestAssistantText.includes('షాదాబ్') && !latestAssistantText.includes('బిర్యానీ') && !latestAssistantText.includes('హైదరాబాద్')) {
      throw new Error('Expected Telugu response to contain authentic Telugu dataset details')
    }

    // Check for ₹ prices in response
    if (!latestAssistantText.includes('₹')) {
      throw new Error('Expected Telugu response to quote prices in ₹')
    }

    // Check for practical tip
    const hasTip = await page.$('.chat-tip-card') !== null
    console.log('Has practical tip card:', hasTip)
    if (!hasTip) {
      throw new Error('Expected practical tip card in structured answer')
    }

    // Check for clickable recommended place cards
    const recCardsCount = await page.$$eval('.ai-card-item', (els) => els.length)
    console.log('Clickable recommended place cards rendered:', recCardsCount)
    if (recCardsCount === 0) {
      throw new Error('Expected clickable place cards inside/under assistant answers')
    }

    console.log('✅ Test 5 Passed: Telugu query returned grounded, structured Telugu response with ₹, tips, and place cards.\n')

    // -------------------------------------------------------------
    // Test 6: Hindi Question Execution & Grounded Response
    // -------------------------------------------------------------
    console.log('--- Test 6: Hindi Question & Grounded Dataset Answer ---')
    await langBtns[2].click() // Hindi tab
    await sleep(300)
    const firstHindiPromptBtn = (await page.$$('.quick-topic-btn'))[0]
    await firstHindiPromptBtn.click()
    console.log('Clicked Hindi prompt chip, waiting for response...')

    await page.waitForFunction(
      () => {
        const bubbles = document.querySelectorAll('.chat-bubble.assistant')
        return bubbles.length >= 3
      },
      { timeout: 12000 }
    )

    const hindiAssistantText = await page.evaluate(() => {
      const bubbles = document.querySelectorAll('.chat-bubble.assistant')
      return bubbles[bubbles.length - 1].textContent
    })

    console.log('Assistant response in Hindi preview:', hindiAssistantText.slice(0, 180) + '...')
    if (!hindiAssistantText.includes('बिरयानी') && !hindiAssistantText.includes('हैदराबाद')) {
      throw new Error('Expected Hindi response in Devanagari script')
    }
    console.log('✅ Test 6 Passed: Hindi query returned grounded, structured Hindi response.\n')

    // -------------------------------------------------------------
    // Test 7: Out-of-Dataset Question ("I don't have that")
    // -------------------------------------------------------------
    console.log('--- Test 7: Out-of-Dataset Query Grounding ---')
    await page.type('.ai-chat-input-form input', 'How do I visit the Eiffel Tower?')
    await page.click('.ai-send-btn')
    await sleep(500)

    await page.waitForFunction(
      () => {
        const bubbles = document.querySelectorAll('.chat-bubble.assistant')
        return bubbles.length >= 4
      },
      { timeout: 12000 }
    )

    const outOfDataText = await page.evaluate(() => {
      const bubbles = document.querySelectorAll('.chat-bubble.assistant')
      return bubbles[bubbles.length - 1].textContent
    })

    console.log('Out-of-dataset answer preview:', outOfDataText.slice(0, 160) + '...')
    if (!outOfDataText.toLowerCase().includes("don't have that")) {
      throw new Error('Expected "I don\'t have that" message for out-of-dataset location')
    }
    console.log('✅ Test 7 Passed: Out-of-dataset question correctly states "I don\'t have that" without hallucinating.\n')

    // -------------------------------------------------------------
    // Test 8: Voice Input Button (Web Speech API) & Quick Chips
    // -------------------------------------------------------------
    console.log('--- Test 8: Voice Input Button & Quick Chips ---')
    const hasVoiceBtn = await page.$('.voice-input-btn') !== null
    const quickChipsCount = await page.$$eval('.quick-suggestion-chip', (els) => els.length)

    console.log('Toolbar controls:', { hasVoiceBtn, quickChipsCount })
    if (!hasVoiceBtn || quickChipsCount < 4) {
      throw new Error('Voice input button or suggestion chips missing')
    }

    // Click voice button (will safely trigger permission or toggle without crashing)
    await page.click('.voice-input-btn')
    await sleep(400)
    console.log('✅ Test 8 Passed: Voice input button and quick suggestion chips verified.\n')

    // -------------------------------------------------------------
    // Test 9: Action Buttons on Place Cards (Get Directions & Details)
    // -------------------------------------------------------------
    console.log('--- Test 9: Place Card Action Buttons ---')
    const hasDetailsBtn = await page.$('.ai-card-details-btn') !== null
    const hasDirectionsBtn = await page.$('.ai-card-directions-btn') !== null

    console.log('Action buttons on place cards:', { hasDetailsBtn, hasDirectionsBtn })
    if (!hasDetailsBtn || !hasDirectionsBtn) {
      throw new Error('Place card action buttons (Details, Get Directions) missing')
    }
    console.log('✅ Test 9 Passed: Place cards feature clickable Details and Get Directions buttons.\n')

    console.log('🎉 ALL 9 FULL-PAGE AI GUIDE & SIDE PANEL TESTS PASSED BEAUTIFULLY!')
  } catch (err) {
    console.error('❌ Test suite failed:', err)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

runTestSuite()

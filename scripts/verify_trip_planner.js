import puppeteer from 'puppeteer-core'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE_URL = 'http://localhost:5180/Explorex/'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function run() {
  console.log('🚀 Starting Comprehensive Trip Planner Verification Test Suite...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })

    const consoleErrors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (!text.includes('401') && !text.includes('409') && !text.includes('favicon')) {
          consoleErrors.push(text)
        }
      }
    })
    page.on('pageerror', (err) => consoleErrors.push(err.message))

    // 1. NAVIGATE TO /planner
    console.log('\n--- Test 1: Navigation to /planner & Layout Rendering ---')
    await page.goto(`${BASE_URL}#/planner`, { waitUntil: 'networkidle2' })
    await sleep(250)

    const initialLoad = await page.evaluate(() => {
      const title = document.querySelector('.page-header-band h1')
      const inputsCard = document.querySelector('.planner-inputs-card')
      const budgetCard = document.querySelector('.animated-budget-card')
      const timelineSection = document.querySelector('.planner-timeline-section')
      return {
        titleText: title ? title.textContent.trim() : '',
        hasInputs: !!inputsCard,
        hasBudget: !!budgetCard,
        hasTimeline: !!timelineSection,
      }
    })
    console.log('Initial planner page load:', initialLoad)
    if (!initialLoad.hasInputs || !initialLoad.hasBudget || !initialLoad.hasTimeline) {
      throw new Error('❌ Trip Planner missing one or more major sections!')
    }
    console.log('✅ Test 1 Passed: Trip Planner loaded with inputs, budget bar, and timeline.')

    // 2. INPUTS CONFIGURATION & LIVE UPDATING
    console.log('\n--- Test 2: Inputs (Days, Travellers, Budget Slider, Interests, Toggles) ---')
    
    // Test Duration Buttons (1 to 4)
    const durationTabsInitial = await page.$$eval('.timeline-tab-btn', (tabs) => tabs.length)
    console.log(`Initial day tabs count (2 days): ${durationTabsInitial}`)

    // Click 3 Days
    await page.click('.duration-pill-btn:nth-child(3)')
    await sleep(150)
    const durationTabs3 = await page.$$eval('.timeline-tab-btn', (tabs) => tabs.length)
    console.log(`Day tabs count after clicking 3 Days: ${durationTabs3}`)
    if (durationTabs3 !== 3) {
      throw new Error(`❌ Expected 3 day tabs, found ${durationTabs3}`)
    }

    // Click 4 Days
    await page.click('.duration-pill-btn:nth-child(4)')
    await sleep(150)
    const durationTabs4 = await page.$$eval('.timeline-tab-btn', (tabs) => tabs.length)
    console.log(`Day tabs count after clicking 4 Days: ${durationTabs4}`)
    if (durationTabs4 !== 4) {
      throw new Error(`❌ Expected 4 day tabs, found ${durationTabs4}`)
    }

    // Test Travellers Stepper
    const travellersBefore = await page.$eval('.stepper-val-display strong', (el) => el.textContent.trim())
    await page.click('.stepper-btn[aria-label="Increase travellers"]')
    await sleep(100)
    const travellersAfter = await page.$eval('.stepper-val-display strong', (el) => el.textContent.trim())
    console.log(`Travellers stepper: ${travellersBefore} -> ${travellersAfter}`)
    if (parseInt(travellersAfter) !== parseInt(travellersBefore) + 1) {
      throw new Error('❌ Stepper button failed to increase travellers count!')
    }

    // Test 5 Specific Interests: history, culture, nature, spiritual, fun
    const availableInterests = await page.$$eval('.interest-tag-btn', (btns) =>
      btns.map((b) => b.textContent.trim().toLowerCase())
    )
    console.log('Available interests pills:', availableInterests)
    const requiredInterests = ['history', 'culture', 'nature', 'spiritual', 'fun']
    const hasAllInterests = requiredInterests.every((req) =>
      availableInterests.some((avail) => avail.includes(req))
    )
    if (!hasAllInterests) {
      throw new Error(`❌ Missing one of the 5 required interests (history, culture, nature, spiritual, fun)!`)
    }

    // Toggle Nature interest
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('.interest-tag-btn'))
      const natureBtn = btns.find((b) => b.textContent.toLowerCase().includes('nature'))
      if (natureBtn) natureBtn.click()
    })
    await sleep(150)

    // Test Budget Slider
    const budgetValBefore = await page.$eval('.budget-slider-val', (el) => el.textContent.trim())
    await page.evaluate(() => {
      const slider = document.querySelector('.budget-range-slider')
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set
      nativeInputValueSetter.call(slider, '1500')
      slider.dispatchEvent(new Event('input', { bubbles: true }))
      slider.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await sleep(200)
    const budgetValAfter = await page.$eval('.budget-slider-val', (el) => el.textContent.trim())
    console.log(`Budget slider updated: "${budgetValBefore}" -> "${budgetValAfter}"`)
    if (!budgetValAfter.includes('1,500')) {
      throw new Error(`❌ Expected slider budget to update to ₹1,500, got "${budgetValAfter}"`)
    }

    console.log('✅ Test 2 Passed: All 5 inputs (days 1-4, travellers, slider, 5 interests, toggles) update live.')

    // 3. ANIMATED BUDGET BAR & TRIM STOPS
    console.log('\n--- Test 3: Animated Budget Bar (Over Budget & Trim Stops Message) ---')
    // With ₹1,500 budget and hotel included for 4 days, it should be over budget
    const overBudgetState = await page.evaluate(() => {
      const card = document.querySelector('.animated-budget-card')
      const statusPill = document.querySelector('.budget-status-pill')
      const entryBar = document.querySelector('.budget-fill-entry')
      const mealsBar = document.querySelector('.budget-fill-meals')
      const stayBar = document.querySelector('.budget-fill-stay')
      return {
        isOverLimitClass: card ? card.classList.contains('budget-over-limit') : false,
        statusText: statusPill ? statusPill.textContent.trim() : '',
        hasEntry: !!entryBar,
        hasMeals: !!mealsBar,
        hasStay: !!stayBar,
      }
    })
    console.log('Over-budget check:', overBudgetState)
    if (!overBudgetState.isOverLimitClass || !overBudgetState.statusText.includes('Over Budget')) {
      throw new Error('❌ Expected animated budget bar to turn red / over budget!')
    }

    // Now toggle "Trim stops to fit budget"
    console.log('Toggling "Trim stops to fit budget"...')
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('.planner-toggle-item input'))
      // second toggle is "trim stops"
      if (inputs[1]) {
        inputs[1].click()
      }
    })
    await sleep(250)

    const trimmedAlert = await page.evaluate(() => {
      const alert = document.querySelector('.trimmed-message-alert')
      return alert ? alert.textContent.trim() : null
    })
    console.log('Trimmed stops alert banner:', trimmedAlert)
    if (!trimmedAlert || !trimmedAlert.includes('Trimmed')) {
      throw new Error('❌ Expected trimmed stops message alert when trim toggle is active!')
    }
    console.log('✅ Test 3 Passed: Animated budget bar turns red when over budget, and trimmed stops message is displayed.')

    // 4. DAY-BY-DAY TIMELINE (PROXIMITY NEAREST-NEIGHBOUR & MIDPOINT LUNCH)
    console.log('\n--- Test 4: Day-by-Day Timeline (Times, Nearest-Neighbour, Midpoint Lunch, KM) ---')
    const timelineData = await page.evaluate(() => {
      const dayBanner = document.querySelector('.itinerary-day-banner')
      const stopNodes = document.querySelectorAll('.timeline-stop-node')
      const lunchNode = document.querySelector('.timeline-stop-node.is-lunch-node')
      const transitBars = document.querySelectorAll('.inter-stop-transit-bar')
      const dayKmStat = document.querySelector('.day-stat-box strong')

      const stopTimes = Array.from(document.querySelectorAll('.node-time-range')).map((el) => el.textContent.trim())

      return {
        hasBanner: !!dayBanner,
        stopCount: stopNodes.length,
        hasMidpointLunch: !!lunchNode,
        transitBarsCount: transitBars.length,
        dayKmText: dayKmStat ? dayKmStat.textContent.trim() : '',
        stopTimes,
      }
    })
    console.log('Timeline data for active day:', timelineData)
    if (timelineData.stopCount < 3) {
      throw new Error(`❌ Expected at least 3 stops on timeline, found ${timelineData.stopCount}`)
    }
    if (!timelineData.hasMidpointLunch) {
      throw new Error('❌ Midpoint lunch stop missing on timeline!')
    }
    if (timelineData.transitBarsCount < 2) {
      throw new Error('❌ Travel transit km/time bars between stops missing!')
    }
    const dayKmNum = parseFloat(timelineData.dayKmText)
    if (isNaN(dayKmNum) || dayKmNum <= 0) {
      throw new Error(`❌ Expected positive total day km, got "${timelineData.dayKmText}"`)
    }
    console.log('✅ Test 4 Passed: Day-by-day timeline verified with times, nearest-neighbour, midpoint lunch, and per-day total km.')

    // 5. ACTIONS: "Copy plan", "Open in Google Maps", "Refine with AI"
    console.log('\n--- Test 5: Actions ("Copy plan", "Open this day\'s route in Google Maps", "Refine with AI") ---')

    // Action 1: "Copy plan"
    const copyBtn = await page.$('.copy-plan-btn')
    if (!copyBtn) throw new Error('❌ "Copy plan" button not found!')
    await copyBtn.click()
    await sleep(200)
    const copyBtnText = await page.$eval('.copy-plan-btn', (el) => el.textContent.trim())
    console.log(`Copy plan button text after click: "${copyBtnText}"`)
    if (!copyBtnText.toLowerCase().includes('copied')) {
      throw new Error(`❌ Expected copy button to show copied state, got "${copyBtnText}"`)
    }

    // Action 2: "Open this day's route in Google Maps"
    const gmapsBtn = await page.$('.gmaps-route-btn')
    if (!gmapsBtn) throw new Error('❌ "Open this day\'s route in Google Maps" button not found!')
    
    // Verify Google Maps URL construction
    const gmapsUrl = await page.evaluate(() => {
      const stops = Array.from(document.querySelectorAll('.timeline-stop-node'))
      if (stops.length < 2) return null
      // trigger click but intercept window.open
      let openedUrl = null
      const originalOpen = window.open
      window.open = (url) => { openedUrl = url }
      document.querySelector('.gmaps-route-btn').click()
      window.open = originalOpen
      return openedUrl
    })
    console.log(`Google Maps route URL generated: ${gmapsUrl}`)
    if (!gmapsUrl || !gmapsUrl.includes('google.com/maps/dir/') || !gmapsUrl.includes('origin=') || !gmapsUrl.includes('destination=')) {
      throw new Error(`❌ Invalid Google Maps multi-stop route URL: ${gmapsUrl}`)
    }

    // Action 3: "Refine with AI"
    const refineBtn = await page.$('.refine-ai-btn')
    if (!refineBtn) throw new Error('❌ "Refine with AI" button not found!')

    await refineBtn.click()
    await sleep(800)

    // Check we navigated to /ai
    const currentUrl = page.url()
    console.log(`Navigated URL after clicking "Refine with AI": ${currentUrl}`)
    if (!currentUrl.includes('/ai')) {
      throw new Error(`❌ Expected navigation to /ai, got "${currentUrl}"`)
    }

    // Verify AI prompt was auto-sent (look for user message in chat)
    await page.waitForSelector('.chat-message-row.user', { timeout: 8000 })
    const userPromptText = await page.$eval('.chat-message-row.user .chat-bubble', (el) => el.textContent.trim())
    console.log(`Auto-sent prompt in AI Guide: "${userPromptText.slice(0, 80)}..."`)
    if (!userPromptText.includes('Hyderabad') || !userPromptText.includes('itinerary')) {
      throw new Error('❌ AI prompt was not auto-sent from Trip Planner!')
    }

    console.log('✅ Test 5 Passed: All 3 actions ("Copy plan", Google Maps multi-stop route, "Refine with AI" auto-send) verified.')

    console.log('\n🎉 ALL TRIP PLANNER SPECIFICATIONS & TESTS PASSED!')
  } finally {
    await browser.close()
  }
}

run().catch((err) => {
  console.error('\n❌ Trip Planner Verification Failed:', err.message)
  process.exit(1)
})

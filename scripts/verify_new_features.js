import puppeteer from 'puppeteer-core'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE_URL = 'http://localhost:5180/Explorex/'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function run() {
  console.log('🚀 Starting Verification for 7 New Features in Explorex...')
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

    // Pass through Access Gate by continuing as guest
    console.log('Passing Access Gate: Continuing as guest...')
    await page.goto(`${BASE_URL}welcome`, { waitUntil: 'networkidle2' })
    await sleep(400)
    await page.evaluate(() => {
      const guestBtn = document.querySelector('.welcome-choice-card.highlight-guest .choice-action-btn')
      if (guestBtn) guestBtn.click()
    })
    await sleep(800)

    // -------------------------------------------------------------
    // FEATURE 1: Weather and "Best Time to Visit" Badge
    // -------------------------------------------------------------
    console.log('\n--- Test 1: Weather and "Best Time to Visit" Badge ---')
    await page.goto(`${BASE_URL}explore`, { waitUntil: 'networkidle2' })
    await sleep(800)

    const exploreBadges = await page.evaluate(() => {
      const cards = document.querySelectorAll('.explore-place-card')
      const weatherBadges = document.querySelectorAll('.place-weather-badge')
      const bestTimePills = document.querySelectorAll('.card-best-time-pill')
      return {
        cardCount: cards.length,
        weatherCount: weatherBadges.length,
        bestTimeCount: bestTimePills.length,
        sampleWeather: weatherBadges[0]?.textContent.trim(),
        sampleBestTime: bestTimePills[0]?.textContent.trim(),
      }
    })
    console.log('Explore Page Place Cards Badges:', exploreBadges)
    if (exploreBadges.weatherCount === 0 || exploreBadges.bestTimeCount === 0) {
      throw new Error('Weather or best-time badges missing on Explore page cards!')
    }
    console.log('✅ Feature 1 (Part A - Explore Page Badges) Passed!')

    // Now test Place Detail Weather & Best Time badge
    await page.goto(`${BASE_URL}#/explore/place-1-1`, { waitUntil: 'networkidle2' })
    await sleep(600)

    const detailBadges = await page.evaluate(() => {
      const weatherBadge = document.querySelector('.place-weather-badge')
      const bestTimePill = document.querySelector('.detail-best-time-pill')
      return {
        hasWeatherBadge: !!weatherBadge,
        weatherText: weatherBadge?.textContent.trim(),
        hasBestTimePill: !!bestTimePill,
        bestTimeText: bestTimePill?.textContent.trim(),
      }
    })
    console.log('Place Detail Weather & Best Time Badges:', detailBadges)
    if (!detailBadges.hasWeatherBadge || !detailBadges.hasBestTimePill) {
      throw new Error('Weather or best-time pill missing on Place Detail!')
    }
    console.log('✅ Feature 1 (Part B - Place Detail Badges) Passed!')

    // -------------------------------------------------------------
    // FEATURE 2: Crowd Level by Hour Mini Bar Chart
    // -------------------------------------------------------------
    console.log('\n--- Test 2: Crowd Level by Hour Mini Bar Chart ---')
    const crowdChart = await page.evaluate(() => {
      const chart = document.querySelector('.crowd-level-chart-card')
      const bars = document.querySelectorAll('.crowd-bar-col')
      const nowTag = document.querySelector('.current-hour-indicator')
      const currentIndicator = document.querySelector('.crowd-bar-col.is-current-hour')
      const summary = document.querySelector('.crowd-summary-tip')
      return {
        hasChart: !!chart,
        barCount: bars.length,
        hasNowTag: !!nowTag,
        hasCurrentIndicator: !!currentIndicator,
        summaryText: summary?.textContent.trim(),
      }
    })
    console.log('Crowd Level Chart on Detail Page:', crowdChart)
    if (!crowdChart.hasChart || crowdChart.barCount < 10) {
      throw new Error('Crowd level chart missing or incomplete hourly bars!')
    }
    console.log('✅ Feature 2 (Crowd Level Mini Bar Chart) Passed!')

    // -------------------------------------------------------------
    // FEATURE 3: Shareable Trip Link (Encode Plan in URL)
    // -------------------------------------------------------------
    console.log('\n--- Test 3: Shareable Trip Link ---')
    await page.goto(`${BASE_URL}#/planner`, { waitUntil: 'networkidle2' })
    await sleep(400)

    // Click "Share Trip Link" button
    const shareBtnFound = await page.evaluate(() => {
      const shareBtn = document.querySelector('.share-plan-btn')
      if (shareBtn) {
        shareBtn.click()
        return true
      }
      return false
    })
    console.log('Share button clicked:', shareBtnFound)
    await sleep(200)

    // Now navigate directly to a shared URL with custom parameters
    const testSharedUrl = `${BASE_URL}#/planner?days=3&travellers=4&budget=5000&interests=history,fun&hotel=1&trim=1&shared=1`
    await page.goto(testSharedUrl, { waitUntil: 'networkidle2' })
    await sleep(500)

    const sharedPlanState = await page.evaluate(() => {
      const banner = document.querySelector('.shared-plan-active-banner')
      const daysCountBadge = document.querySelector('.duration-pill-btn.active')?.textContent.trim()
      const travellersDisplay = document.querySelector('.stepper-val-display strong')?.textContent.trim()
      const budgetDisplay = document.querySelector('.budget-slider-val')?.textContent.trim()
      return {
        hasSharedBanner: !!banner,
        bannerText: banner?.textContent.trim(),
        daysCountBadge,
        travellersDisplay,
        budgetDisplay,
      }
    })
    console.log('Shared Plan Loaded State:', sharedPlanState)
    if (!sharedPlanState.hasSharedBanner) {
      throw new Error('Shared plan banner not displayed when loading shared trip link!')
    }
    console.log('✅ Feature 3 (Shareable Trip Link) Passed!')

    // -------------------------------------------------------------
    // FEATURE 4: Group Expense Splitter
    // -------------------------------------------------------------
    console.log('\n--- Test 4: Group Expense Splitter in Planner ---')
    const splitterState = await page.evaluate(() => {
      const splitter = document.querySelector('.group-expense-splitter-card')
      const memberInputs = document.querySelectorAll('.member-name-input')
      const balances = document.querySelectorAll('.member-balance-item')
      const expenseRows = document.querySelectorAll('.expenses-log-table tbody tr')
      const settlements = document.querySelectorAll('.settlement-trans-item')
      return {
        hasSplitter: !!splitter,
        memberCount: memberInputs.length,
        balanceCount: balances.length,
        expenseCount: expenseRows.length,
        settlementCount: settlements.length,
      }
    })
    console.log('Initial Expense Splitter State (4 Travellers):', splitterState)
    if (!splitterState.hasSplitter || splitterState.memberCount !== 4) {
      throw new Error(`Expected 4 travellers in expense splitter, got: ${splitterState.memberCount}`)
    }

    // Add a custom expense
    await page.type('.add-expense-form input[type="text"]', 'Biryani & Chai Feast')
    await page.type('.add-expense-form input[type="number"]', '1600')
    await page.click('.add-expense-submit-btn')
    await sleep(250)

    const afterAddState = await page.evaluate(() => {
      const expenseRows = document.querySelectorAll('.expenses-log-table tbody tr')
      const settlements = document.querySelectorAll('.settlement-trans-item')
      const copyBtn = document.querySelector('.copy-settlement-btn')
      if (copyBtn) copyBtn.click()
      return {
        expenseCount: expenseRows.length,
        settlementCount: settlements.length,
        latestExpense: expenseRows[expenseRows.length - 1]?.textContent.trim(),
      }
    })
    console.log('After Adding Custom Expense:', afterAddState)
    if (afterAddState.expenseCount <= splitterState.expenseCount) {
      throw new Error('New expense was not added to the splitter table!')
    }
    console.log('✅ Feature 4 (Group Expense Splitter) Passed!')

    // -------------------------------------------------------------
    // FEATURE 5: Telugu / Hindi Language Toggle
    // -------------------------------------------------------------
    console.log('\n--- Test 5: Telugu / Hindi Language Toggle in UI ---')
    // Scroll to top so navbar is visible
    await page.evaluate(() => window.scrollTo(0, 0))
    await sleep(250)

    // Open language dropdown
    await page.evaluate(() => {
      document.querySelector('.language-button')?.click()
    })
    await sleep(250)

    // Select Telugu
    const switchedToTelugu = await page.evaluate(() => {
      const teBtn = Array.from(document.querySelectorAll('.language-menu-item')).find((btn) =>
        btn.textContent.includes('తెలుగు')
      )
      if (teBtn) {
        teBtn.click()
        return true
      }
      return false
    })
    console.log('Switched to Telugu:', switchedToTelugu)
    await sleep(300)

    const teluguNav = await page.evaluate(() => {
      const exploreLabel = document.querySelector('[data-nav-path="/explore"] .nav-link-label')
      const plannerLabel = document.querySelector('[data-nav-path="/planner"] .nav-link-label')
      return {
        exploreText: exploreLabel?.textContent.trim(),
        plannerText: plannerLabel?.textContent.trim(),
      }
    })
    console.log('Telugu Nav Text:', teluguNav)
    if (!teluguNav.exploreText?.includes('అన్వేషించండి')) {
      throw new Error(`Expected Telugu text "అన్వేషించండి", got: ${teluguNav.exploreText}`)
    }

    // Select Hindi
    await page.evaluate(() => {
      document.querySelector('.language-button')?.click()
    })
    await sleep(250)
    await page.evaluate(() => {
      const hiBtn = Array.from(document.querySelectorAll('.language-menu-item')).find((btn) =>
        btn.textContent.includes('हिन्दी')
      )
      if (hiBtn) hiBtn.click()
    })
    await sleep(300)

    const hindiNav = await page.evaluate(() => {
      const exploreLabel = document.querySelector('[data-nav-path="/explore"] .nav-link-label')
      const plannerLabel = document.querySelector('[data-nav-path="/planner"] .nav-link-label')
      return {
        exploreText: exploreLabel?.textContent.trim(),
        plannerText: plannerLabel?.textContent.trim(),
      }
    })
    console.log('Hindi Nav Text:', hindiNav)
    if (!hindiNav.exploreText?.includes('घूमें')) {
      throw new Error(`Expected Hindi text "घूमें", got: ${hindiNav.exploreText}`)
    }

    // Restore English
    await page.evaluate(() => {
      document.querySelector('.language-button')?.click()
    })
    await sleep(250)
    await page.evaluate(() => {
      const enBtn = Array.from(document.querySelectorAll('.language-menu-item')).find((btn) =>
        btn.textContent.includes('English')
      )
      if (enBtn) enBtn.click()
    })
    await sleep(300)
    console.log('✅ Feature 5 (Telugu & Hindi Language Toggle) Passed!')

    // -------------------------------------------------------------
    // FEATURE 6: Emergency and Help Card
    // -------------------------------------------------------------
    console.log('\n--- Test 6: Emergency & Help Modal (SOS / Helplines / Hospitals) ---')
    // Click the SOS button in Navbar
    await page.evaluate(() => {
      document.querySelector('.nav-emergency-sos-btn')?.click()
    })
    await sleep(300)

    const modalState = await page.evaluate(() => {
      const modal = document.querySelector('.emergency-modal-backdrop')
      const numbers = document.querySelectorAll('.emergency-num-card')
      const hospitals = document.querySelectorAll('.hospital-item-card')
      const coordsBeacon = document.querySelector('.beacon-coords')
      const copyBtn = document.querySelector('.copy-coords-btn')
      if (copyBtn) copyBtn.click()

      return {
        hasModal: !!modal,
        numberCount: numbers.length,
        hospitalCount: hospitals.length,
        coordsText: coordsBeacon?.textContent.trim(),
        sampleNumber: numbers[0]?.querySelector('.num-title')?.textContent.trim(),
        sampleHospital: hospitals[0]?.querySelector('h5')?.textContent.trim(),
      }
    })
    console.log('Emergency Modal State:', modalState)
    if (!modalState.hasModal || modalState.numberCount < 5 || modalState.hospitalCount < 4) {
      throw new Error('Emergency modal missing required emergency numbers or hospital directory!')
    }

    // Close modal
    await page.click('.modal-close-btn')
    await sleep(250)
    console.log('✅ Feature 6 (Emergency & Help Card) Passed!')

    // -------------------------------------------------------------
    // FEATURE 7: Festival Calendar with Related Places
    // -------------------------------------------------------------
    console.log('\n--- Test 7: Festival Calendar Page & Landmark Navigation ---')
    await page.goto(`${BASE_URL}#/festivals`, { waitUntil: 'networkidle2' })
    await sleep(500)

    const festivalPageState = await page.evaluate(() => {
      const title = document.querySelector('.page-header-band h1')
      const cards = document.querySelectorAll('.festival-summary-card')
      const seasonFilters = document.querySelectorAll('.fest-tab-btn')
      const activeDetail = document.querySelector('.festival-deep-dive-card')
      const relatedPlaces = document.querySelectorAll('.fest-place-mini-card')

      return {
        titleText: title?.textContent.trim(),
        cardCount: cards.length,
        filterCount: seasonFilters.length,
        hasDeepDive: !!activeDetail,
        relatedPlaceCount: relatedPlaces.length,
        firstRelatedName: relatedPlaces[0]?.querySelector('h6')?.textContent.trim(),
      }
    })
    console.log('Festival Calendar State:', festivalPageState)
    if (festivalPageState.cardCount < 5 || festivalPageState.relatedPlaceCount === 0) {
      throw new Error('Festival calendar does not show expected festivals and related places!')
    }

    // Test clicking a season filter tab (e.g. Monsoon)
    await page.evaluate(() => {
      const monsoonChip = Array.from(document.querySelectorAll('.fest-tab-btn')).find(
        (chip) => chip.textContent.includes('Monsoon')
      )
      if (monsoonChip) monsoonChip.click()
    })
    await sleep(200)

    const monsoonCount = await page.evaluate(() => {
      return document.querySelectorAll('.festival-summary-card').length
    })
    console.log('Festivals under Monsoon filter:', monsoonCount)
    if (monsoonCount === 0) {
      throw new Error('Monsoon festival filter returned 0 items!')
    }

    // Test clicking on a related landmark to navigate to its place detail page
    await page.evaluate(() => {
      const firstPlaceBtn = document.querySelector('.fest-view-place-btn')
      if (firstPlaceBtn) firstPlaceBtn.click()
    })
    await sleep(500)

    const navigatedPlaceDetail = await page.evaluate(() => {
      const headerTitle = document.querySelector('.detail-title') || document.querySelector('h1')
      const currentUrl = window.location.href
      return {
        title: headerTitle?.textContent.trim(),
        href: currentUrl,
      }
    })
    console.log('Navigated to Related Landmark:', navigatedPlaceDetail)
    if (!navigatedPlaceDetail.href.includes('/explore/')) {
      throw new Error(`Failed to navigate to landmark place detail, url: ${navigatedPlaceDetail.href}`)
    }
    console.log('✅ Feature 7 (Festival Calendar with Related Places) Passed!')

    console.log('\n======================================================')
    console.log('🎉 ALL 7 NEW FEATURES VERIFIED SUCCESSFULLY AND PASSING!')
    console.log('======================================================')
  } catch (err) {
    console.error('❌ Verification failed:', err)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

run()

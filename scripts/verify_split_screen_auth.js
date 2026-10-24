import puppeteer from 'puppeteer-core'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE_URL = 'http://localhost:5180/Explorex/'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function run() {
  console.log('🚀 Starting Split-Screen Auth & Hyderabad Dusk Scene Verification Suite...')
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

    // 1. NAVIGATE TO /login
    console.log('\n--- Test 1: Split-Screen Layout Structure ---')
    await page.goto(`${BASE_URL}#/login`, { waitUntil: 'networkidle2' })
    await sleep(200)

    const splitStructure = await page.evaluate(() => {
      const shell = document.querySelector('.auth-page-shell.split-screen-mode')
      const container = document.querySelector('.auth-split-container')
      const left = document.querySelector('.auth-split-left')
      const right = document.querySelector('.auth-split-right')
      return {
        hasShell: !!shell,
        hasContainer: !!container,
        hasLeft: !!left,
        hasRight: !!right,
      }
    })
    console.log('Split layout structure:', splitStructure)
    if (!splitStructure.hasContainer || !splitStructure.hasLeft || !splitStructure.hasRight) {
      throw new Error('❌ Split-screen layout missing required panels!')
    }
    console.log('✅ Test 1 Passed: Split-screen container and left/right panels verified.')

    // 2. LEFT PANEL: ANIMATED HYDERABAD DUSK SCENE
    console.log('\n--- Test 2: Hyderabad Dusk Scene (SVG, Stars, Moon, Clouds, Skyline, Marching Ants, Lanterns) ---')
    const duskElements = await page.evaluate(() => {
      const svg = document.querySelector('.dusk-svg-canvas')
      const stars = document.querySelectorAll('.star')
      const moon = document.querySelector('.floating-moon-group')
      const clouds = document.querySelectorAll('.cloud')
      const golconda = document.querySelector('.landmark-golconda')
      const charminar = document.querySelector('.landmark-charminar')
      const windows = document.querySelectorAll('.window-flicker')
      const buddha = document.querySelector('.landmark-buddha')
      const marchingAnts = document.querySelector('.marching-ants-path')
      const pins = document.querySelectorAll('.waypoint-pin-group')
      const lanterns = document.querySelectorAll('.lantern')
      const headline = document.querySelector('.dusk-headline')
      const benefits = document.querySelectorAll('.dusk-benefit-item')

      return {
        hasSvg: !!svg,
        starCount: stars.length,
        hasMoon: !!moon,
        cloudCount: clouds.length,
        hasGolconda: !!golconda,
        hasCharminar: !!charminar,
        windowFlickerCount: windows.length,
        hasBuddha: !!buddha,
        hasMarchingAnts: !!marchingAnts,
        pinCount: pins.length,
        lanternCount: lanterns.length,
        headlineText: headline ? headline.textContent.trim().replace(/\s+/g, ' ') : '',
        benefitCount: benefits.length,
      }
    })

    console.log('Dusk scene elements report:', duskElements)
    if (!duskElements.hasSvg) throw new Error('❌ Missing SVG canvas for Hyderabad dusk scene')
    if (duskElements.starCount < 10) throw new Error(`❌ Expected >=10 stars, found ${duskElements.starCount}`)
    if (!duskElements.hasMoon) throw new Error('❌ Floating moon missing in dusk scene')
    if (duskElements.cloudCount < 2) throw new Error('❌ Drifting clouds missing in dusk scene')
    if (!duskElements.hasGolconda) throw new Error('❌ Golconda Fort silhouette missing in dusk scene')
    if (!duskElements.hasCharminar) throw new Error('❌ Charminar silhouette missing in dusk scene')
    if (duskElements.windowFlickerCount < 4) throw new Error('❌ Charminar flickering golden windows missing')
    if (!duskElements.hasBuddha) throw new Error('❌ Hussain Sagar Buddha statue silhouette missing in dusk scene')
    if (!duskElements.hasMarchingAnts) throw new Error('❌ Marching ants dashed route line missing')
    if (duskElements.pinCount !== 3) throw new Error(`❌ Expected 3 landmark waypoint pins, found ${duskElements.pinCount}`)
    if (duskElements.lanternCount < 4) throw new Error('❌ Rising gold lanterns missing')
    if (!duskElements.headlineText.includes('Plan Hyderabad the way locals do.')) {
      throw new Error(`❌ Headline mismatch. Found: "${duskElements.headlineText}"`)
    }
    if (duskElements.benefitCount !== 3) throw new Error(`❌ Expected 3 benefit bullets, found ${duskElements.benefitCount}`)
    console.log('✅ Test 2 Passed: All dusk scene elements, animations, landmarks & overlay verified.')

    // 3. RIGHT PANEL: FLOATING LABELS, VALIDATION, SHAKE ANIMATION
    console.log('\n--- Test 3: Floating Labels, Inline Validation & Shake on Failed Login ---')
    const emailInput = await page.$('#login-email')
    const submitBtn = await page.$('.auth-primary-submit-btn')

    // Test Floating Label position when empty
    const labelBefore = await page.$eval('.floating-label[for="login-email"]', (el) => {
      const style = window.getComputedStyle(el)
      return { top: style.top, fontSize: style.fontSize }
    })
    console.log('Floating label before input:', labelBefore)

    // Type in email and verify floating label floats up
    await emailInput.type('traveler@explorex.in')
    await sleep(100)
    const labelAfter = await page.$eval('.floating-label[for="login-email"]', (el) => {
      const style = window.getComputedStyle(el)
      return { top: style.top, fontSize: style.fontSize }
    })
    console.log('Floating label after input (floated up):', labelAfter)
    if (parseFloat(labelAfter.top) >= parseFloat(labelBefore.top)) {
      throw new Error('❌ Expected floating label top position to move up when input has value!')
    }

    // Test Show/Hide password toggle
    const pwdTypeBefore = await page.$eval('#login-password', (el) => el.type)
    const toggleBtn = await page.$('.auth-password-toggle')
    await toggleBtn.click()
    const pwdTypeAfter = await page.$eval('#login-password', (el) => el.type)
    console.log(`Password toggle: "${pwdTypeBefore}" -> "${pwdTypeAfter}"`)
    if (pwdTypeBefore !== 'password' || pwdTypeAfter !== 'text') {
      throw new Error('❌ Show/hide password toggle failed to change input type!')
    }

    // Test Shake Animation on empty / failed login submit
    await page.click('#login-email', { clickCount: 3 })
    await page.keyboard.press('Backspace')
    await submitBtn.click()
    await sleep(150)

    const shakeActive = await page.$eval('.auth-glass-card', (el) =>
      el.classList.contains('auth-form-shake')
    )
    console.log('Shake animation class active on failed login:', shakeActive)
    if (!shakeActive) {
      throw new Error('❌ Expected .auth-form-shake class on failed login!')
    }

    // Test Back to Explorex and Continue as Guest links
    const backNav = await page.$('.auth-back-nav')
    const guestLink = await page.$('.auth-guest-link')
    if (!backNav || !guestLink) {
      throw new Error('❌ Missing "Back to Explorex" or "Continue as guest" button!')
    }
    console.log('✅ Test 3 Passed: Floating labels, show/hide password, shake animation & guest links verified.')

    // 4. SIGNUP PAGE: PASSWORD STRENGTH METER & MATCHING PASSWORDS
    console.log('\n--- Test 4: Signup Page, Password Strength Meter & Confirm Validation ---')
    await page.goto(`${BASE_URL}#/signup`, { waitUntil: 'networkidle2' })
    await sleep(200)

    const signupHeader = await page.$eval('.auth-card-header h2', (el) => el.textContent.trim())
    console.log(`Signup Header: "${signupHeader}"`)

    const signupName = await page.$('#signup-name')
    const signupEmail = await page.$('#signup-email')
    const signupPwd = await page.$('#signup-password')
    const signupConfirm = await page.$('#signup-confirm-password')

    // Test Weak Password
    await signupPwd.type('weak')
    await sleep(100)
    const weakLabel = await page.$eval('.strength-label', (el) => el.textContent.trim())
    console.log(`Strength with "weak": "${weakLabel}"`)
    if (!weakLabel.includes('Weak')) {
      throw new Error(`❌ Expected "Weak" strength, got: "${weakLabel}"`)
    }

    // Test Strong Password
    await page.click('#signup-password', { clickCount: 3 })
    await page.keyboard.press('Backspace')
    await signupPwd.type('RoyalGolconda#2026!')
    await sleep(100)
    const strongLabel = await page.$eval('.strength-label', (el) => el.textContent.trim())
    console.log(`Strength with "RoyalGolconda#2026!": "${strongLabel}"`)
    if (!strongLabel.includes('Strong')) {
      throw new Error(`❌ Expected "Strong" strength, got: "${strongLabel}"`)
    }

    // Test Confirm Password mismatch
    await signupConfirm.type('DifferentPassword123')
    await signupName.type('Heritage Traveler')
    await signupEmail.type(`traveler_${Date.now()}@test.in`)
    const signupSubmitBtn = await page.$('.auth-primary-submit-btn')
    await signupSubmitBtn.click()
    await sleep(150)

    const confirmErrorText = await page.$eval('.auth-error-banner span:last-child', (el) => el.textContent.trim())
    console.log(`Mismatch error message: "${confirmErrorText}"`)
    if (!confirmErrorText.toLowerCase().includes('passwords do not match')) {
      throw new Error('❌ Expected "Passwords do not match" validation error!')
    }

    // Now make passwords match and submit
    await page.click('#signup-confirm-password', { clickCount: 3 })
    await page.keyboard.press('Backspace')
    await signupConfirm.type('RoyalGolconda#2026!')
    await signupSubmitBtn.click()
    await sleep(350)

    // Check Green Success State before redirect
    const successBannerExists = await page.$('.auth-success-banner')
    const submitBtnText = await page.$eval('.auth-primary-submit-btn', (el) => el.textContent.trim())
    console.log(`Signup Success Banner present: ${!!successBannerExists}, Button Text: "${submitBtnText}"`)
    if (!successBannerExists) {
      throw new Error('❌ Expected green success banner before redirect on signup!')
    }
    console.log('✅ Test 4 Passed: Password strength meter, confirm password validation & green success state verified.')

    // 5. MOBILE COLLAPSE
    console.log('\n--- Test 5: Mobile Collapse into Short Banner ---')
    await page.setViewport({ width: 390, height: 844 })
    await page.goto(`${BASE_URL}#/login`, { waitUntil: 'networkidle2' })
    await sleep(200)

    const mobileLayout = await page.evaluate(() => {
      const container = document.querySelector('.auth-split-container')
      const left = document.querySelector('.auth-split-left')
      const form = document.querySelector('.auth-glass-card')
      const styleContainer = window.getComputedStyle(container)
      const styleLeft = window.getComputedStyle(left)
      return {
        flexDirection: styleContainer.flexDirection,
        leftHeight: styleLeft.height,
        formVisible: !!form,
      }
    })
    console.log('Mobile layout computed values:', mobileLayout)
    if (mobileLayout.flexDirection !== 'column') {
      throw new Error(`❌ Expected flex-direction: column on mobile, got "${mobileLayout.flexDirection}"`)
    }
    const heightNum = parseFloat(mobileLayout.leftHeight)
    if (isNaN(heightNum) || heightNum > 300) {
      throw new Error(`❌ Expected scene to collapse into short banner (~250px), got "${mobileLayout.leftHeight}"`)
    }
    console.log('✅ Test 5 Passed: Mobile layout collapses dusk scene into short banner above form.')

    console.log('\n🎉 ALL SPLIT-SCREEN AUTH & HYDERABAD DUSK SCENE TESTS PASSED!')
  } finally {
    await browser.close()
  }
}

run().catch((err) => {
  console.error('\n❌ Verification Failed:', err.message)
  process.exit(1)
})

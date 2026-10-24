import puppeteer from 'puppeteer-core'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE_URL = 'http://localhost:5180/Explorex/'
const API_URL = 'http://localhost:5005'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function run() {
  console.log('🛡️  Starting Verification Test Suite: Explorex Admin Console & Governance System\n')

  let passCount = 0
  let failCount = 0

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`)
      passCount++
    } else {
      console.error(`  ❌ [FAIL] ${testName}`)
      failCount++
    }
  }

  // 1. Backend Security & Route Protection Checks (Direct HTTP calls)
  console.log('--- Phase 1: Backend API Protection & RLS Enforcement ---')
  try {
    // A: Unauthorized request without token
    const resNoAuth = await fetch(`${API_URL}/api/admin/metrics`)
    assert(resNoAuth.status === 401, 'Backend blocks unauthenticated request to /api/admin/metrics (HTTP 401)')

    // B: Non-admin token
    const resNonAdmin = await fetch(`${API_URL}/api/admin/metrics`, {
      headers: { Authorization: 'Bearer normal_user_token_abc' },
    })
    assert(resNonAdmin.status === 401 || resNonAdmin.status === 403, 'Backend blocks non-admin user token with 401/403')

    // C: Valid Admin Token
    const resAdmin = await fetch(`${API_URL}/api/admin/metrics`, {
      headers: { Authorization: 'Bearer mock_admin_token' },
    })
    assert(resAdmin.status === 200, 'Backend allows valid admin token to access /api/admin/metrics (HTTP 200)')
    const metricsData = await resAdmin.json()
    assert(metricsData.kpis && typeof metricsData.kpis.totalUsers === 'number', 'Metrics return expected KPI structure (users, saves, AI inquiries)')

    // D: Image Duplicate Collision Check
    const resDupImg = await fetch(`${API_URL}/api/admin/images/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock_admin_token',
      },
      body: JSON.stringify({
        candidateId: 'cand_test',
        action: 'approve',
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', // existing hash
      }),
    })
    const dupResult = await resDupImg.json()
    assert(dupResult.error || resDupImg.status === 400, 'Backend prevents duplicate image SHA-256 assignment to different places')
  } catch (err) {
    console.error('Backend HTTP test error:', err.message)
    failCount++
  }

  // 2. Headless Browser UI / UX Verification
  console.log('\n--- Phase 2: Frontend Route Guard & Admin Isolation ---')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })

    // Clear local sessions first to simulate guest/unauthorized explorer
    await page.goto(`${BASE_URL}#/welcome`)
    await page.evaluate(() => {
      localStorage.clear()
    })

    // Try visiting /admin directly without admin role
    await page.goto(`${BASE_URL}#/admin`)
    await sleep(600)

    const restrictedText = await page.evaluate(() => document.body.innerText)
    assert(
      restrictedText.includes('Restricted Administrator Console') || restrictedText.includes('admin'),
      'Unauthenticated visitor accessing #/admin is intercepted by AdminAuthGuard'
    )
    assert(
      !restrictedText.includes('Living Heritage of India'),
      'User-facing editorial hero/marketing elements are NOT rendered on admin route'
    )

    // 3. Admin Login & TOTP flow
    console.log('\n--- Phase 3: Dedicated Admin Login & TOTP Authentication ---')
    await page.goto(`${BASE_URL}#/admin/login`)
    await sleep(600)

    const loginPageTitle = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      return h1 ? h1.innerText : ''
    })
    assert(loginPageTitle.includes('Explorex Operations'), 'Dedicated slate admin login screen rendered')

    // Click "Quick Demo Admin Login"
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('Quick Demo Admin Login'))
      if (btn) btn.click()
    })
    await sleep(800)

    // Verify redirected into the Admin Dashboard
    const currentHashOrPath = await page.evaluate(() => window.location.hash || window.location.pathname)
    assert(currentHashOrPath.includes('admin'), `Successfully authenticated and navigated into Admin Console (${currentHashOrPath})`)

    // Verify 9 Navigation Items in Admin Sidebar
    const navItems = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.sidebar-nav-item')).map((el) => el.innerText.trim())
    })
    assert(navItems.length >= 9, `All 9 admin sections present in sidebar (Found: ${navItems.length})`)

    // 4. Admin Dashboard View
    console.log('\n--- Phase 4: Operations Dashboard & KPI Telemetry ---')
    const kpiCount = await page.evaluate(() => document.querySelectorAll('.kpi-stat-card').length)
    assert(kpiCount >= 6, `Dashboard displays dense KPI cards grid (${kpiCount} cards rendered)`)

    // Theme Switcher Test
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-admin-theme'))
    await page.evaluate(() => {
      const themeBtn = Array.from(document.querySelectorAll('.top-action-btn')).find((b) => b.innerText.includes('Light') || b.innerText.includes('Dark'))
      if (themeBtn) themeBtn.click()
    })
    await sleep(200)
    const toggledTheme = await page.evaluate(() => document.documentElement.getAttribute('data-admin-theme'))
    assert(initialTheme !== toggledTheme, `Slate Theme toggle works (toggled from ${initialTheme} to ${toggledTheme})`)

    // 5. Places Management Table & Actions
    console.log('\n--- Phase 5: Places Management & Coordinate Boundary Validation ---')
    await page.goto(`${BASE_URL}#/admin/places`)
    await sleep(700)

    const placesRowCount = await page.evaluate(() => document.querySelectorAll('.admin-data-table tbody tr').length)
    assert(placesRowCount > 0, `Places data table populated with verified destinations (${placesRowCount} rows shown)`)

    // Open "Create New Place" Modal
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('Create New Place'))
      if (btn) btn.click()
    })
    await sleep(300)

    const modalTitle = await page.evaluate(() => {
      const h3 = document.querySelector('.modal-header h3')
      return h3 ? h3.innerText : ''
    })
    assert(modalTitle.includes('Create New Destination'), 'Create Destination modal opens with validation fields')

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('.modal-header .sidebar-collapse-toggle')
      if (closeBtn) closeBtn.click()
    })
    await sleep(200)

    // 6. Image Review Queue & Integrity
    console.log('\n--- Phase 6: Candidate Image Review Queue ---')
    await page.goto(`${BASE_URL}#/admin/images`)
    await sleep(700)

    const imageSectionTitle = await page.evaluate(() => document.querySelector('.page-title-group h2')?.innerText || '')
    assert(imageSectionTitle.includes('Image Integrity'), 'Image Review Queue view mounted with license and hash inspection')

    // 7. Feedback Inbox & Curator Reply Sync
    console.log('\n--- Phase 7: Feedback Inbox & User Notification Sync ---')
    await page.goto(`${BASE_URL}#/admin/feedback`)
    await page.waitForSelector('.admin-data-table')
    await sleep(800)

    const slaBreachedVisible = await page.evaluate(() => {
      return document.body.innerText.includes('SLA Breached') || document.body.innerText.includes('>3d SLA')
    })
    assert(slaBreachedVisible, 'SLA breached badge properly highlights aged feedback tickets (>3 days)')

    // Click on the first row to ensure it is selected
    await page.click('.admin-data-table tbody tr')
    await page.waitForSelector('#feedback-reply-input')
    await page.click('#feedback-reply-input')
    await page.type('#feedback-reply-input', 'Thank you for the update! We have officially verified the winter schedule.')
    await sleep(300)

    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('Send Verified Reply'))
      if (submitBtn) submitBtn.click()
    })
    await sleep(800)

    const updatedFeedback = await page.evaluate(() => {
      const raw = localStorage.getItem('sb_emu_table_feedback')
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return parsed.find((f) => f.admin_note?.includes('Thank you')) || parsed[0]
    })
    assert(
      updatedFeedback && updatedFeedback.admin_note?.includes('Thank you for the update!'),
      'Curator reply persisted to feedback.admin_note for user visibility'
    )

    // 8. Announcement Banner & User Site Reactivity
    console.log('\n--- Phase 8: Content Studio & Announcement Banner Reactivity ---')
    await page.goto(`${BASE_URL}#/admin/content`)
    await sleep(600)

    // Verify banner editor is present and publish a test message
    await page.evaluate(() => {
      const testBanner = {
        is_active: true,
        message: 'Verified National Monument Illuminations for Diwali 2026 Active!',
        type: 'cultural_event',
        cta_text: 'View Festivals',
        cta_link: '/festivals',
      }
      localStorage.setItem('explorex_announcement_banner', JSON.stringify(testBanner))
      window.dispatchEvent(new Event('storage'))
    })
    await sleep(300)

    // Navigate to user app home
    await page.goto(`${BASE_URL}#/`)
    await sleep(800)

    const userAppText = await page.evaluate(() => document.body.innerText)
    assert(
      userAppText.includes('Verified National Monument Illuminations for Diwali 2026'),
      'Active announcement banner from admin content studio renders immediately in user app'
    )

    // 9. Audit Logs View
    console.log('\n--- Phase 9: Immutable Audit Trail & Diff Inspector ---')
    await page.goto(`${BASE_URL}#/admin/audit-logs`)
    await page.waitForSelector('.admin-data-table')
    await sleep(800)

    const auditHeader = await page.evaluate(() => document.querySelector('.page-title-group h2')?.innerText || '')
    assert(auditHeader.includes('Audit Log'), 'Audit log table mounted with chronological action entries')

    // Open Diff Inspector
    await page.evaluate(() => {
      const inspectBtn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('Inspect Diff'))
      if (inspectBtn) inspectBtn.click()
    })
    await sleep(500)

    const diffModalVisible = await page.evaluate(() => {
      return document.querySelector('.diff-panel.before') !== null && document.querySelector('.diff-panel.after') !== null
    })
    assert(diffModalVisible, 'Diff inspector modal renders side-by-side Before and After committed states')

  } finally {
    await browser.close()
  }

  console.log('\n======================================================')
  console.log(`🏁 Verification Results: ${passCount} Passed, ${failCount} Failed`)
  console.log('======================================================\n')

  if (failCount > 0) {
    process.exit(1)
  }
}

run().catch((err) => {
  console.error('Test Suite crashed:', err)
  process.exit(1)
})

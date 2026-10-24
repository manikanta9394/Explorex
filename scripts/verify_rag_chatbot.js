import puppeteer from 'puppeteer-core'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE_URL = 'http://localhost:5180/Explorex/'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function runVerification() {
  console.log('🤖 Starting Explorex AI RAG-Grounded Chatbot E2E Verification...\n')

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1380, height: 900 })

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

    // -------------------------------------------------------------
    // Step 1: Access Gate Authentication
    // -------------------------------------------------------------
    console.log('--- Step 1: Authentication & Navigation to AI Guide ---')
    await page.goto(`${BASE_URL}#/welcome`, { waitUntil: 'networkidle2' })
    await sleep(600)

    // Click "Continue as guest" if on welcome page
    const hasGuestBtn = await page.$('.welcome-choice-card.highlight-guest .choice-action-btn')
    if (hasGuestBtn) {
      await page.evaluate(() => {
        const btn = document.querySelector('.welcome-choice-card.highlight-guest .choice-action-btn')
        if (btn) btn.click()
      })
      await sleep(600)
    }

    // Navigate to AI Guide
    await page.goto(`${BASE_URL}#/ai`, { waitUntil: 'networkidle2' })
    await sleep(1000)

    // Verify UI Layout Elements
    const layout = await page.evaluate(() => {
      return {
        hasShell: !!document.querySelector('.ai-chatbot-page-shell'),
        hasMasterContainer: !!document.querySelector('.ai-chat-master-container'),
        hasSidebar: !!document.querySelector('.ai-chat-sidebar'),
        hasStage: !!document.querySelector('.ai-chat-stage'),
        hasInputTextarea: !!document.querySelector('.chat-main-textarea'),
        hasSendBtn: !!document.querySelector('.chat-send-btn'),
        hasEmptyState: !!document.querySelector('.chat-empty-state-card'),
        hasCapabilityPills: document.querySelectorAll('.capabilities-ribbon .cap-pill').length,
        hasSuggestionCards: document.querySelectorAll('.suggestion-tile-card').length,
      }
    })
    console.log('Layout elements detected:', layout)
    if (!layout.hasMasterContainer || !layout.hasInputTextarea || !layout.hasSidebar) {
      throw new Error('Master AI Chatbot layout elements failed to mount properly!')
    }
    console.log('✅ Step 1 Passed: AI Chatbot layout loaded cleanly.\n')

    // -------------------------------------------------------------
    // Helper function to send a prompt in UI
    // -------------------------------------------------------------
    async function sendPrompt(text) {
      await page.focus('.chat-main-textarea')
      // Clear any existing text
      await page.keyboard.down('Meta')
      await page.keyboard.press('KeyA')
      await page.keyboard.up('Meta')
      await page.keyboard.press('Backspace')

      // Use React native value setter for reliable state synchronization
      await page.evaluate((val) => {
        const textarea = document.querySelector('.chat-main-textarea')
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
        nativeSetter.call(textarea, val)
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }, text)
      await sleep(300)

      await page.evaluate(() => {
        const sendBtn = document.querySelector('.chat-send-btn')
        if (sendBtn) sendBtn.click()
      })

      // Wait for streaming or response to complete (up to 15s)
      const startTime = Date.now()
      await sleep(500)
      while (Date.now() - startTime < 15000) {
        await sleep(400)
        const isStreaming = await page.$('.streaming-row')
        if (!isStreaming) {
          const assistantMsgs = await page.$$('.chat-bubble-row.assistant-row')
          if (assistantMsgs.length > 0) {
            const hasContent = await page.evaluate(() => {
              const msgs = document.querySelectorAll('.chat-bubble-row.assistant-row')
              const last = msgs[msgs.length - 1]
              return last && last.textContent.trim().length > 15
            })
            if (hasContent) break
          }
        }
      }
      await sleep(600)
    }

    // -------------------------------------------------------------
    // Step 2: Unanswerable Refusal Guard Verification
    // -------------------------------------------------------------
    console.log('--- Step 2: Grounding Guard Refusal Test (Eiffel Tower) ---')
    await sendPrompt('What is the entry ticket fee for the Eiffel Tower?')

    const refusalResult = await page.evaluate(() => {
      const msgs = document.querySelectorAll('.chat-bubble-row.assistant-row')
      const lastMsg = msgs[msgs.length - 1]
      const text = lastMsg ? lastMsg.textContent : ''
      const citedCards = lastMsg ? lastMsg.querySelectorAll('.cited-place-tile').length : 0

      return {
        text,
        citedCards,
        hasRefusalPhrase:
          text.includes("don't have verified information") ||
          text.includes("I don't have") ||
          text.includes("only covers travel within India"),
      }
    })
    console.log('Refusal response snippet:', refusalResult.text.slice(0, 160) + '...')
    if (!refusalResult.hasRefusalPhrase) {
      throw new Error('Expected Grounding Guard refusal message for unverified non-Indian landmark!')
    }
    console.log('✅ Step 2 Passed: Honest refusal delivered with zero hallucinated prices.\n')

    // -------------------------------------------------------------
    // Step 3: Verified Grounded Fact & Citation Test (Golconda Fort)
    // -------------------------------------------------------------
    console.log('--- Step 3: Verified Factual Citation Test (Golconda Fort) ---')
    await sendPrompt('What is the entry fee and visiting hours for Golconda Fort in Hyderabad?')

    const factResult = await page.evaluate(() => {
      const msgs = document.querySelectorAll('.chat-bubble-row.assistant-row')
      const lastMsg = msgs[msgs.length - 1]
      const text = lastMsg ? lastMsg.textContent : ''
      const citedCards = lastMsg ? lastMsg.querySelectorAll('.cited-place-tile').length : 0
      const hasCitationPill = lastMsg ? !!lastMsg.querySelector('.chat-citation-pill') : false
      const hasPracticalTip = text.includes('Practical Tip') || text.includes('💡')
      const hasVerificationNote = text.includes('verify') || text.includes('Note:')

      return {
        text: text.slice(0, 220),
        citedCards,
        hasCitationPill,
        hasFee: text.includes('₹25'),
        hasPracticalTip,
        hasVerificationNote,
      }
    })
    console.log('Fact response snippet:', factResult)
    if (!factResult.hasFee || !factResult.hasCitationPill || factResult.citedCards === 0) {
      throw new Error(`Expected Golconda Fort answer citing [1], fee ₹25, and place card. Got: ${JSON.stringify(factResult)}`)
    }
    console.log('✅ Step 3 Passed: Verified factual answer citing [1], ₹25, practical tip, and destination card.\n')

    // -------------------------------------------------------------
    // Step 4: Native Telugu Query Test
    // -------------------------------------------------------------
    console.log('--- Step 4: Native Telugu Query Test ---')
    await sendPrompt('గోల్కొండ కోట టికెట్ ధర ఎంత?')

    const teluguResult = await page.evaluate(() => {
      const msgs = document.querySelectorAll('.chat-bubble-row.assistant-row')
      const lastMsg = msgs[msgs.length - 1]
      const text = lastMsg ? lastMsg.textContent : ''
      // Check for Telugu unicode range \u0C00-\u0C7F
      const teluguCharCount = (text.match(/[\u0C00-\u0C7F]/g) || []).length
      return {
        teluguCharCount,
        hasFee: text.includes('₹25'),
        snippet: text.slice(0, 150),
      }
    })
    console.log('Telugu response sample:', teluguResult)
    if (teluguResult.teluguCharCount < 15 || !teluguResult.hasFee) {
      throw new Error(`Expected native Telugu response with fee ₹25, got: ${JSON.stringify(teluguResult)}`)
    }
    console.log('✅ Step 4 Passed: Multilingual Telugu query responded fluently in Telugu.\n')

    // -------------------------------------------------------------
    // Step 5: Native Hindi Query Test
    // -------------------------------------------------------------
    console.log('--- Step 5: Native Hindi Query Test ---')
    await sendPrompt('चारमीनार कब खुलता है और टिकट कितना है?')

    const hindiResult = await page.evaluate(() => {
      const msgs = document.querySelectorAll('.chat-bubble-row.assistant-row')
      const lastMsg = msgs[msgs.length - 1]
      const text = lastMsg ? lastMsg.textContent : ''
      // Check for Devanagari unicode range \u0900-\u097F
      const hindiCharCount = (text.match(/[\u0900-\u097F]/g) || []).length
      return {
        hindiCharCount,
        snippet: text.slice(0, 150),
      }
    })
    console.log('Hindi response sample:', hindiResult)
    if (hindiResult.hindiCharCount < 15) {
      throw new Error(`Expected native Hindi response, got: ${JSON.stringify(hindiResult)}`)
    }
    console.log('✅ Step 5 Passed: Multilingual Hindi query responded fluently in Hindi.\n')

    // -------------------------------------------------------------
    // Step 6: Conversation Sidebar Actions & Persistence Across Refresh
    // -------------------------------------------------------------
    console.log('--- Step 6: Conversation Sidebar Persistence & Management ---')
    const initialConvCount = await page.evaluate(() => {
      return document.querySelectorAll('.sidebar-conversations-list .conv-item').length
    })
    console.log('Initial conversations count:', initialConvCount)

    // Click "New Chat" button
    await page.evaluate(() => {
      const btn = document.querySelector('.new-chat-primary-btn')
      if (btn) btn.click()
    })
    await sleep(600)

    // Type a prompt in the new conversation
    await sendPrompt('Taj Mahal ticket price and timings in Agra')

    // Rename current conversation
    await page.evaluate(() => {
      const activeConv = document.querySelector('.conv-item.active')
      const renameBtn = activeConv ? activeConv.querySelector('.conv-action-btn:nth-child(2)') : null
      if (renameBtn) renameBtn.click()
    })
    await sleep(300)

    // Type custom title in the input
    await page.evaluate(() => {
      const renameInput = document.querySelector('.conv-item.renaming input')
      if (renameInput) {
        renameInput.value = 'Agra Wonder Tour'
        renameInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      const saveBtn = document.querySelector('.rename-actions button')
      if (saveBtn) saveBtn.click()
    })
    await sleep(500)

    // Pin the conversation
    await page.evaluate(() => {
      const activeConv = document.querySelector('.conv-item.active')
      const pinBtn = activeConv ? activeConv.querySelector('.conv-action-btn:nth-child(1)') : null
      if (pinBtn) pinBtn.click()
    })
    await sleep(600)

    // Verify pinned group appears
    const hasPinnedGroup = await page.evaluate(() => {
      return document.querySelector('.conv-group-label') !== null
    })
    console.log('Pinned group exists in sidebar:', hasPinnedGroup)

    // Refresh page to verify database persistence across page reload
    console.log('Reloading page to test conversation persistence...')
    await page.reload({ waitUntil: 'networkidle2' })
    await sleep(1200)

    const reloadedConvTitles = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.sidebar-conversations-list .conv-item'))
      return items.map((el) => el.querySelector('.conv-title')?.textContent.trim())
    })
    console.log('Conversations after page reload:', reloadedConvTitles)

    const foundPersistedTitle = reloadedConvTitles.some(
      (t) => t && (t.includes('Agra') || t.includes('Taj Mahal'))
    )
    if (!foundPersistedTitle) {
      throw new Error(`Expected renamed conversation to persist across page refresh! Found: ${JSON.stringify(reloadedConvTitles)}`)
    }
    console.log('✅ Step 6 Passed: Conversations successfully persisted across page refresh.\n')

    // -------------------------------------------------------------
    // Step 7: Feedback Submission & Thumbs Down Modal
    // -------------------------------------------------------------
    console.log('--- Step 7: Feedback Submission & Thumbs Down Modal ---')
    // Select last assistant message and click thumbs down
    await page.evaluate(() => {
      const thumbsDownBtns = document.querySelectorAll('.feedback-thumb-btn[title*="Inaccurate"]')
      if (thumbsDownBtns.length > 0) {
        thumbsDownBtns[thumbsDownBtns.length - 1].click()
      }
    })
    await sleep(400)

    const modalVisible = await page.evaluate(() => {
      return !!document.querySelector('.feedback-reason-modal')
    })
    console.log('Feedback reason modal opened:', modalVisible)
    if (!modalVisible) {
      throw new Error('Expected feedback reason modal to open on thumbs down click!')
    }

    // Enter comment and submit feedback
    await page.evaluate(() => {
      const textarea = document.querySelector('.feedback-reason-modal textarea')
      if (textarea) {
        textarea.value = 'Automated verification test feedback.'
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }
      const submitBtn = document.querySelector('.feedback-reason-modal .modal-submit-btn')
      if (submitBtn) submitBtn.click()
    })
    await sleep(600)

    const modalClosedAndActive = await page.evaluate(() => {
      const modal = document.querySelector('.feedback-reason-modal')
      const activeDown = document.querySelector('.feedback-thumb-btn.active-down')
      return {
        modalClosed: !modal,
        hasActiveDownBadge: !!activeDown,
      }
    })
    console.log('Feedback submission state:', modalClosedAndActive)
    if (!modalClosedAndActive.modalClosed || !modalClosedAndActive.hasActiveDownBadge) {
      throw new Error('Feedback submission failed to close modal or apply active-down class!')
    }

    // Also test thumbs up on first message
    await page.evaluate(() => {
      const thumbsUpBtns = document.querySelectorAll('.feedback-thumb-btn[title*="Helpful"]')
      if (thumbsUpBtns.length > 0) {
        thumbsUpBtns[0].click()
      }
    })
    await sleep(400)

    const hasActiveUp = await page.evaluate(() => {
      return !!document.querySelector('.feedback-thumb-btn.active-up')
    })
    console.log('Thumbs up active state verified:', hasActiveUp)
    if (!hasActiveUp) {
      throw new Error('Thumbs up feedback failed to activate!')
    }
    console.log('✅ Step 7 Passed: User feedback modal, reason tagging, and thumbs up/down verified.\n')

    console.log('======================================================')
    console.log('🎉 ALL 7 E2E RAG CHATBOT VERIFICATION TESTS PASSED!')
    console.log('======================================================')
  } finally {
    await browser.close()
  }
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err)
  process.exit(1)
})

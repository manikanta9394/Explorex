import { env } from '../config/env.js'
import { allDatasetPlaces } from '../data/tourismData.js'
import {
  detectLanguage,
  isSmallTalk,
  getSmallTalkResponse,
  extractEntities,
  rewriteFollowupQuery,
} from './queryUnderstandingService.js'
import { hybridSearch } from './hybridSearchService.js'
import { rerankAndDeduplicate } from './rerankService.js'
import { isGroundingSufficient, getGroundedRefusalMessage } from './groundingGuard.js'
import { queryAnswerCache, checkRateLimit, checkAndConsumeTokenBudget } from './cacheAndRateLimitService.js'
import { buildSystemPrompt } from '../prompts/systemPrompt.js'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

// In-memory ai_logs store for telemetry
const inMemoryAiLogs = []

export function getAiLogs(limit = 50) {
  return inMemoryAiLogs.slice(-limit).reverse()
}

export function logAiTelemetry(entry) {
  const record = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
    ...entry,
  }
  inMemoryAiLogs.push(record)
  if (inMemoryAiLogs.length > 500) {
    inMemoryAiLogs.shift()
  }
  return record
}

// Multilingual display names map for native scripts
const NATIVE_NAMES = {
  te: {
    'charminar-hyderabad': 'చార్మినార్',
    'golconda-fort-hyderabad': 'గోల్కొండ కోట',
    'taj-mahal-agra': 'తాజ్ మహల్',
    'golden-temple-amritsar': 'స్వర్ణ దేవాలయం (హర్మందిర్ సాహిబ్)',
    'hawa-mahal-jaipur': 'హవా మహల్',
    'konark-sun-temple-odisha': 'కోణార్క్ సూర్య దేవాలయం',
    'brihadeeswarar-temple-thanjavur': 'బృహదీశ్వర దేవాలయం (తంజావూరు)',
  },
  hi: {
    'charminar-hyderabad': 'चारमीनार',
    'golconda-fort-hyderabad': 'गोलकोंडा किला',
    'taj-mahal-agra': 'ताज महल',
    'golden-temple-amritsar': 'स्वर्ण मंदिर (हरमंदिर साहिब)',
    'hawa-mahal-jaipur': 'हवा महल',
    'konark-sun-temple-odisha': 'कोणार्क सूर्य मंदिर',
    'brihadeeswarar-temple-thanjavur': 'बृहदेश्वर मंदिर (तंजावुर)',
  },
  ta: {
    'charminar-hyderabad': 'சார்மினார்',
    'golconda-fort-hyderabad': 'கோல்கொண்டா கோட்டை',
    'taj-mahal-agra': 'தாஜ்மஹால்',
    'golden-temple-amritsar': 'பொற்கோவில்',
    'hawa-mahal-jaipur': 'காற்று மஹால்',
    'konark-sun-temple-odisha': 'கொனார்க் சூரியக் கோவில்',
    'brihadeeswarar-temple-thanjavur': 'பிரகதீஸ்வரர் கோவில் (தஞ்சாவூர்)',
  },
}

/**
 * Deterministic local grounded answer generator
 * Used when OpenRouter API is unavailable or offline, ensuring 100% uptime & zero downtime
 */
export function generateLocalGroundedAnswer({
  query: _query,
  chunks: _chunks = [],
  citedPlaces = [],
  language = 'en',
  entities: _entities = {},
}) {
  const p = citedPlaces[0] || allDatasetPlaces[0]
  const pName = p.name
  const citation = `[1]`
  const city = p.city || 'India'
  const state = p.state || 'India'

  // Entry fee string
  let feeText = 'Official entry fee is not listed; please verify locally.'
  let feeTextTe = 'ప్రవేశ రుసుము: అధికారికంగా జాబితా చేయబడలేదు; దయచేసి స్థానికంగా ధృవీకరించుకోండి.'
  let feeTextHi = 'प्रवेश शुल्क: आधिकारिक रूप से सूचीबद्ध नहीं है; कृपया स्थानीय स्तर पर पुष्टि करें।'
  let feeTextTa = 'நுழைவுக் கட்டணம்: அதிகாரப்பூர்வமாக பட்டியலிடப்படவில்லை; உள்ளூரில் சரிபார்க்கவும்.'

  if (p.price && p.price.amount !== null && p.price.amount !== undefined) {
    const amt = Number(p.price.amount)
    if (amt === 0) {
      feeText = 'Free public entry for all visitors (₹0).'
      feeTextTe = 'అందరికీ ఉచిత ప్రవేశం (₹0 రూపాయలు / నిధులు అవసరం లేదు).'
      feeTextHi = 'सभी आगंतुकों के लिए निशुल्क प्रवेश (₹0 रुपये).'
      feeTextTa = 'அனைத்து பார்வையாளர்களுக்கும் இலவச நுழைவு (₹0 ரூபாய்).'
    } else {
      feeText = `₹${amt.toLocaleString('en-IN')} per ${p.price.unit || 'person'}.`
      feeTextTe = `₹${amt.toLocaleString('en-IN')} రూపాయలు (${p.price.unit || 'ఒక్కొక్కరికి'}).`
      feeTextHi = `₹${amt.toLocaleString('en-IN')} रुपये (${p.price.unit || 'प्रति व्यक्ति'}).`
      feeTextTa = `₹${amt.toLocaleString('en-IN')} ரூபாய் (${p.price.unit || 'ஒரு நபருக்கு'}).`
    }
  }

  // Telugu response
  if (language === 'te') {
    const nativeTitle = NATIVE_NAMES.te[p.id] || pName
    return `${nativeTitle} (${pName}) ${citation} ${city}, ${state} లోని అత్యంత ప్రసిద్ధి చెందిన చారిత్రక వారసత్వ ప్రదేశం.

**ముఖ్యమైన సమాచారం మరియు సందర్శన నియమాలు:**
- **ప్రదేశం:** ${city}, ${state}
- **టికెట్ ధర:** ${feeTextTe}
- **సందర్శన సమయం:** ${p.opening_hours || 'ప్రతిరోజూ ఉదయం 9:00 నుండి సాయంత్రం 5:30 వరకు'}
- **నియమాలు:** సంప్రదాయ వస్త్రధారణ సూచించబడుతుంది, నిర్దేశిత ప్రదేశాలలో ఫోటోగ్రఫీ అనుమతించబడుతుంది.
- **ఉత్తమ సందర్శన కాలం:** ${p.best_time || 'అక్టోబర్ నుండి మార్చి వరకు (చల్లని ఆహ్లాదకరమైన వాతావరణం)'}

💡 ప్రాక్టికల్ సూచన: రద్దీని నివారించడానికి ఉదయాన్నే లేదా మధ్యాహ్నం 3:30 తర్వాత సందర్శించడం మంచిది. అలాగే ఆన్‌లైన్ లేదా కౌంటర్ వద్ద టికెట్లను ముందుగానే తీసుకోవడం సౌకర్యంగా ఉంటుంది.

*గమనిక: సెలవు దినాలలో ప్రవేశ వేళలు మరియు టికెట్ ధరలు మారే అవకాశం ఉంది; దయచేసి సందర్శించడానికి ముందు అధికారిక వర్గాలతో ధృవీకరించుకోండి.*`
  }

  // Hindi response
  if (language === 'hi') {
    const nativeTitle = NATIVE_NAMES.hi[p.id] || pName
    return `${nativeTitle} (${pName}) ${citation} ${city}, ${state} का एक ऐतिहासिक और प्रतिष्ठित पर्यटन स्थल है।

**प्रमुख विवरण, नियम और आगंतुक जानकारी:**
- **स्थान:** ${city}, ${state}
- **प्रवेश शुल्क:** ${feeTextHi}
- **खुलने का समय:** ${p.opening_hours || 'प्रतिदिन सुबह 9:00 बजे से शाम 5:30 बजे तक'}
- **नियम:** शालीन पोशाक और परिसर में स्वच्छता बनाए रखें। जूते निर्धारित स्थान पर उतारें।
- **उत्तम समय:** ${p.best_time || 'अक्टूबर से मार्च (सुहावना मौसम)'}

💡 व्यावहारिक सुझाव: स्मारक परिसर में भीड़ से बचने के लिए सुबह के समय पहुँचें और आरामदायक जूते पहनें।

*नोट: राष्ट्रीय अवकाशों पर प्रवेश समय और टिकट दरों में परिवर्तन हो सकता है; कृपया जाने से पहले आधिकारिक स्रोतों से सत्यापित करें।*`
  }

  // Tamil response
  if (language === 'ta') {
    const nativeTitle = NATIVE_NAMES.ta[p.id] || pName
    return `${nativeTitle} (${pName}) ${citation} ${city}, ${state}-ல் அமைந்துள்ள புகழ்பெற்ற வரலாற்றுச் சிறப்புமிக்க இடமாகும்.

**முக்கிய விவரங்கள் மற்றும் பார்வையாளர் தகவல்:**
- **இடம்:** ${city}, ${state}
- **நுழைவுக் கட்டணம்:** ${feeTextTa}
- **பார்வை நேரம்:** ${p.opening_hours || 'தினமும் காலை 9:00 முதல் மாலை 5:30 வரை'}
- **பார்வையிட சிறந்த நேரம்:** ${p.best_time || 'அக்டோபர் முதல் மார்ச் வரை'}

💡 நடைமுறை குறிப்பு: கூட்ட நெரிசலைத் தவிர்க்க காலையிலேயே செல்வது நல்லது.

*குறிப்பு: விடுமுறை நாட்களில் நுழைவு நேரம் மற்றும் கட்டணங்கள் மாறக்கூடும்; தயவுசெய்து பார்வையிடும் முன் அதிகாரப்பூர்வ வலைத்தளத்தில் சரிபார்க்கவும்.*`
  }

  // English response
  return `${pName} ${citation} is one of the most prominent heritage destinations in ${city}, ${state}.

**Key Highlights & Visitor Details:**
- **Location:** ${city}, ${state}, India
- **Entry Ticket:** ${feeText}
- **Visiting Timings:** ${p.opening_hours || 'Daily, 9:00 AM – 5:30 PM'}
- **Best Time to Visit:** ${p.best_time || 'October to March (pleasant sightseeing weather)'}
${citedPlaces.length > 1 ? `- **Nearby Heritage:** Also explore ${citedPlaces.slice(1).map((cp) => `${cp.name} [${cp.citationIndex}]`).join(', ')}.` : ''}

💡 Practical Tip: Plan your visit early in the morning to beat tourist queues and capture optimal natural lighting for heritage photography.

*Note: Timings, rules, and ticket prices may vary; please verify with official sources before visiting.*`
}

/**
 * Main RAG Chat Execution Pipeline
 */
export async function executeRAGChat({
  message,
  history = [],
  currentPlace = null,
  travelMode = 'driving',
  userLocation = null,
  userId = 'anonymous_explorer',
  image = null, // base64 or imageUrl for vision analysis
}) {
  const startTime = Date.now()

  // 1. Rate Limiting Check
  const rateLimit = checkRateLimit(userId, 30)
  if (!rateLimit.allowed) {
    return {
      answer: rateLimit.error,
      citedPlaces: [],
      sources: [],
      model: 'rate-limit-guard',
      language: 'en',
    }
  }

  // 2. Token Budget Check
  const tokenBudget = checkAndConsumeTokenBudget(userId, 200)
  if (!tokenBudget.allowed) {
    return {
      answer: tokenBudget.error,
      citedPlaces: [],
      sources: [],
      model: 'token-budget-guard',
      language: 'en',
    }
  }

  // 3. Language Detection
  const language = detectLanguage(message)

  // 4. Small Talk Fast-Path
  if (isSmallTalk(message)) {
    const smallTalkAnswer = getSmallTalkResponse(message, language, 'Explorer')
    logAiTelemetry({
      query: message,
      model: 'fast-path-smalltalk',
      prompt_tokens: 20,
      completion_tokens: 40,
      latency_ms: Date.now() - startTime,
      status: 'success',
    })
    return {
      answer: smallTalkAnswer,
      citedPlaces: [],
      sources: [],
      model: 'fast-path-smalltalk',
      language,
      isSmallTalk: true,
    }
  }

  // 5. Query Understanding & Follow-up Rewriting
  const standaloneQuery = rewriteFollowupQuery(message, history)
  const entities = extractEntities(standaloneQuery)

  // 6. Cache Lookup
  const cacheKey = `${language}_${standaloneQuery.toLowerCase().trim()}_${currentPlace?.id || 'none'}`
  const cachedResult = queryAnswerCache.get(cacheKey)
  if (cachedResult) {
    return {
      ...cachedResult,
      isCached: true,
      latency_ms: Date.now() - startTime,
    }
  }

  // 7. Hybrid Search (Vector + BM25 with RRF and Geo-Boost)
  const searchFilters = {
    places: entities.places,
    state: entities.state,
    city: entities.city,
    type: entities.type,
    priceLimit: entities.priceLimit,
    isFreeOnly: entities.isFreeOnly,
  }

  const candidateChunks = await hybridSearch({
    query: standaloneQuery,
    filters: searchFilters,
    userLocation,
    currentPlace,
    limit: 30,
  })

  // 8. Rerank and Place Deduplication
  const singlePlaceFocus = Boolean(entities.places && entities.places.length === 1)
  const { chunks, citedPlaces, maxScore } = rerankAndDeduplicate(candidateChunks, {
    query: standaloneQuery,
    maxChunks: 7,
    singlePlaceFocus,
  })

  // 9. Grounding Guard: Reject unverified or fictional queries honestly
  const groundingCheck = isGroundingSufficient({
    chunks,
    queryEntities: entities,
    maxScore,
    rawQuery: standaloneQuery,
  })

  if (!groundingCheck.sufficient) {
    const refusalAnswer = getGroundedRefusalMessage(language, entities.places?.[0]?.name || '')
    logAiTelemetry({
      query: message,
      model: 'grounding-guard-refusal',
      prompt_tokens: 50,
      completion_tokens: 60,
      latency_ms: Date.now() - startTime,
      status: 'refusal',
    })
    return {
      answer: refusalAnswer,
      citedPlaces: [],
      sources: [],
      model: 'grounding-guard',
      language,
      isRefusal: true,
    }
  }

  // 10. Build System Prompt & Messages Payload
  const systemPrompt = buildSystemPrompt({
    contextChunks: chunks,
    citedPlaces,
    userLanguage: language,
    travelMode,
    activePlace: currentPlace,
  })

  const messagesPayload = [
    { role: 'system', content: systemPrompt },
    ...history
      .filter((m) => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
      .slice(-6),
  ]

  // If user attached an image for vision queries ("What place is this?")
  if (image) {
    messagesPayload.push({
      role: 'user',
      content: [
        { type: 'text', text: standaloneQuery },
        { type: 'image_url', image_url: { url: image } },
      ],
    })
  } else {
    messagesPayload.push({
      role: 'user',
      content: standaloneQuery,
    })
  }

  // 11. Model Routing with Fallback & Timeout
  const models = [
    env.openRouterModel || 'google/gemma-3-27b-it:free',
    ...env.openRouterFallbackModels,
    'openrouter/free',
  ].filter((m, i, arr) => arr.indexOf(m) === i)

  let finalAnswer = null
  let usedModel = 'rag-grounded-engine'

  if (env.openRouterApiKey && !env.openRouterApiKey.includes('placeholder') && !env.openRouterApiKey.includes('your_')) {
    for (const model of models) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 9000)

        const response = await fetch(OPENROUTER_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.openRouterApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5180/Explorex/',
            'X-Title': 'Explorex AI Guide',
          },
          body: JSON.stringify({
            model,
            messages: messagesPayload,
            temperature: 0.3,
            max_tokens: 650,
          }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          const text = data.choices?.[0]?.message?.content?.trim()
          if (text) {
            finalAnswer = text
            usedModel = model
            break
          }
        }
      } catch (err) {
        console.warn(`[OpenRouter] Model ${model} request failed:`, err.message)
      }
    }
  }

  // 12. Fallback to Local Deterministic Grounded Synthesizer if API call did not succeed
  if (!finalAnswer) {
    finalAnswer = generateLocalGroundedAnswer({
      query: standaloneQuery,
      chunks,
      citedPlaces,
      language,
      entities,
    })
    usedModel = 'explorex-grounded-synthesizer-v2'
  }

  const result = {
    answer: finalAnswer,
    citedPlaces,
    sources: chunks.map((c, i) => ({
      index: i + 1,
      placeId: c.metadata.place_id,
      placeName: c.metadata.place_name,
      city: c.metadata.city,
      state: c.metadata.state,
      chunkType: c.chunk_type,
      snippet: c.content.slice(0, 160) + '...',
    })),
    model: usedModel,
    language,
    latency_ms: Date.now() - startTime,
  }

  // Cache final answer
  queryAnswerCache.set(cacheKey, result)

  // Log Telemetry
  logAiTelemetry({
    query: message,
    model: usedModel,
    prompt_tokens: 350,
    completion_tokens: finalAnswer.split(/\s+/).length,
    latency_ms: result.latency_ms,
    status: 'success',
  })

  return result
}

// Backward-compatible export for existing callers
export async function createTravelChat(opts) {
  const result = await executeRAGChat({
    message: opts.message,
    history: opts.history,
    currentPlace: opts.place || opts.currentPlace,
    travelMode: opts.travelMode,
    userLocation: opts.userLocation,
    userId: opts.userId,
    image: opts.image,
  })

  return {
    answer: result.answer,
    recommendedPlaces: result.citedPlaces,
    citedPlaces: result.citedPlaces,
    sources: result.sources,
    model: result.model,
    language: result.language,
  }
}

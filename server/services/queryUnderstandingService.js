import { allDatasetPlaces } from '../data/tourismData.js'

/**
 * Detect language of query:
 * Returns 'te' (Telugu), 'hi' (Hindi), 'ta' (Tamil), or 'en' (English default)
 */
export function detectLanguage(text) {
  if (!text || typeof text !== 'string') return 'en'

  // Script detection via Unicode ranges
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te' // Telugu
  if (/[\u0900-\u097F]/.test(text)) return 'hi' // Devanagari / Hindi
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta' // Tamil
  if (/[\u0980-\u09FF]/.test(text)) return 'bn' // Bengali

  // Romanized common greeting / phrasing checks
  const lower = text.toLowerCase()
  if (/\b(namaskaram|namaskara|namasthe|meeru|ela unnaru|dabbulu|entha|choodandi)\b/.test(lower)) return 'te'
  if (/\b(namaste|kya|kitna|kaise|kahan|hai|shukriya|dhanyavaad|batao)\b/.test(lower)) return 'hi'
  if (/\b(vanakkam|eppadi|irukkinga|nandri|enga)\b/.test(lower)) return 'ta'

  return 'en'
}

/**
 * Known Indian States and Popular Cities map for entity matching
 */
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
  'Chandigarh', 'Andaman & Nicobar', 'Dadra & Nagar Haveli and Daman & Diu', 'Lakshadweep'
]

const POPULAR_CITIES = [
  'Hyderabad', 'Warangal', 'Nizamabad', 'Agra', 'Jaipur', 'Udaipur', 'Jodhpur',
  'Mumbai', 'Pune', 'Amritsar', 'New Delhi', 'Delhi', 'Chennai', 'Madurai', 'Thanjavur',
  'Kolkata', 'Bengaluru', 'Mysuru', 'Kochi', 'Trivandrum', 'Shimla', 'Manali',
  'Srinagar', 'Leh', 'Varanasi', 'Bhubaneswar', 'Puri', 'Panaji', 'Ahmedabad'
]

/**
 * Check if the user query is small talk (hi, bye, thanks, who are you)
 */
export function isSmallTalk(text) {
  if (!text || typeof text !== 'string') return false
  const trimmed = text.trim().toLowerCase().replace(/[?!.,]/g, '')

  const smallTalkPatterns = [
    /^(hi|hello|hey|hola|greetings|good morning|good afternoon|good evening|good night)$/,
    /^(namaste|namaskar|namaskaram|vanakkam|నమస్కారం|नमस्ते|வணக்கம்)$/,
    /^(thanks|thank you|thx|dhanyavad|shukriya|nandri|ధన్యవాదాలు|धन्यवाद)$/,
    /^(bye|goodbye|see you|cya|tata|अलविदा)$/,
    /^(who are you|what are you|what can you do|help me|tell me about yourself|నువ్వు ఎవరు|तुम कौन हो)$/,
    /^(how are you|how do you do|ela unnaru|kaise ho|ఎలా ఉన్నారు|कैसे हैं)$/,
  ]

  return smallTalkPatterns.some((pattern) => pattern.test(trimmed))
}

/**
 * Fast-path response generator for small talk
 */
export function getSmallTalkResponse(text, userLanguage = 'en', profileName = 'Traveler') {
  const lang = detectLanguage(text) || userLanguage || 'en'
  const trimmed = text.trim().toLowerCase().replace(/[?!.,]/g, '')

  if (lang === 'te') {
    if (/నమస్కారం|namaskaram|hi|hello/.test(trimmed)) {
      return `నమస్కారం ${profileName}! Explorex కు స్వాగతం. భారతదేశం అంతటా గల చారిత్రక కట్టడాలు, దేవాలయాలు, పర్యాటక ప్రదేశాల సమాచారం మరియు ప్రయాణ ప్రణాళికలలో మీకు సహాయం చేయడానికి నేను సిద్ధంగా ఉన్నాను. ఈ రోజు మనం ఎక్కడికి వెళ్దాం?`
    }
    if (/ధన్యవాదాలు|thanks|thank you/.test(trimmed)) {
      return `ధన్యవాదాలు ${profileName}! మీకు సహాయం చేయడం నాకు చాలా సంతోషం. మీకు ఏవైనా సందేహాలు ఉంటే నన్ను ఎప్పుడైనా అడగవచ్చు.`
    }
    if (/నువ్వు ఎవరు|who are you|what can you do/.test(trimmed)) {
      return `నేను Explorex AI పర్యాటక సహాయకుడిని. భారతదేశంలోని అన్ని 36 రాష్ట్రాలు మరియు కేంద్రపాలిత ప్రాంతాల వారసత్వ ప్రదేశాలు, ఖచ్చితమైన టికెట్ ధరలు, ప్రవేశ సమయాలు మరియు ప్రయాణ ప్రణాళికలపై నేను ఖచ్చితమైన మార్గదర్శకత్వం అందిస్తాను.`
    }
    return `నమస్కారం ${profileName}! నేను మీకు ఎలా సహాయపడగలను? ఏదైనా భారతీయ పర్యాటక ప్రదేశం లేదా ప్రయాణ ప్రణాళిక గురించి అడగండి.`
  }

  if (lang === 'hi') {
    if (/नमस्ते|namaste|hi|hello/.test(trimmed)) {
      return `नमस्ते ${profileName}! Explorex में आपका स्वागत है। मैं भारत भर के ऐतिहासिक स्मारकों, मंदिरों, दर्शनीय स्थलों के वास्तविक टिकट शुल्क, समय और यात्रा योजनाओं में आपकी सहायता करने के लिए यहाँ हूँ। आज हम कहाँ की यात्रा कर रहे हैं?`
    }
    if (/धन्यवाद|shukriya|thanks|thank you/.test(trimmed)) {
      return `धन्यवाद ${profileName}! आपकी सहायता करके मुझे बहुत खुशी हुई। यदि आपकी कोई और यात्रा संबंधी जिज्ञासा है, तो बेझिझक पूछें!`
    }
    if (/तुम कौन हो|who are you|what can you do/.test(trimmed)) {
      return `मैं Explorex AI यात्रा मार्गदर्शक हूँ। मैं भारत के सभी 36 राज्यों और केंद्र शासित प्रदेशों के प्रमाणित पर्यटन स्थलों, प्रवेश शुल्क, समय और यात्रा मार्गों की सटीक जानकारी प्रदान करता हूँ।`
    }
    return `नमस्ते ${profileName}! मैं आपकी किस प्रकार सहायता कर सकता हूँ? किसी भी पर्यटन स्थल या बजट यात्रा के बारे में पूछें।`
  }

  // English default
  if (/thanks|thank you|thx/.test(trimmed)) {
    return `You're very welcome, ${profileName}! It's a pleasure to help you explore India. Let me know whenever you're ready for your next adventure or query!`
  }
  if (/bye|goodbye|see you/.test(trimmed)) {
    return `Goodbye, ${profileName}! Safe travels across India, and happy exploring! Reach out whenever you need verified heritage insights.`
  }
  if (/who are you|what can you do/.test(trimmed)) {
    return `I am Explorex AI, your verified travel companion for all 36 States and Union Territories of India. I provide authentic visiting rules, official entry fees in ₹, seasonal travel recommendations, nearby stays/dining, and customized multi-day itineraries grounded strictly in verified tourism data.`
  }
  return `Hello ${profileName}! Welcome to Explorex. Where in India would you like to explore today? Ask me about monuments, entry tickets, itineraries, or nearby destinations.`
}

/**
 * Extract entities from text
 */
export function extractEntities(text) {
  if (!text || typeof text !== 'string') return {}

  const lower = text.toLowerCase()
  const entities = {
    places: [],
    state: null,
    city: null,
    type: null, // 'attraction' | 'stay' | 'food'
    priceLimit: null,
    isFreeOnly: false,
    days: null,
    isOpenNow: false,
  }

  // Detect state
  for (const st of INDIAN_STATES) {
    if (lower.includes(st.toLowerCase())) {
      entities.state = st
      break
    }
  }

  // Detect city (English & Native Scripts)
  const cityAliases = [
    { name: 'Hyderabad', keywords: ['hyderabad', 'హైదరాబాద్', 'हैदराबाद', 'ஹைதராபாத்'] },
    { name: 'Agra', keywords: ['agra', 'ఆగ్రా', 'आगरा', 'ஆக்ரா'] },
    { name: 'Jaipur', keywords: ['jaipur', 'జైపూర్', 'जयपुर', 'ஜெய்ப்பூர்'] },
    { name: 'Amritsar', keywords: ['amritsar', 'అమృత్‌సర్', 'अमृतसर', 'அமிர்தசரஸ்'] },
    { name: 'Thanjavur', keywords: ['thanjavur', 'తంజావూరు', 'तंजावुर', 'தஞ்சாவூர்'] },
    { name: 'Madurai', keywords: ['madurai', 'మదురై', 'मदुरै', 'மதுரை'] },
    { name: 'Delhi', keywords: ['delhi', 'new delhi', 'ఢిల్లీ', 'दिल्ली', 'டெல்லி'] },
    { name: 'Mumbai', keywords: ['mumbai', 'ముంబై', 'मुंबई', 'மும்பை'] },
  ]

  for (const item of cityAliases) {
    if (item.keywords.some((kw) => text.toLowerCase().includes(kw))) {
      entities.city = item.name
      break
    }
  }

  if (!entities.city) {
    for (const ct of POPULAR_CITIES) {
      if (lower.includes(ct.toLowerCase())) {
        entities.city = ct
        break
      }
    }
  }

  // Detect type
  if (/\b(hotel|resort|stay|accommodation|lodge|homestay|room)\b/.test(lower)) {
    entities.type = 'stay'
  } else if (/\b(food|restaurant|dining|biryani|cafe|breakfast|lunch|dinner|eat|dishes)\b/.test(lower)) {
    entities.type = 'food'
  } else if (/\b(monument|temple|fort|palace|museum|attraction|beach|lake|falls|park|sightseeing)\b/.test(lower)) {
    entities.type = 'attraction'
  }

  // Detect free entry
  if (/\b(free|free entry|zero cost|no fee|bina paise)\b/.test(lower)) {
    entities.isFreeOnly = true
    entities.priceLimit = 0
  }

  // Detect budget limit in INR
  const budgetMatch = text.match(/(?:under|below|budget of|within|less than|₹|rs\.?|inr)\s*(\d{2,6})/i)
  if (budgetMatch && budgetMatch[1]) {
    entities.priceLimit = parseInt(budgetMatch[1], 10)
  }

  // Detect number of days
  const daysMatch = text.match(/(\d+)\s*(?:day|days|दिन|రోజులు)/i)
  if (daysMatch && daysMatch[1]) {
    entities.days = parseInt(daysMatch[1], 10)
  }

  // Detect "open now"
  if (/\b(open now|today|right now|currently open)\b/.test(lower)) {
    entities.isOpenNow = true
  }

  // Extract place names from dataset (English + Aliases)
  const placeMatches = []
  const seenPlaceIds = new Set()

  const GENERIC_EXCLUDED_TOKENS = [
    'temple', 'palace', 'monument', 'valley', 'resort', 'hotel', 'beach',
    'mahal', 'fort', 'tomb', 'caves', 'waterfalls', 'lake', 'falls', 'garden',
    'houseboats', 'point', 'complex', 'hill', 'trail', 'promenade'
  ]

  // Priority 1: Check regional script place keywords (Telugu, Hindi, Tamil)
  const regionalKeywords = [
    { id: 'charminar-hyderabad', keywords: ['చార్మినార్', 'चारमीनार', 'சார்மினார்'] },
    { id: 'golconda-fort-hyderabad', keywords: ['గోల్కొండ', 'गोलकोंडा', 'கோல்கொண்டா'] },
    { id: 'taj-mahal-agra', keywords: ['తాజ్ మహల్', 'ताज महल', 'தாஜ்மஹால்'] },
    { id: 'golden-temple-amritsar', keywords: ['స్వర్ణ దేవాలయం', 'स्वर्ण मंदिर', 'హర్మందిర్', 'பொற்கோவில்'] },
    { id: 'hawa-mahal-jaipur', keywords: ['హవా మహల్', 'हवा महल', 'காற்று மஹால்'] },
    { id: 'konark-sun-temple-odisha', keywords: ['కోణార్క్', 'कोणार्क', 'கொனார்க்'] },
    { id: 'brihadeeswarar-temple-thanjavur', keywords: ['బృహదీశ్వర', 'बृहदेश्वर', 'பிரகதீஸ்வரர்', 'తంజావూరు', 'தஞ்சாவூர்'] },
    { id: 'qutub-minar-delhi', keywords: ['కుతుబ్ మినార్', 'क़ुतुब मीनार', 'குதுப் மினார்'] },
    { id: 'gateway-of-india-mumbai', keywords: ['గేట్‌వే ఆఫ్ ఇండియా', 'गेटवे ऑफ़ इंडिया', 'நுழைவு வாயில்'] },
    { id: 'red-fort-delhi', keywords: ['ఎర్రకోట', 'लाल किला', 'செங்கோட்டை'] },
    { id: 'amber-fort-jaipur', keywords: ['అంబర్ కోట', 'आमेर', 'ஆம்பர்'] },
    { id: 'meenakshi-amman-temple-madurai', keywords: ['మీనాక్షి', 'मीनाक्षी', 'மீனாட்சி'] },
  ]

  for (const item of regionalKeywords) {
    if (item.keywords.some((kw) => text.includes(kw))) {
      const match = allDatasetPlaces.find((p) => p.id === item.id)
      if (match && !seenPlaceIds.has(match.id)) {
        seenPlaceIds.add(match.id)
        placeMatches.push(match)
      }
    }
  }

  // Priority 2: Check full exact place name in query
  for (const p of allDatasetPlaces) {
    if (!p.name) continue
    const pNameLower = p.name.toLowerCase()
    const primaryName = pNameLower.split('(')[0].trim()
    if (lower.includes(primaryName)) {
      if (!seenPlaceIds.has(p.id)) {
        seenPlaceIds.add(p.id)
        placeMatches.push(p)
      }
    }
  }

  // Priority 3: Check distinct multi-character tokens (excluding generic terms)
  for (const p of allDatasetPlaces) {
    if (!p.name || seenPlaceIds.has(p.id)) continue
    const pNameLower = p.name.toLowerCase().split('(')[0].trim()
    const tokens = pNameLower.split(/\s+/).filter((t) => t.length >= 4 && !GENERIC_EXCLUDED_TOKENS.includes(t))
    if (tokens.length > 0 && tokens.every((token) => lower.includes(token))) {
      seenPlaceIds.add(p.id)
      placeMatches.push(p)
    }
  }

  entities.places = placeMatches
  return entities
}

/**
 * Rewrite conversational follow-up questions into standalone queries
 * Example:
 *   Prior User: "Tell me about Golconda Fort"
 *   Current: "What is its entry fee and timings?"
 *   Rewritten: "What is the entry fee and timings for Golconda Fort?"
 */
export function rewriteFollowupQuery(currentMessage, history = []) {
  if (!history || !Array.isArray(history) || history.length === 0) {
    return currentMessage
  }

  const trimmed = currentMessage.trim()
  const lower = trimmed.toLowerCase()

  // Pronoun indicators of follow-ups
  const isFollowUp =
    /\b(it|its|they|their|this place|that place|here|there|the entry fee|the timings|the ticket|how to reach|dress code)\b/i.test(lower) ||
    trimmed.length < 35

  if (!isFollowUp) return currentMessage

  // Find last referenced place from history
  let referencedPlaceName = null
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i]
    if (typeof msg.content === 'string') {
      const entities = extractEntities(msg.content)
      if (entities.places && entities.places.length > 0) {
        referencedPlaceName = entities.places[0].name
        break
      }
    }
  }

  if (referencedPlaceName) {
    // Replace pronouns with referenced place name
    const rewritten = trimmed
      .replace(/\b(its|their)\b/gi, `${referencedPlaceName}'s`)
      .replace(/\b(it|this place|that place)\b/gi, referencedPlaceName)

    if (!rewritten.toLowerCase().includes(referencedPlaceName.toLowerCase())) {
      return `${rewritten} for ${referencedPlaceName}`
    }
    return rewritten
  }

  return currentMessage
}

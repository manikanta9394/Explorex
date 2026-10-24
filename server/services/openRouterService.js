import { env } from '../config/env.js'
import {
  allDatasetPlaces,
  enrichedPlaces,
  enrichedHotels,
  enrichedRestaurants,
} from '../data/tourismData.js'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Haversine formula to compute distance in km
export function getDistanceKm(coord1, coord2) {
  if (!coord1 || !coord2) return null
  const [lat1, lon1] = coord1
  const [lat2, lon2] = coord2
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return null
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((R * c).toFixed(1))
}

// Find nearest places from a target coordinate
export function findNearbyPlaces(targetCoord, limit = 3, excludeId = null) {
  if (!targetCoord || !Array.isArray(targetCoord)) return []
  return allDatasetPlaces
    .filter((p) => p.id !== excludeId && p.position && Array.isArray(p.position))
    .map((p) => ({
      ...p,
      distanceKm: getDistanceKm(targetCoord, p.position),
    }))
    .filter((p) => p.distanceKm !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit)
}

// Extract places from dataset mentioned in text or query
export function extractMentionedPlaces(text, maxCount = 4) {
  if (!text || typeof text !== 'string') return []
  const lower = text.toLowerCase()
  const matched = []
  const seenIds = new Set()

  const aliases = [
    { id: '1', keywords: ['charminar', 'చార్మినార్', 'चारमीनार', 'laad bazaar', 'లాడ్ బజార్', 'లాడ్ బజారు', 'old city', 'mecca masjid', 'మక్కా మసీదు'] },
    { id: '2', keywords: ['golconda', 'గోల్కొండ', 'गोलकोंडा', 'sound and light', 'fort', 'కోట', 'किला'] },
    { id: '3', keywords: ['hussain sagar', 'హుస్సేన్ సాగర్', 'हुसैन सागर', 'buddha', 'necklace road', 'boating', 'tank bund', 'బోటింగ్', 'बोटिंग'] },
    { id: '4', keywords: ['chowmahalla', 'చౌమహల్లా', 'चौमहल्ला', 'palace', 'మహల్', 'महल'] },
    { id: '5', keywords: ['salar jung', 'సాలార్ జంగ్', 'सालार जंग', 'museum', 'మ్యూజియం', 'म्यूजियम'] },
    { id: '6', keywords: ['ramoji', 'రామోజీ', 'रामोजी', 'film city', 'फिल्म सिटी'] },
    { id: '7', keywords: ['birla mandir', 'బిర్లా మందిర్', 'बिरला मंदिर', 'temple', 'గుడి', 'मंदिर'] },
    { id: '8', keywords: ['qutb shahi', 'కుతుబ్ షాహీ', 'कुतुब शाही', 'tombs', 'సమాధులు'] },
    { id: '9', keywords: ['shilparamam', 'శిల్పారామం', 'शिल्पारामम', 'crafts', 'arts'] },
    { id: '10', keywords: ['zoo', 'zoological', 'జూ', 'चिड़ियाघर', 'nehru zoo'] },
    { id: '101', keywords: ['shadab', 'షాదాబ్', 'शादाब'] },
    { id: '102', keywords: ['bawarchi', 'బావర్చి', 'बावर्ची'] },
    { id: '103', keywords: ['paradise', 'ప్యారడైజ్', 'पैराडाइज'] },
  ]

  for (const item of aliases) {
    if (item.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      const p = allDatasetPlaces.find((x) => x.id === item.id)
      if (p && !seenIds.has(p.id)) {
        seenIds.add(p.id)
        matched.push(p)
      }
    }
  }

  // Prioritize primary attractions by name
  for (const place of allDatasetPlaces) {
    if (!place?.name || seenIds.has(place.id)) continue
    const nameLower = place.name.toLowerCase()
    if (
      lower.includes(nameLower) ||
      (nameLower.length >= 7 && lower.includes(nameLower.split(' ')[0]))
    ) {
      seenIds.add(place.id)
      matched.push(place)
      if (matched.length >= maxCount) break
    }
  }

  return matched
}

// Format price in ₹
export function formatPriceInr(place) {
  if (!place || !place.price) return 'Free entry (₹0)'
  const amount = place.price.amount
  if (!amount || amount === 0) return 'Free entry (₹0)'
  return `₹${amount} ${place.price.unit || ''}`.trim()
}

// Extract the most relevant places for a given query to ground the LLM
export function getRelevantPlacesForQuery(query, activePlace, limit = 4) {
  const q = (query || '').toLowerCase().trim()
  const scored = []
  const seenIds = new Set()

  if (activePlace && activePlace.id) {
    seenIds.add(activePlace.id)
    scored.push({ place: activePlace, score: 100 })
  }

  const isFoodQuery = /food|eat|biryani|restaurant|dining|lunch|dinner|chai|haleem|షాదాబ్|బావర్చి|ప్యారడైజ్|బిర్యానీ|తిండి|भोजन|बिरयानी|खाना|रेस्टोरेंट/i.test(q)
  const isHotelQuery = /hotel|stay|resort|lodge|accommodation|room|హోటల్|రూమ్|होटल|कमरा|ठहर/i.test(q)

  const mentioned = extractMentionedPlaces(q, 4)
  for (const m of mentioned) {
    if (!seenIds.has(m.id)) {
      seenIds.add(m.id)
      scored.push({ place: m, score: 80 })
    }
  }

  if (isFoodQuery) {
    for (const r of enrichedRestaurants.slice(0, 3)) {
      if (!seenIds.has(r.id)) {
        seenIds.add(r.id)
        scored.push({ place: r, score: 60 })
      }
    }
  }

  if (isHotelQuery) {
    for (const h of enrichedHotels.slice(0, 3)) {
      if (!seenIds.has(h.id)) {
        seenIds.add(h.id)
        scored.push({ place: h, score: 60 })
      }
    }
  }

  // If nearby query, find closest places to activePlace
  if (/nearby|around|close|దగ్గర|పాస్|समीप/i.test(q) && activePlace?.position) {
    const nearby = findNearbyPlaces(activePlace.position, 3, activePlace.id)
    for (const n of nearby) {
      if (!seenIds.has(n.id)) {
        seenIds.add(n.id)
        scored.push({ place: n, score: 70 })
      }
    }
  }

  // Pad with top landmarks if needed
  if (scored.length < limit) {
    for (const p of enrichedPlaces) {
      if (!seenIds.has(p.id)) {
        seenIds.add(p.id)
        scored.push({ place: p, score: 20 })
        if (scored.length >= limit) break
      }
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.place)
}

// Build compact grounded knowledge context for LLM prompt sending only the most relevant places
export function buildGroundingContext(message, currentPlace, travelMode) {
  const relevantPlaces = getRelevantPlacesForQuery(message, currentPlace, 4)

  const relevantData = relevantPlaces.map((p) => ({
    name: p.name,
    category: p.category,
    price: formatPriceInr(p),
    hours: p.rules?.[0] || 'Visiting hours: 9:00 AM - 5:30 PM',
    rules: p.rules?.slice(0, 3) || ['Follow designated visitor paths', 'Verify tickets at entry'],
    rating: p.rating,
    coordinates: p.position,
  }))

  const activeContext = currentPlace
    ? {
        name: currentPlace.name,
        category: currentPlace.category,
        price: formatPriceInr(currentPlace),
        hours: currentPlace.rules?.[0] || 'Visiting hours: 9:00 AM - 5:30 PM',
        rules: currentPlace.rules || [],
        coordinates: currentPlace.position,
        address: currentPlace.location?.address || 'Hyderabad, Telangana',
      }
    : null

  return `
MOST RELEVANT VERIFIED PLACES FOR THIS QUESTION (from Explorex dataset):
${JSON.stringify(relevantData, null, 2)}

CURRENTLY SELECTED PLACE CONTEXT:
${JSON.stringify(activeContext, null, 2)}

USER TRAVEL MODE:
${travelMode || 'driving-car'}
`
}

// Language helpers
function detectLanguage(text) {
  if (!text) return 'en'
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te' // Telugu unicode block
  if (/[\u0900-\u097F]/.test(text)) return 'hi' // Devanagari (Hindi) unicode block
  return 'en'
}

// Deterministic Grounded Intelligence Engine (Offline / Fallback / Non-API mode)
export function generateGroundedAnswer({
  message,
  currentPlace,
  travelMode = 'driving-car',
  userLocation,
}) {
  const query = (message || '').toLowerCase().trim()
  const lang = detectLanguage(message)
  const placeName = currentPlace?.name || 'Charminar'
  const placeCoord = currentPlace?.position || [17.3614, 78.4747]
  const modeLabel =
    travelMode === 'foot-walking'
      ? 'walking'
      : travelMode === 'cycling-regular'
      ? 'cycling'
      : 'driving'

  // 1. Off-Topic Query Detection (Non-travel related questions)
  const offTopicKeywords = [
    'world cup', 'fifa', 'python', 'javascript', 'write code', 'crypto', 'bitcoin',
    'stock market', 'recipe for pizza', 'who is elon musk', 'presidential election',
    'formula 1', 'capital of france',
  ]
  const isOffTopic = offTopicKeywords.some((kw) => query.includes(kw))
  if (isOffTopic) {
    if (lang === 'te') {
      return {
        answer: `నేను ఎక్స్‌ప్లోరెక్స్ (Explorex), హైదరాబాద్ మరియు తెలంగాణ పర్యాటక సహాయకుడిని. తెలంగాణ ప్రయాణాలకు వెలుపల ఉన్న అంశాలకు నేను సమాధానం ఇవ్వలేను, కానీ మా చారిత్రక కట్టడాలు, రుచికరమైన ఆహారం మరియు దర్శనీయ స్థలాల గురించి సంతోషంగా సహాయం చేస్తాను.

• **చారిత్రక యాత్రలు**: హైదరాబాద్‌లో 1 రోజు లేదా బహుళ రోజుల పర్యటన ప్రణాళికలు.
• **ప్రామాణిక ఆహారం**: ప్రసిద్ధ హైదరాబాదీ దమ్ బిర్యానీ, ఇరానీ చాయ్ మరియు హలీమ్ కేంద్రాలు.
• **నియమాలు & ధరలు**: ధృవీకరించబడిన ప్రవేశ రుసుములు ₹ లలో మరియు సందర్శన సమయాలు.
• **దిశలు**: నడక, సైక్లింగ్ లేదా డ్రైవింగ్ కోసం కి.మీ లలో దూరాలు.

💡 ప్రాక్టికల్ టిప్ (Practical Tip): *"చార్మినార్ దగ్గర ఫేమస్ బిర్యానీ ఎక్కడ దొరుకుతుంది?"* లేదా *"గోల్కొండ కోట సమయాలు ఏమిటి?"* అని అడిగి చూడండి.`,
        recommendedPlaces: [enrichedPlaces[0], enrichedPlaces[1]],
        source: 'grounded-intelligence',
      }
    }
    if (lang === 'hi') {
      return {
        answer: `मैं Explorex हूँ, हैदराबाद और तेलंगाना का आपका समर्पित यात्रा गाइड। तेलंगाना यात्रा से बाहर के सवालों के लिए मैं जानकारी नहीं दे सकता, लेकिन हमारे ऐतिहासिक स्मारकों, शाही महलों और खान-पान के बारे में आपकी पूरी मदद करूँगा।

• **हेरिटेज टूर**: हैदराबाद में 1 दिन या बहु-दिवसीय यात्रा योजना बनाएं।
• **स्वादिष्ट भोजन**: असली हैदराबादी दम बिरयानी, ईरानी चाय और हलीम के प्रसिद्ध स्थल।
• **टिकट और समय**: ₹ में प्रमाणित टिकट मूल्य, समय और फोटोग्राफी के नियम।
• **दूरी और रूट**: पैदल, साइकिल या कार द्वारा किमी में सटीक दूरी और दिशा-निर्देश।

💡 उपयोगी सुझाव (Practical Tip): *"चारमीनार के पास सबसे अच्छी बिरयानी कहाँ मिलती है?"* या *"गोलकोंडा किले का समय क्या है?"* पूछकर देखें।`,
        recommendedPlaces: [enrichedPlaces[0], enrichedPlaces[1]],
        source: 'grounded-intelligence',
      }
    }

    return {
      answer: `I am Explorex, your dedicated travel guide for Hyderabad and Telangana. While I cannot answer questions outside Telangana travel, I would be delighted to help you explore our historic monuments, royal palaces, authentic dining, and cultural landmarks.

• **Heritage Itineraries**: Plan a curated 1-day or multi-day trip across Hyderabad.
• **Authentic Dining**: Discover iconic Hyderabadi Dum Biryani, Haleem, and Irani Chai spots.
• **Visiting Rules & Prices**: Access verified ticket prices in ₹, timings, and photography guidelines.
• **Turn-by-turn Directions**: Calculate routes and distances in km for walking, cycling, or driving.

💡 Practical Tip: Try asking *"What to see in 1 day?"* or *"Where do locals eat near Charminar?"* to plan your journey.`,
      recommendedPlaces: [enrichedPlaces[0], enrichedPlaces[1]],
      source: 'grounded-intelligence',
    }
  }

  // 2. Query About a Place Not in Dataset / Not in Telangana
  const outOfDatasetPlaces = [
    'eiffel tower', 'statue of liberty', 'taj mahal', 'colosseum', 'atlantis water kingdom',
    'burj khalifa', 'disneyland', 'pyramids of giza', 'machu picchu', 'great wall of china',
    'ఈఫిల్ టవర్', 'తాజ్ మహల్', 'ताज महल', 'एफिल टॉवर',
  ]
  const mentionedOutPlace = outOfDatasetPlaces.find((p) => query.includes(p))
  if (mentionedOutPlace) {
    const formattedName = mentionedOutPlace
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

    if (lang === 'te') {
      return {
        answer: `నా దగ్గర ఆ సమాచారం లేదు (I don't have that). **${formattedName}** మా ధృవీకరించబడిన హైదరాబాద్ మరియు తెలంగాణ పర్యాటక జాబితాలో లేదు.

• **పరిధి**: Explorex కేవలం తెలంగాణ రాష్ట్ర పరిధిలోని చారిత్రక కట్టడాలు, దేవాలయాలు, సరస్సులు మరియు హోటళ్ల వివరాలను మాత్రమే అందిస్తుంది.
• **సత్యనిష్ఠ**: లేని లేదా ధృవీకరించని స్థలాల గురించి మేము ఊహాజనిత సమాచారాన్ని లేదా ధరలను సృష్టించము.
• **అధికారిక వెబ్‌సైట్**: ఇతర ప్రాంతాల సమాచారం కోసం అధికారిక పర్యాటక వెబ్‌సైట్లను (tourism.telangana.gov.in) సంప్రదించండి.

💡 ప్రాక్టికల్ టిప్ (Practical Tip): హైదరాబాద్ పర్యటనలో ప్రసిద్ధ కట్టడాల కోసం చార్మినార్, గోల్కొండ కోట లేదా చౌమహల్లా ప్యాలెస్ గురించి అడగండి.`,
        recommendedPlaces: [enrichedPlaces[0], enrichedPlaces[1], enrichedPlaces[3]],
        source: 'grounded-intelligence',
      }
    }

    if (lang === 'hi') {
      return {
        answer: `मेरे पास यह जानकारी नहीं है (I don't have that)। **${formattedName}** हमारे सत्यापित हैदराबाद और तेलंगाना पर्यटन डेटाबेस में शामिल नहीं है।

• **दायरा**: Explorex केवल हैदराबाद और तेलंगाना राज्य के प्रमुख पर्यटन स्थलों, भोजन और ठहरने की प्रमाणित जानकारी देता है।
• **तथ्यपरकता**: हम अवास्तविक स्थानों, काल्पनिक कीमतों या समय का निर्माण नहीं करते हैं।
• **सत्यापन**: अन्य राज्यों या देशों के पर्यटन के लिए आधिकारिक पर्यटन पोर्टलों (जैसे tourism.telangana.gov.in) की मदद लें।

💡 उपयोगी सुझाव (Practical Tip): हैदराबाद के प्रमुख ऐतिहासिक स्थलों के लिए आप चारमीनार, गोलकोंडा किला या चौमहल्ला पैलेस के बारे में पूछ सकते हैं।`,
        recommendedPlaces: [enrichedPlaces[0], enrichedPlaces[1], enrichedPlaces[3]],
        source: 'grounded-intelligence',
      }
    }

    return {
      answer: `I don't have that in our verified Hyderabad and Telangana places catalog. To ensure factual accuracy, Explorex only references verified local monuments, stays, and dining spots.

• **Geographic Scope**: ${formattedName} is not a tourist attraction located within Hyderabad or Telangana.
• **Strict Grounding**: We do not invent fictional landmarks, prices, or timings for unverified destinations.
• **Official Verification**: For travel beyond Telangana, we recommend consulting official state and national tourism portals such as Telangana Tourism (tourism.telangana.gov.in).

💡 Practical Tip: If you are looking for landmark heritage monuments in Hyderabad, consider visiting iconic destinations like Charminar, Golconda Fort, or Chowmahalla Palace.`,
      recommendedPlaces: [enrichedPlaces[0], enrichedPlaces[1], enrichedPlaces[3]],
      source: 'grounded-intelligence',
    }
  }

  // 3. Directions / "How do I get there?"
  const isDirectionsQuery =
    /how\s+(do\s+i\s+)?(get\s+there|reach|go)|how\s+to\s+reach|directions|where\s+is\s+it|route\s+to|reach\s+on\s+foot|ఎలా\s+చేరుకోవాలి|రూట్|मार्ग|कैसे\s+पहुंचें|रास्ता/i.test(
      query
    )
  if (isDirectionsQuery) {
    const originCoord =
      Array.isArray(userLocation) && userLocation.length >= 2
        ? [userLocation[1], userLocation[0]]
        : [17.385, 78.4867]
    const distanceKm = getDistanceKm(originCoord, placeCoord) || 4.2

    if (lang === 'te') {
      return {
        answer: `**${placeName}** చేరుకోవడానికి **${modeLabel}** మార్గం వివరాలు:

• **స్థానం**: ${currentPlace?.location?.address || `${placeName}, హైదరాబాద్, తెలంగాణ`} (కోఆర్డినేట్స్: ${placeCoord[0]}° N, ${placeCoord[1]}° E).
• **ప్రయాణ మోడ్**: ${modeLabel === 'walking' ? '🚶 నడక' : modeLabel === 'cycling' ? '🚴 సైక్లింగ్' : '🚗 డ్రైవింగ్'}.
• **అంచనా దూరం**: సెంట్రల్ హైదరాబాద్ నుండి సుమారు ${distanceKm} కి.మీ.
• **యాక్సెస్**: ప్రధాన రహదారుల ద్వారా సులభంగా చేరుకోవచ్చు; వాహన పార్కింగ్ సదుపాయం అందుబాటులో ఉంది.

💡 ప్రాక్టికల్ టిప్ (Practical Tip): గూగుల్ మ్యాప్స్‌లో లైవ్ టర్న్-బై-టర్న్ నావిగేషన్ కోసం క్రింది కార్డులోని 'Directions' బటన్‌ను నొక్కండి.

*గమనిక: ట్రాఫిక్ మరియు రహదారి పరిస్థితుల ప్రకారం ప్రయాణ సమయం మారవచ్చు.*`,
        recommendedPlaces: currentPlace ? [currentPlace] : [enrichedPlaces[0]],
        source: 'grounded-intelligence',
      }
    }

    if (lang === 'hi') {
      return {
        answer: `**${placeName}** तक **${modeLabel}** द्वारा पहुँचने के निर्देश:

• **स्थान**: ${currentPlace?.location?.address || `${placeName}, हैदराबाद, तेलंगाना`} (निर्देशांक: ${placeCoord[0]}° N, ${placeCoord[1]}° E)।
• **यात्रा मोड**: ${modeLabel === 'walking' ? '🚶 पैदल' : modeLabel === 'cycling' ? '🚴 साइकिल' : '🚗 ड्राइविंग'} (${travelMode})।
• **अनुमानित दूरी**: केंद्रीय हैदराबाद से लगभग ${distanceKm} किमी।
• **प्रवेश**: मुख्य सड़क संपर्क उपलब्ध है; मुख्य द्वार के पास पार्किंग सुविधा मौजूद है।

💡 उपयोगी सुझाव (Practical Tip): गूगल मैप्स में टर्न-बाय-टर्न नेविगेशन शुरू करने के लिए नीचे दिए गए कार्ड पर 'Directions' बटन दबाएं।

*नोट: ट्रैफ़िक और सड़क की स्थिति के अनुसार यात्रा का समय बदल सकता है।*`,
        recommendedPlaces: currentPlace ? [currentPlace] : [enrichedPlaces[0]],
        source: 'grounded-intelligence',
      }
    }

    return {
      answer: `Here is how you can reach **${placeName}** via **${modeLabel}**:

• **Location**: ${currentPlace?.location?.address || `${placeName}, Hyderabad, Telangana`} (Coordinates: ${placeCoord[0]}° N, ${placeCoord[1]}° E).
• **Travel Mode**: ${modeLabel.charAt(0).toUpperCase() + modeLabel.slice(1)} (${travelMode}).
• **Estimated Distance**: Approx. ${distanceKm} km from central Hyderabad.
• **Route Access**: Accessible via primary arterial roads; dedicated parking and designated pedestrian access are available near the entrance.

💡 Practical Tip: Tap the 'Get Directions' button on the card below to launch turn-by-turn navigation directly in Google Maps.

*Note: Travel times and transit routes may vary depending on live traffic conditions.*`,
      recommendedPlaces: currentPlace ? [currentPlace] : [enrichedPlaces[0]],
      source: 'grounded-intelligence',
    }
  }

  // 4. "What's nearby?" / Surrounding attractions
  const isNearbyQuery =
    /what('?s|\s+is)\s+nearby|near\s+(this|here|me)|places\s+close\s+by|around\s+(here|this)|దగ్గరలో|పరిసరాల్లో|समीप|आस-पास/i.test(
      query
    )
  if (isNearbyQuery) {
    const nearby = findNearbyPlaces(placeCoord, 3, currentPlace?.id)

    if (lang === 'te') {
      const bullets = nearby
        .map(
          (p) =>
            `• **${p.name}**: ${p.distanceKm} కి.మీ దూరం · ${p.category} · రేటింగ్: ${p.rating} ★ · ${formatPriceInr(p)}`
        )
        .join('\n')

      return {
        answer: `**${placeName}** కి సమీపంలో ఉన్న అత్యంత ప్రాచుర్యం పొందిన ప్రదేశాలు:

${bullets}

💡 ప్రాక్టికల్ టిప్ (Practical Tip): ఈ సమీప ప్రదేశాలను ఒకే నడక లేదా చిన్న డ్రైవ్ లూప్‌లో సందర్శించడం ద్వారా ప్రయాణ సమయాన్ని మరియు ట్రాఫిక్‌ను ఆదా చేసుకోవచ్చు.

*గమనిక: సమయాలు మరియు ప్రవేశ రుసుములు మారవచ్చు; సందర్శించే ముందు సరిచూసుకోండి.*`,
        recommendedPlaces: nearby,
        source: 'grounded-intelligence',
      }
    }

    if (lang === 'hi') {
      const bullets = nearby
        .map(
          (p) =>
            `• **${p.name}**: ${p.distanceKm} किमी दूर · ${p.category} · रेटिंग: ${p.rating} ★ · ${formatPriceInr(p)}`
        )
        .join('\n')

      return {
        answer: `**${placeName}** के आस-पास के सबसे लोकप्रिय दर्शनीय स्थल:

${bullets}

💡 उपयोगी सुझाव (Practical Tip): इन पास के स्थलों को एक ही दिन के रूट में जोड़ने से समय और ट्रैफ़िक की बचत होती है।

*नोट: समय और टिकट शुल्क बदल सकते हैं; कृपया जाने से पहले पुष्टि करें।*`,
        recommendedPlaces: nearby,
        source: 'grounded-intelligence',
      }
    }

    const bullets = nearby
      .map(
        (p) =>
          `• **${p.name}**: ${p.distanceKm} km away · ${p.category} · Rating: ${p.rating} ★ · ${formatPriceInr(p)}`
      )
      .join('\n')

    return {
      answer: `Here are the top-rated destinations closest to **${placeName}**:

${bullets}

💡 Practical Tip: Combining these neighboring sites on a single walking or short driving loop saves travel time and minimizes city traffic.

*Note: Visiting hours and entry fees may vary; please verify with official sources before visiting.*`,
      recommendedPlaces: nearby,
      source: 'grounded-intelligence',
    }
  }

  // 5. Food / Where locals eat / Dining / Biryani
  const isFoodQuery =
    /food|eat|biryani|restaurant|dining|lunch|dinner|local\s+dishes|chai|bakery|బిర్యానీ|ఆహారం|తిండి|భోజనం|రెస్టారెంట్|बिरयानी|खाना|रेस्टोरेंट|भोजन/i.test(
      query
    )
  if (isFoodQuery) {
    const topRestaurants = enrichedRestaurants.slice(0, 3)

    if (lang === 'te') {
      return {
        answer: `హైదరాబాద్ మరియు చార్మినార్ పరిసరాల్లో ప్రామాణిక నిజామీ భోజనం మరియు బిర్యానీ లభించే అగ్రశ్రేణి కేంద్రాలు:

• **హోటల్ షాదాబ్ (Hotel Shadab)**: చార్మినార్ సమీపం (0.8 కి.మీ) · రేటింగ్: 4.8 ★ · ఇద్దరికి సుమారు ₹600. ప్రామాణిక హైదరాబాదీ మటన్ దమ్ బిర్యానీ మరియు పాయ రోటీకి ప్రసిద్ధి.
• **బావర్చి రెస్టారెంట్ (Bawarchi Restaurant)**: ఆర్టీసీ క్రాస్ రోడ్స్ · రేటింగ్: 4.7 ★ · ఇద్దరికి సుమారు ₹550. రుచికరమైన చికెన్/మటన్ బిర్యానీలకు ప్రసిద్ధి.
• **ప్యారడైజ్ ఫుడ్ కోర్ట్ (Paradise Food Court)**: సికింద్రాబాద్ & చార్మినార్ · రేటింగ్: 4.5 ★ · ఇద్దరికి సుమారు ₹750. దశాబ్దాల చరిత్ర కలిగిన ఐకానిక్ బిర్యానీ బ్రాండ్.

💡 ప్రాక్టికల్ టిప్ (Practical Tip): తాజాగా దమ్ చేసిన వేడివేడి బిర్యానీ కోసం మధ్యాహ్నం 12:30 నుండి 2:00 గంటల మధ్య లేదా రాత్రి 7:30 నుండి 9:00 గంటల మధ్య వెళ్లడం మంచిది.

*గమనిక: రెస్టారెంట్ సమయాలు మరియు ఆహార ధరలు మారవచ్చు; సందర్శించే ముందు సరిచూసుకోండి.*`,
        recommendedPlaces: topRestaurants,
        source: 'grounded-intelligence',
      }
    }

    if (lang === 'hi') {
      return {
        answer: `हैदराबाद और चारमीनार के आस-पास असली दम बिरयानी और लजीज व्यंजनों के लिए सबसे प्रसिद्ध रेस्टोरेंट:

• **होटल शादाब (Hotel Shadab)**: चारमीनार के निकट (0.8 किमी) · रेटिंग: 4.8 ★ · दो लोगों के लिए लगभग ₹600। असली हैदराबादी मटन दम बिरयानी और निज़ामी कबाब के लिए विख्यात।
• **बावर्ची रेस्टोरेंट (Bawarchi Restaurant)**: आरटीसी क्रॉस रोड्स · रेटिंग: 4.7 ★ · दो लोगों के लिए लगभग ₹550। पारंपरिक हैदराबादी मसालों वाली बिरयानी।
• **पैराडाइज फूड कोर्ट (Paradise Food Court)**: सिकंदराबाद और चारमीनार शाखाएं · रेटिंग: 4.5 ★ · दो लोगों के लिए लगभग ₹750। विश्व प्रसिद्ध हैदराबादी बिरयानी।

💡 उपयोगी सुझाव (Practical Tip): ताज़ा बनी गर्म दम बिरयानी के स्वाद के लिए दोपहर 12:30 से 2:00 बजे या रात 7:30 से 9:00 बजे के बीच जाएं।

*नोट: कीमतें और खुलने का समय बदल सकते हैं; कृपया जाने से पहले पुष्टि करें।*`,
        recommendedPlaces: topRestaurants,
        source: 'grounded-intelligence',
      }
    }

    const bullets = topRestaurants
      .map(
        (r) =>
          `• **${r.name}**: ${r.category} · Rating: ${r.rating} ★ · Approx. ${formatPriceInr(r)} for two. Known for authentic Nizami delicacies, fragrant Dum Biryani, and traditional desserts.`
      )
      .join('\n')

    return {
      answer: `Here are authentic dining spots where locals and visitors experience Hyderabad's renowned cuisine:

${bullets}

💡 Practical Tip: For the freshest batch of authentic Dum Biryani, visit between 12:30 PM - 2:00 PM for lunch or 7:30 PM - 9:00 PM for dinner.

*Note: Restaurant hours, waiting times, and meal prices may vary; please verify before visiting.*`,
      recommendedPlaces: topRestaurants,
      source: 'grounded-intelligence',
    }
  }

  // 6. 1-Day Itinerary
  const isItineraryQuery =
    /1[- ]day|one\s+day|itinerary|day\s+plan|what\s+to\s+see\s+in\s+1\s+day|1\s+రోజు|ఒక\s+రోజు|1\s+दिन|एक\s+दिन/i.test(
      query
    )
  if (isItineraryQuery) {
    const stops = [
      enrichedPlaces[0], // Charminar
      enrichedPlaces[3], // Chowmahalla Palace
      enrichedPlaces[1], // Golconda Fort
    ].filter(Boolean)

    if (lang === 'te') {
      return {
        answer: `హైదరాబాద్‌లో 1 రోజులో ముఖ్యమైన చారిత్రక సంపదను సందర్శించే ఉత్తమ ప్రణాళిక:

• **ఉదయం (9:00 AM - 11:30 AM)**: **${stops[0]?.name || 'చార్మినార్'}** (${formatPriceInr(stops[0])}) తో ప్రారంభించి, 1591 నాటి కట్టడాన్ని మరియు లాడ్ బజార్ ముత్యాల మార్కెట్‌ను చూడండి.
• **మధ్యాహ్నం (11:45 AM - 1:45 PM)**: సమీపంలోని **${stops[1]?.name || 'చౌమహల్లా ప్యాలెస్'}** (0.9 కి.మీ, ${formatPriceInr(stops[1])}) కు వెళ్లి నిజాం దర్బార్ హాల్, వింటేజ్ కార్ల గ్యాలరీని సందర్శించండి.
• **మధ్యాహ్న భోజనం (2:00 PM - 3:30 PM)**: స్థానిక హెరిటేజ్ రెస్టారెంట్‌లో అసలైన హైదరాబాదీ దమ్ బిర్యానీని ఆస్వాదించండి (ఇద్దరికి ₹500 - ₹800).
• **సాయంత్రం (4:30 PM - 7:30 PM)**: **${stops[2]?.name || 'గోల్కొండ కోట'}** (11.2 కి.మీ, ${formatPriceInr(stops[2])}) వద్ద సూర్యాస్తమయాన్ని మరియు రాత్రి సౌండ్ & లైట్ షోను తిలకించండి.

💡 ప్రాక్టికల్ టిప్ (Practical Tip): పాతబస్తీ ట్రాఫిక్ కంటే ముందు ఉండటానికి ఉదయం 9:30 లోపే చార్మినార్ వద్ద పర్యటన ప్రారంభించండి.

*గమనిక: సమయాలు మరియు ప్రవేశ రుసుములు మారవచ్చు; సందర్శించే ముందు అధికారికంగా ధృవీకరించుకోండి.*`,
        recommendedPlaces: stops,
        source: 'grounded-intelligence',
      }
    }

    if (lang === 'hi') {
      return {
        answer: `हैदराबाद में 1 दिन की संपूर्ण हेरिटेज यात्रा का योजनाबद्ध कार्यक्रम:

• **सुबह (9:00 AM - 11:30 AM)**: **${stops[0]?.name || 'चारमीनार'}** (${formatPriceInr(stops[0])}) से शुरुआत करें, ऐतिहासिक मीनारों का दीदार करें और लाड बाज़ार घूमें।
• **दोपहर (11:45 AM - 1:45 PM)**: **${stops[1]?.name || 'चौमहल्ला पैलेस'}** (0.9 किमी, ${formatPriceInr(stops[1])}) जाएं और निज़ाम के भव्य दरबार हॉल और विंटेज कारों को देखें।
• **दोपहर का भोजन (2:00 PM - 3:30 PM)**: पास के प्रसिद्ध रेस्टोरेंट में प्रामाणिक हैदराबादी दम बिरयानी का आनंद लें (दो लोगों के लिए ₹500 - ₹800)।
• **शाम व सूर्यास्त (4:30 PM - 7:30 PM)**: **${stops[2]?.name || 'गोलकोंडा किला'}** (11.2 किमी, ${formatPriceInr(stops[2])}) पहुंचकर सूर्यास्त देखें और शाम का साउंड एंड लाइट शो देखें।

💡 उपयोगी सुझाव (Practical Tip): धूप से बचने और पुराने शहर के ट्रैफ़िक से पहले पहुंचने के लिए सुबह 9:30 से पहले निकलें।

*नोट: समय और टिकट शुल्क बदल सकते हैं; कृपया जाने से पहले पुष्टि करें।*`,
        recommendedPlaces: stops,
        source: 'grounded-intelligence',
      }
    }

    return {
      answer: `Here is a curated 1-day heritage itinerary for exploring Hyderabad:

• **Morning (9:00 AM - 11:30 AM)**: Start at **${stops[0]?.name || 'Charminar'}** (${formatPriceInr(stops[0])}) to admire the 1591 landmark before midday heat, followed by a walk through Laad Bazaar.
• **Midday (11:45 AM - 1:45 PM)**: Head to **${stops[1]?.name || 'Chowmahalla Palace'}** (0.9 km away, ${formatPriceInr(stops[1])}) to explore royal Nizami courtyards, chandelier halls, and vintage cars.
• **Afternoon (2:00 PM - 3:30 PM)**: Enjoy authentic Hyderabadi Dum Biryani at a heritage restaurant (₹500 - ₹800 for two).
• **Late Afternoon & Sunset (4:30 PM - 7:30 PM)**: Visit **${stops[2]?.name || 'Golconda Fort'}** (11.2 km away, ${formatPriceInr(stops[2])}) for panoramic hilltop sunset views and the evening sound-and-light show.

💡 Practical Tip: Start before 9:30 AM to beat Old City traffic, and wear comfortable walking shoes for cobblestone palace paths.

*Note: Timings, rules, and ticket prices may vary; please verify with official sources before visiting.*`,
      recommendedPlaces: stops,
      source: 'grounded-intelligence',
    }
  }

  // 7. Timings / Rules / Photography / Prices
  const isRulesQuery =
    /timings|hours|rules|photography|photos|dress\s+code|open(ing)?\s+time|ticket|price|cost|సమయాలు|ధర|రుసుము|ఫోటో|समय|टिकट|किराया|नियम|फोटो/i.test(
      query
    )
  if (isRulesQuery) {
    const targetPlace =
      extractMentionedPlaces(query)[0] || currentPlace || enrichedPlaces[0]

    const rules = targetPlace?.rules || [
      'Visiting hours: Daily, 9:00 AM - 5:30 PM',
      'Photography permitted in designated outdoor areas',
      'Modest attire recommended for heritage sites',
      'Guided audio tours available at entrance',
    ]

    if (lang === 'te') {
      const bullets = rules.map((r) => `• ${r}`).join('\n')
      return {
        answer: `**${targetPlace.name}** సందర్శన సమయాలు, ప్రవేశ రుసుము మరియు మార్గదర్శకాలు:

${bullets}
• **టికెట్ ధర**: ప్రతి సందర్శకుడికి ${formatPriceInr(targetPlace)}.

💡 ప్రాక్టికల్ టిప్ (Practical Tip): ఉత్తమ ఫోటోగ్రఫీ మరియు గోల్డెన్ అవర్ లైటింగ్ కోసం సాయంత్రం 4:30 నుండి 5:30 గంటల మధ్య సందర్శించండి.

*గమనిక: సమయాలు, నిబంధనలు మరియు టికెట్ ధరలు మారవచ్చు; సందర్శించే ముందు అధికారికంగా ధృవీకరించుకోండి.*`,
        recommendedPlaces: [targetPlace],
        source: 'grounded-intelligence',
      }
    }

    if (lang === 'hi') {
      const bullets = rules.map((r) => `• ${r}`).join('\n')
      return {
        answer: `**${targetPlace.name}** के खुलने का समय, टिकट दर और नियम:

${bullets}
• **टिकट मूल्य**: प्रति पर्यटक ${formatPriceInr(targetPlace)}।

💡 उपयोगी सुझाव (Practical Tip): बेहतरीन तस्वीरों और मनमोहक रोशनी के लिए शाम 4:30 से 5:30 बजे का समय सबसे उपयुक्त है।

*नोट: समय, नियम और टिकट शुल्क बदल सकते हैं; कृपया जाने से पहले आधिकारिक स्रोतों से पुष्टि करें।*`,
        recommendedPlaces: [targetPlace],
        source: 'grounded-intelligence',
      }
    }

    const bullets = rules.map((r) => `• ${r}`).join('\n')
    return {
      answer: `Here are the verified visiting hours, photography rules, and guidelines for **${targetPlace.name}**:

${bullets}
• **Ticket Price**: ${formatPriceInr(targetPlace)} per visitor.

💡 Practical Tip: Visit between 4:30 PM - 5:30 PM for optimal photography light with soft golden illumination and minimal harsh shadows.

*Note: Timings, rules, and ticket prices may vary; please verify with official sources before visiting.*`,
      recommendedPlaces: [targetPlace],
      source: 'grounded-intelligence',
    }
  }

  // 8. Budget Under ₹100 / Free Entry
  const isBudgetQuery =
    /budget|under\s+(₹|rs\.?|inr)?\s*100|cheap|affordable|free\s+entry|తక్కువ\s+ధర|ఉచితం|सस्ता|कम\s+बजट/i.test(
      query
    )
  if (isBudgetQuery) {
    const budgetSpots = [...enrichedPlaces]
      .sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0))
      .slice(0, 4)

    if (lang === 'te') {
      const bullets = budgetSpots
        .map((p) => `• **${p.name}**: ${formatPriceInr(p)} · ${p.category} · రేటింగ్: ${p.rating} ★`)
        .join('\n')

      return {
        answer: `హైదరాబాద్‌లో బడ్జెట్ అనుకూలమైన (చాలావరకు ₹100 లోపు) ముఖ్యమైన దర్శనీయ స్థలాలు:

${bullets}

💡 ప్రాక్టికల్ టిప్ (Practical Tip): చాలా చారిత్రక ప్రదేశాలలో 15 సంవత్సరాల లోపు పిల్లలకు ఉచిత ప్రవేశం ఉంటుంది; టికెట్ కౌంటర్ వద్ద లైన్ తప్పించుకోవడానికి ఆన్‌లైన్‌లో బుక్ చేసుకోవచ్చు.

*గమనిక: టికెట్ ధరలు మారవచ్చు; సందర్శించే ముందు అధికారిక పోర్టల్‌లో ధృవీకరించుకోండి.*`,
        recommendedPlaces: budgetSpots,
        source: 'grounded-intelligence',
      }
    }

    if (lang === 'hi') {
      const bullets = budgetSpots
        .map((p) => `• **${p.name}**: ${formatPriceInr(p)} · ${p.category} · रेटिंग: ${p.rating} ★`)
        .join('\n')

      return {
        answer: `हैदराबाद में बजट के अनुकूल (अधिकांश ₹100 से कम) शीर्ष दर्शनीय स्थल:

${bullets}

💡 उपयोगी सुझाव (Practical Tip): कई हेरिटेज स्थलों पर 15 वर्ष से कम आयु के बच्चों का प्रवेश निःशुल्क है; काउंटर की कतार से बचने के लिए टिकट ऑनलाइन बुक करें।

*नोट: टिकट शुल्क बदल सकते हैं; कृपया जाने से पहले आधिकारिक स्रोतों से पुष्टि करें।*`,
        recommendedPlaces: budgetSpots,
        source: 'grounded-intelligence',
      }
    }

    const bullets = budgetSpots
      .map((p) => `• **${p.name}**: ${formatPriceInr(p)} · ${p.category} · Rating: ${p.rating} ★`)
      .join('\n')

    return {
      answer: `Here are the best budget-friendly destinations in Hyderabad with verified low entry fees (many under ₹100 or ₹300):

${bullets}

💡 Practical Tip: Most heritage monuments allow free entry for children under 15 years; booking tickets online skips queue times at physical ticket counters.

*Note: Timings, rules, and ticket prices may vary; please verify with official sources before visiting.*`,
      recommendedPlaces: budgetSpots,
      source: 'grounded-intelligence',
    }
  }

  // 9. Default Destination Intelligence (Grounded on current place or matching place)
  const matchedPlaces = extractMentionedPlaces(query)
  const targetPlace = matchedPlaces[0] || currentPlace || enrichedPlaces[0]

  if (lang === 'te') {
    return {
      answer: `**${targetPlace.name}** తెలంగాణలోని అత్యంత ప్రాముఖ్యత కలిగిన పర్యాటక ప్రదేశాలలో ఒకటి:

• **వర్గం & రేటింగ్**: ${targetPlace.category} · ${targetPlace.rating} ★.
• **ప్రవేశ రుసుము**: ${formatPriceInr(targetPlace)}.
• **వివరాలు**: ${targetPlace.description || 'హైదరాబాద్ సాంస్కృతిక వారసత్వాన్ని ప్రతిబింబించే చారిత్రక ప్రదేశం.'}
• **సందర్శన నియమాలు**: ${targetPlace.rules?.[0] || 'ప్రతిరోజూ ఉదయం 9:00 నుండి సాయంత్రం 5:00 వరకు తెరిచి ఉంటుంది'}.

💡 ప్రాక్టికల్ టిప్ (Practical Tip): ఆహ్లాదకరమైన అనుభవం కోసం ఉదయం పూట లేదా సాయంత్రం వేళల్లో సందర్శించండి మరియు సౌకర్యవంతమైన బూట్లను ధరించండి.

*గమనిక: సమయాలు, నిబంధనలు మరియు టికెట్ ధరలు మారవచ్చు; సందర్శించే ముందు సరిచూసుకోండి.*`,
      recommendedPlaces: [targetPlace],
      source: 'grounded-intelligence',
    }
  }

  if (lang === 'hi') {
    return {
      answer: `**${targetPlace.name}** तेलंगाना के सबसे प्रमुख और ऐतिहासिक पर्यटन स्थलों में से एक है:

• **श्रेणी और रेटिंग**: ${targetPlace.category} · ${targetPlace.rating} ★।
• **प्रवेश शुल्क**: ${formatPriceInr(targetPlace)}।
• **अवलोकन**: ${targetPlace.description || 'हैदराबाद की समृद्ध संस्कृति और वास्तुकला का जीवंत प्रतीक।'}
• **नियम**: ${targetPlace.rules?.[0] || 'प्रतिदिन सुबह 9:00 से शाम 5:00 बजे तक खुला'}.

💡 उपयोगी सुझाव (Practical Tip): बेहतरीन अनुभव के लिए सुबह के समय या शाम को जाएं और चलने के लिए आरामदायक जूते पहनें।

*नोट: समय, नियम और टिकट शुल्क बदल सकते हैं; कृपया जाने से पहले पुष्टि करें।*`,
      recommendedPlaces: [targetPlace],
      source: 'grounded-intelligence',
    }
  }

  return {
    answer: `**${targetPlace.name}** is one of the premier destinations in Telangana, offering exceptional cultural and historical significance:

• **Category & Rating**: ${targetPlace.category} · ${targetPlace.rating} ★.
• **Entry Fee**: ${formatPriceInr(targetPlace)}.
• **Overview**: ${targetPlace.description || 'A historic landmark reflecting the vibrant heritage of Hyderabad.'}
• **Visiting Guidelines**: ${targetPlace.rules?.[0] || 'Open daily, 9:00 AM - 5:00 PM'}.

💡 Practical Tip: Check weather conditions and wear comfortable walking shoes; early morning or late afternoon visits offer the most pleasant experience.

*Note: Timings, rules, and ticket prices may vary; please verify with official sources before visiting.*`,
    recommendedPlaces: [targetPlace],
    source: 'grounded-intelligence',
  }
}

// Main Chat Entry Point
export async function createTravelChat({
  message,
  history = [],
  place,
  currentPlace,
  travelMode = 'driving-car',
  userLocation,
}) {
  const activePlace =
    currentPlace ||
    (place ? allDatasetPlaces.find((p) => p.name.toLowerCase() === place.toLowerCase()) : null) ||
    enrichedPlaces[0]

  // If OpenRouter API key is not configured or in test mode, run our grounded intelligence engine
  if (!env.openRouterApiKey) {
    return generateGroundedAnswer({
      message,
      currentPlace: activePlace,
      travelMode,
      userLocation,
    })
  }

  // Build compact relevant grounding context for the LLM
  const groundingContext = buildGroundingContext(message, activePlace, travelMode)

  const systemPrompt = `You are Explorex, a specialized Hyderabad and Telangana travel guide assistant.
Tone: Professional, concise, warm and friendly.

STRUCTURE YOUR ANSWER AS FOLLOWS:
1. Short introductory sentence.
2. Bullet points or numbered steps with concrete details.
3. A practical tip at the end (prefixed with "💡 Practical Tip:").

LANGUAGE RULES:
- Reply in the user's language!
- If the user asks in Telugu (తెలుగు), answer fully in Telugu.
- If the user asks in Hindi (हिन्दी), answer fully in Hindi.
- If the user asks in English, answer in English.

GROUNDING & TRUTHFULNESS RULES:
- Ground your answer strictly in the verified Telangana places dataset provided above and well-known verified facts about Hyderabad/Telangana.
- Never invent prices, timings, or places.
- If unsure or if a requested place/detail is not in the dataset/area, explicitly say:
  "I don't have that" (or equivalent in user's language: "నా దగ్గర ఆ సమాచారం లేదు" in Telugu, "मेरे पास यह जानकारी नहीं है" in Hindi) and suggest checking official sources (such as Telangana Tourism: tourism.telangana.gov.in).
- Always quote prices in ₹ and distances in km.
- If the answer includes prices or visiting hours, ALWAYS end with a verification note:
  "Note: Timings, rules, and ticket prices may vary; please verify with official sources before visiting." (or equivalent in the reply language).
- If the user asks an off-topic question unrelated to Hyderabad or Telangana travel (e.g. sports, coding, international trivia), politely decline and steer the conversation back to Hyderabad and Telangana.
- Note the user's currently viewed place: "${activePlace.name}" and travel mode: "${travelMode}".
- Answer in under 200 words.

${groundingContext}`

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history
      .filter((item) => ['user', 'assistant'].includes(item.role) && typeof item.content === 'string')
      .slice(-6),
    { role: 'user', content: message },
  ]

  const models = ['openrouter/free', env.openRouterModel, ...env.openRouterFallbackModels].filter(
    (m, i, all) => all.indexOf(m) === i
  )

  let lastError = null

  for (const model of models) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 9500) // 9.5s timeout per attempt

      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5180/Explorex/',
          'X-Title': 'Explorex Travel Guide',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.3, // Low temperature for factual grounding
          max_tokens: 450,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        lastError = new Error(`OpenRouter model ${model} failed with status ${response.status}`)
        continue
      }

      const payload = await response.json()
      const answer = payload.choices?.[0]?.message?.content?.trim()
      if (answer) {
        // Extract recommended places mentioned in answer or query
        const recommended = extractMentionedPlaces(`${message} ${answer}`, 4)
        if (recommended.length === 0 && activePlace) {
          recommended.push(activePlace)
        }

        return {
          answer,
          recommendedPlaces: recommended,
          source: 'openrouter',
        }
      }

      lastError = new Error(`OpenRouter model ${model} returned an empty response`)
    } catch (err) {
      lastError = err
    }
  }

  // Graceful fallback to grounded intelligence if all OpenRouter models fail
  console.warn('OpenRouter API call unsuccessful; falling back to grounded intelligence:', lastError?.message)
  return generateGroundedAnswer({
    message,
    currentPlace: activePlace,
    travelMode,
    userLocation,
  })
}

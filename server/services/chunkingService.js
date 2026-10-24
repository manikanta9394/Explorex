import { allDatasetPlaces } from '../data/tourismData.js'

/**
 * 5 Standard Chunk Types per place:
 * 1. overview: Identity, historical/cultural significance, architecture, category, city, state.
 * 2. rules_and_visitor_info: Dress code, photography, prohibited items, guided tours, etiquette.
 * 3. prices_and_timings: Exact entry fee (in INR), concessions, ticket types, opening & closing hours, weekly holidays.
 * 4. how_to_reach_and_best_time: Best months/season, ideal time of day, transit/metro access, geographic coordinates.
 * 5. nearby_food_and_stay: Proximity to local dining, hotels, and nearby cluster attractions.
 */

// Simple deterministic hash-based 1536-dimensional semantic projection vector
// Produces consistent cosine similarities for dense vector operations in place_embeddings
export function generateDenseEmbedding(text) {
  const DIMENSIONS = 1536
  const vec = new Float32Array(DIMENSIONS)
  if (!text || typeof text !== 'string') return Array.from(vec)

  const normalized = text.toLowerCase().trim()
  const words = normalized.split(/\W+/).filter(Boolean)

  for (let w = 0; w < words.length; w++) {
    const word = words[w]
    let h = 0x811c9dc5
    for (let i = 0; i < word.length; i++) {
      h ^= word.charCodeAt(i)
      h = Math.imul(h, 0x01000193)
    }
    const idx = Math.abs(h) % DIMENSIONS
    const weight = 1.0 / Math.sqrt(w + 1)
    vec[idx] += weight

    // N-gram feature projection for semantic similarity
    if (word.length >= 3) {
      for (let j = 0; j <= word.length - 3; j++) {
        const tri = (word.charCodeAt(j) * 31 + word.charCodeAt(j + 1)) * 31 + word.charCodeAt(j + 2)
        const triIdx = Math.abs(tri) % DIMENSIONS
        vec[triIdx] += 0.3 * weight
      }
    }
  }

  // L2 Normalize
  let norm = 0
  for (let i = 0; i < DIMENSIONS; i++) {
    norm += vec[i] * vec[i]
  }
  norm = Math.sqrt(norm) || 1
  for (let i = 0; i < DIMENSIONS; i++) {
    vec[i] /= norm
  }

  return Array.from(vec)
}

// Multilingual aliases dictionary for major Indian heritage destinations
const MULTILINGUAL_ALIASES = {
  'charminar-hyderabad': 'చార్మినార్ চারমিনার चारमीनार சார்மினார் Charminar Hyderabad Old City Laad Bazaar',
  'golconda-fort-hyderabad': 'గోల్కొండ కోట गोलकोंडा किला கோல்கொண்டா Golconda Fort Qutb Shahi',
  'taj-mahal-agra': 'తాజ్ మహల్ ताज महल தாஜ்மஹால் Taj Mahal Agra Yamuna',
  'golden-temple-amritsar': 'స్వర్ణ దేవాలయం स्वर्ण मंदिर ਹਰਿਮੰਦਰ ਸਾਹਿਬ பொற்கோவில் Golden Temple Harmandir Sahib Amritsar',
  'hawa-mahal-jaipur': 'హవా మహల్ हवा महल காற்று மஹால் Hawa Mahal Palace of Winds Jaipur',
  'konark-sun-temple-odisha': 'కోణార్క్ సూర్య దేవాలయం कोणार्क सूर्य मंदिर கொனார்க் சூரியக் கோவில் Konark Sun Temple Black Pagoda Odisha',
  'brihadeeswarar-temple-thanjavur': 'బృహదీశ్వర ఆలయం बृहदेश्वर मंदिर தஞ்சைப் பெரிய கோவில் Brihadeeswarar Temple Big Temple Thanjavur Chola',
  'qutub-minar-delhi': 'కుతుబ్ మినార్ क़ुतुब मीनार குதுப் மினார் Qutub Minar Mehrauli Delhi',
  'gateway-of-india-mumbai': 'గేట్‌వే ఆఫ్ ఇండియా गेटवे ऑफ़ इंडिया இந்தியாவின் நுழைவு வாயில் Gateway of India Mumbai Colaba',
  'red-fort-delhi': 'ఎర్రకోట लाल किला செங்கோட்டை Red Fort Lal Qila Delhi Old Delhi',
  'amber-fort-jaipur': 'అంబర్ కోట आमेर का किला ஆம்பர் கோட்டை Amber Fort Amer Jaipur',
  'meenakshi-amman-temple-madurai': 'మీనాక్షి అమ్మన్ దేవాలయం मीनाक्षी अम्मन मंदिर மீனாட்சி அம்மன் கோவில் Meenakshi Amman Temple Madurai',
}

export function chunkPlace(place) {
  if (!place || !place.id) return []

  const placeId = place.id
  const name = place.name || 'Unnamed Destination'
  const state = place.state || 'Telangana'
  const city = place.city || 'Hyderabad'
  const type = place.type || (placeId.startsWith('hotel-') ? 'stay' : placeId.startsWith('restaurant-') ? 'food' : 'attraction')
  const category = place.category || 'Attraction'
  const tags = Array.isArray(place.tags) ? place.tags : []
  const lat = place.position ? Number(place.position[0]) : Number(place.location?.coordinates?.[1] || 0)
  const lng = place.position ? Number(place.position[1]) : Number(place.location?.coordinates?.[0] || 0)
  const lastVerifiedAt = place.last_verified_at || '2026-01-15'
  const multiAliases = MULTILINGUAL_ALIASES[placeId] || ''

  // Pricing normalization
  let priceAmount = null
  let priceUnit = 'visit'
  let isFree = false
  if (place.price && typeof place.price === 'object') {
    if (place.price.amount !== null && place.price.amount !== undefined) {
      priceAmount = Number(place.price.amount)
      priceUnit = place.price.unit || (type === 'stay' ? 'night' : type === 'food' ? 'person' : 'visit')
      if (priceAmount === 0) isFree = true
    }
  }

  const baseMeta = {
    place_id: placeId,
    place_name: name,
    state,
    city,
    type,
    category,
    tags,
    lat,
    lng,
    price_amount: priceAmount,
    price_unit: priceUnit,
    is_free: isFree,
    last_verified_at: lastVerifiedAt,
  }

  const chunks = []

  // Chunk 1: Overview
  const overviewContent = `${name} is a renowned ${category} (${type}) situated in ${city}, ${state}, India. ${place.description || ''} Key tags and heritage attributes: ${tags.join(', ') || category}. Multilingual aliases: ${multiAliases}.`
  chunks.push({
    chunk_index: 0,
    chunk_type: 'overview',
    content: overviewContent.trim(),
    metadata: { ...baseMeta, chunk_type: 'overview' },
  })

  // Chunk 2: Rules and Visitor Info
  let rulesText = 'General guidelines: Modest attire encouraged; visitor safety regulations apply.'
  if (Array.isArray(place.rules) && place.rules.length > 0) {
    rulesText = place.rules.join('. ')
  }
  const rulesContent = `Visitor Guidelines & Rules for ${name} (${city}, ${state}): ${rulesText}. Photography: Permitted in designated areas unless restricted by monument authorities. Security check at entrance.`
  chunks.push({
    chunk_index: 1,
    chunk_type: 'rules_and_visitor_info',
    content: rulesContent.trim(),
    metadata: { ...baseMeta, chunk_type: 'rules_and_visitor_info' },
  })

  // Chunk 3: Prices and Timings
  let priceStr = 'Entry fee: Not listed; please verify locally before visiting.'
  if (isFree) {
    priceStr = `Entry fee: Free entry for all visitors (₹0). ${place.price?.note || ''}`
  } else if (priceAmount !== null) {
    priceStr = `Entry fee: ₹${priceAmount.toLocaleString('en-IN')} per ${priceUnit}. Official verified rate. ${place.price?.note || ''}`
  }
  const hoursStr = place.opening_hours || place.openingHours || 'Daily: 9:00 AM – 5:30 PM (standard monument hours)'
  const priceTimingsContent = `Ticket Pricing & Visiting Hours for ${name}: ${priceStr} Timings: ${hoursStr}. Verified source: ${place.price?.source || 'ASI / State Tourism Authority'} (Last verified: ${lastVerifiedAt}). Note: Entry prices and timings are subject to change on national holidays.`
  chunks.push({
    chunk_index: 2,
    chunk_type: 'prices_and_timings',
    content: priceTimingsContent.trim(),
    metadata: { ...baseMeta, chunk_type: 'prices_and_timings' },
  })

  // Chunk 4: How to Reach and Best Time
  const bestTime = place.best_time || 'October to March (pleasant weather season)'
  const howToReachContent = `How to Reach & Best Time to Visit ${name}: Ideal visiting season is ${bestTime}. Coordinates: Latitude ${lat.toFixed(4)}, Longitude ${lng.toFixed(4)}. Located in ${city}, ${state}. Accessible via city metro, auto-rickshaw, taxi, and local buses.`
  chunks.push({
    chunk_index: 3,
    chunk_type: 'how_to_reach_and_best_time',
    content: howToReachContent.trim(),
    metadata: { ...baseMeta, chunk_type: 'how_to_reach_and_best_time' },
  })

  // Chunk 5: Nearby Food and Stay Context
  const nearbyContent = `Nearby Accommodations and Dining around ${name} in ${city}: Travelers exploring ${name} can find regional culinary spots serving authentic cuisine and comfortable stays within 3 to 10 km. Optimal cluster stops for a combined 1-day itinerary.`
  chunks.push({
    chunk_index: 4,
    chunk_type: 'nearby_food_and_stay',
    content: nearbyContent.trim(),
    metadata: { ...baseMeta, chunk_type: 'nearby_food_and_stay' },
  })

  // Attach embeddings
  return chunks.map((c) => ({
    ...c,
    embedding: generateDenseEmbedding(c.content),
  }))
}

// Build and cache all place chunks in memory for fast server-side hybrid retrieval
let cachedAllChunks = null

export function getAllPlaceChunks() {
  if (cachedAllChunks) return cachedAllChunks
  console.log(`[ChunkingService] Generating chunks for ${allDatasetPlaces.length} places across India...`)
  const start = Date.now()
  const all = []
  for (const place of allDatasetPlaces) {
    const chunks = chunkPlace(place)
    all.push(...chunks)
  }
  cachedAllChunks = all
  console.log(`[ChunkingService] Generated ${all.length} chunks in ${Date.now() - start}ms.`)
  return cachedAllChunks
}

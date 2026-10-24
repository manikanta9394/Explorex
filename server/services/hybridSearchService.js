import { getAllPlaceChunks, generateDenseEmbedding } from './chunkingService.js'

// Haversine formula
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return null
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((R * c).toFixed(2))
}

// Cosine similarity between two float arrays
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Tokenize text into normalized tokens
function tokenize(text) {
  if (!text) return []
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1)
}

// Lexical BM25-style scorer
function computeBM25Score(queryTokens, chunk) {
  const contentTokens = tokenize(chunk.content)
  const titleTokens = tokenize(chunk.metadata.place_name)
  const tagTokens = tokenize((chunk.metadata.tags || []).join(' '))
  const stateCityTokens = tokenize(`${chunk.metadata.state} ${chunk.metadata.city}`)

  let score = 0
  const contentSet = new Set(contentTokens)
  const titleSet = new Set(titleTokens)

  for (const token of queryTokens) {
    // Exact place title match gets significant boost
    if (titleSet.has(token)) {
      score += 8.0
    }
    // State / city match
    if (stateCityTokens.includes(token)) {
      score += 4.0
    }
    // Tag match
    if (tagTokens.includes(token)) {
      score += 3.0
    }
    // Body content match
    if (contentSet.has(token)) {
      score += 1.5
    }
  }

  return score
}

/**
 * Execute Hybrid Search across all chunks using Reciprocal Rank Fusion (RRF)
 */
export async function hybridSearch({
  query,
  filters = {},
  userLocation = null, // [lat, lng] or { lat, lng }
  currentPlace = null,
  limit = 30,
}) {
  const allChunks = getAllPlaceChunks()
  if (!allChunks || allChunks.length === 0) return []

  const queryEmbedding = generateDenseEmbedding(query)
  const queryTokens = tokenize(query)

  // 1. Filter chunks by metadata (state, city, type, priceLimit)
  const placeMatchIds = new Set((filters.places || []).map((p) => p.id))

  const candidateChunks = allChunks.filter((chunk) => {
    const meta = chunk.metadata
    const isExplicitPlace = placeMatchIds.has(meta.place_id)

    // Never filter out the place if explicitly referenced in the user's query
    if (isExplicitPlace) return true

    if (filters.state && meta.state.toLowerCase() !== filters.state.toLowerCase()) {
      return false
    }
    if (filters.city) {
      const cLow = filters.city.toLowerCase()
      const mLow = meta.city.toLowerCase()
      const cityMatches = mLow === cLow || mLow.includes(cLow) || cLow.includes(mLow)
      if (!cityMatches) return false
    }
    if (filters.type && meta.type !== filters.type) {
      return false
    }
    if (filters.isFreeOnly && !meta.is_free) {
      return false
    }
    if (filters.priceLimit !== null && filters.priceLimit !== undefined) {
      if (meta.price_amount !== null && meta.price_amount > filters.priceLimit) {
        return false
      }
    }
    return true
  })

  // 2. Compute Vector Similarities
  const vectorRanked = candidateChunks
    .map((chunk) => ({
      chunk,
      vectorScore: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.vectorScore - a.vectorScore)

  // 3. Compute Lexical / BM25 Scores
  const lexicalRanked = candidateChunks
    .map((chunk) => ({
      chunk,
      lexicalScore: computeBM25Score(queryTokens, chunk),
    }))
    .sort((a, b) => b.lexicalScore - a.lexicalScore)

  // 4. Map Ranks for Reciprocal Rank Fusion (RRF constant k = 60)
  const k = 60
  const chunkScores = new Map()

  vectorRanked.forEach((item, rank) => {
    const key = `${item.chunk.metadata.place_id}_${item.chunk.chunk_index}`
    const rrfScore = 1.0 / (k + rank + 1)
    chunkScores.set(key, {
      chunk: item.chunk,
      vectorScore: item.vectorScore,
      lexicalScore: 0,
      rrfScore,
      distanceKm: null,
    })
  })

  lexicalRanked.forEach((item, rank) => {
    const key = `${item.chunk.metadata.place_id}_${item.chunk.chunk_index}`
    const rrfScore = 1.0 / (k + rank + 1)
    if (chunkScores.has(key)) {
      const existing = chunkScores.get(key)
      existing.rrfScore += rrfScore
      existing.lexicalScore = item.lexicalScore
    } else {
      chunkScores.set(key, {
        chunk: item.chunk,
        vectorScore: 0,
        lexicalScore: item.lexicalScore,
        rrfScore,
        distanceKm: null,
      })
    }
  })

  // 5. Geo-Awareness: Boost nearby places if user location or active place is known
  let targetLat = null
  let targetLng = null
  if (userLocation) {
    if (Array.isArray(userLocation) && userLocation.length >= 2) {
      targetLat = Number(userLocation[0])
      targetLng = Number(userLocation[1])
    } else if (typeof userLocation === 'object' && userLocation.lat && userLocation.lng) {
      targetLat = Number(userLocation.lat)
      targetLng = Number(userLocation.lng)
    }
  } else if (currentPlace && currentPlace.position) {
    targetLat = Number(currentPlace.position[0])
    targetLng = Number(currentPlace.position[1])
  }

  const results = Array.from(chunkScores.values())

  if (targetLat !== null && targetLng !== null) {
    results.forEach((item) => {
      const d = calculateDistanceKm(targetLat, targetLng, item.chunk.metadata.lat, item.chunk.metadata.lng)
      item.distanceKm = d
      // Proximity boost: if within 15 km, grant RRF boost
      if (d !== null && d <= 15) {
        const proximityBoost = (15 - d) / 15 * 0.02
        item.rrfScore += proximityBoost
      }
    })
  }

  // 6. Direct Place Entity Boost: if user explicitly named places, boost them to the top
  if (placeMatchIds.size > 0) {
    results.forEach((item) => {
      if (placeMatchIds.has(item.chunk.metadata.place_id)) {
        item.rrfScore += 0.20
      }
    })
  }

  // 7. Sort by combined RRF score and return top candidates
  results.sort((a, b) => b.rrfScore - a.rrfScore)

  return results.slice(0, limit)
}

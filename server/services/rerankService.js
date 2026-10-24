import { allDatasetPlaces } from '../data/tourismData.js'

/**
 * Re-ranks candidate chunks from hybrid search down to 6 - 8 focused chunks
 * and performs place deduplication to return clean, diverse, high-confidence context.
 */
export function rerankAndDeduplicate(candidates, { query, maxChunks = 8, singlePlaceFocus = false } = {}) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return {
      chunks: [],
      citedPlaces: [],
      maxScore: 0,
    }
  }

  const queryLower = (query || '').toLowerCase()

  // Cross-scoring adjustments
  const scored = candidates.map((item) => {
    let finalScore = item.rrfScore || 0
    const meta = item.chunk.metadata

    // 1. Direct place name query match boost
    if (queryLower.includes(meta.place_name.toLowerCase())) {
      finalScore += 0.05
    }

    // 2. Specific chunk intent match
    if (
      (queryLower.includes('price') || queryLower.includes('ticket') || queryLower.includes('fee') || queryLower.includes('cost') || queryLower.includes('timing') || queryLower.includes('hours')) &&
      item.chunk.chunk_type === 'prices_and_timings'
    ) {
      finalScore += 0.06
    }

    if (
      (queryLower.includes('rule') || queryLower.includes('dress') || queryLower.includes('camera') || queryLower.includes('photo') || queryLower.includes('guideline')) &&
      item.chunk.chunk_type === 'rules_and_visitor_info'
    ) {
      finalScore += 0.06
    }

    if (
      (queryLower.includes('reach') || queryLower.includes('metro') || queryLower.includes('best time') || queryLower.includes('season') || queryLower.includes('month') || queryLower.includes('when')) &&
      item.chunk.chunk_type === 'how_to_reach_and_best_time'
    ) {
      finalScore += 0.06
    }

    if (
      (queryLower.includes('food') || queryLower.includes('hotel') || queryLower.includes('stay') || queryLower.includes('eat') || queryLower.includes('near')) &&
      item.chunk.chunk_type === 'nearby_food_and_stay'
    ) {
      finalScore += 0.06
    }

    return {
      ...item,
      finalScore,
    }
  })

  // Sort by final cross-scored relevance
  scored.sort((a, b) => b.finalScore - a.finalScore)

  const selectedChunks = []
  const placeChunkCounts = new Map()
  const citedPlaceIds = []
  const maxPerPlace = singlePlaceFocus ? 4 : 2

  for (const item of scored) {
    const placeId = item.chunk.metadata.place_id
    const currentCount = placeChunkCounts.get(placeId) || 0

    if (currentCount < maxPerPlace) {
      selectedChunks.push(item.chunk)
      placeChunkCounts.set(placeId, currentCount + 1)
      if (!citedPlaceIds.includes(placeId)) {
        citedPlaceIds.push(placeId)
      }
    }

    if (selectedChunks.length >= maxChunks) break
  }

  // Map full place objects for UI citation cards
  const citedPlaces = citedPlaceIds
    .map((id, index) => {
      const p = allDatasetPlaces.find((x) => x.id === id)
      if (!p) return null
      return {
        citationIndex: index + 1,
        citationTag: `[${index + 1}]`,
        id: p.id,
        name: p.name,
        category: p.category,
        city: p.city,
        state: p.state,
        image: p.image,
        price: p.price,
        rating: p.rating,
        position: p.position,
        wikidata_id: p.wikidata_id,
        is_illustration: p.is_illustration,
      }
    })
    .filter(Boolean)

  const maxScore = scored[0]?.vectorScore || scored[0]?.finalScore || 0

  return {
    chunks: selectedChunks,
    citedPlaces,
    maxScore,
  }
}

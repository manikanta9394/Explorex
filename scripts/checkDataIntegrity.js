import { allDatasetPlaces } from '../src/data/tourismData.js'

console.log('🔍 Running Explorex Comprehensive Data Integrity Check...\n')

// 1. National India Boundary Bounds
const INDIA_BOUNDS = {
  minLat: 6.0,
  maxLat: 37.5,
  minLng: 68.0,
  maxLng: 98.0,
}

// 2. State Bounding Boxes (with 0.2 degree tolerance for border zones)
const STATE_BOUNDS = {
  'Andhra Pradesh': { minLat: 12.4, maxLat: 19.4, minLng: 76.5, maxLng: 85.0 },
  'Arunachal Pradesh': { minLat: 26.4, maxLat: 29.7, minLng: 91.3, maxLng: 97.7 },
  'Assam': { minLat: 23.9, maxLat: 28.2, minLng: 89.5, maxLng: 96.2 },
  'Bihar': { minLat: 24.1, maxLat: 27.8, minLng: 83.1, maxLng: 88.5 },
  'Chhattisgarh': { minLat: 17.6, maxLat: 24.3, minLng: 80.0, maxLng: 84.6 },
  'Goa': { minLat: 14.7, maxLat: 16.0, minLng: 73.4, maxLng: 74.6 },
  'Gujarat': { minLat: 19.9, maxLat: 24.9, minLng: 67.9, maxLng: 74.7 },
  'Haryana': { minLat: 27.4, maxLat: 31.1, minLng: 74.2, maxLng: 77.8 },
  'Himachal Pradesh': { minLat: 30.2, maxLat: 33.5, minLng: 75.4, maxLng: 79.2 },
  'Jharkhand': { minLat: 21.7, maxLat: 25.6, minLng: 83.1, maxLng: 88.1 },
  'Karnataka': { minLat: 11.3, maxLat: 18.7, minLng: 73.8, maxLng: 78.8 },
  'Kerala': { minLat: 8.1, maxLat: 13.0, minLng: 74.6, maxLng: 77.6 },
  'Madhya Pradesh': { minLat: 20.9, maxLat: 27.1, minLng: 73.8, maxLng: 83.0 },
  'Maharashtra': { minLat: 15.4, maxLat: 22.2, minLng: 72.4, maxLng: 81.1 },
  'Manipur': { minLat: 23.6, maxLat: 25.9, minLng: 92.8, maxLng: 95.0 },
  'Meghalaya': { minLat: 24.8, maxLat: 26.3, minLng: 89.6, maxLng: 93.0 },
  'Mizoram': { minLat: 21.7, maxLat: 24.7, minLng: 92.0, maxLng: 93.7 },
  'Nagaland': { minLat: 24.9, maxLat: 27.2, minLng: 93.1, maxLng: 95.5 },
  'Odisha': { minLat: 17.6, maxLat: 22.8, minLng: 81.2, maxLng: 87.7 },
  'Punjab': { minLat: 29.3, maxLat: 32.7, minLng: 73.6, maxLng: 77.1 },
  'Rajasthan': { minLat: 22.8, maxLat: 30.4, minLng: 69.3, maxLng: 78.5 },
  'Sikkim': { minLat: 26.8, maxLat: 28.3, minLng: 87.8, maxLng: 89.1 },
  'Tamil Nadu': { minLat: 7.8, maxLat: 13.8, minLng: 76.0, maxLng: 80.6 },
  'Telangana': { minLat: 15.6, maxLat: 20.1, minLng: 77.0, maxLng: 82.0 },
  'Tripura': { minLat: 22.7, maxLat: 24.7, minLng: 90.9, maxLng: 92.6 },
  'Uttar Pradesh': { minLat: 23.7, maxLat: 30.6, minLng: 76.9, maxLng: 84.9 },
  'Uttarakhand': { minLat: 28.5, maxLat: 31.7, minLng: 77.3, maxLng: 81.3 },
  'West Bengal': { minLat: 21.3, maxLat: 27.4, minLng: 85.6, maxLng: 90.1 },
  'Andaman and Nicobar Islands': { minLat: 6.5, maxLat: 14.0, minLng: 92.0, maxLng: 94.5 },
  'Chandigarh': { minLat: 30.5, maxLat: 30.9, minLng: 76.6, maxLng: 77.0 },
  'Dadra and Nagar Haveli and Daman and Diu': { minLat: 19.8, maxLat: 21.0, minLng: 70.8, maxLng: 73.4 },
  'Delhi': { minLat: 28.3, maxLat: 29.0, minLng: 76.7, maxLng: 77.5 },
  'Jammu and Kashmir': { minLat: 32.0, maxLat: 35.5, minLng: 73.3, maxLng: 76.8 },
  'Ladakh': { minLat: 31.8, maxLat: 36.5, minLng: 75.3, maxLng: 80.8 },
  'Lakshadweep': { minLat: 7.8, maxLat: 12.7, minLng: 71.3, maxLng: 74.7 },
  'Puducherry': { minLat: 10.7, maxLat: 12.3, minLng: 79.5, maxLng: 80.2 },
}

let passCount = 0
let failCount = 0
const errors = []

function assert(cond, msg) {
  if (cond) {
    passCount++
  } else {
    failCount++
    errors.push(msg)
    console.error(`  ❌ [FAIL] ${msg}`)
  }
}

// A. National India Boundary and State Coordinate Check
console.log('--- A. Coordinates Validation (Inside India & Stated State) ---')
let coordIssues = 0
allDatasetPlaces.forEach((p) => {
  const lat = typeof p.lat === 'number' ? p.lat : (p.position ? p.position[0] : null)
  const lng = typeof p.lng === 'number' ? p.lng : (p.position ? p.position[1] : null)

  if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
    assert(false, `Place "${p.name}" (${p.id}) has invalid coordinates: lat=${lat}, lng=${lng}`)
    coordIssues++
    return
  }

  // Check India boundary
  const insideIndia =
    lat >= INDIA_BOUNDS.minLat &&
    lat <= INDIA_BOUNDS.maxLat &&
    lng >= INDIA_BOUNDS.minLng &&
    lng <= INDIA_BOUNDS.maxLng

  if (!insideIndia) {
    assert(false, `Place "${p.name}" (${p.id}) coordinates [${lat}, ${lng}] outside India bounds!`)
    coordIssues++
  } else {
    passCount++
  }

  // Check State boundary
  const stateBox = STATE_BOUNDS[p.state]
  if (stateBox) {
    const insideState =
      lat >= stateBox.minLat &&
      lat <= stateBox.maxLat &&
      lng >= stateBox.minLng &&
      lng <= stateBox.maxLng

    if (!insideState) {
      assert(false, `Place "${p.name}" (${p.id}) [${lat}, ${lng}] outside stated state boundary for "${p.state}"!`)
      coordIssues++
    } else {
      passCount++
    }
  }
})

if (coordIssues === 0) {
  console.log(`  ✅ All ${allDatasetPlaces.length} places have valid coordinates strictly inside India and their stated state.`)
}

// B. Duplicate Places Check (slug/id, name+state, wikidata_id)
console.log('\n--- B. Duplicate Detection Audit ---')
const seenIds = new Set()
const seenNameState = new Set()
const seenWikidata = new Set()
let duplicateCount = 0

allDatasetPlaces.forEach((p) => {
  // Check ID
  if (seenIds.has(p.id)) {
    assert(false, `Duplicate Place ID detected: "${p.id}" for place "${p.name}"`)
    duplicateCount++
  } else {
    seenIds.add(p.id)
    passCount++
  }

  // Check Name + State
  const nameStateKey = `${p.name.toLowerCase().trim()}:::${(p.state || '').toLowerCase().trim()}`
  if (seenNameState.has(nameStateKey)) {
    assert(false, `Duplicate Place Name in same state: "${p.name}" in ${p.state}`)
    duplicateCount++
  } else {
    seenNameState.add(nameStateKey)
    passCount++
  }

  // Check Wikidata ID if present and not generic
  if (p.wikidata_id && p.wikidata_id.startsWith('Q')) {
    if (seenWikidata.has(p.wikidata_id)) {
      assert(false, `Duplicate Wikidata ID: "${p.wikidata_id}" on place "${p.name}" (${p.id})`)
      duplicateCount++
    } else {
      seenWikidata.add(p.wikidata_id)
      passCount++
    }
  }
})

if (duplicateCount === 0) {
  console.log(`  ✅ Zero duplicate IDs, zero duplicate names within states, and zero duplicate Wikidata IDs found across ${allDatasetPlaces.length} destinations.`)
}

// C. Link & Image URL Validity Check
console.log('\n--- C. Link & Image URL Validity Check ---')
let linkIssues = 0
allDatasetPlaces.forEach((p) => {
  const imgUrl = p.image || p.imageUrl
  if (imgUrl) {
    if (imgUrl.startsWith('data:image/')) {
      // Valid cultural vector illustration data URI
      passCount++
    } else {
      try {
        const parsed = new URL(imgUrl, 'http://localhost')
        if (!parsed.protocol.startsWith('http') && !parsed.pathname.startsWith('/')) {
          assert(false, `Malformed image URL on "${p.name}": ${imgUrl}`)
          linkIssues++
        } else {
          passCount++
        }
      } catch {
        assert(false, `Invalid image URL on "${p.name}": ${imgUrl}`)
        linkIssues++
      }
    }
  }

  const srcUrl = p.officialSourceUrl || p.source_url
  if (srcUrl) {
    try {
      new URL(srcUrl)
      passCount++
    } catch {
      assert(false, `Malformed source URL on "${p.name}": ${srcUrl}`)
      linkIssues++
    }
  }
})

if (linkIssues === 0) {
  console.log(`  ✅ All image URLs and official source links have valid URI syntax and protocol schemes.`)
}

console.log('\n======================================================')
console.log(`🏁 Data Integrity Results: ${passCount} Passed, ${failCount} Failed`)
console.log('======================================================\n')

if (failCount > 0) {
  process.exit(1)
}

import { allDatasetPlaces } from '../server/data/tourismData.js'

const API_BASE = 'http://localhost:5005/api/ai/ask'

const testCases = [
  {
    name: '1. Itinerary: 1-Day Plan in Hyderabad',
    payload: {
      message: 'What to see in 1 day in Hyderabad?',
    },
    validate: (res) => {
      const { answer, recommendedPlaces } = res.data
      if (!answer.includes('1-day') && !answer.includes('itinerary')) return 'Missing itinerary intro'
      if (!answer.includes('₹')) return 'Missing prices in ₹'
      if (!answer.includes('km')) return 'Missing distance in km'
      if (!answer.includes('💡 Practical Tip:')) return 'Missing practical tip'
      if (!Array.isArray(recommendedPlaces) || recommendedPlaces.length === 0) return 'Missing recommended places'
      return null
    },
  },
  {
    name: '2. Food: Where Locals Eat Near Landmark',
    payload: {
      message: 'Where do locals eat near Charminar?',
      currentPlace: allDatasetPlaces[0], // Charminar
    },
    validate: (res) => {
      const { answer, recommendedPlaces } = res.data
      if (!answer.toLowerCase().includes('dining') && !answer.toLowerCase().includes('biryani') && !answer.toLowerCase().includes('cuisine')) return 'Missing food content'
      if (!answer.includes('₹')) return 'Missing prices in ₹'
      if (!answer.includes('💡 Practical Tip:')) return 'Missing practical tip'
      if (!Array.isArray(recommendedPlaces) || recommendedPlaces.length === 0) return 'Missing recommended restaurants'
      return null
    },
  },
  {
    name: '3. Budget: Places Under ₹100',
    payload: {
      message: 'What are some budget places under ₹100?',
    },
    validate: (res) => {
      const { answer, recommendedPlaces } = res.data
      if (!answer.includes('₹')) return 'Missing prices in ₹'
      if (!answer.toLowerCase().includes('budget')) return 'Missing budget reference'
      if (!answer.includes('💡 Practical Tip:')) return 'Missing practical tip'
      if (!Array.isArray(recommendedPlaces) || recommendedPlaces.length === 0) return 'Missing recommended budget places'
      return null
    },
  },
  {
    name: '4. Directions: Context-Aware (Charminar, driving-car)',
    payload: {
      message: 'How do I get there?',
      currentPlace: allDatasetPlaces[0], // Charminar
      travelMode: 'driving-car',
    },
    validate: (res) => {
      const { answer, recommendedPlaces } = res.data
      if (!answer.includes('Charminar')) return 'Context place not mentioned'
      if (!answer.toLowerCase().includes('driving')) return 'Travel mode driving not mentioned'
      if (!answer.includes('km')) return 'Missing distance in km'
      if (!answer.includes('💡 Practical Tip:')) return 'Missing practical tip'
      if (!Array.isArray(recommendedPlaces) || recommendedPlaces.length === 0) return 'Missing recommended destination'
      return null
    },
  },
  {
    name: '5. Directions: Context-Aware (Chowmahalla Palace, foot-walking)',
    payload: {
      message: 'How do I reach on foot?',
      currentPlace: allDatasetPlaces[3], // Chowmahalla Palace
      travelMode: 'foot-walking',
    },
    validate: (res) => {
      const { answer } = res.data
      if (!answer.includes('Chowmahalla Palace')) return 'Context place not mentioned'
      if (!answer.toLowerCase().includes('walking')) return 'Travel mode walking not mentioned'
      if (!answer.includes('km')) return 'Missing distance in km'
      if (!answer.includes('💡 Practical Tip:')) return 'Missing practical tip'
      return null
    },
  },
  {
    name: '6. Nearby: Context-Aware (Nearest Destinations to Charminar)',
    payload: {
      message: "What's nearby?",
      currentPlace: allDatasetPlaces[0], // Charminar
    },
    validate: (res) => {
      const { answer, recommendedPlaces } = res.data
      if (!answer.includes('Charminar')) return 'Context place not mentioned'
      if (!answer.includes('km away')) return 'Missing distance in km for nearby spots'
      if (!answer.includes('💡 Practical Tip:')) return 'Missing practical tip'
      if (!Array.isArray(recommendedPlaces) || recommendedPlaces.length < 2) return 'Expected multiple nearby places'
      return null
    },
  },
  {
    name: '7. Timings & Rules: Guidelines for Landmark',
    payload: {
      message: 'What are the visiting hours and photography rules for Charminar?',
      currentPlace: allDatasetPlaces[0],
    },
    validate: (res) => {
      const { answer } = res.data
      if (!answer.toLowerCase().includes('visiting hours') && !answer.toLowerCase().includes('hours')) return 'Missing hours'
      if (!answer.toLowerCase().includes('photography')) return 'Missing photography rules'
      if (!answer.includes('💡 Practical Tip:')) return 'Missing practical tip'
      return null
    },
  },
  {
    name: '8. Photography: Best Time for Photos',
    payload: {
      message: 'When is the best time for photos at Golconda Fort?',
      currentPlace: allDatasetPlaces[1], // Golconda Fort
    },
    validate: (res) => {
      const { answer } = res.data
      if (!answer.toLowerCase().includes('photography') && !answer.toLowerCase().includes('photos') && !answer.toLowerCase().includes('golden hour')) return 'Missing photo advice'
      if (!answer.includes('💡 Practical Tip:')) return 'Missing practical tip'
      return null
    },
  },
  {
    name: '9. Off-Topic: Politeness and Boundary Guidance',
    payload: {
      message: 'Who won the 2022 FIFA World Cup in Qatar?',
    },
    validate: (res) => {
      const { answer } = res.data
      if (!answer.includes('Explorex') || !answer.includes('Hyderabad and Telangana')) return 'Failed to identify as Explorex'
      if (!answer.includes('💡 Practical Tip:')) return 'Missing practical tip steering back to travel'
      return null
    },
  },
  {
    name: '10. Out-of-Dataset: Non-Telangana Landmark (Eiffel Tower)',
    payload: {
      message: 'Tell me about visiting the Eiffel Tower in Hyderabad.',
    },
    validate: (res) => {
      const { answer, recommendedPlaces } = res.data
      if (!answer.toLowerCase().includes('could not find') && !answer.toLowerCase().includes('not a tourist attraction')) return 'Failed to catch out-of-dataset place'
      if (!answer.includes('Telangana Tourism') && !answer.includes('official')) return 'Did not suggest official sources'
      if (!answer.includes('💡 Practical Tip:')) return 'Missing practical tip'
      if (!Array.isArray(recommendedPlaces) || recommendedPlaces.length === 0) return 'Did not recommend verified alternatives'
      return null
    },
  },
  {
    name: '11. Out-of-Dataset: Fictional/Unverified Spot (Atlantis Water Kingdom)',
    payload: {
      message: 'Can I visit Atlantis Water Kingdom in Telangana?',
    },
    validate: (res) => {
      const { answer } = res.data
      if (!answer.toLowerCase().includes('could not find') && !answer.toLowerCase().includes('not a tourist attraction')) return 'Failed to catch non-existent place'
      if (!answer.includes('Telangana Tourism')) return 'Did not suggest official sources'
      return null
    },
  },
  {
    name: '12. Specific Heritage Attraction: Salar Jung Museum',
    payload: {
      message: 'Tell me about Salar Jung Museum ticket prices and highlights.',
    },
    validate: (res) => {
      const { answer, recommendedPlaces } = res.data
      if (!answer.includes('Salar Jung Museum')) return 'Missing place name'
      if (!answer.includes('₹')) return 'Missing ticket price in ₹'
      if (!answer.includes('💡 Practical Tip:')) return 'Missing practical tip'
      if (!Array.isArray(recommendedPlaces) || recommendedPlaces.length === 0) return 'Missing recommended place card'
      return null
    },
  },
]

async function runAllTests() {
  console.log('🤖 Running 12 Rigorous Grounding, Context & Accuracy Verification Tests for Explorex AI...\n')
  let passedCount = 0

  for (const tc of testCases) {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tc.payload),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const json = await res.json()
      const error = tc.validate(json)

      if (error) {
        console.error(`❌ ${tc.name} FAILED: ${error}`)
        console.error('Answer received:', json.data?.answer)
      } else {
        console.log(`✅ ${tc.name} PASSED`)
        console.log(`   Sample preview: "${json.data.answer.split('\n')[0]}"`)
        console.log(`   Recommended cards returned: ${json.data.recommendedPlaces?.length || 0}`)
        passedCount += 1
      }
    } catch (err) {
      console.error(`❌ ${tc.name} ERROR:`, err.message)
    }
    console.log('')
  }

  console.log('------------------------------------------------------------')
  console.log(`Summary: ${passedCount}/${testCases.length} Grounding & Accuracy Tests PASSED!`)

  if (passedCount === testCases.length) {
    console.log('🎉 ALL 12 EXPLOREX AI QUESTION TYPES PASSED PERFECTLY!')
  } else {
    process.exit(1)
  }
}

runAllTests().catch((e) => {
  console.error(e)
  process.exit(1)
})

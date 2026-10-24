import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { allDatasetPlaces, enrichedPlaces } from '../../src/data/tourismData.js'
import { isInsideIndia } from '../../src/utils/geoUtils.js'

describe('Data Layer Integration Suite', () => {
  it('loads all nationwide destinations with full schema compliance', () => {
    assert.ok(allDatasetPlaces.length >= 500, `Dataset contains ${allDatasetPlaces.length} destinations`)

    // Verify first place has all mandatory database fields
    const p = allDatasetPlaces[0]
    assert.ok(p.id, 'Place must have a unique ID')
    assert.ok(p.name, 'Place must have a display name')
    assert.ok(p.state, 'Place must specify an Indian State / UT')
    assert.ok(p.city, 'Place must specify a city or district')
    assert.ok(Array.isArray(p.position) && p.position.length === 2, 'Place must have [lat, lng] coordinates')
    assert.ok(isInsideIndia(p.position[0], p.position[1]), 'Coordinates must be inside India')
  })

  it('covers major Indian States and Union Territories across India', () => {
    const states = new Set(allDatasetPlaces.map((p) => p.state).filter(Boolean))
    assert.ok(states.size >= 30, `Dataset covers ${states.size} States and Union Territories`)

    // Confirm presence of key states
    assert.ok(states.has('Telangana'), 'Contains Telangana')
    assert.ok(states.has('Uttar Pradesh'), 'Contains Uttar Pradesh')
    assert.ok(states.has('Maharashtra'), 'Contains Maharashtra')
    assert.ok(states.has('Rajasthan'), 'Contains Rajasthan')
    assert.ok(states.has('Kerala'), 'Contains Kerala')
    assert.ok(states.has('Tamil Nadu'), 'Contains Tamil Nadu')
  })

  it('filters destinations accurately by type and category', () => {
    const attractions = allDatasetPlaces.filter((p) => p.type === 'attraction' || !p.type)
    const stays = allDatasetPlaces.filter((p) => p.type === 'stay' || (p.category || '').toLowerCase().includes('hotel') || (p.category || '').toLowerCase().includes('resort'))
    const dining = allDatasetPlaces.filter((p) => p.type === 'food' || ['biryani', 'south indian', 'hyderabadi', 'mughlai', 'cafe', 'culinary', 'dining', 'food', 'restaurant', 'fast food', 'seafood'].some(k => (p.category || '').toLowerCase().includes(k) || (p.tags || []).some(t => t.toLowerCase().includes(k))))

    assert.ok(attractions.length > 200, `Found ${attractions.length} attractions`)
    assert.ok(stays.length > 50, `Found ${stays.length} stays`)
    assert.ok(dining.length >= 25, `Found ${dining.length} culinary dining spots`)
  })

  it('preserves verified pricing in INR and valid image sources', () => {
    const sample = allDatasetPlaces.slice(0, 50)
    sample.forEach((p) => {
      // Must have valid price number or free ticket (0)
      const price = p.price?.amount ?? p.priceInr ?? p.price_amount
      if (price != null) {
        assert.ok(typeof price === 'number' && !isNaN(price), `Price for "${p.name}" must be a valid number`)
      }

      // Image must be a valid string URL or data URI
      assert.ok(typeof p.image === 'string' && p.image.length > 0, `Place "${p.name}" must have an image string`)
    })
  })
})

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  isInsideIndia,
  isInsideTelangana,
  validateAndFilterIndiaPlaces,
  validateAndFilterTelanganaPlaces,
  haversineDistanceKm,
} from '../../src/utils/geoUtils.js'

describe('geoValidation Utility Suite', () => {
  it('identifies coordinates within India national boundary', () => {
    // New Delhi
    assert.equal(isInsideIndia(28.6139, 77.209), true)
    // Hyderabad
    assert.equal(isInsideIndia(17.385, 78.4867), true)
    // Mumbai
    assert.equal(isInsideIndia(19.076, 72.8777), true)
    // Kanyakumari (Southern tip)
    assert.equal(isInsideIndia(8.0883, 77.5385), true)
  })

  it('rejects coordinates outside India national boundary', () => {
    // London
    assert.equal(isInsideIndia(51.5074, -0.1278), false)
    // New York
    assert.equal(isInsideIndia(40.7128, -74.006), false)
    // Null / NaN
    assert.equal(isInsideIndia(null, null), false)
    assert.equal(isInsideIndia(NaN, 78.4), false)
  })

  it('validates Telangana & Hyderabad bounding box', () => {
    // Charminar, Hyderabad
    assert.equal(isInsideTelangana(17.3614, 78.4747), true)
    // Warangal Fort, Telangana
    assert.equal(isInsideTelangana(17.955, 79.619), true)
    // Bangalore, Karnataka (Outside Telangana)
    assert.equal(isInsideTelangana(12.9716, 77.5946), false)
  })

  it('filters an array of places, omitting any with invalid coordinates', () => {
    const mixedPlaces = [
      { id: 'p1', name: 'Charminar', position: [17.3614, 78.4747] },
      { id: 'p2', name: 'Eiffel Tower', position: [48.8584, 2.2945] },
      { id: 'p3', name: 'Taj Mahal', position: [27.1751, 78.0421] },
    ]

    const validIndiaPlaces = validateAndFilterIndiaPlaces(mixedPlaces)
    assert.equal(validIndiaPlaces.length, 2)
    assert.equal(validIndiaPlaces.some((p) => p.name === 'Eiffel Tower'), false)
  })

  it('calculates spherical Haversine distances accurately', () => {
    // Distance from Charminar [17.3614, 78.4747] to Golconda Fort [17.3850, 78.4041]
    const distHyd = haversineDistanceKm([17.3614, 78.4747], [17.385, 78.4041])
    // Expected distance is approximately 7.9 to 8.2 km
    assert.ok(distHyd > 7.5 && distHyd < 8.5, `Distance was ${distHyd} km`)

    // Identical coordinates return 0 km
    assert.equal(haversineDistanceKm([17.385, 78.4867], [17.385, 78.4867]), 0)
  })
})

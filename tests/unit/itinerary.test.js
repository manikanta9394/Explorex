import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  filterPlacesByInterests,
  estimateTransitMinutes,
  calculateItineraryMetrics,
  calculateExpenseSplits,
} from '../../src/utils/itineraryUtils.js'

describe('itineraryUtils Utility Suite', () => {
  const samplePlaces = [
    { id: '1', name: 'Golconda Fort', category: 'Historical Fort', tags: ['heritage', 'history'] },
    { id: '2', name: 'Birla Mandir', category: 'Temple', tags: ['spiritual', 'temple'] },
    { id: '3', name: 'Hussain Sagar Lake', category: 'Lake', tags: ['nature', 'water'] },
    { id: '4', name: 'Wonderla Amusement Park', category: 'Theme Park', tags: ['entertainment', 'fun'] },
    { id: '5', name: 'Shilparamam Craft Village', category: 'Cultural Village', tags: ['art', 'culture', 'craft'] },
  ]

  it('filters places based on user interest categories', () => {
    const spiritualOnly = filterPlacesByInterests(samplePlaces, ['spiritual'])
    assert.equal(spiritualOnly.length, 1)
    assert.equal(spiritualOnly[0].name, 'Birla Mandir')

    const historyAndNature = filterPlacesByInterests(samplePlaces, ['history', 'nature'])
    assert.equal(historyAndNature.length, 2)
  })

  it('returns all places when interests array is empty', () => {
    const all = filterPlacesByInterests(samplePlaces, [])
    assert.equal(all.length, samplePlaces.length)
  })

  it('estimates realistic urban transit minutes based on distance', () => {
    assert.equal(estimateTransitMinutes(0), 0)
    // 5 km in urban traffic (~22 km/h) takes ~14 minutes
    const mins5km = estimateTransitMinutes(5)
    assert.ok(mins5km >= 12 && mins5km <= 16, `Estimated ${mins5km} mins for 5 km`)
  })

  it('calculates total day distance and transit metrics', () => {
    const stops = [
      { place: { position: [17.3614, 78.4747] }, slot: 'Stop 1' },
      { place: { position: [17.385, 78.4041] }, slot: 'Stop 2' }, // ~8 km
      { place: { position: [17.4062, 78.4691] }, slot: 'Stop 3' }, // ~7 km
    ]

    const metrics = calculateItineraryMetrics(stops)
    assert.ok(metrics.totalKm > 14 && metrics.totalKm < 17, `Total distance was ${metrics.totalKm} km`)
    assert.ok(metrics.totalTransitMins > 25, `Total transit was ${metrics.totalTransitMins} mins`)
    assert.equal(stops[stops.length - 1].distanceNextKm, 0)
  })

  it('calculates fair group expense splits and settles debts', () => {
    const travellers = ['Aarav', 'Diya', 'Rohan']
    const expenses = [
      { description: 'Fort Tickets', amount: 900, paidBy: 'Aarav' },
      { description: 'Lunch Biryani', amount: 1500, paidBy: 'Diya' },
      { description: 'Cab Rental', amount: 600, paidBy: 'Aarav' },
    ]

    const result = calculateExpenseSplits(expenses, travellers)
    // Total = 3000, 3 travellers -> 1000 per person
    assert.equal(result.totalAmount, 3000)
    assert.equal(result.perPersonShare, 1000)

    // Aarav paid 1500 (owed 500), Diya paid 1500 (owed 500), Rohan paid 0 (owes 1000)
    assert.equal(result.settlements.length, 2)
    assert.ok(result.settlements.some((s) => s.from === 'Rohan' && s.to === 'Aarav' && s.amount === 500))
    assert.ok(result.settlements.some((s) => s.from === 'Rohan' && s.to === 'Diya' && s.amount === 500))
  })
})

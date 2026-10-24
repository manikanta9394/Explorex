import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formatINR, formatPriceWithUnit } from '../../src/utils/formatCurrency.js'

describe('formatCurrency Utility Suite', () => {
  it('formats regular amounts into INR with Indian currency symbol', () => {
    assert.equal(formatINR(500), '₹500')
    assert.equal(formatINR(2499), '₹2,499')
  })

  it('formats large amounts with Indian comma grouping (en-IN)', () => {
    // In India, 150000 is 1,50,000 (one lakh fifty thousand)
    assert.equal(formatINR(150000), '₹1,50,000')
    assert.equal(formatINR(10000000), '₹1,00,00,000') // 1 crore
  })

  it('handles null, undefined and zero safely', () => {
    assert.equal(formatINR(0), '₹0')
    assert.equal(formatINR(null), '₹0')
    assert.equal(formatINR(undefined), '₹0')
    assert.equal(formatINR(NaN), '₹0')
  })

  it('formats price object with custom units', () => {
    const formattedHotel = formatPriceWithUnit({ amount: 4500, unit: 'night' })
    assert.equal(formattedHotel.priceDisplay, '₹4,500')
    assert.equal(formattedHotel.unitDisplay, 'night')
    assert.equal(formattedHotel.fullDisplay, '₹4,500 / night')

    const formattedAttraction = formatPriceWithUnit({ amount: 50, unit: 'person' })
    assert.equal(formattedAttraction.priceDisplay, '₹50')
    assert.equal(formattedAttraction.unitDisplay, 'person')
  })

  it('provides sensible fallback defaults when price object is missing', () => {
    const fallbackHotel = formatPriceWithUnit(null, 'hotel')
    assert.equal(fallbackHotel.unitDisplay, 'night')

    const fallbackFood = formatPriceWithUnit(null, 'restaurant')
    assert.equal(fallbackFood.unitDisplay, 'person')
  })
})

/**
 * Formats an amount into Indian Rupee string with Indian number grouping (en-IN)
 * e.g., 2499 -> "₹2,499", 35000 -> "₹35,000", 300 -> "₹300"
 */
export function formatINR(amount) {
  if (amount == null || isNaN(amount)) return '₹0'
  const numericAmount = Math.round(Number(amount))
  return `₹${numericAmount.toLocaleString('en-IN')}`
}

/**
 * Returns formatted price object containing formatted price string and unit
 */
export function formatPriceWithUnit(priceObj, fallbackType = '') {
  if (!priceObj || typeof priceObj !== 'object') {
    const defaultAmount = fallbackType === 'hotel' ? 7499 : fallbackType === 'restaurant' ? 800 : 300
    const defaultUnit = fallbackType === 'hotel' ? 'night' : fallbackType === 'restaurant' ? 'person' : 'visit'
    return {
      priceDisplay: formatINR(defaultAmount),
      unitDisplay: defaultUnit,
      fullDisplay: `${formatINR(defaultAmount)} / ${defaultUnit}`,
    }
  }

  const amount = priceObj.amount ?? (fallbackType === 'hotel' ? 7499 : 300)
  const unit = priceObj.unit || (fallbackType === 'hotel' ? 'night' : fallbackType === 'restaurant' ? 'person' : 'visit')

  return {
    priceDisplay: formatINR(amount),
    unitDisplay: unit,
    fullDisplay: `${formatINR(amount)} / ${unit}`,
  }
}

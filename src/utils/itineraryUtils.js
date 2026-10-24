import { haversineDistanceKm } from './geoUtils.js'

export function filterPlacesByInterests(places, interests = []) {
  if (!Array.isArray(places)) return []
  if (!interests || interests.length === 0) return places

  return places.filter((p) => {
    const text = `${p.category || ''} ${p.name || ''} ${p.description || ''} ${(p.tags || []).join(' ')}`.toLowerCase()
    return interests.some((interest) => {
      switch (interest.toLowerCase()) {
        case 'history':
          return text.includes('fort') || text.includes('palace') || text.includes('tomb') || text.includes('history') || text.includes('heritage') || text.includes('museum')
        case 'culture':
          return text.includes('art') || text.includes('culture') || text.includes('craft') || text.includes('bazaar') || text.includes('tradition')
        case 'nature':
          return (
            text.includes('lake') ||
            text.includes('garden') ||
            (text.includes('park') && !text.includes('theme park') && !text.includes('amusement')) ||
            text.includes('hill') ||
            text.includes('water') ||
            text.includes('wildlife') ||
            text.includes('nature') ||
            text.includes('sanctuary') ||
            text.includes('waterfall')
          )
        case 'spiritual':
          return text.includes('temple') || text.includes('mandir') || text.includes('masjid') || text.includes('mosque') || text.includes('buddha') || text.includes('church') || text.includes('spiritual')
        case 'fun':
          return text.includes('amusement') || text.includes('entertainment') || text.includes('wonderla') || text.includes('science') || text.includes('fun') || text.includes('film')
        default:
          return true
      }
    })
  })
}

export function estimateTransitMinutes(distKm) {
  if (distKm <= 0) return 0
  const avgSpeedKmh = 22 // Realistic Indian city urban transit speed
  const transitMins = Math.round((distKm / avgSpeedKmh) * 60)
  return Math.max(8, Math.min(transitMins, 75))
}

export function calculateItineraryMetrics(dayStops) {
  let totalKm = 0
  let totalTransitMins = 0

  for (let i = 0; i < dayStops.length; i++) {
    if (i < dayStops.length - 1) {
      const c1 = dayStops[i].place?.position || [17.385, 78.4867]
      const c2 = dayStops[i + 1].place?.position || [17.385, 78.4867]
      const dist = haversineDistanceKm(c1, c2)
      const transit = estimateTransitMinutes(dist)
      dayStops[i].distanceNextKm = dist
      dayStops[i].transitMins = transit
      totalKm += dist
      totalTransitMins += transit
    } else {
      dayStops[i].distanceNextKm = 0
      dayStops[i].transitMins = 0
    }
  }

  return {
    totalKm: Number(totalKm.toFixed(1)),
    totalTransitMins,
  }
}

/**
 * Group Expense Splitter Algorithm
 * Computes net balances and resolves who owes whom with minimal transaction transfers.
 */
export function calculateExpenseSplits(expenses, travellers = []) {
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return { totalAmount: 0, perPersonShare: 0, settlements: [] }
  }

  const totalAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  const people = Array.from(new Set([...travellers, ...expenses.map((e) => e.paidBy)])).filter(Boolean)
  const n = Math.max(people.length, 1)
  const perPersonShare = Math.round(totalAmount / n)

  // Net balance map: positive means person is owed money, negative means person owes money
  const balance = {}
  people.forEach((p) => (balance[p] = 0))

  expenses.forEach((e) => {
    const paidBy = e.paidBy || 'Member'
    const amt = Number(e.amount) || 0
    balance[paidBy] = (balance[paidBy] || 0) + amt
  })

  people.forEach((p) => {
    balance[p] = (balance[p] || 0) - perPersonShare
  })

  // Debt settlement resolution
  const debtors = []
  const creditors = []
  Object.entries(balance).forEach(([person, bal]) => {
    if (bal < -1) debtors.push({ person, owes: -bal })
    else if (bal > 1) creditors.push({ person, isOwed: bal })
  })

  const settlements = []
  let dIdx = 0
  let cIdx = 0

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx]
    const creditor = creditors[cIdx]
    const transfer = Math.min(debtor.owes, creditor.isOwed)

    if (transfer > 0) {
      settlements.push({
        from: debtor.person,
        to: creditor.person,
        amount: Math.round(transfer),
      })
    }

    debtor.owes -= transfer
    creditor.isOwed -= transfer

    if (debtor.owes <= 1) dIdx++
    if (creditor.isOwed <= 1) cIdx++
  }

  return {
    totalAmount,
    perPersonShare,
    settlements,
  }
}

import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  Check,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  Link2,
  MapPin,
  Minus,
  Navigation,
  Plus,
  RotateCcw,
  Scissors,
  Share2,
  Sparkles,
  Star,
  Users,
  Utensils,
  Wallet,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SafeImage from '../components/SafeImage'
import GroupExpenseSplitter from '../components/GroupExpenseSplitter'
import { enrichedPlaces, enrichedRestaurants, enrichedHotels } from '../data/tourismData'

// 5 Specific Travel Interests Required by Spec
const INTEREST_OPTIONS = [
  { id: 'history', label: 'History & Forts', icon: '🏛️', desc: 'Fortresses, palaces & Asaf Jahi tombs' },
  { id: 'culture', label: 'Culture & Arts', icon: '🎭', desc: 'Museums, lacquer bazaars & crafts' },
  { id: 'nature', label: 'Nature & Lakes', icon: '🌿', desc: 'Waterfronts, gardens & scenic hills' },
  { id: 'spiritual', label: 'Spiritual Heritage', icon: '🛕', desc: 'Temples, mosques & sacred shrines' },
  { id: 'fun', label: 'Fun & Entertainment', icon: '🎡', desc: 'Amusement parks, film cities & science' },
]

// Haversine Distance Calculator (km)
function haversineDistanceKm(coords1, coords2) {
  if (!coords1 || !coords2) return 2.4
  const lat1 = Array.isArray(coords1) ? coords1[0] : coords1.lat || coords1.latitude
  const lon1 = Array.isArray(coords1) ? coords1[1] : coords1.lng || coords1.longitude
  const lat2 = Array.isArray(coords2) ? coords2[0] : coords2.lat || coords2.latitude
  const lon2 = Array.isArray(coords2) ? coords2[1] : coords2.lng || coords2.longitude
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return 2.4

  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const calculated = Number((R * c).toFixed(1))
  // Even spots with identical coordinate pins have an authentic ~0.4 km walking separation
  return Math.max(0.4, calculated)
}

// Estimate transit duration in minutes based on distance
function estimateTransitMinutes(distKm) {
  if (distKm <= 0.5) return 6
  // Average Hyderabad urban traffic speed ~22 km/h + 3 min transition buffer
  const mins = Math.round((distKm / 22) * 60 + 3)
  return Math.max(6, mins)
}

// Match place by the 5 specific interests
function matchesInterest(place, selectedInterests) {
  if (!selectedInterests || selectedInterests.length === 0) return true
  const text = `${place.name} ${place.category} ${place.description || ''}`.toLowerCase()

  return selectedInterests.some((interest) => {
    switch (interest) {
      case 'history':
        return (
          text.includes('fort') ||
          text.includes('palace') ||
          text.includes('monument') ||
          text.includes('tomb') ||
          text.includes('heritage') ||
          text.includes('history') ||
          text.includes('charminar') ||
          text.includes('museum')
        )
      case 'culture':
        return (
          text.includes('museum') ||
          text.includes('art') ||
          text.includes('craft') ||
          text.includes('bazaar') ||
          text.includes('shilparamam') ||
          text.includes('culture') ||
          text.includes('village') ||
          text.includes('nizam')
        )
      case 'nature':
        return (
          text.includes('lake') ||
          text.includes('garden') ||
          text.includes('park') ||
          text.includes('hill') ||
          text.includes('water') ||
          text.includes('zoo') ||
          text.includes('nature') ||
          text.includes('cheruvu')
        )
      case 'spiritual':
        return (
          text.includes('temple') ||
          text.includes('mandir') ||
          text.includes('masjid') ||
          text.includes('mosque') ||
          text.includes('buddha') ||
          text.includes('church') ||
          text.includes('dargah') ||
          text.includes('spiritual')
        )
      case 'fun':
        return (
          text.includes('film') ||
          text.includes('amusement') ||
          text.includes('wonderla') ||
          text.includes('science') ||
          text.includes('snow') ||
          text.includes('planetarium') ||
          text.includes('fun') ||
          text.includes('entertainment')
        )
      default:
        return false
    }
  })
}

// Canonical Day Anchor Seeds for Geographic Diversification
const DAY_SEED_AREAS = [
  {
    day: 1,
    theme: 'Old City & Royal Charminar Heritage',
    sub: 'Centuries of Nizami architecture, bustling lacquer bazaars, and royal dining.',
    anchorName: 'Charminar',
    seedCoords: [17.3614, 78.4747],
  },
  {
    day: 2,
    theme: 'Golconda Fort, Tombs & Acoustic Marvels',
    sub: 'Medieval hill citadel, whispering arches, royal mausoleums, and sunset vistas.',
    anchorName: 'Golconda Fort',
    seedCoords: [17.385, 78.4041],
  },
  {
    day: 3,
    theme: 'Hussain Sagar, Monolith Buddha & Birla Mandir',
    sub: 'Sparkling waterfront breezes, white marble shrines, and scenic shoreline walks.',
    anchorName: 'Birla Mandir',
    seedCoords: [17.4062, 78.4691],
  },
  {
    day: 4,
    theme: 'Crafts, High-Tech Hyderabad & Durgam Cheruvu',
    sub: 'Artisan craft villages, suspension lake bridges, and contemporary Telangana flair.',
    anchorName: 'Shilparamam',
    seedCoords: [17.4526, 78.3784],
  },
]

export default function TripPlannerPage({ onNavigate, onSelectPlace, onGetDirections }) {
  // Parse query parameters for Shareable Trip Link
  const getInitialParams = () => {
    if (typeof window === 'undefined') return {}
    try {
      const search =
        window.location.search ||
        (window.location.hash?.includes('?') ? window.location.hash.split('?')[1] : '')
      const params = new URLSearchParams(search)
      return {
        days: params.get('days') ? Math.min(4, Math.max(1, parseInt(params.get('days'), 10))) : null,
        travellers: params.get('travellers') ? Math.min(10, Math.max(1, parseInt(params.get('travellers'), 10))) : null,
        budget: params.get('budget') ? Math.min(15000, Math.max(500, parseInt(params.get('budget'), 10))) : null,
        interests: params.get('interests') ? params.get('interests').split(',').filter(Boolean) : null,
        hotel: params.get('hotel') !== null ? params.get('hotel') === '1' || params.get('hotel') === 'true' : null,
        trim: params.get('trim') !== null ? params.get('trim') === '1' || params.get('trim') === 'true' : null,
        isShared: params.has('days') || params.get('shared') === '1',
      }
    } catch {
      return {}
    }
  }

  const initialParams = useMemo(() => getInitialParams(), [])

  // 1. Mandatory User Inputs
  const [durationDays, setDurationDays] = useState(initialParams.days || 2) // 1 to 4 days
  const [travellers, setTravellers] = useState(initialParams.travellers || 2) // Number of travellers (1 to 10)
  const [budgetPerPerson, setBudgetPerPerson] = useState(initialParams.budget || 3000) // ₹ slider (500 to 15,000)
  const [selectedInterests, setSelectedInterests] = useState(initialParams.interests || ['history', 'culture']) // history, culture, nature, spiritual, fun
  const [includeHotel, setIncludeHotel] = useState(initialParams.hotel !== null ? initialParams.hotel : true) // toggle "include hotel"
  const [trimStops, setTrimStops] = useState(initialParams.trim !== null ? initialParams.trim : false) // toggle "trim stops to fit budget"

  // UI state
  const [activeDayTab, setActiveDayTab] = useState(1)
  const [copied, setCopied] = useState(false)
  const [sharedCopied, setSharedCopied] = useState(false)
  const [isSharedPlan, setIsSharedPlan] = useState(Boolean(initialParams.isShared))

  // Update inputs if URL query parameters change (e.g. following a shared trip link)
  useEffect(() => {
    const handleUrlUpdate = () => {
      const p = getInitialParams()
      if (p.isShared) {
        if (p.days) setDurationDays(p.days)
        if (p.travellers) setTravellers(p.travellers)
        if (p.budget) setBudgetPerPerson(p.budget)
        if (p.interests) setSelectedInterests(p.interests)
        if (p.hotel !== null) setIncludeHotel(p.hotel)
        if (p.trim !== null) setTrimStops(p.trim)
        setIsSharedPlan(true)
      }
    }
    window.addEventListener('hashchange', handleUrlUpdate)
    window.addEventListener('popstate', handleUrlUpdate)
    return () => {
      window.removeEventListener('hashchange', handleUrlUpdate)
      window.removeEventListener('popstate', handleUrlUpdate)
    }
  }, [])

  // Toggle interest item
  const toggleInterest = (id) => {
    setSelectedInterests((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev // keep at least 1 selected
        return prev.filter((item) => item !== id)
      }
      return [...prev, id]
    })
  }

  // 2. Generate Plan with Nearest-Neighbour Proximity & Midpoint Lunch
  const { generatedDays, trimmedMessage, totalTripCostPerPerson, costBreakdown } = useMemo(() => {
    const visitedPlaceIds = new Set()
    const daysResult = []
    let allTrimmedStopNames = []

    // Base estimated costs per person
    const dailyMealCostPerPerson = 550 // lunch + evening chai/snacks
    const totalMealsCostPerPerson = dailyMealCostPerPerson * durationDays

    // Hotel cost estimation: ~₹2,200/night/room divided across travellers
    // E.g., for 2 travellers, ₹1,100/night/person
    const roomCostPerNight = 2200
    const nights = Math.max(1, durationDays - 1)
    const roomsNeeded = Math.ceil(travellers / 2)
    const totalStayCostPerPerson = includeHotel
      ? Math.round((roomsNeeded * roomCostPerNight * nights) / travellers)
      : 0

    // Filter candidate places by selected interests
    const candidateAttractions = enrichedPlaces.filter((p) =>
      matchesInterest(p, selectedInterests)
    )
    const pool = candidateAttractions.length >= 8 ? candidateAttractions : enrichedPlaces

    for (let d = 1; d <= durationDays; d++) {
      const seedInfo = DAY_SEED_AREAS[(d - 1) % DAY_SEED_AREAS.length]
      let currentCoords = seedInfo.seedCoords

      // Find anchor place for the day
      let anchor = pool.find(
        (p) => !visitedPlaceIds.has(p.id) && p.name.toLowerCase().includes(seedInfo.anchorName.toLowerCase())
      )
      if (!anchor) {
        anchor = pool.find((p) => !visitedPlaceIds.has(p.id)) || pool[(d * 3) % pool.length]
      }
      visitedPlaceIds.add(anchor.id)
      currentCoords = anchor.position || seedInfo.seedCoords

      // Helper to pick nearest unvisited place using nearest-neighbour greedy search
      const pickNearestUnvisited = (coords, candidates, fallbackIndex) => {
        let best = null
        let bestDist = Infinity
        for (const p of candidates) {
          if (!visitedPlaceIds.has(p.id)) {
            const dist = haversineDistanceKm(coords, p.position)
            if (dist < bestDist) {
              bestDist = dist
              best = p
            }
          }
        }
        if (!best) {
          for (const p of enrichedPlaces) {
            if (!visitedPlaceIds.has(p.id)) {
              const dist = haversineDistanceKm(coords, p.position)
              if (dist < bestDist) {
                bestDist = dist
                best = p
              }
            }
          }
        }
        const chosen = best || candidates[fallbackIndex % candidates.length] || enrichedPlaces[fallbackIndex % enrichedPlaces.length]
        visitedPlaceIds.add(chosen.id)
        return chosen
      }

      // Stop 1: Morning Heritage (09:00 AM – 11:30 AM)
      const stop1 = {
        slot: '09:00 AM – 11:30 AM',
        timeLabel: 'Morning Discovery',
        place: anchor,
        tip: 'Arrive early for pleasant morning sunlight and unhurried exploration.',
        cost: anchor.price?.amount || 100,
        type: 'attraction',
      }

      // Stop 2: Midday Stop using Nearest-Neighbour from Stop 1
      const stop2Place = pickNearestUnvisited(currentCoords, pool, d * 5 + 1)
      const stop2 = {
        slot: '11:45 AM – 01:15 PM',
        timeLabel: 'Midday Exploration',
        place: stop2Place,
        tip: 'Explore shaded pavilions and royal galleries during midday.',
        cost: stop2Place.price?.amount || 100,
        type: 'attraction',
      }
      currentCoords = stop2Place.position || currentCoords

      // Stop 3: Midpoint Lunch Stop (Closest authentic restaurant to Stop 2)
      let nearestRestDist = Infinity
      let lunchPlace = null
      for (const r of enrichedRestaurants) {
        if (!visitedPlaceIds.has(r.id)) {
          const dist = haversineDistanceKm(currentCoords, r.position)
          if (dist < nearestRestDist) {
            nearestRestDist = dist
            lunchPlace = r
          }
        }
      }
      if (!lunchPlace) lunchPlace = enrichedRestaurants[d % enrichedRestaurants.length]
      visitedPlaceIds.add(lunchPlace.id)

      const stop3Lunch = {
        slot: '01:30 PM – 02:45 PM',
        timeLabel: 'Midpoint Authentic Lunch',
        place: lunchPlace,
        tip: 'Savor genuine Hyderabadi Dum Biryani, Mirchi ka Salan, and hot Irani chai.',
        cost: lunchPlace.price?.amount || 350,
        type: 'lunch',
      }
      currentCoords = lunchPlace.position || currentCoords

      // Stop 4: Afternoon Stop using Nearest-Neighbour from Lunch
      const stop4Place = pickNearestUnvisited(currentCoords, pool, d * 7 + 2)
      const stop4 = {
        slot: '03:15 PM – 05:15 PM',
        timeLabel: 'Afternoon Immersion',
        place: stop4Place,
        tip: 'Marvel at authentic craftsmanship, courtyards, and artisanal treasures.',
        cost: stop4Place.price?.amount || 150,
        type: 'attraction',
      }
      currentCoords = stop4Place.position || currentCoords

      // Stop 5: Sunset / Twilight Stop using Nearest-Neighbour from Stop 4
      const stop5Place = pickNearestUnvisited(currentCoords, pool, d * 11 + 3)
      const stop5 = {
        slot: '05:45 PM – 07:30 PM',
        timeLabel: 'Golden Hour & Sunset Vista',
        place: stop5Place,
        tip: 'Capture golden-hour reflections across the illuminated Telangana skyline.',
        cost: stop5Place.price?.amount || 100,
        type: 'attraction',
      }

      // Initial raw stops for the day
      let dayStops = [stop1, stop2, stop3Lunch, stop4, stop5]

      // Recommended Hotel for the night (if toggle is on)
      let recommendedHotel = null
      if (includeHotel) {
        let nearestHotelDist = Infinity
        for (const h of enrichedHotels) {
          const dist = haversineDistanceKm(stop5Place.position, h.position)
          if (dist < nearestHotelDist) {
            nearestHotelDist = dist
            recommendedHotel = h
          }
        }
        if (!recommendedHotel) recommendedHotel = enrichedHotels[d % enrichedHotels.length]
      }

      daysResult.push({
        dayNumber: d,
        theme: seedInfo.theme,
        subtitle: seedInfo.sub,
        stops: dayStops,
        recommendedHotel,
      })
    }

    // Calculate preliminary total entry fees
    let totalEntryFeesPerPerson = daysResult.reduce((sum, d) => {
      return (
        sum +
        d.stops
          .filter((s) => s.type === 'attraction')
          .reduce((stopSum, s) => stopSum + s.cost, 0)
      )
    }, 0)

    let totalTripCost = totalEntryFeesPerPerson + totalMealsCostPerPerson + totalStayCostPerPerson

    // 3. Trim stops to fit budget logic
    let trimmedCount = 0
    if (trimStops && totalTripCost > budgetPerPerson) {
      // Collect all non-lunch trim candidates sorted by cost descending
      for (const day of daysResult) {
        if (totalTripCost <= budgetPerPerson) break

        // We can trim up to 2 attractions per day (keeping Stop 1 Morning Anchor and Stop 3 Lunch)
        const trimmable = day.stops.filter((s) => s.type === 'attraction' && s !== day.stops[0])
        trimmable.sort((a, b) => b.cost - a.cost)

        for (const item of trimmable) {
          if (totalTripCost > budgetPerPerson && day.stops.length > 3) {
            day.stops = day.stops.filter((s) => s !== item)
            totalTripCost -= item.cost
            totalEntryFeesPerPerson -= item.cost
            allTrimmedStopNames.push(item.place.name)
            trimmedCount++
          }
        }
      }
    }

    // Now compute inter-stop transit distances and travel times for each day
    daysResult.forEach((day) => {
      let dayTotalKm = 0
      let dayTotalMins = 0

      for (let i = 0; i < day.stops.length; i++) {
        if (i < day.stops.length - 1) {
          const c1 = day.stops[i].place.position
          const c2 = day.stops[i + 1].place.position
          const distKm = haversineDistanceKm(c1, c2)
          const transitMins = estimateTransitMinutes(distKm)
          day.stops[i].distanceNextKm = distKm
          day.stops[i].transitMins = transitMins
          dayTotalKm += distKm
          dayTotalMins += transitMins
        } else {
          day.stops[i].distanceNextKm = 0
          day.stops[i].transitMins = 0
        }
      }

      day.totalKm = Number(dayTotalKm.toFixed(1))
      day.totalMins = dayTotalMins
      day.totalDayCost =
        day.stops.reduce((sum, s) => sum + s.cost, 0) +
        dailyMealCostPerPerson +
        (includeHotel ? Math.round(totalStayCostPerPerson / durationDays) : 0)
    })

    const trimmedMsg =
      trimmedCount > 0
        ? `⚡ Trimmed ${trimmedCount} stops (${allTrimmedStopNames.join(', ')}) to fit within your ₹${budgetPerPerson.toLocaleString('en-IN')} budget.`
        : null

    return {
      generatedDays: daysResult,
      trimmedMessage: trimmedMsg,
      totalTripCostPerPerson: totalTripCost,
      costBreakdown: {
        entryFees: totalEntryFeesPerPerson,
        meals: totalMealsCostPerPerson,
        stay: totalStayCostPerPerson,
        total: totalTripCost,
      },
    }
  }, [durationDays, travellers, budgetPerPerson, selectedInterests, includeHotel, trimStops])

  // Active Day object
  const currentDay = generatedDays.find((d) => d.dayNumber === activeDayTab) || generatedDays[0]

  // Budget calculations
  const isOverBudget = totalTripCostPerPerson > budgetPerPerson
  const overAmount = isOverBudget ? totalTripCostPerPerson - budgetPerPerson : 0
  const budgetRatio = Math.min(100, Math.round((totalTripCostPerPerson / budgetPerPerson) * 100))

  // Segment widths in budget bar
  const maxScale = Math.max(budgetPerPerson, totalTripCostPerPerson)
  const entryPct = Math.round((costBreakdown.entryFees / maxScale) * 100)
  const mealsPct = Math.round((costBreakdown.meals / maxScale) * 100)
  const stayPct = Math.round((costBreakdown.stay / maxScale) * 100)

  // ACTION: Shareable Trip Link (encode plan in URL)
  const handleShareTrip = () => {
    const params = new URLSearchParams({
      days: String(durationDays),
      travellers: String(travellers),
      budget: String(budgetPerPerson),
      interests: selectedInterests.join(','),
      hotel: includeHotel ? '1' : '0',
      trim: trimStops ? '1' : '0',
      shared: '1',
    })

    const shareUrl = `${window.location.origin}${window.location.pathname}#/planner?${params.toString()}`

    if (navigator.share) {
      navigator
        .share({
          title: `Explorex ${durationDays}-Day Hyderabad Trip Plan`,
          text: `Check out our ${durationDays}-day curated trip plan for ${travellers} travellers in Hyderabad (₹${budgetPerPerson}/person)!`,
          url: shareUrl,
        })
        .catch(() => {
          navigator.clipboard?.writeText?.(shareUrl)
        })
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
    }

    setSharedCopied(true)
    setTimeout(() => setSharedCopied(false), 2500)
  }

  // ACTION 1: Copy Plan
  const handleCopyPlan = () => {
    let text = `EXPLOREX HYDERABAD & TELANGANA ITINERARY\n`
    text += `Duration: ${durationDays} Day(s) · Travellers: ${travellers} · Budget: ₹${budgetPerPerson.toLocaleString('en-IN')}/person\n`
    text += `Total Estimated Cost: ₹${totalTripCostPerPerson.toLocaleString('en-IN')}/person (₹${(totalTripCostPerPerson * travellers).toLocaleString('en-IN')} total)\n\n`

    generatedDays.forEach((day) => {
      text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      text += `DAY ${day.dayNumber}: ${day.theme}\n`
      text += `Total Travel: ${day.totalKm} km (${day.totalMins} min transit)\n\n`

      day.stops.forEach((stop, i) => {
        text += `${i + 1}. [${stop.slot}] ${stop.place.name} (${stop.place.category})\n`
        text += `   • Tip: ${stop.tip}\n`
        text += `   • Cost: ₹${stop.cost} · Location: ${stop.place.location?.address || 'Hyderabad'}\n`
        if (stop.distanceNextKm > 0) {
          text += `   → Travel ${stop.distanceNextKm} km (~${stop.transitMins} min) to next stop\n`
        }
      })

      if (day.recommendedHotel) {
        text += `\n🏨 Night Stay: ${day.recommendedHotel.name} (${day.recommendedHotel.location?.address || 'Hyderabad'})\n`
      }
      text += `\n`
    })

    text += `Generated with Explorex AI Travel Companion (https://explorex.in)`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      })
    }
  }

  // ACTION 2: Open this day's route in Google Maps (origin, waypoints, destination)
  const handleOpenGoogleMapsRoute = () => {
    if (!currentDay || !currentDay.stops || currentDay.stops.length === 0) return

    const stops = currentDay.stops
    const originPlace = stops[0].place
    const destPlace = stops[stops.length - 1].place

    const originLat = originPlace.position ? originPlace.position[0] : 17.3614
    const originLng = originPlace.position ? originPlace.position[1] : 78.4747

    const destLat = destPlace.position ? destPlace.position[0] : 17.385
    const destLng = destPlace.position ? destPlace.position[1] : 78.4041

    // Intermediate waypoints
    const intermediateStops = stops.slice(1, -1)
    const waypointsParam = intermediateStops
      .map((s) => {
        const lat = s.place.position ? s.place.position[0] : ''
        const lng = s.place.position ? s.place.position[1] : ''
        return `${lat},${lng}`
      })
      .filter(Boolean)
      .join('|')

    let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`
    if (waypointsParam) {
      mapsUrl += `&waypoints=${encodeURIComponent(waypointsParam)}`
    }

    window.open(mapsUrl, '_blank')
  }

  // ACTION 3: Refine with AI (opens /ai and auto-sends the plan as a prompt)
  const handleRefineWithAI = () => {
    const stopsSummary = currentDay.stops
      .map((s) => `${s.slot}: ${s.place.name} (${s.place.category})`)
      .join(', ')

    const promptText = `I am planning a ${durationDays}-day trip to Hyderabad for ${travellers} traveler(s) with a budget of ₹${budgetPerPerson.toLocaleString('en-IN')}/person. For Day ${currentDay.dayNumber} (${currentDay.theme}), my stops are: ${stopsSummary}. Please refine this day's itinerary with local insider secrets, best golden-hour photo angles, crowd avoidance timings, and authentic local snacks nearby.`

    try {
      sessionStorage.setItem('explorex_pending_ai_prompt', promptText)
      localStorage.setItem('explorex_pending_ai_prompt', promptText)
    } catch {}

    onNavigate?.('ai')
  }

  return (
    <div className="planner-page-shell">
      {/* Header Band */}
      <PageHeaderBand
        eyebrow="Multimodal Heritage Generator"
        title="Trip Planner"
        subtitle="Craft an hour-by-hour Hyderabad itinerary clustered by proximity with live budget tracking, midpoint lunch stops, and turn-by-turn routes."
        badge={
          <span className="header-stat-badge">
            <CalendarDays size={13} /> {durationDays} Day{durationDays > 1 ? 's' : ''} Plan Live
          </span>
        }
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Trip Planner' },
        ]}
      />

      <div className="planner-container">
        {/* Shared Trip Plan Active Alert Banner */}
        {isSharedPlan && (
          <div className="shared-plan-active-banner">
            <Link2 size={16} />
            <span>
              📋 Loaded from shared trip link: <strong>{durationDays} Days · {travellers} Travellers · ₹{budgetPerPerson.toLocaleString('en-IN')}/person budget</strong>.
            </span>
            <button
              type="button"
              className="close-shared-pill"
              onClick={() => setIsSharedPlan(false)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* INPUTS CONTROL PANEL */}
        <section className="planner-inputs-card" aria-label="Trip Planner Configuration">
          <div className="inputs-header-row">
            <div className="inputs-title-wrap">
              <span className="inputs-eyebrow">
                <Sparkles size={13} /> Personalize Your Journey
              </span>
              <h3>Travel Parameters</h3>
            </div>
            <button
              type="button"
              className="reset-defaults-btn"
              onClick={() => {
                setDurationDays(2)
                setTravellers(2)
                setBudgetPerPerson(3000)
                setSelectedInterests(['history', 'culture'])
                setIncludeHotel(true)
                setTrimStops(false)
              }}
              title="Reset to default settings"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>

          <div className="inputs-grid-layout">
            {/* 1. Number of Days (1 to 4) */}
            <div className="input-cell">
              <label className="input-cell-label">
                <CalendarDays size={14} /> 1. Number of Days (1 to 4)
              </label>
              <div className="duration-pill-group">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`duration-pill-btn ${durationDays === d ? 'active' : ''}`}
                    onClick={() => {
                      setDurationDays(d)
                      if (activeDayTab > d) setActiveDayTab(1)
                    }}
                  >
                    <span>{d}</span>
                    <small>{d === 1 ? 'Day' : 'Days'}</small>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Travellers (1 to 10) */}
            <div className="input-cell">
              <label className="input-cell-label">
                <Users size={14} /> 2. Travellers
              </label>
              <div className="stepper-counter-box">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setTravellers((p) => Math.max(1, p - 1))}
                  disabled={travellers <= 1}
                  aria-label="Decrease travellers"
                >
                  <Minus size={15} />
                </button>
                <div className="stepper-val-display">
                  <strong>{travellers}</strong>
                  <span>{travellers === 1 ? 'Person' : 'People'}</span>
                </div>
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setTravellers((p) => Math.min(10, p + 1))}
                  disabled={travellers >= 10}
                  aria-label="Increase travellers"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            {/* 3. Budget Per Person (₹ Slider) */}
            <div className="input-cell span-2">
              <div className="budget-label-row">
                <label className="input-cell-label">
                  <Wallet size={14} /> 3. Budget per Person
                </label>
                <span className="budget-slider-val">
                  ₹{budgetPerPerson.toLocaleString('en-IN')}
                  <small> / person</small>
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="15000"
                step="250"
                value={budgetPerPerson}
                onChange={(e) => setBudgetPerPerson(Number(e.target.value))}
                className="budget-range-slider"
                aria-label="Budget per person slider"
              />
              <div className="slider-scale-ticks">
                <span>₹500 (Budget)</span>
                <span>₹3,000 (Standard)</span>
                <span>₹7,500 (Heritage)</span>
                <span>₹15,000 (Royal Luxury)</span>
              </div>
            </div>
          </div>

          {/* 4. Interests (history, culture, nature, spiritual, fun) */}
          <div className="interests-row-box">
            <label className="input-cell-label">
              <Compass size={14} /> 4. Travel Interests (Select multiple)
            </label>
            <div className="interests-pills-row">
              {INTEREST_OPTIONS.map((item) => {
                const isSelected = selectedInterests.includes(item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`interest-tag-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleInterest(item.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="interest-tag-icon">{item.icon}</span>
                    <span className="interest-tag-title">{item.label}</span>
                    {isSelected && <Check size={13} className="selected-check" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 5. Toggles: "Include hotel" & "Trim stops to fit budget" */}
          <div className="toggles-row-container">
            <label className="planner-toggle-item">
              <input
                type="checkbox"
                checked={includeHotel}
                onChange={(e) => setIncludeHotel(e.target.checked)}
                className="planner-toggle-input"
              />
              <span className="toggle-switch-track">
                <span className="toggle-switch-thumb" />
              </span>
              <div className="toggle-copy">
                <strong>Include Hotel Stay</strong>
                <small>Adds overnight heritage room cost (~₹2,200/room/night)</small>
              </div>
            </label>

            <label className="planner-toggle-item">
              <input
                type="checkbox"
                checked={trimStops}
                onChange={(e) => setTrimStops(e.target.checked)}
                className="planner-toggle-input"
              />
              <span className="toggle-switch-track">
                <span className="toggle-switch-thumb" />
              </span>
              <div className="toggle-copy">
                <strong>Trim stops to fit budget</strong>
                <small>Automatically trims high-fee stops if costs exceed ₹ slider</small>
              </div>
            </label>
          </div>
        </section>

        {/* ANIMATED BUDGET BAR */}
        <section className={`animated-budget-card ${isOverBudget ? 'budget-over-limit' : ''}`}>
          <div className="budget-card-header">
            <div className="budget-stat-col">
              <span className="budget-eyebrow">Trip Budget Allocation</span>
              <div className="budget-cost-headline">
                <h4>
                  ₹{totalTripCostPerPerson.toLocaleString('en-IN')}
                  <small> / person</small>
                </h4>
                <span className="budget-target-pill">
                  Target: ₹{budgetPerPerson.toLocaleString('en-IN')}
                </span>
                {isOverBudget ? (
                  <span className="budget-status-pill error">
                    ⚠️ +₹{overAmount.toLocaleString('en-IN')} Over Budget
                  </span>
                ) : (
                  <span className="budget-status-pill success">
                    ✓ Within Budget ({budgetRatio}%)
                  </span>
                )}
              </div>
            </div>

            <div className="budget-breakdown-chips">
              <span className="breakdown-chip entry">
                <span className="chip-dot" /> 🎟️ Tickets: ₹{costBreakdown.entryFees.toLocaleString('en-IN')}
              </span>
              <span className="breakdown-chip meals">
                <span className="chip-dot" /> 🍽️ Meals: ₹{costBreakdown.meals.toLocaleString('en-IN')}
              </span>
              {includeHotel && (
                <span className="breakdown-chip stay">
                  <span className="chip-dot" /> 🏨 Stay: ₹{costBreakdown.stay.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Animated Segmented Progress Bar */}
          <div className="budget-track-wrapper" role="progressbar" aria-valuenow={budgetRatio} aria-valuemin={0} aria-valuemax={100}>
            <div className="budget-fill-entry" style={{ width: `${entryPct}%` }} title={`Entry Fees: ₹${costBreakdown.entryFees}`} />
            <div className="budget-fill-meals" style={{ width: `${mealsPct}%` }} title={`Meals: ₹${costBreakdown.meals}`} />
            {includeHotel && (
              <div className="budget-fill-stay" style={{ width: `${stayPct}%` }} title={`Stay: ₹${costBreakdown.stay}`} />
            )}
          </div>

          {/* Message When Stops Were Trimmed */}
          {trimmedMessage && (
            <div className="trimmed-message-alert" role="status">
              <Scissors size={15} />
              <span>{trimmedMessage}</span>
            </div>
          )}
        </section>

        {/* OUTPUT: DAY-BY-DAY TIMELINE */}
        <section className="planner-timeline-section" aria-label="Day by Day Itinerary Timeline">
          {/* Day Tabs */}
          <div className="timeline-day-tabs">
            {generatedDays.map((day) => (
              <button
                key={day.dayNumber}
                type="button"
                className={`timeline-tab-btn ${activeDayTab === day.dayNumber ? 'active' : ''}`}
                onClick={() => setActiveDayTab(day.dayNumber)}
              >
                <span className="tab-pill-num">Day {day.dayNumber}</span>
                <span className="tab-pill-title">{day.theme}</span>
                <span className="tab-pill-km">{day.totalKm} km</span>
              </button>
            ))}
          </div>

          {/* Active Day Card */}
          {currentDay && (
            <div className="active-day-itinerary-card">
              {/* Day Header Banner */}
              <div className="itinerary-day-banner">
                <div className="day-info-left">
                  <span className="day-counter-badge">
                    Day {currentDay.dayNumber} of {durationDays}
                  </span>
                  <h3>{currentDay.theme}</h3>
                  <p>{currentDay.subtitle}</p>
                </div>

                <div className="day-stats-right">
                  <div className="day-stat-box">
                    <span className="stat-label">Total Day Travel</span>
                    <strong>{currentDay.totalKm} km</strong>
                    <small>~{currentDay.totalMins} min transit</small>
                  </div>
                  <div className="day-stat-box">
                    <span className="stat-label">Estimated Day Cost</span>
                    <strong>₹{currentDay.totalDayCost.toLocaleString('en-IN')}</strong>
                    <small>for {travellers} traveler{travellers > 1 ? 's' : ''}</small>
                  </div>
                </div>
              </div>

              {/* Day Timeline Stops */}
              <div className="timeline-stops-container">
                {currentDay.stops.map((stop, idx) => {
                  const isLunch = stop.type === 'lunch'

                  return (
                    <div key={`${stop.place.id}-${idx}`} className={`timeline-stop-node ${isLunch ? 'is-lunch-node' : ''}`}>
                      {/* Left Time Column */}
                      <div className="stop-time-column">
                        <div className="node-number-circle">
                          {isLunch ? <Utensils size={14} /> : idx + 1}
                        </div>
                        <span className="node-time-range">
                          <Clock size={12} /> {stop.slot}
                        </span>
                        <span className={`node-type-badge ${isLunch ? 'lunch-badge' : ''}`}>
                          {stop.timeLabel}
                        </span>
                      </div>

                      {/* Right Place Card */}
                      <div className="stop-place-card">
                        <div className="stop-card-thumb">
                          <SafeImage
                            src={stop.place.image}
                            fallbackSrc={stop.place.fallbackImage}
                            category={stop.place.category}
                            alt={stop.place.name}
                          />
                          {isLunch && <span className="midpoint-lunch-tag">Midpoint Dining</span>}
                        </div>

                        <div className="stop-card-info">
                          <div className="stop-header-line">
                            <h4>{stop.place.name}</h4>
                            <div className="stop-rating-pill">
                              <Star size={12} fill="#C9A227" color="#C9A227" />
                              <span>{stop.place.rating || 4.7}</span>
                            </div>
                          </div>

                          <div className="stop-meta-pills">
                            <span className="meta-category">{stop.place.category}</span>
                            <span className="meta-location">
                              <MapPin size={11} /> {stop.place.location?.address || 'Hyderabad, Telangana'}
                            </span>
                            <span className="meta-price-chip">₹{stop.cost} ticket</span>
                          </div>

                          <div className="stop-tip-alert">
                            <span className="tip-bulb">💡</span>
                            <p>{stop.tip}</p>
                          </div>

                          <div className="stop-action-links">
                            <button
                              type="button"
                              className="view-place-link"
                              onClick={() => {
                                if (onSelectPlace) onSelectPlace(stop.place)
                                onNavigate?.(`explore/${stop.place.id}`)
                              }}
                            >
                              <span>View Details</span>
                              <ExternalLink size={12} />
                            </button>

                            <button
                              type="button"
                              className="get-dir-link"
                              onClick={() => {
                                if (onGetDirections) onGetDirections(stop.place)
                                else onNavigate?.('map')
                              }}
                            >
                              <Navigation size={12} />
                              <span>Directions</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Travel Distance & Transit Time Connector to Next Stop */}
                      {stop.distanceNextKm > 0 && (
                        <div className="inter-stop-transit-bar" aria-label={`Transit to next stop: ${stop.distanceNextKm} km, ~${stop.transitMins} min`}>
                          <div className="transit-line" />
                          <div className="transit-chip">
                            <Navigation size={12} className="transit-arrow-icon" />
                            <span>
                              <strong>{stop.distanceNextKm} km</strong> (~{stop.transitMins} min drive) to next stop
                            </span>
                          </div>
                          <div className="transit-line" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Recommended Hotel Stay Node (If toggle is on) */}
              {includeHotel && currentDay.recommendedHotel && (
                <div className="night-stay-card">
                  <div className="hotel-icon-badge">🏨</div>
                  <div className="hotel-info-col">
                    <span className="hotel-eyebrow">Recommended Night Stay Near Day's End</span>
                    <h4>{currentDay.recommendedHotel.name}</h4>
                    <p>{currentDay.recommendedHotel.location?.address || 'Hyderabad, Telangana'}</p>
                  </div>
                  <div className="hotel-price-badge">
                    <strong>₹{currentDay.recommendedHotel.price?.amount || 2200}</strong>
                    <small>/night</small>
                  </div>
                </div>
              )}

              {/* 3 ACTIONS REQUIRED BY SPEC */}
              <div className="planner-actions-bar">
                {/* Action: Share Plan (Encode plan in URL) */}
                <button
                  type="button"
                  className="action-btn share-plan-btn"
                  onClick={handleShareTrip}
                  title="Copy shareable link encoded with this trip plan"
                >
                  {sharedCopied ? (
                    <>
                      <Check size={16} color="#2D7D46" />
                      <span>Link Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={16} />
                      <span>Share Trip Link</span>
                    </>
                  )}
                </button>

                {/* Action 1: Copy Plan */}
                <button
                  type="button"
                  className="action-btn copy-plan-btn"
                  onClick={handleCopyPlan}
                >
                  {copied ? (
                    <>
                      <Check size={16} color="#2D7D46" />
                      <span>Copied Plan to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy Plan</span>
                    </>
                  )}
                </button>

                {/* Action 2: Open this day's route in Google Maps */}
                <button
                  type="button"
                  className="action-btn gmaps-route-btn"
                  onClick={handleOpenGoogleMapsRoute}
                  title="Open origin, waypoints, and destination in Google Maps"
                >
                  <Navigation size={16} />
                  <span>Open this day's route in Google Maps</span>
                </button>

                {/* Action 3: Refine with AI */}
                <button
                  type="button"
                  className="action-btn refine-ai-btn"
                  onClick={handleRefineWithAI}
                  title="Open /ai and auto-send this itinerary for custom refinement"
                >
                  <Sparkles size={16} />
                  <span>Refine with AI</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* GROUP EXPENSE SPLITTER SECTION */}
        <section className="planner-expense-splitter-section" aria-label="Group Expense Splitter">
          <GroupExpenseSplitter
            travellerCount={travellers}
            baseItineraryCostPerPerson={totalTripCostPerPerson}
            days={durationDays}
          />
        </section>
      </div>
    </div>
  )
}

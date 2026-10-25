// Weather service using free Open-Meteo API with localStorage caching and offline fallbacks

const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes cache

// Interpret WMO weather code
function interpretWmoCode(code) {
  if (code === 0) return { condition: 'Clear Sky', icon: '☀️' }
  if (code === 1 || code === 2) return { condition: 'Mainly Clear', icon: '🌤️' }
  if (code === 3) return { condition: 'Partly Cloudy', icon: '⛅' }
  if (code === 45 || code === 48) return { condition: 'Foggy', icon: '🌫️' }
  if (code >= 51 && code <= 55) return { condition: 'Drizzle', icon: '🌦️' }
  if (code >= 61 && code <= 65) return { condition: 'Light Rain', icon: '🌧️' }
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', icon: '🌧️' }
  if (code >= 95) return { condition: 'Thunderstorm', icon: '⛈️' }
  return { condition: 'Pleasant Weather', icon: '⛅' }
}

export async function fetchPlaceWeather(lat = 17.3614, lon = 78.4747, placeId = 'hyderabad', options = {}) {
  const cacheKey = `explorex_weather_v1_${placeId}`

  // Check cache (30 minutes TTL)
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return parsed.data
      }
    }
  } catch {}

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${Number(lat).toFixed(4)}&longitude=${Number(lon).toFixed(4)}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    // Forward external abort signal if provided
    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort(), { once: true })
    }

    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!res.ok) throw new Error(`Weather API returned ${res.status}`)

    const data = await res.json()
    const current = data.current || {}
    const tempC = Math.round(current.temperature_2m ?? 28)
    const code = current.weather_code ?? 1
    const { condition, icon } = interpretWmoCode(code)
    const humidity = Math.round(current.relative_humidity_2m ?? 50)
    const windSpeedKmH = Math.round(current.wind_speed_10m ?? 10)

    const weatherData = {
      tempC,
      condition,
      icon,
      humidity,
      windSpeedKmH,
      source: 'live-open-meteo',
    }

    try {
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: weatherData }))
    } catch {}

    return weatherData
  } catch {
    return null
  }
}

// Best time to visit metadata per place / category
export function getBestTimeToVisit(place) {
  if (!place) return { badge: 'Best: Oct – Mar', season: 'Oct – Mar', timeOfDay: 'Morning' }

  const name = (place.name || '').toLowerCase()
  const cat = (place.category || '').toLowerCase()

  if (name.includes('golconda')) {
    return {
      badge: 'Best: 4:00 PM – 6:30 PM',
      season: 'Oct – Mar',
      timeOfDay: 'Sunset & Evening Show',
      tag: 'Sunset Light & Sound',
      fullText: 'Optimal light for hilltop photography and evening Sound & Light show.',
    }
  }
  if (name.includes('charminar') || name.includes('laad bazaar')) {
    return {
      badge: 'Best: 9:00 AM – 11:30 AM',
      season: 'Year-Round',
      timeOfDay: 'Early Morning',
      tag: 'Cooler & Less Crowded',
      fullText: 'Early morning allows peaceful exploration before afternoon bazaar crowds.',
    }
  }
  if (name.includes('hussain sagar') || name.includes('necklace road') || name.includes('lumbini')) {
    return {
      badge: 'Best: 5:00 PM – 8:00 PM',
      season: 'Year-Round',
      timeOfDay: 'Evening Sunset',
      tag: 'Sunset Boating',
      fullText: 'Pleasant lake breeze, golden sunset over Buddha statue, and evening musical fountain.',
    }
  }
  if (name.includes('chowmahalla') || name.includes('salar jung')) {
    return {
      badge: 'Best: 10:30 AM – 1:30 PM',
      season: 'Year-Round',
      timeOfDay: 'Late Morning',
      tag: 'Indoor Heritage',
      fullText: 'Air-cooled royal galleries and courtyard chandelier halls.',
    }
  }
  if (name.includes('ramoji')) {
    return {
      badge: 'Best: 9:00 AM – 5:00 PM',
      season: 'Oct – Feb',
      timeOfDay: 'Full Day Tour',
      tag: 'Full Day Experience',
      fullText: 'Arrive early at gates to experience all live shows, film sets, and adventure rides.',
    }
  }
  if (name.includes('shilparamam')) {
    return {
      badge: 'Best: 4:30 PM – 8:30 PM',
      season: 'Oct – Mar',
      timeOfDay: 'Late Afternoon to Night',
      tag: 'Cultural Evenings',
      fullText: 'Evening craft stalls, folk dance amphitheater performances, and pleasant walking weather.',
    }
  }
  if (name.includes('birla mandir')) {
    return {
      badge: 'Best: 6:00 PM – 8:00 PM',
      season: 'Year-Round',
      timeOfDay: 'Evening Aarti',
      tag: 'Illumination & City View',
      fullText: 'Spectacular panoramic night view of illuminated Hyderabad from atop Naubat Pahad.',
    }
  }
  if (cat.includes('food') || cat.includes('restaurant')) {
    return {
      badge: 'Best: 12:30 PM or 7:30 PM',
      season: 'Year-Round',
      timeOfDay: 'Lunch / Dinner Peak',
      tag: 'Fresh Dum Biryani Batch',
      fullText: 'Fresh batches of authentic Dum Biryani and Haleem are served straight from the deg.',
    }
  }
  if (cat.includes('hotel') || cat.includes('stay')) {
    return {
      badge: 'Best: Check-in 2:00 PM',
      season: 'Oct – Mar (Peak)',
      timeOfDay: 'Afternoon Check-in',
      tag: 'Heritage Hospitality',
      fullText: 'Best experienced during pleasant winter months with outdoor royal dining.',
    }
  }

  return {
    badge: 'Best: Oct – Mar (Morning)',
    season: 'Oct – Mar',
    timeOfDay: 'Morning 9:00 AM – 11:30 AM',
    tag: 'Cooler Weather',
    fullText: 'Pleasant ambient temperatures and optimal daylight for outdoor sightseeing.',
  }
}

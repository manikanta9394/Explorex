import { useEffect, useState, useRef } from 'react'
import { fetchPlaceWeather } from '../services/weatherService'

export default function PlaceWeatherBadge({
  place,
  coordinates,
  placeId,
  className = '',
  compact = false,
  isDetailPage = false,
}) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(Boolean(isDetailPage))
  const badgeRef = useRef(null)

  const resolvedCoords = coordinates || place?.position || place?.coordinates
  const lat = resolvedCoords?.[0] ?? 17.3614
  const lon = resolvedCoords?.[1] ?? 78.4747
  const pid = placeId || place?.id || 'hyderabad'

  // 1. Observe visibility: only fetch when card is in/near viewport or on detail page
  useEffect(() => {
    if (isVisible) return

    if (!badgeRef.current || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '120px' }
    )

    observer.observe(badgeRef.current)
    return () => observer.disconnect()
  }, [isVisible])

  // 2. Fetch live weather (or 30m cache) once visible, abort on unmount
  useEffect(() => {
    if (!isVisible) return

    let mounted = true
    const controller = new AbortController()

    fetchPlaceWeather(lat, lon, pid, { signal: controller.signal })
      .then((data) => {
        if (mounted) {
          setWeather(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setWeather(null)
          setLoading(false)
        }
      })

    return () => {
      mounted = false
      controller.abort()
    }
  }, [isVisible, lat, lon, pid])

  // Optional UI: while loading or waiting for visibility, render a tiny invisible placeholder
  if (!isVisible || loading) {
    return <span ref={badgeRef} className="place-weather-placeholder" aria-hidden="true" />
  }

  // Optional UI: if API fails, is blocked, or returns no data, render nothing
  if (!weather || typeof weather.tempC !== 'number') {
    return null
  }

  if (compact) {
    return (
      <span
        ref={badgeRef}
        className={`place-weather-badge compact ${className}`}
        title={`${weather.condition || 'Clear'} · ${weather.tempC}°C`}
      >
        <span className="weather-icon-emoji">{weather.icon || '🌤️'}</span>
        <strong>{weather.tempC}°C</strong>
      </span>
    )
  }

  return (
    <span
      ref={badgeRef}
      className={`place-weather-badge ${className}`}
      title={`Live Weather: ${weather.condition || 'Clear'}, ${weather.tempC}°C${weather.humidity ? ` · Humidity ${weather.humidity}%` : ''}`}
    >
      <span className="weather-icon-emoji">{weather.icon || '🌤️'}</span>
      <strong>{weather.tempC}°C</strong>
      <span className="weather-sep">·</span>
      <span className="weather-cond">{weather.condition || 'Clear'}</span>
    </span>
  )
}

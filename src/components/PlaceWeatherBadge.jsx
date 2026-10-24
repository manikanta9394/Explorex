import { useEffect, useState } from 'react'
import { CloudSun } from 'lucide-react'
import { fetchPlaceWeather } from '../services/weatherService'

export default function PlaceWeatherBadge({
  coordinates,
  placeId = 'hyderabad',
  className = '',
  compact = false,
}) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  const lat = coordinates?.[0] ?? 17.3614
  const lon = coordinates?.[1] ?? 78.4747

  useEffect(() => {
    let mounted = true
    fetchPlaceWeather(lat, lon, placeId)
      .then((data) => {
        if (mounted) {
          setWeather(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setWeather({ tempC: 28, condition: 'Pleasant & Clear', icon: '🌤️' })
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [lat, lon, placeId])

  if (loading) {
    return (
      <span className={`place-weather-badge loading ${className}`}>
        <CloudSun size={12} className="weather-spin" />
        <span>Weather...</span>
      </span>
    )
  }

  if (compact) {
    return (
      <span
        className={`place-weather-badge compact ${className}`}
        title={`${weather.condition} · ${weather.tempC}°C in Hyderabad`}
      >
        <span className="weather-icon-emoji">{weather.icon}</span>
        <strong>{weather.tempC}°C</strong>
      </span>
    )
  }

  return (
    <span
      className={`place-weather-badge ${className}`}
      title={`Live Weather: ${weather.condition}, ${weather.tempC}°C (Humidity: ${weather.humidity || 48}%)`}
    >
      <span className="weather-icon-emoji">{weather.icon}</span>
      <strong>{weather.tempC}°C</strong>
      <span className="weather-sep">·</span>
      <span className="weather-cond">{weather.condition}</span>
    </span>
  )
}

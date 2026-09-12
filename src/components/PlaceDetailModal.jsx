import { useEffect, useMemo, useState } from 'react'
import { Camera, Clock, Heart, MapPin, Navigation, ShieldAlert, Shirt, Sparkles, Star, Ticket, X } from 'lucide-react'
import { useSavedPlaces } from '../context/useSavedPlaces'
import { useTravelMode } from '../context/useTravelMode'
import { useUserLocation } from '../context/useUserLocation'
import { fetchRoute } from '../services/api'
import { formatPriceWithUnit } from '../utils/formatCurrency'
import { openGoogleMapsDirections } from '../utils/googleMaps'
import SafeImage from './SafeImage'

function getRuleIcon(ruleText) {
  const text = ruleText.toLowerCase()
  if (text.includes('hour') || text.includes('check-in') || text.includes('time') || text.includes('daily')) {
    return <Clock size={15} className="rule-icon clock" />
  }
  if (text.includes('pet') || text.includes('no ') || text.includes('forbidden') || text.includes('ban')) {
    return <ShieldAlert size={15} className="rule-icon alert" />
  }
  if (text.includes('dress') || text.includes('attire') || text.includes('wear') || text.includes('casual')) {
    return <Shirt size={15} className="rule-icon dress" />
  }
  if (text.includes('photo') || text.includes('camera') || text.includes('flash') || text.includes('picture')) {
    return <Camera size={15} className="rule-icon camera" />
  }
  if (text.includes('ticket') || text.includes('cancellation') || text.includes('fee') || text.includes('pay') || text.includes('reservation')) {
    return <Ticket size={15} className="rule-icon ticket" />
  }
  return <Sparkles size={15} className="rule-icon sparkle" />
}

function getCoords(p) {
  if (!p) return null
  if (Array.isArray(p.position) && p.position.length >= 2) {
    return [p.position[0], p.position[1]]
  }
  if (p.location && Array.isArray(p.location.coordinates) && p.location.coordinates.length >= 2) {
    return [p.location.coordinates[1], p.location.coordinates[0]]
  }
  return null
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function PlaceDetailModal({
  isOpen,
  onClose,
  place,
  allPlaces = [],
  onSelectPlace,
  onGetDirections,
}) {
  const [bouncing, setBouncing] = useState(false)
  const [routeInfo, setRouteInfo] = useState(null)
  const [loadingRoute, setLoadingRoute] = useState(false)
  const { travelMode } = useTravelMode()
  const { isSaved, toggleSave } = useSavedPlaces()
  const { activeOrigin } = useUserLocation()

  const saved = isSaved(place?.id)

  // ESC key listener to close detail modal
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent background body scrolling when detail modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Calculate 3 nearest place suggestions mixed across categories sorted by distance
  const nearbySuggestions = useMemo(() => {
    if (!place || !Array.isArray(allPlaces) || allPlaces.length === 0) return []

    const currentCoords = getCoords(place)
    if (!currentCoords) return allPlaces.slice(0, 3)

    const candidates = allPlaces
      .filter((item) => item.id !== place.id && item.name !== place.name)
      .map((item) => {
        const coords = getCoords(item)
        let dist = 9999
        if (coords) {
          dist = calculateDistanceKm(currentCoords[0], currentCoords[1], coords[0], coords[1])
        }
        return { ...item, _dist: dist }
      })
      .sort((a, b) => a._dist - b._dist)

    const topCandidates = candidates.slice(0, 15)
    const result = []
    const usedTypes = new Set()

    for (const c of topCandidates) {
      const typeKey = c.id.startsWith('hotel-')
        ? 'hotel'
        : c.id.startsWith('restaurant-')
        ? 'restaurant'
        : 'attraction'
      if (!usedTypes.has(typeKey) && result.length < 3) {
        usedTypes.add(typeKey)
        result.push(c)
      }
    }

    for (const c of topCandidates) {
      if (result.length >= 3) break
      if (!result.some((r) => r.id === c.id)) {
        result.push(c)
      }
    }

    return result
  }, [place, allPlaces])

  // Fetch live route info respecting selected travel mode and user location
  useEffect(() => {
    if (!isOpen || !place) return

    let isMounted = true

    const updateRoute = async () => {
      setLoadingRoute(true)
      const destCoords = place.position
        ? [place.position[1], place.position[0]]
        : place.location?.coordinates || [78.4747, 17.3616]

      try {
        const data = await fetchRoute(activeOrigin, destCoords, travelMode)
        if (!isMounted) return
        if (data) {
          setRouteInfo({
            duration: data.duration?.formatted || (data.duration ? `${data.duration} min` : '10 min'),
            distance: data.distance?.km || data.distance || (data.distanceMeters ? (data.distanceMeters / 1000).toFixed(1) : 2.4),
          })
        }
      } finally {
        if (isMounted) setLoadingRoute(false)
      }
    }

    updateRoute()

    return () => {
      isMounted = false
    }
  }, [isOpen, place, travelMode, activeOrigin])

  if (!isOpen || !place) return null

  function handleToggleSave(e) {
    e.stopPropagation()
    if (place?.id) {
      toggleSave(place.id)
      setBouncing(true)
      setTimeout(() => setBouncing(false), 500)
    }
  }

  // Format INR price with unit
  const fallbackType = place.category?.toLowerCase().includes('hotel')
    ? 'hotel'
    : place.category?.toLowerCase().includes('restaurant') || place.category?.toLowerCase().includes('dining')
    ? 'restaurant'
    : 'attraction'
  const { priceDisplay, unitDisplay: priceUnit } = formatPriceWithUnit(place.price, fallbackType)

  const categoryLabel = place.category || 'Attraction'
  const modeEmoji = travelMode === 'foot-walking' ? '🚶' : travelMode === 'cycling-regular' ? '🚴' : '🚗'
  const rulesList = Array.isArray(place.rules) && place.rules.length > 0 ? place.rules : [
    'Opening Hours: Daily, 9:00 AM - 5:00 PM',
    'Photography permitted in designated areas',
    'Modest dress code encouraged for heritage sites',
    'Guided tours available on entry',
  ]

  return (
    <div className="place-modal-overlay" onClick={onClose}>
      <div className="place-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Mobile Swipe-down indicator */}
        <div className="mobile-sheet-handle" onClick={onClose}>
          <span className="handle-bar" />
        </div>

        {/* Hero Image Section */}
        <div className="modal-hero-image-wrap">
          <SafeImage
            src={place.image}
            category={place.category}
            fallbackSrc={place.fallbackImage}
            alt={place.name}
          />
          <div className="modal-hero-shade" />

          <span className="modal-category-chip">{categoryLabel}</span>

          <button
            className={`modal-save-pill ${saved ? 'saved' : ''} ${bouncing ? 'heart-bounce' : ''}`}
            onClick={handleToggleSave}
            aria-label={saved ? `Remove ${place.name} from saved` : `Save ${place.name}`}
          >
            <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          <button className="modal-close-round" onClick={onClose} aria-label="Close place details">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="modal-body-content">
          {/* Header Title & Price */}
          <div className="modal-title-row">
            <div>
              <h2>{place.name}</h2>
              <p className="modal-address">
                <MapPin size={14} className="pin-icon" /> {place.location?.address || place.detail || place.city || 'Telangana'}
              </p>
            </div>

            <div className="modal-price-box">
              <span className="price-amount">{priceDisplay}</span>
              <span className="price-unit">/ {priceUnit}</span>
            </div>
          </div>

          {/* Rating & Live Travel Time Badges */}
          <div className="modal-badges-row">
            <div className="modal-rating-badge">
              <Star size={15} fill="currentColor" />
              <strong>{place.rating || 4.7}</strong>
              <small>Highly rated</small>
            </div>

            {loadingRoute ? (
              <div className="travel-time-chip shimmer">
                <span className="shimmer-dot" /> Recalculating...
              </div>
            ) : routeInfo ? (
              <div className="travel-time-chip">
                {modeEmoji} {routeInfo.duration} ({routeInfo.distance} km)
              </div>
            ) : null}
          </div>

          <div className="modal-section-divider" />

          {/* Description */}
          <div className="modal-description-section">
            <h3>Overview</h3>
            <p>{place.description}</p>
          </div>

          <div className="modal-section-divider" />

          {/* Rules & Info List */}
          <div className="modal-rules-section">
            <h3>Rules & Visitor Info</h3>
            <ul className="rules-icon-list">
              {rulesList.map((rule, idx) => (
                <li key={idx} className="rule-item">
                  <div className="rule-icon-box">
                    {getRuleIcon(rule)}
                  </div>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* You Might Also Like Nearby Section */}
          {nearbySuggestions.length > 0 && (
            <>
              <div className="modal-section-divider" />
              <div className="modal-nearby-section">
                <h3><Sparkles size={15} /> You might also like nearby</h3>
                <div className="modal-nearby-scroll">
                  {nearbySuggestions.map((item) => {
                    const typeKey = item.id.startsWith('hotel-')
                      ? 'hotel'
                      : item.id.startsWith('restaurant-')
                      ? 'restaurant'
                      : 'attraction'
                    const { priceDisplay: itemPrice, unitDisplay: itemUnit } = formatPriceWithUnit(item.price, typeKey)
                    const chipLabel = item.category || (typeKey === 'hotel' ? 'Hotel' : typeKey === 'restaurant' ? 'Dining' : 'Attraction')

                    return (
                      <div
                        key={item.id}
                        className="nearby-mini-card"
                        onClick={() => onSelectPlace?.(item)}
                      >
                        <div className="mini-card-image-wrap">
                          <SafeImage
                            src={item.image}
                            category={item.category}
                            fallbackSrc={item.fallbackImage}
                            alt={item.name}
                          />
                          <span className="mini-category-chip">{chipLabel}</span>
                        </div>

                        <div className="mini-card-body">
                          <h4 className="mini-card-title" title={item.name}>{item.name}</h4>

                          <div className="mini-card-meta">
                            <span className="mini-rating">
                              <Star size={12} fill="#C9A227" color="#C9A227" />
                              <strong>{item.rating || 4.7}</strong>
                            </span>

                            <span className="mini-price">
                              {itemPrice} <small>/{itemUnit}</small>
                            </span>
                          </div>

                          {item._dist < 990 && (
                            <div className="mini-distance-tag">
                              <MapPin size={11} /> {item._dist < 1 ? `${Math.round(item._dist * 1000)}m away` : `${item._dist.toFixed(1)} km away`}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* Sticky CTA Footer */}
          <div className="modal-footer-actions">
            <button
              className="modal-directions-btn"
              onClick={() => {
                onClose()
                if (onGetDirections) {
                  onGetDirections(place)
                } else {
                  openGoogleMapsDirections(place, travelMode)
                }
              }}
            >
              <Navigation size={16} /> Get Directions
            </button>

            <button
              className={`modal-secondary-save-btn ${saved ? 'saved' : ''}`}
              onClick={handleToggleSave}
            >
              <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
              <span>{saved ? 'Saved in List' : 'Save Place'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useMemo, useEffect } from 'react'
import { ArrowRight, Compass, Heart, MapPin, Navigation, Star } from 'lucide-react'
import SafeImage from './SafeImage'
import { formatPriceWithUnit } from '../utils/formatCurrency'
import { fetchRoute, getRouteCache } from '../services/api'
import { useTravelMode } from '../context/useTravelMode'
import { useSavedPlaces } from '../context/useSavedPlaces'
import { useUserLocation } from '../context/useUserLocation'

// 6 Canonical Featured Destinations from Telangana Dataset
const FEATURED_TARGETS = [
  { id: 'place-1-1', nameMatch: 'Charminar' },
  { id: 'place-2-2', nameMatch: 'Golconda Fort' },
  { id: 'place-4-4', nameMatch: 'Chowmahalla Palace' },
  { id: 'place-11-11', nameMatch: 'Salar Jung Museum' },
  { id: 'place-25-25', nameMatch: 'Birla Mandir' },
  { id: 'place-6-6', nameMatch: 'Paigah Tombs' },
]

function DestinationCard({ place, onSelectPlace, onGetDirections, index = 0 }) {
  const [bouncing, setBouncing] = useState(false)
  const [routeInfo, setRouteInfo] = useState(null)
  const [loadingRoute, setLoadingRoute] = useState(false)

  const { travelMode } = useTravelMode()
  const { isSaved, toggleSave } = useSavedPlaces()
  const { activeOrigin } = useUserLocation()

  const saved = isSaved(place?.id)

  const destCoords = useMemo(() => {
    if (!place) return [78.4747, 17.3614]
    return place.position
      ? [Number(place.position[1]), Number(place.position[0])]
      : place.location?.coordinates || [78.4747, 17.3614]
  }, [place])

  useEffect(() => {
    let isMounted = true

    const updateRoute = async () => {
      const cached = getRouteCache(activeOrigin, destCoords, travelMode, place?.id)
      if (cached) {
        if (!cached.error && (cached.duration || cached.durationMeters)) {
          setRouteInfo({
            duration: cached.duration?.formatted || `${cached.duration} min`,
            distance: cached.distance?.km ?? cached.distance ?? 2.4,
          })
        }
        setLoadingRoute(false)
        return
      }

      setLoadingRoute(true)
      try {
        const data = await fetchRoute(activeOrigin, destCoords, travelMode, place?.id)
        if (!isMounted) return
        if (data && !data.error && (data.duration || data.durationMeters)) {
          setRouteInfo({
            duration: data.duration?.formatted || (data.duration ? `${data.duration} min` : '10 min'),
            distance: data.distance?.km ?? data.distance ?? 2.4,
          })
        }
      } catch {
        // Graceful fallback
      } finally {
        if (isMounted) setLoadingRoute(false)
      }
    }

    updateRoute()
    return () => {
      isMounted = false
    }
  }, [place?.id, destCoords, travelMode, activeOrigin])

  const handleToggleSave = (e) => {
    e.stopPropagation()
    if (place?.id) {
      toggleSave(place.id)
      setBouncing(true)
      setTimeout(() => setBouncing(false), 600)
    }
  }

  const { priceDisplay, unitDisplay } = formatPriceWithUnit(place?.price, 'attraction')
  const modeEmoji = travelMode === 'foot-walking' ? '🚶' : travelMode === 'cycling-regular' ? '🚴' : '🚗'
  const locationLabel = place?.location?.address || place?.city || 'Hyderabad, Telangana'

  return (
    <article
      className="featured-dest-card interactive-card reveal-fade-up"
      style={{ '--reveal-index': index }}
      onClick={() => onSelectPlace?.(place)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelectPlace?.(place)
      }}
      aria-label={`View details for ${place.name}`}
    >
      {/* Thumbnail Wrap */}
      <div className="dest-card-image-wrap">
        <SafeImage
          src={place.image}
          category={place.category}
          alt={place.name}
        />
        <span className="dest-cat-chip">{place.category || 'Historical Monument'}</span>

        {/* Bookmark Button */}
        <button
          type="button"
          className={`dest-save-btn ${saved ? 'saved' : ''} ${bouncing ? 'heart-beat-active' : ''}`}
          onClick={handleToggleSave}
          aria-label={saved ? `Remove ${place.name} from saved` : `Save ${place.name}`}
          title={saved ? 'Remove from saved' : 'Save place'}
        >
          <Heart size={16} fill={saved ? '#C9682D' : 'none'} color={saved ? '#C9682D' : '#1F3A2E'} />
        </button>

        {/* Travel Distance Badge */}
        {loadingRoute ? (
          <span className="dest-time-chip shimmer">Updating...</span>
        ) : routeInfo && routeInfo.duration ? (
          <span className="dest-time-chip">
            {modeEmoji} {routeInfo.duration} ({routeInfo.distance} km)
          </span>
        ) : null}
      </div>

      {/* Card Body */}
      <div className="dest-card-body">
        <div className="dest-card-top-info">
          <div className="dest-rating-pill">
            <Star size={13} fill="#C9A227" color="#C9A227" />
            <span>{(Number(place.rating) || 4.7).toFixed(1)}</span>
          </div>
          <div className="dest-price-tag">
            <strong>{priceDisplay}</strong>
            <small>/{unitDisplay}</small>
          </div>
        </div>

        <h3 className="dest-card-title">{place.name}</h3>
        <p className="dest-card-addr">
          <MapPin size={12} /> {locationLabel}
        </p>

        <p className="dest-card-snippet">
          {place.description ? place.description.slice(0, 110) + '...' : 'A quintessential landmark showcasing Telangana’s rich architectural heritage.'}
        </p>

        {/* Footer Actions */}
        <div className="dest-card-footer">
          <button
            type="button"
            className="dest-directions-btn"
            onClick={(e) => {
              e.stopPropagation()
              onGetDirections?.(place)
            }}
            title="Get turn-by-turn directions in Google Maps"
          >
            <Navigation size={13} /> Directions
          </button>

          <button
            type="button"
            className="dest-view-btn"
            onClick={() => onSelectPlace?.(place)}
          >
            <span>View Details</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function FeaturedDestinations({
  allPlaces = [],
  places = [],
  onSelectPlace,
  onGetDirections,
  onToggleFullCatalog,
  onExploreAll,
  showingFullCatalog,
}) {
  // Resolve exactly 6 canonical featured places from dataset
  const featuredSix = useMemo(() => {
    const source = (Array.isArray(allPlaces) && allPlaces.length > 0) ? allPlaces : places
    if (!Array.isArray(source) || source.length === 0) return []

    const picked = []
    for (const target of FEATURED_TARGETS) {
      let found = source.find((p) => p.id === target.id)
      if (!found && target.nameMatch) {
        found = source.find((p) => p.name && p.name.toLowerCase().includes(target.nameMatch.toLowerCase()))
      }
      if (found && !picked.some((p) => p.id === found.id)) {
        picked.push(found)
      }
    }

    // Fill to 6 if any were missing
    if (picked.length < 6) {
      for (const p of source) {
        if (!picked.some((item) => item.id === p.id)) {
          picked.push(p)
          if (picked.length === 6) break
        }
      }
    }

    return picked.slice(0, 6)
  }, [allPlaces, places])

  return (
    <section className="featured-destinations-section scroll-reveal" id="destinations">
      {/* Anchor for navbar backward compatibility */}
      <span id="overview" className="anchor-hidden" />

      <div className="featured-dest-container">
        {/* Section Header */}
        <div className="featured-dest-header">
          <div>
            <span className="eyebrow">
              <Compass size={14} /> Curated Telangana Heritage
            </span>
            <h2>
              Featured Destinations
              <br />
              <em>iconic Telangana landmarks.</em>
            </h2>
            <p className="featured-dest-lead">
              Six handpicked monuments and royal palaces that define the historical soul of Hyderabad and Telangana, with transparent ₹ pricing and live routes.
            </p>
          </div>

          <div className="featured-dest-actions">
            <button
              type="button"
              className="explore-catalog-toggle-btn"
              onClick={onExploreAll || onToggleFullCatalog}
            >
              <span>{showingFullCatalog ? 'Hide Full Catalog' : 'Explore All 120+ Places'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* 6 Destination Cards Grid */}
        <div className="featured-dest-grid">
          {featuredSix.map((place, idx) => (
            <DestinationCard
              key={place.id}
              place={place}
              index={idx}
              onSelectPlace={onSelectPlace}
              onGetDirections={onGetDirections}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

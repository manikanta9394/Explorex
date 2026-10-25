import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { ArrowRight, Compass, Locate, Navigation, Star } from 'lucide-react'
import { useTravelMode } from '../context/useTravelMode'
import { useUserLocation } from '../context/useUserLocation'
import { fetchRoute, getRouteCache } from '../services/api'
import { formatPriceWithUnit } from '../utils/formatCurrency'
import { openGoogleMapsDirections } from '../utils/googleMaps'
import { isInsideIndia, validateAndFilterIndiaPlaces } from '../utils/geoUtils'
import MarkerClusterGroup from './MarkerClusterGroup'
import SafeImage from './SafeImage'
import { DistanceBadgeErrorBoundary, MapErrorBoundary } from './ErrorBoundary'
// Dynamically import leaflet stylesheet so it does not block initial page rendering
if (typeof window !== 'undefined') {
  import('leaflet/dist/leaflet.css')
}

// Custom Marker Icons for Categories
const attractionIcon = L.divIcon({
  className: 'all-places-marker attraction-marker',
  html: `<div class="all-pin attraction-pin" title="Attraction">
          <span>🏛️</span>
         </div>`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
})

const hotelIcon = L.divIcon({
  className: 'all-places-marker hotel-marker',
  html: `<div class="all-pin hotel-pin" title="Hotel">
          <span>🏨</span>
         </div>`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
})

const restaurantIcon = L.divIcon({
  className: 'all-places-marker restaurant-marker',
  html: `<div class="all-pin restaurant-pin" title="Restaurant">
          <span>🍽️</span>
         </div>`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
})

const userLocationIcon = L.divIcon({
  className: 'all-places-marker user-marker',
  html: `<div class="user-gps-pin">
          <span class="gps-dot"></span>
          <span class="gps-pulse"></span>
         </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

function MapBoundsRecenter({ items, userCoords, filterKey }) {
  const map = useMap()
  const lastKeyRef = useRef(null)

  useEffect(() => {
    // Only fit bounds on initial load or when filter/geo changes
    const currentKey = `${filterKey}_${items?.length || 0}_${userCoords ? 'geo' : 'nogeo'}`
    if (lastKeyRef.current === currentKey) return
    lastKeyRef.current = currentKey

    // If user clicked "My Location" and granted GPS, zoom to user's region
    if (userCoords && Array.isArray(userCoords) && userCoords.length >= 2) {
      const uLat = Number(userCoords[1])
      const uLng = Number(userCoords[0])
      if (!isNaN(uLat) && !isNaN(uLng)) {
        map.setView([uLat, uLng], 12)
        return
      }
    }

    // Default nationwide view: center of India
    map.setView([22.5, 79.5], 5)
  }, [map, items, userCoords, filterKey])

  return null
}

function PopupCardContent({ place, onSelectPlace, onGetDirections }) {
  const { travelMode } = useTravelMode()
  const { activeOrigin } = useUserLocation()

  const destCoords = useMemo(() => {
    return place.position
      ? [Number(place.position[1]), Number(place.position[0])]
      : place.location?.coordinates || [78.4747, 17.3614]
  }, [place])

  const [routeInfo, setRouteInfo] = useState(() => {
    const cached = getRouteCache(activeOrigin, destCoords, travelMode, place.id)
    if (cached && !cached.error && (cached.duration || cached.durationMeters)) {
      return {
        duration: cached.duration?.formatted || `${cached.duration} min`,
        distance: cached.distance?.km ?? cached.distance ?? 2.4,
      }
    }
    return null
  })

  useEffect(() => {
    let isMounted = true

    fetchRoute(activeOrigin, destCoords, travelMode, place.id)
      .then((data) => {
        if (!isMounted) return
        if (data && !data.error && (data.duration || data.durationMeters)) {
          setRouteInfo({
            duration: data.duration?.formatted || (data.duration ? `${data.duration} min` : '10 min'),
            distance: data.distance?.km ?? data.distance ?? (data.distanceMeters ? (data.distanceMeters / 1000).toFixed(1) : 2.4),
          })
        } else {
          setRouteInfo({ error: true })
        }
      })
      .catch(() => {
        if (isMounted) setRouteInfo({ error: true })
      })

    return () => {
      isMounted = false
    }
  }, [place.id, destCoords, travelMode, activeOrigin])

  const fallbackType = place.category?.toLowerCase().includes('hotel') ? 'hotel' : 'attraction'
  const { priceDisplay, unitDisplay: priceUnit } = formatPriceWithUnit(place.price, fallbackType)
  const modeEmoji = travelMode === 'foot-walking' ? '🚶' : travelMode === 'cycling-regular' ? '🚴' : '🚗'

  return (
    <div className="popup-preview-card">
      <div className="popup-image-wrap">
        <SafeImage
          src={place.image}
          category={place.category}
          fallbackSrc={place.fallbackImage}
          alt={place.name}
        />
        <span className="popup-category-chip">{place.category || 'Attraction'}</span>
      </div>

      <div className="popup-body">
        <h4>{place.name}</h4>
        <div className="popup-meta-row">
          <span className="popup-rating">
            <Star size={13} fill="#C9A227" color="#C9A227" />
            <strong>{(Number(place.rating) || 4.7).toFixed(1)}</strong>
          </span>
          <span className="popup-price">{priceDisplay} <small>/{priceUnit}</small></span>
        </div>

        <DistanceBadgeErrorBoundary modeEmoji={modeEmoji}>
          {routeInfo && !routeInfo.error && routeInfo.duration ? (
            <div className="popup-travel-badge">
              {modeEmoji} {routeInfo.duration} ({routeInfo.distance} km)
            </div>
          ) : routeInfo?.error ? (
            <div className="popup-travel-badge travel-time-unavailable">
              {modeEmoji} Distance unavailable
            </div>
          ) : null}
        </DistanceBadgeErrorBoundary>

        <div className="popup-actions">
          <button className="popup-view-btn" onClick={() => onSelectPlace?.(place)}>
            View Details <ArrowRight size={13} />
          </button>
          <button
            className="popup-directions-btn"
            onClick={() => {
              if (onGetDirections) {
                onGetDirections(place)
              } else {
                openGoogleMapsDirections(place, travelMode)
              }
            }}
            title="Get directions in Google Maps"
          >
            <Navigation size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function AllPlacesMapInner({ places = [], onSelectPlace, onGetDirections }) {
  const [filter, setFilter] = useState('all') // 'all' | 'attractions' | 'hotels' | 'restaurants'
  const [userCoords, setUserCoords] = useState(null)
  const [geoLocating, setGeoLocating] = useState(false)

  // Geolocation for map spatial context
  function handleLocateUser() {
    if (!('geolocation' in navigator)) return
    setGeoLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords([pos.coords.longitude, pos.coords.latitude])
        setGeoLocating(false)
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err.message)
        setGeoLocating(false)
      },
      { timeout: 8000, enableHighAccuracy: true }
    )
  }

  // Filter dataset items, validating every place is within India boundary
  const filteredPlaces = useMemo(() => {
    const rawList = Array.isArray(places) ? places : []
    const validatedList = validateAndFilterIndiaPlaces(rawList, 'AllPlacesMap')

    if (filter === 'attractions') {
      return validatedList.filter((p) => {
        const id = String(p.id || '')
        return id.startsWith('place-') || p.type === 'attraction' || (!id.startsWith('hotel-') && !id.startsWith('restaurant-') && p.type !== 'stay' && p.type !== 'food')
      })
    }
    if (filter === 'hotels') {
      return validatedList.filter((p) => {
        const id = String(p.id || '')
        return id.startsWith('hotel-') || p.type === 'stay' || p.category?.toLowerCase().includes('hotel')
      })
    }
    if (filter === 'restaurants') {
      return validatedList.filter((p) => {
        const id = String(p.id || '')
        return id.startsWith('restaurant-') || p.type === 'food' || p.cuisine || p.detail?.includes('Dining') || p.category?.toLowerCase().includes('food')
      })
    }
    return validatedList
  }, [places, filter])

  function getMarkerIcon(place) {
    const id = String(place.id || '')
    const cat = (place.category || '').toLowerCase()
    if (id.startsWith('hotel-') || place.type === 'stay' || cat.includes('hotel')) {
      return hotelIcon
    }
    if (id.startsWith('restaurant-') || place.type === 'food' || place.cuisine || place.detail?.includes('Dining') || cat.includes('restaurant')) {
      return restaurantIcon
    }
    return attractionIcon
  }

  return (
    <div className="all-places-map-wrapper">
      {/* Map Header & Category Filters */}
      <div className="map-controls-header">
        <div className="map-filter-pills">
          <button className={`filter-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            🌟 All ({places.length})
          </button>
          <button className={`filter-pill ${filter === 'attractions' ? 'active' : ''}`} onClick={() => setFilter('attractions')}>
            🏛️ Attractions
          </button>
          <button className={`filter-pill ${filter === 'hotels' ? 'active' : ''}`} onClick={() => setFilter('hotels')}>
            🏨 Hotels
          </button>
          <button className={`filter-pill ${filter === 'restaurants' ? 'active' : ''}`} onClick={() => setFilter('restaurants')}>
            🍽️ Restaurants
          </button>
        </div>

        <button className="locate-me-btn" onClick={handleLocateUser} disabled={geoLocating} title="Show my current location">
          <Locate size={14} />
          <span>{geoLocating ? 'Locating...' : 'My Location'}</span>
        </button>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="map-canvas-container">
        <MapContainer
          center={[22.5, 79.5]}
          zoom={5}
          minZoom={4}
          maxZoom={18}
          scrollWheelZoom={true}
          className="all-places-leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Location GPS Marker */}
          {userCoords && (
            <Marker position={[userCoords[1], userCoords[0]]} icon={userLocationIcon}>
              <Popup className="user-gps-popup">
                <div className="gps-popup-body">
                  <Compass size={14} /> <strong>Your Current Location</strong>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Place Category Markers with Marker Clustering */}
          <MarkerClusterGroup key={filter} spiderfyOnMaxZoom={true} maxClusterRadius={45}>
            {filteredPlaces.map((place) => {
              const leafletLat = place.position ? Number(place.position[0]) : Number(place.location?.coordinates?.[1])
              const leafletLng = place.position ? Number(place.position[1]) : Number(place.location?.coordinates?.[0])
              if (!isInsideIndia(leafletLat, leafletLng)) {
                console.warn(`[AllPlacesMap] Hiding pin outside India: ${place.name} at [${leafletLat}, ${leafletLng}]`)
                return null
              }

              return (
                <Marker key={place.id} position={[leafletLat, leafletLng]} icon={getMarkerIcon(place)}>
                  <Popup className="place-preview-popup" closeButton={true}>
                    <PopupCardContent
                      place={place}
                      onSelectPlace={onSelectPlace}
                      onGetDirections={onGetDirections}
                    />
                  </Popup>
                </Marker>
              )
            })}
          </MarkerClusterGroup>

          <MapBoundsRecenter items={filteredPlaces} userCoords={userCoords} filterKey={filter} />
        </MapContainer>

        {/* Map Legend Overlay */}
        <div className="map-legend-overlay">
          <div className="legend-item"><span className="legend-dot attraction" /> Attractions</div>
          <div className="legend-item"><span className="legend-dot hotel" /> Hotels</div>
          <div className="legend-item"><span className="legend-dot restaurant" /> Restaurants</div>
          {userCoords && <div className="legend-item"><span className="legend-dot user" /> You</div>}
        </div>
      </div>
    </div>
  )
}

export default function AllPlacesMap(props) {
  return (
    <MapErrorBoundary minHeight="450px">
      <AllPlacesMapInner {...props} />
    </MapErrorBoundary>
  )
}

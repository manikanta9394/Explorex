import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { ArrowRight, Compass, Locate, Navigation, Star } from 'lucide-react'
import { useTravelMode } from '../context/useTravelMode'
import { useUserLocation } from '../context/useUserLocation'
import { fetchRoute } from '../services/api'
import { formatPriceWithUnit } from '../utils/formatCurrency'
import { openGoogleMapsDirections } from '../utils/googleMaps'
import MarkerClusterGroup from './MarkerClusterGroup'
import SafeImage from './SafeImage'
import 'leaflet/dist/leaflet.css'

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

function MapBoundsRecenter({ items, userCoords }) {
  const map = useMap()
  const hasFittedRef = useRef(false)

  useEffect(() => {
    if (hasFittedRef.current && (!userCoords || items.length === 0)) return

    // Filter items to Hyderabad & surrounding metro region (16.5..18.5 N, 77.5..79.5 E)
    const localCoords = items
      .map((item) => {
        if (item.position) return item.position
        if (item.location?.coordinates) return [item.location.coordinates[1], item.location.coordinates[0]]
        return null
      })
      .filter((coord) => coord && coord[0] >= 16.5 && coord[0] <= 18.5 && coord[1] >= 77.5 && coord[1] <= 79.5)

    if (userCoords) {
      localCoords.push([userCoords[1], userCoords[0]])
    }

    if (localCoords.length > 0) {
      const bounds = L.latLngBounds(localCoords)
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13, minZoom: 11 })
        hasFittedRef.current = true
      }
    } else {
      map.setView([17.3850, 78.4867], 12)
      hasFittedRef.current = true
    }
  }, [map, items, userCoords])

  return null
}

function PopupCardContent({ place, onSelectPlace, onGetDirections }) {
  const [routeInfo, setRouteInfo] = useState(null)
  const { travelMode } = useTravelMode()
  const { activeOrigin } = useUserLocation()

  useEffect(() => {
    let isMounted = true
    const destCoords = place.position
      ? [place.position[1], place.position[0]]
      : place.location?.coordinates || [78.4747, 17.3616]

    fetchRoute(activeOrigin, destCoords, travelMode).then((data) => {
      if (!isMounted) return
      if (data) {
        setRouteInfo({
          duration: data.duration?.formatted || (data.duration ? `${data.duration} min` : '10 min'),
          distance: data.distance?.km || data.distance || (data.distanceMeters ? (data.distanceMeters / 1000).toFixed(1) : 2.4),
        })
      }
    })

    return () => {
      isMounted = false
    }
  }, [place, travelMode, activeOrigin])

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
        <span className="popup-category-chip">{place.category}</span>
      </div>

      <div className="popup-body">
        <h4>{place.name}</h4>
        <div className="popup-meta-row">
          <span className="popup-rating">
            <Star size={13} fill="#C9A227" color="#C9A227" />
            <strong>{place.rating || 4.7}</strong>
          </span>
          <span className="popup-price">{priceDisplay} <small>/{priceUnit}</small></span>
        </div>

        {routeInfo && (
          <div className="popup-travel-badge">
            {modeEmoji} {routeInfo.duration} ({routeInfo.distance} km)
          </div>
        )}

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

export default function AllPlacesMap({ places = [], onSelectPlace, onGetDirections }) {
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

  // Filter dataset items
  const filteredPlaces = useMemo(() => {
    if (filter === 'attractions') {
      return places.filter((p) => p.id.startsWith('place-') || (!p.id.startsWith('hotel-') && !p.id.startsWith('restaurant-')))
    }
    if (filter === 'hotels') {
      return places.filter((p) => p.id.startsWith('hotel-') || p.category?.toLowerCase().includes('hotel'))
    }
    if (filter === 'restaurants') {
      return places.filter((p) => p.id.startsWith('restaurant-') || p.cuisine || p.detail?.includes('Dining'))
    }
    return places
  }, [places, filter])

  function getMarkerIcon(place) {
    if (place.id.startsWith('hotel-') || place.category?.toLowerCase().includes('hotel')) {
      return hotelIcon
    }
    if (place.id.startsWith('restaurant-') || place.cuisine || place.detail?.includes('Dining')) {
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
          center={[17.3850, 78.4867]}
          zoom={12}
          minZoom={9}
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
          <MarkerClusterGroup key={filter}>
            {filteredPlaces.map((place) => {
              const leafletLat = place.position ? place.position[0] : place.location?.coordinates[1]
              const leafletLng = place.position ? place.position[1] : place.location?.coordinates[0]
              if (!leafletLat || !leafletLng) return null

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

          <MapBoundsRecenter items={filteredPlaces} userCoords={userCoords} />
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

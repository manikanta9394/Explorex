import { useEffect, useRef } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MapErrorBoundary } from './ErrorBoundary'
// Dynamically import leaflet stylesheet so it does not block initial page rendering
if (typeof window !== 'undefined') {
  import('leaflet/dist/leaflet.css')
}

// Custom Start Location Marker (Green Frosted Pin with Pulsing Dot)
const startIcon = L.divIcon({
  className: 'custom-route-marker start-marker',
  html: `<div class="marker-pin start-pin">
          <span class="marker-dot"></span>
          <span class="marker-pulse"></span>
         </div>`,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
})

// Custom Destination Marker (Gold Monument Pin)
const destIcon = L.divIcon({
  className: 'custom-route-marker dest-marker',
  html: `<div class="marker-pin dest-pin">
          <span class="marker-icon">📍</span>
         </div>`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
})

function MapBoundsFitter({ points }) {
  const map = useMap()
  const lastKeyRef = useRef('')

  useEffect(() => {
    if (!points || points.length === 0) return

    // Convert coordinates to Leaflet [lat, lng]
    const leafletCoords = points
      .map((pt) => {
        if (Array.isArray(pt) && pt.length >= 2) {
          const lat = Number(pt[0])
          const lng = Number(pt[1])
          if (!isNaN(lat) && !isNaN(lng)) return [lat, lng]
        }
        return null
      })
      .filter(Boolean)

    if (leafletCoords.length === 0) return

    const key = leafletCoords
      .slice(0, 5)
      .concat(leafletCoords.slice(-5))
      .map((pt) => `${pt[0].toFixed(3)},${pt[1].toFixed(3)}`)
      .join(';')

    if (lastKeyRef.current === key) return
    lastKeyRef.current = key

    try {
      const bounds = L.latLngBounds(leafletCoords)
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [45, 45], maxZoom: 16 })
      }
    } catch {
      // ignore fitBounds failure
    }
  }, [map, points])

  return null
}

function RouteMapInner({ startCoords, destCoords, routeCoordinates = [] }) {
  const validStart =
    Array.isArray(startCoords) &&
    startCoords.length >= 2 &&
    !isNaN(Number(startCoords[0])) &&
    !isNaN(Number(startCoords[1]))

  const validDest =
    Array.isArray(destCoords) &&
    destCoords.length >= 2 &&
    !isNaN(Number(destCoords[0])) &&
    !isNaN(Number(destCoords[1]))

  if (!validStart || !validDest) {
    return (
      <div className="route-map-placeholder" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        Route coordinates unavailable
      </div>
    )
  }

  const startLeaflet = [Number(startCoords[1]), Number(startCoords[0])]
  const destLeaflet = [Number(destCoords[1]), Number(destCoords[0])]

  // Convert GeoJSON [lng, lat] coordinates to Leaflet [lat, lng] array
  const linePoints =
    Array.isArray(routeCoordinates) && routeCoordinates.length >= 2
      ? routeCoordinates
          .map((pt) => {
            if (Array.isArray(pt) && pt.length >= 2) {
              const lat = Number(pt[1])
              const lng = Number(pt[0])
              if (!isNaN(lat) && !isNaN(lng)) return [lat, lng]
            }
            return null
          })
          .filter(Boolean)
      : [startLeaflet, destLeaflet]

  const allPoints = [startLeaflet, destLeaflet, ...linePoints]

  return (
    <div className="route-map-wrapper">
      <MapContainer
        center={destLeaflet}
        zoom={13}
        scrollWheelZoom={true}
        className="route-leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Start Marker */}
        <Marker position={startLeaflet} icon={startIcon} />

        {/* Destination Marker */}
        <Marker position={destLeaflet} icon={destIcon} />

        {/* Polyline Route */}
        {linePoints.length >= 2 && (
          <Polyline
            positions={linePoints}
            pathOptions={{
              color: '#1F3A2E',
              weight: 5,
              opacity: 0.85,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        )}

        <MapBoundsFitter points={allPoints} />
      </MapContainer>
    </div>
  )
}

export default function RouteMap(props) {
  return (
    <MapErrorBoundary minHeight="300px">
      <RouteMapInner {...props} />
    </MapErrorBoundary>
  )
}

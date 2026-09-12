import { useEffect } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

  useEffect(() => {
    if (!points || points.length === 0) return

    // Convert coordinates from [lng, lat] to Leaflet [lat, lng]
    const leafletCoords = points.map((pt) => {
      if (Array.isArray(pt)) {
        return [pt[1], pt[0]]
      }
      if (pt.lat !== undefined && pt.lng !== undefined) {
        return [pt.lat, pt.lng]
      }
      return pt
    })

    if (leafletCoords.length > 0) {
      const bounds = L.latLngBounds(leafletCoords)
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [45, 45], maxZoom: 16 })
      }
    }
  }, [map, points])

  return null
}

export default function RouteMap({ startCoords, destCoords, routeCoordinates = [] }) {
  // Convert GeoJSON [lng, lat] coordinates to Leaflet [lat, lng] array
  const linePoints = routeCoordinates.length > 0
    ? routeCoordinates.map((pt) => [pt[1], pt[0]])
    : [
        [startCoords[1], startCoords[0]],
        [destCoords[1], destCoords[0]],
      ]

  const startLeaflet = [startCoords[1], startCoords[0]]
  const destLeaflet = [destCoords[1], destCoords[0]]
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

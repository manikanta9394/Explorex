import { useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { ArrowRight, MapPin, Star, X } from 'lucide-react'
import { mapAttractions } from '../data/tourismData'
import MarkerClusterGroup from './MarkerClusterGroup'
import 'leaflet/dist/leaflet.css'

const markerIcon = L.divIcon({
  className: 'tour-marker-wrap',
  html: '<span class="tour-marker"><span></span></span>',
  iconSize: [30, 38],
  iconAnchor: [15, 38],
})

function AttractionMarker({ attraction, onSelect }) {
  return <Marker position={attraction.position} icon={markerIcon} eventHandlers={{ click: () => onSelect(attraction) }} />
}

export default function TourMap({ attractions = mapAttractions, center = [17.3850, 78.4867], zoom = 11.5, onViewDetails }) {
  const [selected, setSelected] = useState(attractions[0] ?? null)

  return (
    <div className="tour-map-shell">
      <MapContainer center={center} zoom={zoom} minZoom={9} scrollWheelZoom={false} className="tour-map">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkerClusterGroup>
          {attractions.map((attraction) => (
            <AttractionMarker attraction={attraction} onSelect={setSelected} key={attraction.id} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      {selected && (
        <aside className="map-place-card">
          <button className="map-card-close" onClick={() => setSelected(null)} aria-label="Close attraction details">
            <X size={15} />
          </button>
          <div className="map-card-icon">
            <MapPin size={17} />
          </div>
          <div className="map-card-copy">
            <span className="map-card-category">{selected.category}</span>
            <h3>{selected.name}</h3>
            <div className="map-card-rating">
              <Star size={14} fill="currentColor" /> {selected.rating.toFixed(1)} <span>Highly rated</span>
            </div>
            <button className="map-details-button" onClick={() => onViewDetails?.(selected)}>
              View Details <ArrowRight size={14} />
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}


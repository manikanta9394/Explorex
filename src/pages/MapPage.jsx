import { MapPin } from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import AllPlacesMap from '../components/AllPlacesMap'
import { allDatasetPlaces } from '../data/tourismData'
import { MapErrorBoundary } from '../components/ErrorBoundary'

export default function MapPage({ onNavigate, onSelectPlace, onGetDirections }) {
  const handleSelect = (place) => {
    if (onSelectPlace) {
      onSelectPlace(place)
    }
    if (onNavigate && place?.id) {
      onNavigate(`explore/${place.id}`)
    }
  }

  return (
    <div className="map-page-shell">
      {/* Header Band */}
      <PageHeaderBand
        eyebrow="Spatial Navigation & Explorer"
        title="Interactive India Map"
        subtitle="Explore destinations clustered across all 36 States and Union Territories of India with category filters, spatial previews, and live routing."
        badge={
          <span className="header-stat-badge">
            <MapPin size={13} /> {allDatasetPlaces.length} Pins Clustered Across India
          </span>
        }
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Interactive Map' },
        ]}
      />

      {/* Map Main Canvas Container */}
      <div className="map-page-content-wrapper">
        <MapErrorBoundary minHeight="650px">
          <AllPlacesMap
            places={allDatasetPlaces}
            onSelectPlace={handleSelect}
            onGetDirections={onGetDirections}
          />
        </MapErrorBoundary>
      </div>
    </div>
  )
}

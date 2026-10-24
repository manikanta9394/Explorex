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
        title="Interactive Telangana Map"
        subtitle="Explore 400 destinations clustered across Hyderabad and Telangana with category filters, spatial previews, and live routing."
        badge={
          <span className="header-stat-badge">
            <MapPin size={13} /> 400 Pins Clustered
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

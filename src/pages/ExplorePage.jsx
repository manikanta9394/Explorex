import { useMemo, useState } from 'react'
import {
  ArrowUpDown,
  Compass,
  Heart,
  Navigation,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SafeImage from '../components/SafeImage'
import TravelModeSegmentedControl from '../components/TravelModeSegmentedControl'
import PlaceWeatherBadge from '../components/PlaceWeatherBadge'
import { getBestTimeToVisit } from '../services/weatherService'
import { allDatasetPlaces } from '../data/tourismData'
import { useSavedPlaces } from '../context/useSavedPlaces'
import { useTravelMode } from '../context/useTravelMode'
import { useUserLocation } from '../context/useUserLocation'
import { formatPriceWithUnit } from '../utils/formatCurrency'
import { openGoogleMapsDirections } from '../utils/googleMaps'
import { DistanceBadgeErrorBoundary } from '../components/ErrorBoundary'
import useScrollReveal from '../utils/useScrollReveal'

export default function ExplorePage({ onNavigate, onSelectPlace, onGetDirections }) {
  useScrollReveal()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all') // 'all' | 'attractions' | 'stays' | 'food'
  const [sortBy, setSortBy] = useState('rating') // 'rating' | 'price-asc' | 'price-desc' | 'name'
  const [visibleLimit, setVisibleLimit] = useState(12)
  const [beatingId, setBeatingId] = useState(null)

  const { isSaved, toggleSave } = useSavedPlaces()
  const { travelMode } = useTravelMode()
  const { userCoords } = useUserLocation()

  // Filter and sort places
  const filteredPlaces = useMemo(() => {
    let result = [...allDatasetPlaces]

    // Category filter
    if (categoryFilter === 'attractions') {
      result = result.filter(
        (p) =>
          p.id?.startsWith('place-') ||
          (!p.id?.startsWith('hotel-') && !p.id?.startsWith('restaurant-'))
      )
    } else if (categoryFilter === 'stays') {
      result = result.filter(
        (p) =>
          p.id?.startsWith('hotel-') ||
          p.category?.toLowerCase().includes('hotel') ||
          p.category?.toLowerCase().includes('resort')
      )
    } else if (categoryFilter === 'food') {
      result = result.filter(
        (p) =>
          p.id?.startsWith('restaurant-') ||
          p.category?.toLowerCase().includes('restaurant') ||
          p.category?.toLowerCase().includes('dining')
      )
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.location?.address?.toLowerCase().includes(q)
      )
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0)
      }
      if (sortBy === 'price-asc') {
        return (a.price?.amount || 0) - (b.price?.amount || 0)
      }
      if (sortBy === 'price-desc') {
        return (b.price?.amount || 0) - (a.price?.amount || 0)
      }
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '')
      }
      return 0
    })

    return result
  }, [categoryFilter, searchQuery, sortBy])

  const handleSaveClick = (e, placeId) => {
    e.stopPropagation()
    toggleSave(placeId)
    setBeatingId(placeId)
    setTimeout(() => setBeatingId(null), 600)
  }

  const handleDirectionsClick = (e, place) => {
    e.stopPropagation()
    if (onGetDirections) {
      onGetDirections(place)
    } else {
      const userLatLng = userCoords ? { lat: userCoords[1], lng: userCoords[0] } : null
      openGoogleMapsDirections(place, travelMode, userLatLng)
    }
  }

  const handleCardClick = (place) => {
    if (onSelectPlace) {
      onSelectPlace(place)
    }
    if (onNavigate && place?.id) {
      onNavigate(`explore/${place.id}`)
    }
  }

  const modeEmoji =
    travelMode === 'foot-walking' ? '🚶' : travelMode === 'cycling-regular' ? '🚴' : '🚗'

  return (
    <div className="explore-page-shell">
      {/* Header Band */}
      <PageHeaderBand
        eyebrow="Curated Heritage & Experiences"
        title="Explore Destinations"
        subtitle="Search, filter, and sort through 400 verified attractions, royal monuments, hotels, and authentic dining spots across Hyderabad and Telangana."
        badge={
          <span className="header-stat-badge">
            <Compass size={13} /> {filteredPlaces.length} Destinations Listed
          </span>
        }
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Explore' },
        ]}
      />

      {/* Main Content Shell */}
      <div className="explore-content-container">
        {/* Search & Filter Toolbar */}
        <div className="explore-toolbar-card">
          <div className="toolbar-search-row">
            <div className="explore-search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, monument, palace, biryani, or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="toolbar-travel-mode">
              <TravelModeSegmentedControl />
            </div>
          </div>

          <div className="toolbar-filter-row">
            <div className="filter-chips-group">
              <button
                type="button"
                className={`explore-filter-chip ${categoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                <span>🌟 All</span>
                <span className="chip-count">400</span>
              </button>
              <button
                type="button"
                className={`explore-filter-chip ${categoryFilter === 'attractions' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('attractions')}
              >
                <span>🏛️ Attractions</span>
                <span className="chip-count">250</span>
              </button>
              <button
                type="button"
                className={`explore-filter-chip ${categoryFilter === 'stays' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('stays')}
              >
                <span>🏨 Stays</span>
                <span className="chip-count">75</span>
              </button>
              <button
                type="button"
                className={`explore-filter-chip ${categoryFilter === 'food' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('food')}
              >
                <span>🍽️ Food</span>
                <span className="chip-count">75</span>
              </button>
            </div>

            <div className="toolbar-sort-wrap">
              <label htmlFor="sort-select">
                <ArrowUpDown size={14} /> Sort By:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Highest Rated ★</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Places Card Grid */}
        {filteredPlaces.length === 0 ? (
          <div className="explore-empty-state">
            <Compass size={42} className="empty-icon" />
            <h3>No destinations match your search</h3>
            <p>Try searching for a different keyword or reset the active category filters.</p>
            <button
              type="button"
              className="reset-filters-btn"
              onClick={() => {
                setSearchQuery('')
                setCategoryFilter('all')
              }}
            >
              <RotateCcw size={14} /> Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="explore-cards-grid">
              {filteredPlaces.slice(0, visibleLimit).map((place, idx) => {
                const saved = isSaved(place.id)
                const fallbackType = place.id?.startsWith('hotel-')
                  ? 'hotel'
                  : place.id?.startsWith('restaurant-')
                  ? 'restaurant'
                  : 'place'
                const { priceDisplay, unitDisplay } = formatPriceWithUnit(
                  place.price,
                  fallbackType
                )
                const bestTime = getBestTimeToVisit(place)

                return (
                  <article
                    key={place.id}
                    className="explore-place-card interactive-card reveal-fade-up"
                    style={{ '--reveal-index': idx % 12 }}
                    onClick={() => handleCardClick(place)}
                  >
                    <div className="card-thumb-wrap">
                      <SafeImage
                        src={place.image}
                        fallbackSrc={place.fallbackImage}
                        category={place.category}
                        alt={place.name}
                      />
                      <span className="card-category-badge">{place.category}</span>

                      {/* Live Weather Badge (Compact) */}
                      <div className="card-weather-overlay">
                        <PlaceWeatherBadge
                          coordinates={place.position}
                          placeId={place.id}
                          compact
                        />
                      </div>

                      <button
                        type="button"
                        className={`card-save-btn ${saved ? 'saved' : ''} ${beatingId === place.id ? 'heart-beat-active' : ''}`}
                        onClick={(e) => handleSaveClick(e, place.id)}
                        aria-label={saved ? 'Remove from saved' : 'Save destination'}
                        title={saved ? 'Saved in wishlist' : 'Save place'}
                      >
                        <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
                      </button>

                      <DistanceBadgeErrorBoundary modeEmoji={modeEmoji}>
                        <span className="card-mode-chip">
                          {modeEmoji} {place.location?.address?.split(',')[0] || 'Hyderabad'}
                        </span>
                      </DistanceBadgeErrorBoundary>
                    </div>

                    <div className="card-body">
                      <div className="card-header-row">
                        <h3 className="card-title" title={place.name}>
                          {place.name}
                        </h3>
                        <span className="card-rating">
                          <Star size={13} fill="#C9A227" color="#C9A227" />
                          <strong>{place.rating || 4.7}</strong>
                        </span>
                      </div>

                      {/* Best Time to Visit Badge */}
                      <div className="card-best-time-row">
                        <span className="card-best-time-pill" title={bestTime.fullText}>
                          <Sparkles size={11} /> {bestTime.badge}
                        </span>
                      </div>

                      <p className="card-desc">
                        {place.detail || place.description || `${place.name} in Telangana.`}
                      </p>

                      <div className="card-footer-row">
                        <div className="card-price-block">
                          <span className="price-amount">{priceDisplay}</span>
                          <span className="price-unit">/{unitDisplay}</span>
                        </div>

                        <button
                          type="button"
                          className="card-directions-btn"
                          onClick={(e) => handleDirectionsClick(e, place)}
                          title="Get Directions in Google Maps"
                        >
                          <Navigation size={13} />
                          <span>Directions</span>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Load More Button */}
            {visibleLimit < filteredPlaces.length && (
              <div className="load-more-container">
                <button
                  type="button"
                  className="load-more-btn"
                  onClick={() => setVisibleLimit((prev) => prev + 12)}
                >
                  <span>Load More Destinations</span>
                  <span className="load-more-counter">
                    ({filteredPlaces.length - visibleLimit} remaining)
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

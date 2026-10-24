import { useMemo, useState, useEffect } from 'react'
import {
  ArrowUpDown,
  Compass,
  Heart,
  MapPin,
  Navigation,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  X,
  Clock,
  IndianRupee,
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

// Distance calculator in km
function calculateDistance(coord1, coord2) {
  if (!coord1 || !coord2) return null
  const [lat1, lon1] = coord1
  const [lat2, lon2] = coord2
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Text Highlighter
function HighlightedText({ text = '', query = '' }) {
  if (!query.trim() || !text) return text
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="search-highlight">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

export default function ExplorePage({ onNavigate, onSelectPlace, onGetDirections }) {
  useScrollReveal()

  // Read initial state filter from URL query param if present
  const getInitialState = () => {
    try {
      const search = window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '')
      const params = new URLSearchParams(search)
      return params.get('state') || 'all'
    } catch {
      return 'all'
    }
  }

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedState, setSelectedState] = useState(getInitialState)
  const [selectedCity, setSelectedCity] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all') // 'all' | 'attractions' | 'stays' | 'food'
  const [typeFilter, setTypeFilter] = useState('all') // 'all' | specific category
  const [priceFilter, setPriceFilter] = useState('all') // 'all' | 'free' | 'paid'
  const [ratingFilter, setRatingFilter] = useState('all') // 'all' | '4.5' | '4.0'
  const [distanceFilter, setDistanceFilter] = useState('all') // 'all' | '25' | '50' | '100'
  const [openNowOnly, setOpenNowOnly] = useState(false)
  const [sortBy, setSortBy] = useState('rating') // 'rating' | 'price-asc' | 'price-desc' | 'name'
  const [visibleLimit, setVisibleLimit] = useState(12)
  const [beatingId, setBeatingId] = useState(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const { isSaved, toggleSave } = useSavedPlaces()
  const { travelMode } = useTravelMode()
  const { userCoords } = useUserLocation()

  // 200ms debounce for search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Extract unique sorted states across India
  const allStates = useMemo(() => {
    const set = new Set()
    allDatasetPlaces.forEach((p) => {
      if (p.state) set.add(p.state)
    })
    return Array.from(set).sort()
  }, [])

  // Extract cities for currently selected state
  const citiesInState = useMemo(() => {
    const set = new Set()
    allDatasetPlaces.forEach((p) => {
      if (p.city && (selectedState === 'all' || p.state === selectedState)) {
        set.add(p.city)
      }
    })
    return Array.from(set).sort()
  }, [selectedState])

  // Extract unique categories
  const allCategories = useMemo(() => {
    const set = new Set()
    allDatasetPlaces.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set).sort()
  }, [])

  // Filter and sort places
  const filteredPlaces = useMemo(() => {
    let result = [...allDatasetPlaces]

    // 1. State Filter (Critical requirement: Tamil Nadu filter must show only Tamil Nadu places)
    if (selectedState !== 'all') {
      result = result.filter((p) => {
        const pState = (p.state || '').toLowerCase()
        const target = selectedState.toLowerCase()
        return pState === target || pState.includes(target)
      })
    }

    // 2. City Filter
    if (selectedCity !== 'all') {
      result = result.filter((p) => p.city?.toLowerCase() === selectedCity.toLowerCase())
    }

    // 3. Category / Main Type Filter (All / Attractions / Stays / Food)
    if (categoryFilter === 'attractions') {
      result = result.filter(
        (p) =>
          p.type === 'attraction' ||
          (!p.id?.startsWith('hotel-') && !p.id?.startsWith('restaurant-') && p.type !== 'stay' && p.type !== 'food')
      )
    } else if (categoryFilter === 'stays') {
      result = result.filter(
        (p) =>
          p.type === 'stay' ||
          p.id?.startsWith('hotel-') ||
          p.category?.toLowerCase().includes('hotel') ||
          p.category?.toLowerCase().includes('resort')
      )
    } else if (categoryFilter === 'food') {
      result = result.filter(
        (p) =>
          p.type === 'food' ||
          p.id?.startsWith('restaurant-') ||
          p.category?.toLowerCase().includes('restaurant') ||
          p.category?.toLowerCase().includes('culinary') ||
          p.category?.toLowerCase().includes('dining')
      )
    }

    // 4. Sub-category Filter
    if (typeFilter !== 'all') {
      result = result.filter((p) => p.category?.toLowerCase() === typeFilter.toLowerCase())
    }

    // 5. Free / Paid Filter
    if (priceFilter === 'free') {
      result = result.filter((p) => p.price?.amount === 0 || p.price_amount === 0)
    } else if (priceFilter === 'paid') {
      result = result.filter((p) => (p.price?.amount || p.price_amount || 0) > 0)
    }

    // 6. Rating Filter
    if (ratingFilter === '4.5') {
      result = result.filter((p) => (p.rating || 0) >= 4.5)
    } else if (ratingFilter === '4.0') {
      result = result.filter((p) => (p.rating || 0) >= 4.0)
    }

    // 7. Distance Filter (from userCoords if available)
    if (distanceFilter !== 'all' && userCoords) {
      const maxKm = Number(distanceFilter)
      const userLatLng = [userCoords[1], userCoords[0]]
      result = result.filter((p) => {
        if (!p.position) return false
        const km = calculateDistance(userLatLng, p.position)
        return km !== null && km <= maxKm
      })
    }

    // 8. Open Now Filter
    if (openNowOnly) {
      const currentHour = new Date().getHours()
      result = result.filter((p) => {
        if (!p.opening_hours) return true
        // If explicitly open 24 hours
        if (p.opening_hours.includes('24 hours')) return true
        // If morning-evening standard
        return currentHour >= 9 && currentHour < 18
      })
    }

    // 9. Full-Text Search with Debounce
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.state?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }

    // 10. Sort By
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0)
      }
      if (sortBy === 'price-asc') {
        const pA = a.price?.amount !== undefined && a.price?.amount !== null ? a.price.amount : 999999
        const pB = b.price?.amount !== undefined && b.price?.amount !== null ? b.price.amount : 999999
        return pA - pB
      }
      if (sortBy === 'price-desc') {
        const pA = a.price?.amount !== undefined && a.price?.amount !== null ? a.price.amount : -1
        const pB = b.price?.amount !== undefined && b.price?.amount !== null ? b.price.amount : -1
        return pB - pA
      }
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '')
      }
      return 0
    })

    return result
  }, [
    selectedState,
    selectedCity,
    categoryFilter,
    typeFilter,
    priceFilter,
    ratingFilter,
    distanceFilter,
    openNowOnly,
    debouncedQuery,
    sortBy,
    userCoords,
  ])

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

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleLimit((prev) => prev + 12)
      setIsLoadingMore(false)
    }, 350)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedState('all')
    setSelectedCity('all')
    setCategoryFilter('all')
    setTypeFilter('all')
    setPriceFilter('all')
    setRatingFilter('all')
    setDistanceFilter('all')
    setOpenNowOnly(false)
    setSortBy('rating')
  }

  const modeEmoji =
    travelMode === 'foot-walking' ? '🚶' : travelMode === 'cycling-regular' ? '🚴' : '🚗'

  return (
    <div className="explore-page-shell">
      {/* Header Band */}
      <PageHeaderBand
        eyebrow="All-India Cultural & Heritage Directory"
        title="Explore India"
        subtitle="Search, filter, and experience verified tourist landmarks, royal fortresses, spiritual sanctuaries, and authentic regional culinary gems across all 36 States and Union Territories of India."
        badge={
          <span className="header-stat-badge">
            <Compass size={13} /> {filteredPlaces.length} Destinations Listed
          </span>
        }
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Explore India' },
          ...(selectedState !== 'all' ? [{ label: selectedState }] : []),
        ]}
      />

      {/* Main Content Shell */}
      <div className="explore-content-container">
        {/* Search & Filter Toolbar */}
        <div className="explore-toolbar-card">
          {/* Row 1: Search & Travel Mode */}
          <div className="toolbar-search-row">
            <div className="explore-search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search monuments, temples, beaches, forts across India..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search destinations"
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

          {/* Row 2: Type Filter Chips */}
          <div className="toolbar-filter-row">
            <div className="filter-chips-group">
              <button
                type="button"
                className={`explore-filter-chip ${categoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                <span>🌟 All</span>
                <span className="chip-count">{allDatasetPlaces.length}</span>
              </button>
              <button
                type="button"
                className={`explore-filter-chip ${categoryFilter === 'attractions' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('attractions')}
              >
                <span>🏛️ Attractions</span>
              </button>
              <button
                type="button"
                className={`explore-filter-chip ${categoryFilter === 'stays' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('stays')}
              >
                <span>🏨 Stays</span>
              </button>
              <button
                type="button"
                className={`explore-filter-chip ${categoryFilter === 'food' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('food')}
              >
                <span>🍽️ Food</span>
              </button>
            </div>

            <div className="toolbar-sort-wrap">
              <label htmlFor="sort-select">
                <ArrowUpDown size={14} /> Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Highest Rated ★</option>
                <option value="name">Alphabetical (A-Z)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Advanced Dropdown Filters (State, City, Category, Free/Paid, Rating, Distance) */}
          <div className="toolbar-secondary-filters-row">
            {/* State Selector */}
            <div className="filter-select-item">
              <label htmlFor="state-filter-select">
                <MapPin size={13} /> State:
              </label>
              <select
                id="state-filter-select"
                className="explore-state-select"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value)
                  setSelectedCity('all')
                }}
              >
                <option value="all">🇮🇳 All India (36 States &amp; UTs)</option>
                {allStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* City Selector */}
            <div className="filter-select-item">
              <label htmlFor="city-filter-select">City:</label>
              <select
                id="city-filter-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="all">All Cities</option>
                {citiesInState.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selector */}
            <div className="filter-select-item">
              <label htmlFor="category-select">Category:</label>
              <select
                id="category-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Free / Paid Selector */}
            <div className="filter-select-item">
              <label htmlFor="price-filter-select">
                <IndianRupee size={12} /> Fee:
              </label>
              <select
                id="price-filter-select"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="free">Free Entry Only (₹0)</option>
                <option value="paid">Ticketed / Paid Entry</option>
              </select>
            </div>

            {/* Rating Selector */}
            <div className="filter-select-item">
              <label htmlFor="rating-filter-select">
                <Star size={12} /> Rating:
              </label>
              <select
                id="rating-filter-select"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="all">Any Rating</option>
                <option value="4.5">★ 4.5 &amp; above</option>
                <option value="4.0">★ 4.0 &amp; above</option>
              </select>
            </div>

            {/* Distance Filter (Active if userCoords available) */}
            {userCoords && (
              <div className="filter-select-item">
                <label htmlFor="distance-filter-select">Distance:</label>
                <select
                  id="distance-filter-select"
                  value={distanceFilter}
                  onChange={(e) => setDistanceFilter(e.target.value)}
                >
                  <option value="all">Any Distance</option>
                  <option value="25">Within 25 km</option>
                  <option value="50">Within 50 km</option>
                  <option value="100">Within 100 km</option>
                </select>
              </div>
            )}

            {/* Open Now Toggle */}
            <label className="filter-checkbox-item">
              <input
                type="checkbox"
                checked={openNowOnly}
                onChange={(e) => setOpenNowOnly(e.target.checked)}
              />
              <Clock size={13} />
              <span>Open Now</span>
            </label>

            {/* Reset Filters Button */}
            {(selectedState !== 'all' ||
              selectedCity !== 'all' ||
              categoryFilter !== 'all' ||
              typeFilter !== 'all' ||
              priceFilter !== 'all' ||
              ratingFilter !== 'all' ||
              distanceFilter !== 'all' ||
              openNowOnly ||
              searchQuery) && (
              <button
                type="button"
                className="filter-reset-pill-btn"
                onClick={handleResetFilters}
                title="Reset all filters to defaults"
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Counter & State Indicator */}
        <div className="results-status-banner">
          <div className="results-count-text">
            Showing <strong>{Math.min(visibleLimit, filteredPlaces.length)}</strong> of{' '}
            <strong>{filteredPlaces.length}</strong> destinations
            {selectedState !== 'all' && (
              <span className="active-state-tag">
                in <strong>{selectedState}</strong>
                <button
                  type="button"
                  onClick={() => setSelectedState('all')}
                  aria-label="Clear state filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Empty State vs Cards Grid */}
        {filteredPlaces.length === 0 ? (
          <div className="explore-empty-state">
            <div className="empty-state-icon">
              <Compass size={48} />
            </div>
            <h2>No destinations match your search</h2>
            <p>
              We couldn't find any destinations matching your current filters. Try resetting your
              state or category filters to explore the rest of India.
            </p>
            <button
              type="button"
              className="empty-state-reset-btn"
              onClick={handleResetFilters}
            >
              <RotateCcw size={14} /> Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="explore-cards-grid">
              {filteredPlaces.slice(0, visibleLimit).map((place, idx) => {
                const saved = isSaved(place.id)
                const fallbackType = place.id?.startsWith('hotel-') || place.type === 'stay'
                  ? 'hotel'
                  : place.id?.startsWith('restaurant-') || place.type === 'food'
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

                      {/* Illustration Badge if Vector Fallback */}
                      {place.is_illustration && (
                        <span className="card-illustration-badge" title="AI Cultural Vector Illustration">
                          🎨 Illustration
                        </span>
                      )}

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
                          {modeEmoji} {place.city || place.location?.address?.split(',')[0] || 'India'}
                        </span>
                      </DistanceBadgeErrorBoundary>
                    </div>

                    <div className="card-body">
                      <div className="card-header-row">
                        <h3 className="card-title" title={place.name}>
                          <HighlightedText text={place.name} query={debouncedQuery} />
                        </h3>
                        {place.rating ? (
                          <span className="card-rating">
                            <Star size={13} fill="#C9A227" color="#C9A227" />
                            <strong>{place.rating}</strong>
                          </span>
                        ) : (
                          <span className="card-unrated-badge">New</span>
                        )}
                      </div>

                      {/* State & City Location Tag */}
                      <div className="card-state-location-row">
                        <MapPin size={11} />
                        <span>
                          <HighlightedText text={`${place.city}, ${place.state}`} query={debouncedQuery} />
                        </span>
                      </div>

                      {/* Best Time to Visit Badge */}
                      <div className="card-best-time-row">
                        <span className="card-best-time-pill" title={bestTime.fullText}>
                          <Sparkles size={11} /> {bestTime.badge}
                        </span>
                      </div>

                      <p className="card-desc">
                        <HighlightedText
                          text={place.description || `${place.name} in ${place.state}.`}
                          query={debouncedQuery}
                        />
                      </p>

                      <div className="card-footer-row">
                        <div className="card-price-block">
                          <span className="price-amount">{priceDisplay}</span>
                          {unitDisplay && <span className="price-unit">/{unitDisplay}</span>}
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

            {/* Pagination / Load More Button */}
            {filteredPlaces.length > visibleLimit && (
              <div className="explore-pagination-row">
                <button
                  type="button"
                  className="explore-load-more-btn"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <span>Loading Destinations...</span>
                  ) : (
                    <span>
                      Load More Destinations ({filteredPlaces.length - visibleLimit} remaining)
                    </span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

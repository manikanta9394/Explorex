import { useState, useMemo } from 'react'
import {
  Heart,
  MapPin,
  Navigation,
  Star,
  Trash2,
  ArrowRight,
  Compass,
  Sparkles,
  LogIn,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SafeImage from '../components/SafeImage'
import { allDatasetPlaces } from '../data/tourismData'
import { useSavedPlaces } from '../context/useSavedPlaces'
import { useAuth } from '../context/useAuth'
import { formatPriceWithUnit } from '../utils/formatCurrency'

export default function SavedPlacesPage({
  allPlaces = allDatasetPlaces,
  onSelectPlace,
  onGetDirections,
  onNavigate,
}) {
  const { savedIds, toggleSave } = useSavedPlaces()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'attractions' | 'stays' | 'food'

  // Map savedIds to full place objects
  const savedPlaces = useMemo(() => {
    if (!Array.isArray(allPlaces) || !Array.isArray(savedIds)) return []
    const placeMap = new Map(allPlaces.map((p) => [p.id, p]))
    return savedIds
      .map((id) => placeMap.get(id))
      .filter(Boolean)
  }, [allPlaces, savedIds])

  // Count by category
  const categorized = useMemo(() => {
    const attractions = []
    const stays = []
    const food = []

    for (const place of savedPlaces) {
      const cat = (place.category || '').toLowerCase()
      if (cat.includes('hotel') || cat.includes('stay') || cat.includes('resort')) {
        stays.push(place)
      } else if (cat.includes('food') || cat.includes('restaurant') || cat.includes('dining') || cat.includes('cafe')) {
        food.push(place)
      } else {
        attractions.push(place)
      }
    }
    return { attractions, stays, food }
  }, [savedPlaces])

  const filteredPlaces = useMemo(() => {
    if (activeTab === 'attractions') return categorized.attractions
    if (activeTab === 'stays') return categorized.stays
    if (activeTab === 'food') return categorized.food
    return savedPlaces
  }, [activeTab, savedPlaces, categorized])

  return (
    <div className="saved-places-page-shell">
      <PageHeaderBand
        eyebrow="Curated Wishlist"
        title="Saved Places"
        subtitle="Manage and navigate your handpicked monuments, heritage hotels, and royal dining spots across Telangana."
        badge={`${savedPlaces.length} Saved`}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Saved Places' },
        ]}
      />

      <div className="saved-content-container">
        {/* Guest Banner if not logged in */}
        {!user && (
          <aside className="saved-guest-banner" aria-label="Guest mode notice">
            <div className="guest-banner-icon">
              <Sparkles size={20} />
            </div>
            <div className="guest-banner-text">
              <h4>Saved Locally on this Device</h4>
              <p>
                You are currently browsing as a guest. Sign in or create an account to permanently sync your wishlist across all your devices.
              </p>
            </div>
            <div className="guest-banner-actions">
              <button
                type="button"
                className="guest-login-btn"
                onClick={() => onNavigate?.('/login')}
              >
                <LogIn size={15} /> Log In
              </button>
              <button
                type="button"
                className="guest-signup-btn"
                onClick={() => onNavigate?.('/signup')}
              >
                Sign Up
              </button>
            </div>
          </aside>
        )}

        {/* Filter Tabs */}
        {savedPlaces.length > 0 && (
          <div className="saved-tabs-bar">
            <button
              type="button"
              className={`saved-tab-chip ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Places <span className="tab-count">{savedPlaces.length}</span>
            </button>
            <button
              type="button"
              className={`saved-tab-chip ${activeTab === 'attractions' ? 'active' : ''}`}
              onClick={() => setActiveTab('attractions')}
            >
              Attractions <span className="tab-count">{categorized.attractions.length}</span>
            </button>
            <button
              type="button"
              className={`saved-tab-chip ${activeTab === 'stays' ? 'active' : ''}`}
              onClick={() => setActiveTab('stays')}
            >
              Stays & Hotels <span className="tab-count">{categorized.stays.length}</span>
            </button>
            <button
              type="button"
              className={`saved-tab-chip ${activeTab === 'food' ? 'active' : ''}`}
              onClick={() => setActiveTab('food')}
            >
              Dining & Food <span className="tab-count">{categorized.food.length}</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {savedPlaces.length === 0 ? (
          <div className="saved-empty-card">
            <div className="empty-heart-circle">
              <Heart size={44} strokeWidth={1.5} color="#C9A227" />
            </div>
            <h2 className="empty-title">Your wishlist is empty</h2>
            <p className="empty-desc">
              Explore over 400 iconic Telangana destinations, historic monuments, heritage stays, and royal biryani restaurants. Click the heart icon on any card to save it for your next trip.
            </p>
            <div className="empty-actions">
              <button
                type="button"
                className="saved-explore-cta"
                onClick={() => onNavigate?.('/explore')}
              >
                <Compass size={18} />
                Explore Destinations
              </button>
              <button
                type="button"
                className="saved-planner-cta"
                onClick={() => onNavigate?.('/planner')}
              >
                <Sparkles size={18} />
                Generate an Itinerary
              </button>
            </div>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="saved-tab-empty">
            <p>No saved places in this category yet.</p>
            <button
              type="button"
              className="tab-empty-btn"
              onClick={() => setActiveTab('all')}
            >
              View All ({savedPlaces.length})
            </button>
          </div>
        ) : (
          /* Grid of Saved Cards */
          <div className="saved-cards-grid">
            {filteredPlaces.map((place) => {
              const fallbackType = (place.category || '').toLowerCase().includes('hotel')
                ? 'hotel'
                : (place.category || '').toLowerCase().includes('restaurant') ||
                  (place.category || '').toLowerCase().includes('food')
                ? 'restaurant'
                : 'attraction'

              const { priceDisplay, unitDisplay } = formatPriceWithUnit(place.price, fallbackType)

              return (
                <article key={place.id} className="saved-card">
                  <div
                    className="saved-card-media"
                    onClick={() => {
                      if (onSelectPlace) onSelectPlace(place)
                      else if (onNavigate) onNavigate(`/explore/${place.id}`)
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${place.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        if (onSelectPlace) onSelectPlace(place)
                        else if (onNavigate) onNavigate(`/explore/${place.id}`)
                      }
                    }}
                  >
                    <SafeImage
                      src={place.image}
                      alt={place.name}
                      type={fallbackType}
                      className="saved-card-img"
                    />
                    <div className="saved-media-badges">
                      <span className="saved-cat-badge">{place.category || 'Destination'}</span>
                      {place.rating > 0 && (
                        <span className="saved-rating-badge">
                          <Star size={13} fill="#C9A227" color="#C9A227" />
                          <span>{Number(place.rating).toFixed(1)}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="saved-card-body">
                    <div className="saved-card-header-line">
                      <h3
                        className="saved-place-title"
                        onClick={() => {
                          if (onSelectPlace) onSelectPlace(place)
                          else if (onNavigate) onNavigate(`/explore/${place.id}`)
                        }}
                      >
                        {place.name}
                      </h3>
                      <button
                        type="button"
                        className="saved-remove-btn"
                        onClick={() => toggleSave(place.id)}
                        aria-label={`Remove ${place.name} from saved places`}
                        title="Remove from saved places"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {place.city && (
                      <p className="saved-place-location">
                        <MapPin size={13} />
                        <span>{place.city}{place.state ? `, ${place.state}` : ', Telangana'}</span>
                      </p>
                    )}

                    <p className="saved-place-desc">
                      {place.description || 'A remarkable destination showcasing the rich culture, history, and royal architecture of Telangana.'}
                    </p>

                    <div className="saved-card-footer">
                      <div className="saved-price-col">
                        <span className="saved-price-lbl">Entry / Tariff</span>
                        <span className="saved-price-val">
                          {priceDisplay}
                          {unitDisplay && <small className="saved-price-unit">{unitDisplay}</small>}
                        </span>
                      </div>

                      <div className="saved-action-btns">
                        <button
                          type="button"
                          className="saved-dir-btn"
                          onClick={() => {
                            if (onGetDirections) onGetDirections(place)
                            else {
                              const lat = place.coordinates?.lat
                              const lng = place.coordinates?.lng
                              if (lat && lng) {
                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank', 'noopener,noreferrer')
                              }
                            }
                          }}
                          title="Get directions"
                        >
                          <Navigation size={14} /> Directions
                        </button>
                        <button
                          type="button"
                          className="saved-detail-btn"
                          onClick={() => {
                            if (onSelectPlace) onSelectPlace(place)
                            else if (onNavigate) onNavigate(`/explore/${place.id}`)
                          }}
                        >
                          Details <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

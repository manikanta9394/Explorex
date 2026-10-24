import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  Compass,
  Heart,
  MapPin,
  Navigation,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SafeImage from '../components/SafeImage'
import TravelModeSegmentedControl from '../components/TravelModeSegmentedControl'
import PlaceWeatherBadge from '../components/PlaceWeatherBadge'
import CrowdLevelChart from '../components/CrowdLevelChart'
import EmergencyHelpModal from '../components/EmergencyHelpModal'
import { allDatasetPlaces, enrichedHotels, enrichedRestaurants } from '../data/tourismData'
import { useSavedPlaces } from '../context/useSavedPlaces'
import { useTravelMode } from '../context/useTravelMode'
import { useUserLocation } from '../context/useUserLocation'
import { formatPriceWithUnit } from '../utils/formatCurrency'
import { openGoogleMapsDirections } from '../utils/googleMaps'
import { getBestTimeToVisit } from '../services/weatherService'

// Distance helper
function getDistanceKm(coord1, coord2) {
  if (!coord1 || !coord2) return null
  const [lat1, lon1] = coord1
  const [lat2, lon2] = coord2
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return null
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((R * c).toFixed(1))
}

export default function PlaceDetailPage({
  placeId,
  onNavigate,
  onSelectPlace,
  onGetDirections,
}) {
  const { isSaved, toggleSave } = useSavedPlaces()
  const { travelMode } = useTravelMode()
  const { userCoords } = useUserLocation()
  const [beating, setBeating] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)

  // Find place by ID or slug with graceful fallback
  const place = useMemo(() => {
    if (!placeId) return allDatasetPlaces[0]
    const direct = allDatasetPlaces.find((p) => p.id === placeId || p.slug === placeId)
    if (direct) return direct
    const partial = allDatasetPlaces.find((p) => p.id.startsWith(`${placeId}-`) || p.id.includes(placeId))
    return partial || allDatasetPlaces[0]
  }, [placeId])

  const bestTime = useMemo(() => getBestTimeToVisit(place), [place])
  const saved = isSaved(place?.id)

  // Find nearest hotels and restaurants
  const placeCoordLat = place?.position ? place.position[0] : 17.3614
  const placeCoordLng = place?.position ? place.position[1] : 78.4747
  const placeIdKey = place?.id || ''

  const nearbyHotels = useMemo(() => {
    const coords = [placeCoordLat, placeCoordLng]
    return enrichedHotels
      .map((h) => ({
        ...h,
        distanceKm: getDistanceKm(coords, h.position),
      }))
      .filter((h) => h.distanceKm !== null && h.id !== placeIdKey)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3)
  }, [placeCoordLat, placeCoordLng, placeIdKey])

  const nearbyFood = useMemo(() => {
    const coords = [placeCoordLat, placeCoordLng]
    return enrichedRestaurants
      .map((r) => ({
        ...r,
        distanceKm: getDistanceKm(coords, r.position),
      }))
      .filter((r) => r.distanceKm !== null && r.id !== placeIdKey)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3)
  }, [placeCoordLat, placeCoordLng, placeIdKey])

  const handleSave = () => {
    if (place?.id) {
      toggleSave(place.id)
      setBeating(true)
      setTimeout(() => setBeating(false), 600)
    }
  }

  const handleDirections = () => {
    if (onGetDirections) {
      onGetDirections(place)
    } else {
      const userLatLng = userCoords ? { lat: userCoords[1], lng: userCoords[0] } : null
      openGoogleMapsDirections(place, travelMode, userLatLng)
    }
  }

  const fallbackType = place?.id?.startsWith('hotel-')
    ? 'hotel'
    : place?.id?.startsWith('restaurant-')
    ? 'restaurant'
    : 'place'
  const { unitDisplay } = formatPriceWithUnit(place?.price, fallbackType)

  const rulesList = Array.isArray(place?.rules) && place.rules.length > 0 ? place.rules : [
    'Visiting hours: Daily, 9:00 AM - 5:30 PM',
    'Photography permitted in designated visitor areas',
    'Modest attire recommended for heritage sites',
    'Guided audio tours available at entrance',
  ]

  return (
    <div className="place-detail-page-shell">
      {/* Header Band with Breadcrumbs */}
      <PageHeaderBand
        breadcrumbs={
          <div className="detail-breadcrumb-row">
            <button
              type="button"
              className="breadcrumb-back-btn"
              onClick={() => onNavigate('explore')}
            >
              <ArrowLeft size={14} /> Back to Explore
            </button>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{place?.name}</span>
          </div>
        }
        eyebrow={place?.category || 'Heritage Destination'}
        title={place?.name}
        subtitle={`${place?.city ? `${place.city}, ` : ''}${place?.state || 'India'}`}
        badge={
          <div className="detail-header-badges-row">
            {place?.rating ? (
              <span className="detail-rating-pill">
                <Star size={13} fill="#C9A227" color="#C9A227" /> {place.rating} Rating {place.rating_count ? `(${place.rating_count})` : ''}
              </span>
            ) : (
              <span className="detail-rating-pill unrated">
                No reviews yet
              </span>
            )}
            <PlaceWeatherBadge coordinates={place?.position} placeId={place?.id} />
            <span className="detail-best-time-pill" title={bestTime.fullText}>
              <Sparkles size={12} /> {bestTime.badge}
            </span>
          </div>
        }
      />

      {/* Main Container */}
      <div
        className="place-detail-container"
        data-received-place-id={placeId}
        data-place-id={place?.id}
        data-place-img={place?.image}
        data-place-price={JSON.stringify(place?.price)}
      >
        {/* Hero Image Card */}
        <div className="detail-hero-media-card">
          <div className="detail-image-wrap">
            <SafeImage
              src={place?.image}
              fallbackSrc={place?.fallbackImage}
              category={place?.category}
              alt={place?.name}
            />
            <div className="detail-image-shade" />

            <div className="detail-hero-top-left-badges">
              <span className="detail-category-chip">{place?.category}</span>
              {place?.is_illustration && (
                <span className="detail-illustration-chip" title="AI Cultural Vector Illustration">
                  🎨 Illustration
                </span>
              )}
              <span className="hero-best-time-pill" title={bestTime.fullText}>
                <Sparkles size={12} /> {bestTime.badge}
              </span>
            </div>

            <div className="detail-hero-top-right-badges">
              <PlaceWeatherBadge coordinates={place?.position} placeId={place?.id} />
            </div>

            <button
              type="button"
              className={`detail-save-float-btn ${saved ? 'saved' : ''} ${beating ? 'heart-beat-active' : ''}`}
              onClick={handleSave}
              aria-label={saved ? 'Remove from saved' : 'Save place'}
            >
              <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
              <span>{saved ? 'Saved in Wishlist' : 'Save Place'}</span>
            </button>
          </div>

          {/* Image Attribution and Provenance Footer */}
          <div className="detail-image-attribution-bar">
            <span className="attribution-icon">📷</span>
            <span className="attribution-text">
              {place?.image_attribution || `Verified visual reference for ${place?.name}`}
            </span>
            {place?.image_license && (
              <span className="attribution-license-badge">{place.image_license}</span>
            )}
            {place?.is_illustration && (
              <span className="attribution-ai-note">
                (Vector fallback illustration created to match authentic architectural features)
              </span>
            )}
          </div>
        </div>

        {/* Content Columns Grid */}
        <div className="detail-layout-grid">
          {/* Main Info Column */}
          <div className="detail-primary-col">
            {/* Price & Travel Mode Bar */}
            <div className="detail-action-bar-card">
              <div className="action-price-box">
                <span className="price-tag-label">Entry / Average Cost:</span>
                <div className="price-tag-val">
                  {place?.price?.amount !== null && place?.price?.amount !== undefined ? (
                    <>
                      <strong>₹{place.price.amount.toLocaleString('en-IN')}</strong>{' '}
                      <small>/{place.price.unit || unitDisplay}</small>
                    </>
                  ) : (
                    <strong className="price-unlisted">Not listed, verify locally</strong>
                  )}
                </div>
              </div>

              <div className="action-travel-selector">
                <span className="travel-selector-label">Select Travel Mode:</span>
                <TravelModeSegmentedControl />
              </div>
            </div>

            {/* Description Card */}
            <section className="detail-card-section">
              <h3 className="section-title">
                <Compass size={18} /> About {place?.name}
              </h3>
              <p className="detail-body-text">
                {place?.description ||
                  `${place?.name} is one of Telangana’s notable destinations offering authentic regional heritage and culture.`}
              </p>
            </section>

            {/* Crowd Level by Hour Mini Bar Chart */}
            <section className="detail-card-section crowd-chart-section">
              <CrowdLevelChart place={place} />
            </section>

            {/* Rules, Timings & Visitor Guidelines Card */}
            <section className="detail-card-section">
              <h3 className="section-title">
                <ShieldCheck size={18} /> Visitor Guidelines, Hours &amp; Rules
              </h3>
              <ul className="detail-rules-list">
                {rulesList.map((rule, idx) => (
                  <li key={idx} className="rule-item">
                    <span className="rule-check">✓</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
              <div className="detail-pricing-disclaimer">
                💡 Prices in ₹ and opening timings are verified from tourism authorities. Please verify on official holidays before visiting.
              </div>
            </section>

            {/* Emergency & Tourist Assistance Callout */}
            <div className="detail-emergency-callout-card">
              <div className="emergency-callout-info">
                <ShieldAlert size={20} className="shield-icon" />
                <div>
                  <h4>Need Immediate Help or Emergency Info?</h4>
                  <p>24x7 verified access for Police (100), Ambulance (108), Tourist Cell &amp; top hospitals.</p>
                </div>
              </div>
              <button
                type="button"
                className="detail-emergency-help-btn"
                onClick={() => setEmergencyOpen(true)}
              >
                Emergency Directory
              </button>
            </div>

            {/* Action CTA Bar */}
            <div className="detail-cta-group">
              <button
                type="button"
                className="detail-primary-directions-btn"
                onClick={handleDirections}
              >
                <Navigation size={16} />
                <span>Get Directions (Google Maps)</span>
              </button>

              <button
                type="button"
                className="detail-secondary-action-btn"
                onClick={() => onNavigate('planner')}
              >
                <CalendarDays size={16} />
                <span>Add to Trip Planner</span>
              </button>

              <button
                type="button"
                className="detail-secondary-action-btn"
                onClick={() => onNavigate('ai')}
              >
                <Sparkles size={16} />
                <span>Ask AI Guide About This</span>
              </button>
            </div>
          </div>

          {/* Sidebar Column: Nearby Stays & Food */}
          <div className="detail-sidebar-col">
            {/* Nearby Stays */}
            <div className="nearby-panel-card">
              <div className="panel-header">
                <h4>🏨 Nearby Stays ({nearbyHotels.length})</h4>
                <span className="panel-sub">Hotels &amp; Resorts</span>
              </div>
              <div className="panel-items-list">
                {nearbyHotels.map((hotel) => {
                  const { priceDisplay: hotelPrice } = formatPriceWithUnit(hotel.price, 'hotel')
                  return (
                    <div
                      key={hotel.id}
                      className="mini-nearby-item"
                      onClick={() => {
                        onSelectPlace?.(hotel)
                        onNavigate(`explore/${hotel.id}`)
                      }}
                    >
                      <div className="mini-thumb">
                        <SafeImage
                          src={hotel.image}
                          fallbackSrc={hotel.fallbackImage}
                          category={hotel.category}
                          alt={hotel.name}
                        />
                      </div>
                      <div className="mini-meta">
                        <h5>{hotel.name}</h5>
                        <div className="mini-sub-row">
                          <span className="mini-rating">
                            <Star size={11} fill="#C9A227" color="#C9A227" /> {hotel.rating}
                          </span>
                          <span className="mini-price">{hotelPrice}</span>
                        </div>
                        <span className="mini-dist-tag">
                          <MapPin size={10} /> {hotel.distanceKm} km away
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Nearby Food */}
            <div className="nearby-panel-card">
              <div className="panel-header">
                <h4>🍽️ Nearby Dining ({nearbyFood.length})</h4>
                <span className="panel-sub">Authentic Food Spots</span>
              </div>
              <div className="panel-items-list">
                {nearbyFood.map((food) => {
                  const { priceDisplay: foodPrice } = formatPriceWithUnit(food.price, 'restaurant')
                  return (
                    <div
                      key={food.id}
                      className="mini-nearby-item"
                      onClick={() => {
                        onSelectPlace?.(food)
                        onNavigate(`explore/${food.id}`)
                      }}
                    >
                      <div className="mini-thumb">
                        <SafeImage
                          src={food.image}
                          fallbackSrc={food.fallbackImage}
                          category={food.category}
                          alt={food.name}
                        />
                      </div>
                      <div className="mini-meta">
                        <h5>{food.name}</h5>
                        <div className="mini-sub-row">
                          <span className="mini-rating">
                            <Star size={11} fill="#C9A227" color="#C9A227" /> {food.rating}
                          </span>
                          <span className="mini-price">{foodPrice}</span>
                        </div>
                        <span className="mini-dist-tag">
                          <MapPin size={10} /> {food.distanceKm} km away
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmergencyHelpModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />
    </div>
  )
}

import { useMemo, useState, useEffect } from 'react'
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
  Share2,
  Check,
  Plane,
  Train,
  Car,
  FileWarning,
  MessageSquare,
  Clock,
  User,
  ExternalLink,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SafeImage from '../components/SafeImage'
import TravelModeSegmentedControl from '../components/TravelModeSegmentedControl'
import PlaceWeatherBadge from '../components/PlaceWeatherBadge'
import CrowdLevelChart from '../components/CrowdLevelChart'
import EmergencyHelpModal from '../components/EmergencyHelpModal'
import SEOHead from '../components/SEOHead'
import { allDatasetPlaces, enrichedHotels, enrichedRestaurants } from '../data/tourismData'
import { useAuth } from '../context/useAuth'
import { useSavedPlaces } from '../context/useSavedPlaces'
import { useTravelMode } from '../context/useTravelMode'
import { useUserLocation } from '../context/useUserLocation'
import { useToast } from '../context/useToast'
import { formatPriceWithUnit } from '../utils/formatCurrency'
import { openGoogleMapsDirections } from '../utils/googleMaps'
import { getBestTimeToVisit } from '../services/weatherService'
import { fetchPlaceReviews, submitPlaceReview } from '../services/reviewService'
import { triggerFeedbackDrawer } from '../components/FeedbackDrawer'

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
  const { user } = useAuth()
  const { isSaved, toggleSave } = useSavedPlaces()
  const { travelMode } = useTravelMode()
  const { userCoords } = useUserLocation()
  const { showToast } = useToast()

  const [beating, setBeating] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  // Reviews State
  const [reviewsData, setReviewsData] = useState({ reviews: [], avgRating: 4.8, count: 0 })
  const [userRating, setUserRating] = useState(5)
  const [userComment, setUserComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  // Find place by ID or slug with graceful fallback
  const place = useMemo(() => {
    if (!placeId) return allDatasetPlaces[0]
    const direct = allDatasetPlaces.find((p) => p.id === placeId || p.slug === placeId)
    if (direct) return direct
    const partial = allDatasetPlaces.find((p) => p.id.startsWith(`${placeId}-`) || p.id.includes(placeId))
    return partial || allDatasetPlaces[0]
  }, [placeId])

  // Track as last viewed place in localStorage
  useEffect(() => {
    if (place?.id) {
      try {
        localStorage.setItem('explorex_last_viewed_place_id', place.id)
      } catch {}
    }
  }, [place?.id])

  // Load reviews from reviewService
  useEffect(() => {
    if (place?.id) {
      fetchPlaceReviews(place.id).then((res) => {
        setReviewsData(res)
      })
    }
  }, [place?.id])

  const bestTime = useMemo(() => getBestTimeToVisit(place), [place])
  const saved = isSaved(place?.id)

  // Distance from user
  const distanceKm = useMemo(() => {
    if (!userCoords || !place?.position) return null
    const userLatLon = [userCoords[1], userCoords[0]]
    return getDistanceKm(userLatLon, place.position)
  }, [userCoords, place?.position])

  // Transit time estimate by travel mode
  const estimatedTimeText = useMemo(() => {
    if (!distanceKm) return null
    if (travelMode === 'foot-walking' || travelMode === 'walking') {
      const minutes = Math.round((distanceKm / 4.5) * 60)
      if (minutes < 60) return `${minutes} min walk`
      return `${(minutes / 60).toFixed(1)} hrs walk`
    }
    if (travelMode === 'cycling-regular' || travelMode === 'cycling') {
      const minutes = Math.round((distanceKm / 15) * 60)
      if (minutes < 60) return `${minutes} min cycle`
      return `${(minutes / 60).toFixed(1)} hrs cycle`
    }
    // Driving
    const minutes = Math.round((distanceKm / 40) * 60)
    if (minutes < 60) return `${minutes} min drive`
    return `${(minutes / 60).toFixed(1)} hrs drive`
  }, [distanceKm, travelMode])

  // Nearby stays and food
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
      showToast(saved ? `Removed ${place.name} from saved.` : `Saved ${place.name} to your sanctuary!`, saved ? 'info' : 'success')
      setTimeout(() => setBeating(false), 600)
    }
  }

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      navigator.share({
        title: `${place.name} | Explorex India Guide`,
        text: `Explore verified visiting details and pricing for ${place.name} (${place.city}, ${place.state}) on Explorex.`,
        url,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url)
      setCopiedLink(true)
      showToast('Destination link copied to clipboard!', 'success')
      setTimeout(() => setCopiedLink(false), 2400)
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

  const handleReportWrongInfo = () => {
    triggerFeedbackDrawer({
      type: 'content_error',
      place,
      message: `I noticed incorrect details regarding ${place.name} (${place.city}, ${place.state}): `,
    })
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!userComment.trim() || submittingReview) return

    if (!user) {
      showToast('Please sign in or continue as guest to submit a review.', 'warning')
      onNavigate?.('/login')
      return
    }

    setSubmittingReview(true)
    try {
      await submitPlaceReview({
        placeId: place.id,
        rating: userRating,
        comment: userComment,
        userId: user.id,
        userName: user.name || user.email?.split('@')[0] || 'Verified Explorer',
        userAvatar: user.user_metadata?.avatar || 'peacock',
      })

      showToast('Your review has been published!', 'success')
      setUserComment('')

      // Refresh reviews
      const updated = await fetchPlaceReviews(place.id)
      setReviewsData(updated)
    } catch (err) {
      showToast(err.message || 'Failed to submit review.', 'error')
    } finally {
      setSubmittingReview(false)
    }
  }

  const fallbackType = place?.id?.startsWith('hotel-')
    ? 'hotel'
    : place?.id?.startsWith('restaurant-')
    ? 'restaurant'
    : 'place'
  const { priceDisplay, unitDisplay } = formatPriceWithUnit(place?.price, fallbackType)

  const rulesList = Array.isArray(place?.rules) && place.rules.length > 0 ? place.rules : [
    'Visiting hours: Daily, 9:00 AM - 5:30 PM (verify holiday schedules locally)',
    'Photography permitted for mobile phones; tripods require prior ASI authorization',
    'Modest attire recommended when visiting sacred and historical sanctums',
    'Baggage screening and security check enforced at monument entry gate',
  ]

  // Transit stations
  const howToReach = useMemo(() => {
    const city = place?.city || 'Hyderabad'
    return [
      { mode: 'Air Transit', icon: Plane, desc: `Nearest major airport: ${city} International / Domestic Airport, with prepaid taxi and metro connectivity.` },
      { mode: 'Rail Transit', icon: Train, desc: `${city} Central Railway Station connects with daily superfast trains across India.` },
      { mode: 'Road & Metro', icon: Car, desc: `Directly accessible via arterial ring roads, city buses, and auto-rickshaws with digital fare meters.` },
    ]
  }, [place?.city])

  return (
    <div className="place-detail-page-shell">
      <SEOHead
        title={`${place.name} | Timings, Ticket Prices & Visitor Rules`}
        description={`Visiting ${place.name} in ${place.city}, ${place.state}. Official verified entry fees in ₹, ASI visitor guidelines, best time to visit, and directions.`}
        image={place.image}
      />

      {/* Header Band with Breadcrumbs */}
      <PageHeaderBand
        breadcrumbs={
          <div className="detail-breadcrumb-row">
            <button
              type="button"
              className="breadcrumb-back-btn"
              onClick={() => onNavigate?.('/explore')}
            >
              <ArrowLeft size={14} /> Back to Destinations
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current-text">{place.name}</span>
          </div>
        }
        eyebrow={`${place.category} · ${place.state}, India`}
        title={place.name}
        subtitle={`${place.city}, ${place.state} · Wikidata ID: ${place.wikidata_id || 'Verified Monument'}`}
        badge={
          <div className="detail-action-badges-row">
            <button
              type="button"
              className={`detail-save-heart-btn ${saved ? 'saved' : ''} ${beating ? 'heart-beat' : ''}`}
              onClick={handleSave}
              title={saved ? 'Remove from saved' : 'Save place'}
              aria-label={saved ? 'Remove from saved' : 'Save place'}
            >
              <Heart size={16} fill={saved ? '#EF4444' : 'none'} color={saved ? '#EF4444' : '#C9A227'} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              className="detail-share-pill-btn"
              onClick={handleShare}
              title="Share destination link"
            >
              {copiedLink ? <Check size={14} color="#10B981" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              type="button"
              className="report-wrong-info-pill-btn"
              onClick={handleReportWrongInfo}
              title="Report incorrect price, timings, or details"
            >
              <FileWarning size={14} />
              <span>Report Wrong Info</span>
            </button>
          </div>
        }
      />

      {/* Main Layout Grid */}
      <div className="place-detail-container">
        <div className="detail-hero-grid">
          {/* Main Visual & Gallery */}
          <div className="detail-visual-col">
            <div className="detail-main-image-wrap">
              <SafeImage
                src={place.image}
                category={place.category}
                alt={place.name}
                className="detail-main-img"
              />
              <div className="image-attribution-overlay">
                <ShieldCheck size={13} color="#C9A227" />
                <span>
                  Verified via Wikidata {place.wikidata_id || 'ID'} · Wikimedia Commons (CC-BY-SA)
                </span>
              </div>
            </div>

            {/* Travel Mode Toggle & Transit Estimate */}
            <div className="travel-mode-estimate-card">
              <div className="estimate-header">
                <span className="estimate-title">Travel Mode &amp; Transit Time:</span>
                <TravelModeSegmentedControl />
              </div>

              <div className="estimate-metrics-row">
                <div className="metric-pill">
                  <MapPin size={14} color="#C9A227" />
                  <span>
                    {distanceKm !== null ? `${distanceKm} km from you` : `Located in ${place.city}`}
                  </span>
                </div>
                {estimatedTimeText && (
                  <div className="metric-pill highlighted">
                    <Clock size={14} color="#10B981" />
                    <span>Est. {estimatedTimeText}</span>
                  </div>
                )}
                <button
                  type="button"
                  className="quick-directions-link-btn"
                  onClick={handleDirections}
                >
                  <Navigation size={13} />
                  <span>Get Directions in Google Maps</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Facts & Pricing Card */}
          <div className="detail-facts-col">
            <div className="facts-card-shell">
              <div className="facts-header-row">
                <div className="price-tag-wrap">
                  <span className="price-eyebrow">Official Entry Ticket:</span>
                  <div className="price-amount-large">
                    {priceDisplay}
                    {unitDisplay ? <small>/{unitDisplay}</small> : ''}
                  </div>
                  <span className="price-verified-note">
                    {place.price?.source ? (
                      <a href={place.price.source} target="_blank" rel="noreferrer" className="source-link">
                        Verified via official circular <ExternalLink size={11} />
                      </a>
                    ) : (
                      'Government verified rate'
                    )}
                  </span>
                </div>

                <PlaceWeatherBadge place={place} />
              </div>

              {/* Best Time to Visit */}
              <div className="facts-row">
                <span className="fact-label">Best Time to Visit:</span>
                <strong className="fact-value">{place.best_time || bestTime}</strong>
              </div>

              {/* Opening Hours */}
              <div className="facts-row">
                <span className="fact-label">Visiting Hours:</span>
                <strong className="fact-value">{place.opening_hours || 'Daily, 9:00 AM – 5:30 PM'}</strong>
              </div>

              {/* Address / Location */}
              <div className="facts-row">
                <span className="fact-label">Address:</span>
                <strong className="fact-value">{place.address || `${place.name}, ${place.city}, ${place.state}`}</strong>
              </div>

              {/* Action Buttons */}
              <div className="facts-actions-block">
                <button
                  type="button"
                  className="detail-primary-action-btn"
                  onClick={handleDirections}
                >
                  <Navigation size={16} />
                  <span>Open Directions (Google Maps)</span>
                </button>

                <button
                  type="button"
                  className="detail-secondary-action-btn"
                  onClick={() => onNavigate?.('/planner')}
                >
                  <CalendarDays size={16} />
                  <span>Add to Trip Planner</span>
                </button>

                <button
                  type="button"
                  className="detail-secondary-action-btn gold"
                  onClick={() => onNavigate?.('/ai')}
                >
                  <Sparkles size={16} />
                  <span>Ask AI Guide About This Landmark</span>
                </button>
              </div>
            </div>

            {/* Hourly Crowd Level Chart */}
            <CrowdLevelChart place={place} />
          </div>
        </div>

        {/* =============================================================== */}
        {/* DETAIL CONTENT BODY & SIDEBAR                                   */}
        {/* =============================================================== */}
        <div className="detail-body-layout">
          {/* Main Column */}
          <div className="detail-main-text-col">
            {/* Overview / Story */}
            <div className="detail-section-card">
              <h3>About {place.name}</h3>
              <p className="detail-desc-paragraph">
                {place.description ||
                  `${place.name} is one of the premier cultural destinations situated in ${place.city}, ${place.state}. It stands as a testament to the remarkable architectural mastery and historic heritage of the region.`}
              </p>
            </div>

            {/* Rules & Guidelines */}
            <div className="detail-section-card">
              <h3>Visitor Guidelines &amp; Monument Etiquette</h3>
              <ul className="rules-bullet-list">
                {rulesList.map((rule, idx) => (
                  <li key={idx} className="rule-item">
                    <ShieldCheck size={16} color="#10B981" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to Reach */}
            <div className="detail-section-card">
              <h3>How to Reach</h3>
              <div className="how-to-reach-grid">
                {howToReach.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div key={idx} className="reach-item-box">
                      <div className="reach-icon-wrap">
                        <Icon size={18} color="#C9A227" />
                      </div>
                      <div>
                        <strong>{item.mode}</strong>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* User Reviews & Rating Section */}
            <div className="detail-section-card reviews-section">
              <div className="reviews-header-row">
                <div>
                  <h3>Explorer Reviews &amp; Ratings</h3>
                  <div className="reviews-aggregate-row">
                    <div className="avg-stars">
                      <Star size={18} fill="#C9A227" color="#C9A227" />
                      <strong>{reviewsData.avgRating || 4.8}</strong>
                    </div>
                    <span className="reviews-count-text">
                      Based on {reviewsData.reviews.length} verified traveler reviews
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Submission Form (Signed-in users) */}
              <form onSubmit={handleSubmitReview} className="place-review-form">
                <h5>Leave a Verified Explorer Review</h5>
                <p className="form-subtext">
                  Share your experience, crowd tips, or photography recommendations. Strictly one review per explorer.
                </p>

                {/* Rating Stars Selector */}
                <div className="review-stars-select">
                  <span className="select-label">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`star-pick-btn ${userRating >= s ? 'lit' : ''}`}
                      onClick={() => setUserRating(s)}
                      aria-label={`${s} Stars`}
                    >
                      <Star size={18} fill={userRating >= s ? '#C9A227' : 'none'} color="#C9A227" />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  className="review-textarea"
                  placeholder="What should travelers know before visiting? (e.g. best photo angles, audio guide quality, ticket queue tips...)"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  required
                  minLength={5}
                />

                <div className="review-form-bottom">
                  <span className="review-policy-note">
                    Reviews are publicly visible to all explorers and checked for respectful conduct.
                  </span>
                  <button
                    type="submit"
                    className="submit-review-btn"
                    disabled={submittingReview || userComment.trim().length < 5}
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>

              {/* Existing Reviews List */}
              <div className="existing-reviews-list">
                {reviewsData.reviews.map((rev) => (
                  <div key={rev.id} className="review-item-card">
                    <div className="review-item-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          <User size={14} />
                        </div>
                        <div>
                          <strong>{rev.user_name}</strong>
                          <span className="verified-badge">✓ Verified Explorer</span>
                        </div>
                      </div>
                      <div className="review-rating-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={13}
                            fill={rev.rating >= s ? '#C9A227' : 'none'}
                            color="#C9A227"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="review-comment-text">{rev.comment}</p>
                    <span className="review-date">
                      {new Date(rev.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
              </div>
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
                        onNavigate?.(`/explore/${hotel.id}`)
                      }}
                    >
                      <div className="mini-thumb">
                        <SafeImage
                          src={hotel.image}
                          category={hotel.category}
                          alt={hotel.name}
                        />
                      </div>
                      <div className="mini-meta">
                        <h5>{hotel.name}</h5>
                        <div className="mini-sub-row">
                          <span className="mini-rating">
                            <Star size={11} fill="#C9A227" color="#C9A227" /> {hotel.rating || 4.5}
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
                        onNavigate?.(`/explore/${food.id}`)
                      }}
                    >
                      <div className="mini-thumb">
                        <SafeImage
                          src={food.image}
                          category={food.category}
                          alt={food.name}
                        />
                      </div>
                      <div className="mini-meta">
                        <h5>{food.name}</h5>
                        <div className="mini-sub-row">
                          <span className="mini-rating">
                            <Star size={11} fill="#C9A227" color="#C9A227" /> {food.rating || 4.6}
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

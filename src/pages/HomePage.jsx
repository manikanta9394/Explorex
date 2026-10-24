import { useState, useMemo, useEffect } from 'react'
import {
  ArrowRight,
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  Utensils,
  Car,
  Heart,
  Star,
  Navigation,
  Clock,
  ChevronRight,
  CloudRain,
} from 'lucide-react'
import LandingHero from '../components/LandingHero'
import AboutSection from '../components/AboutSection'
import FeaturesSection from '../components/FeaturesSection'
import HowItWorksSection from '../components/HowItWorksSection'
import FeaturedDestinations from '../components/FeaturedDestinations'
import PlaceMarquee from '../components/PlaceMarquee'
import CountUpNumber from '../components/CountUpNumber'
import SafeImage from '../components/SafeImage'
import SEOHead from '../components/SEOHead'
import { allDatasetPlaces } from '../data/tourismData'
import { useAuth } from '../context/useAuth'
import { useSavedPlaces } from '../context/useSavedPlaces'
import { useUserLocation } from '../context/useUserLocation'
import { useScrollReveal } from '../utils/useScrollReveal'
import { formatPriceWithUnit } from '../utils/formatCurrency'

const REGIONS = [
  { id: 'all', label: 'All India' },
  { id: 'south', label: 'South (Telangana, TN, Kerala, Karnataka, AP)' },
  { id: 'north', label: 'North (Delhi, Rajasthan, Punjab, UP, HP)' },
  { id: 'west', label: 'West (Maharashtra, Goa, Gujarat)' },
  { id: 'east', label: 'East (Odisha, West Bengal, Bihar)' },
  { id: 'northeast', label: 'North-East (Assam, Meghalaya, Sikkim)' },
  { id: 'central', label: 'Central (Madhya Pradesh, Chhattisgarh)' },
]

const FESTIVALS_STRIP = [
  {
    name: 'Bonalu & Golconda Utsav',
    dates: 'July – August',
    location: 'Hyderabad, Telangana',
    placeId: 'golconda-fort-hyderabad',
    tag: 'Folk Heritage',
    icon: '🪔',
  },
  {
    name: 'Diwali & Dev Deepawali',
    dates: 'October – November',
    location: 'Varanasi, Uttar Pradesh',
    placeId: 'dashashwamedh-ghat-varanasi',
    tag: 'Spiritual Light',
    icon: '✨',
  },
  {
    name: 'Pushkar Camel Fair',
    dates: 'November',
    location: 'Pushkar, Rajasthan',
    placeId: 'pushkar-lake-temple',
    tag: 'Desert Culture',
    icon: '🐪',
  },
  {
    name: 'Hornbill Festival',
    dates: 'December 1–10',
    location: 'Kohima, Nagaland',
    placeId: 'kisama-heritage-village',
    tag: 'Tribal Traditions',
    icon: '🦚',
  },
  {
    name: 'Sankranti & Kite Festival',
    dates: 'January 14–16',
    location: 'Telangana & Gujarat',
    placeId: 'charminar-hyderabad',
    tag: 'Harvest Harvest',
    icon: '🪁',
  },
]

export default function HomePage({ onNavigate, onSelectPlace }) {
  useScrollReveal([])
  const { user } = useAuth()
  const { isSaved, toggleSave } = useSavedPlaces()
  const { requestLocation } = useUserLocation()

  const [selectedRegion, setSelectedRegion] = useState('all')
  const [lastViewedPlace, setLastViewedPlace] = useState(null)
  const [lastChatTitle, setLastChatTitle] = useState(null)

  const profileName = user?.name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'Explorer')

  // Calculate time greeting
  const greetingText = useMemo(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return `Good morning, ${profileName}`
    if (hour >= 12 && hour < 17) return `Good afternoon, ${profileName}`
    return `Good evening, ${profileName}`
  }, [profileName])

  // Load "Continue where you left off" from localStorage
  useEffect(() => {
    try {
      const lastPlaceId = localStorage.getItem('explorex_last_viewed_place_id')
      if (lastPlaceId) {
        const found = allDatasetPlaces.find((p) => p.id === lastPlaceId)
        if (found) setLastViewedPlace(found)
      }

      const convs = JSON.parse(localStorage.getItem('sb_emu_table_conversations') || '[]')
      if (convs.length > 0) {
        setLastChatTitle(convs[0].title)
      }
    } catch {}
  }, [])

  // Region filtering
  const regionalPlaces = useMemo(() => {
    if (selectedRegion === 'all') return allDatasetPlaces.slice(0, 12)
    const stateMap = {
      south: ['Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala', 'Karnataka'],
      north: ['Delhi', 'Rajasthan', 'Punjab', 'Uttar Pradesh', 'Himachal Pradesh', 'Haryana', 'Uttarakhand'],
      west: ['Maharashtra', 'Goa', 'Gujarat'],
      east: ['Odisha', 'West Bengal', 'Bihar', 'Jharkhand'],
      northeast: ['Assam', 'Meghalaya', 'Sikkim', 'Arunachal Pradesh', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura'],
      central: ['Madhya Pradesh', 'Chhattisgarh'],
    }
    const targetStates = stateMap[selectedRegion] || []
    return allDatasetPlaces.filter((p) => targetStates.includes(p.state)).slice(0, 12)
  }, [selectedRegion])

  // Seasonal picks: Monsoon and Winter Highlights
  const seasonalPicks = useMemo(() => {
    return allDatasetPlaces.filter((p) => {
      const text = `${p.best_time || ''} ${p.description || ''} ${p.tags?.join(' ') || ''}`.toLowerCase()
      return text.includes('monsoon') || text.includes('october') || text.includes('winter') || text.includes('november')
    }).slice(0, 4)
  }, [])

  const handlePlaceClick = (place) => {
    try {
      localStorage.setItem('explorex_last_viewed_place_id', place.id)
    } catch {}
    if (onSelectPlace) onSelectPlace(place)
    if (onNavigate) onNavigate(`explore/${place.id}`)
  }

  return (
    <div className="home-page-container">
      <SEOHead
        title="Explorex | Plan India the Way Locals Do"
        description="Curated cultural tourism for India. Explore 170+ verified heritage monuments, generate day-by-day itineraries with lunch stops, and chat with a RAG-grounded AI guide."
      />

      {/* Dynamic Hero Section with Multi-layer Skyline Parallax */}
      <LandingHero
        onStartExploring={() => onNavigate('explore')}
        onAskAI={() => onNavigate('ai')}
        onSelectPlace={handlePlaceClick}
        allPlaces={allDatasetPlaces}
      />

      {/* ================================================================= */}
      {/* 1. PERSONALIZED WELCOME & QUICK ACTIONS DOCK                       */}
      {/* ================================================================= */}
      <section className="personalized-greeting-band reveal-fade-up">
        <div className="greeting-container">
          <div className="greeting-left-meta">
            <span className="greeting-eyebrow">
              <Sparkles size={14} color="#C9A227" /> Cultural Compass
            </span>
            <h2 className="greeting-headline">{greetingText}</h2>
            <p className="greeting-subtitle">
              Where across India’s 36 States and Union Territories are we wandering today?
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="quick-actions-dock">
            <button
              type="button"
              className="dock-action-btn primary"
              onClick={() => onNavigate?.('/planner')}
            >
              <Compass size={16} />
              <span>Plan Trip</span>
            </button>

            <button
              type="button"
              className="dock-action-btn gold"
              onClick={() => onNavigate?.('/ai')}
            >
              <Sparkles size={16} />
              <span>Ask AI Guide</span>
            </button>

            <button
              type="button"
              className="dock-action-btn"
              onClick={() => {
                requestLocation?.()
                onNavigate?.('/map')
              }}
            >
              <MapPin size={16} />
              <span>Near Me</span>
            </button>
          </div>
        </div>

        {/* Continue where you left off ribbon */}
        {(lastViewedPlace || lastChatTitle) && (
          <div className="continue-left-off-ribbon">
            <span className="ribbon-label">
              <Clock size={13} color="#C9A227" /> Continue where you left off:
            </span>
            <div className="ribbon-items-row">
              {lastViewedPlace && (
                <button
                  type="button"
                  className="resume-pill-btn"
                  onClick={() => handlePlaceClick(lastViewedPlace)}
                >
                  <span>Landmark: <strong>{lastViewedPlace.name}</strong> ({lastViewedPlace.city})</span>
                  <ChevronRight size={13} />
                </button>
              )}
              {lastChatTitle && (
                <button
                  type="button"
                  className="resume-pill-btn"
                  onClick={() => onNavigate?.('/ai')}
                >
                  <span>AI Chat: <strong>{lastChatTitle}</strong></span>
                  <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ================================================================= */}
      {/* 2. STATS COUNTER STRIP WITH COUNT-UP NUMBERS                       */}
      {/* ================================================================= */}
      <section className="stats-banner-strip reveal-fade-up">
        <div className="stats-container">
          <div className="stat-card reveal-zoom" style={{ '--reveal-index': 0 }}>
            <CountUpNumber target={560} suffix="+" />
            <span className="stat-label">Verified Destinations</span>
          </div>
          <div className="stat-card reveal-zoom" style={{ '--reveal-index': 1 }}>
            <CountUpNumber target={170} suffix="+" />
            <span className="stat-label">ASI &amp; UNESCO Monuments</span>
          </div>
          <div className="stat-card reveal-zoom" style={{ '--reveal-index': 2 }}>
            <CountUpNumber target={36} />
            <span className="stat-label">States &amp; Union Territories</span>
          </div>
          <div className="stat-card reveal-zoom" style={{ '--reveal-index': 3 }}>
            <CountUpNumber target={3} suffix=" Modes" />
            <span className="stat-label">Walk · Cycle · Drive</span>
          </div>
          <div className="stat-card reveal-zoom" style={{ '--reveal-index': 4 }}>
            <CountUpNumber target={100} suffix="%" />
            <span className="stat-label">Official Ticket Rates in ₹</span>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. FESTIVAL CALENDAR STRIP                                        */}
      {/* ================================================================= */}
      <section className="festivals-strip-section reveal-fade-up">
        <div className="section-head-wrap">
          <div className="head-left">
            <span className="section-eyebrow">
              <Calendar size={14} color="#C9A227" /> Living Cultural Traditions
            </span>
            <h3 className="section-title">Upcoming Indian Cultural Festivals</h3>
          </div>
          <button
            type="button"
            className="link-view-all-festivals"
            onClick={() => onNavigate?.('/festivals')}
          >
            <span>View Full Calendar</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="festivals-scroll-tray">
          {FESTIVALS_STRIP.map((fest, idx) => (
            <div
              key={idx}
              className="festival-strip-tile"
              onClick={() => onNavigate?.(`/explore/${fest.placeId}`)}
            >
              <div className="fest-icon-orb">{fest.icon}</div>
              <div className="fest-content">
                <span className="fest-tag">{fest.tag}</span>
                <h4>{fest.name}</h4>
                <p className="fest-timing">
                  <Calendar size={12} /> {fest.dates}
                </p>
                <span className="fest-location">
                  <MapPin size={11} /> {fest.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. REGIONAL EXPLORER TABS & PLACES GRID                           */}
      {/* ================================================================= */}
      <section className="regional-picks-section reveal-fade-up">
        <div className="section-head-wrap">
          <div className="head-left">
            <span className="section-eyebrow">
              <Compass size={14} color="#C9A227" /> Nationwide Curation
            </span>
            <h3 className="section-title">Explore by Cultural Region</h3>
          </div>
        </div>

        {/* Region Tabs */}
        <div className="region-pills-filter-row">
          {REGIONS.map((reg) => (
            <button
              key={reg.id}
              type="button"
              className={`region-pill-btn ${selectedRegion === reg.id ? 'active' : ''}`}
              onClick={() => setSelectedRegion(reg.id)}
            >
              {reg.label}
            </button>
          ))}
        </div>

        {/* Regional Places Cards Grid */}
        <div className="places-cards-grid">
          {regionalPlaces.map((place) => {
            const { priceDisplay } = formatPriceWithUnit(place.price)
            const saved = isSaved(place.id)

            return (
              <div
                key={place.id}
                className="destination-card interactive-hover"
                onClick={() => handlePlaceClick(place)}
              >
                <div className="card-thumb-wrap">
                  <SafeImage
                    src={place.image}
                    category={place.category}
                    alt={place.name}
                    className="card-thumb-img"
                  />
                  <button
                    type="button"
                    className={`card-heart-btn ${saved ? 'saved' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSave(place.id)
                    }}
                    aria-label={saved ? 'Remove from saved' : 'Save place'}
                  >
                    <Heart size={15} fill={saved ? '#EF4444' : 'none'} color={saved ? '#EF4444' : '#FFFFFF'} />
                  </button>
                  <span className="card-category-badge">{place.category}</span>
                </div>

                <div className="card-body">
                  <div className="card-title-row">
                    <h4>{place.name}</h4>
                  </div>
                  <span className="card-location">
                    <MapPin size={12} /> {place.city}, {place.state}
                  </span>
                  <p className="card-snippet">
                    {place.description ? place.description.slice(0, 95) + '...' : 'Verified historical destination with ASI circular timings and architectural marvels.'}
                  </p>
                  <div className="card-footer-row">
                    <span className="card-price-badge">{priceDisplay}</span>
                    <button type="button" className="card-explore-btn">
                      <span>View Details</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. SEASONAL PICKS ("Best in Monsoon & Lush Greens")                */}
      {/* ================================================================= */}
      <section className="seasonal-picks-section reveal-fade-up">
        <div className="seasonal-card-banner">
          <div className="seasonal-header-row">
            <div className="seasonal-title-block">
              <span className="seasonal-badge">
                <CloudRain size={14} color="#C9A227" /> Curated Seasonal Focus
              </span>
              <h3>Best in Monsoon &amp; Winter Horizons</h3>
              <p>Mist-shrouded hill forts, living temple tanks, and roaring monsoon waterfalls.</p>
            </div>
            <button
              type="button"
              className="seasonal-all-btn"
              onClick={() => onNavigate?.('/explore')}
            >
              Browse All Places <ArrowRight size={13} />
            </button>
          </div>

          <div className="seasonal-places-row">
            {seasonalPicks.map((place) => (
              <div
                key={place.id}
                className="seasonal-place-tile"
                onClick={() => handlePlaceClick(place)}
              >
                <div className="seasonal-thumb">
                  <SafeImage
                    src={place.image}
                    category={place.category}
                    alt={place.name}
                  />
                </div>
                <div className="seasonal-info">
                  <h5>{place.name}</h5>
                  <span className="seasonal-city">{place.city}, {place.state}</span>
                  <span className="seasonal-best-time">
                    <Clock size={11} /> {place.best_time || 'October to March'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Introduction & Philosophy */}
      <AboutSection />

      {/* Key Project Features */}
      <FeaturesSection
        onNavigateExplore={() => onNavigate('explore')}
        onNavigateMap={() => onNavigate('map')}
        onNavigateAI={() => onNavigate('ai')}
        onNavigatePlanner={() => onNavigate('planner')}
      />

      {/* 3 Steps: How It Works with Scroll-Drawn Route Line */}
      <HowItWorksSection onStartPlanning={() => onNavigate('planner')} />

      {/* Featured 6 Destinations Grid */}
      <FeaturedDestinations
        allPlaces={allDatasetPlaces}
        onSelectPlace={handlePlaceClick}
        onExploreAll={() => onNavigate('explore')}
      />

      {/* Looping Marquee of Place Names */}
      <PlaceMarquee />

      {/* Final Call to Action Banner */}
      <section className="home-final-cta reveal-fade-up">
        <div className="final-cta-card">
          <div className="final-cta-mesh" />
          <div className="final-cta-content">
            <span className="eyebrow light">
              <Sparkles size={14} /> Journey through 36 States
            </span>
            <h2>Ready to experience the living heritage of India?</h2>
            <p>
              Explore 560+ verified monuments, generate proximity-optimized itineraries with authentic lunch stops, and chat with our RAG-grounded AI guide in English, Telugu, or Hindi.
            </p>
            <div className="final-cta-actions">
              <button
                type="button"
                className="cta-primary-btn"
                onClick={() => onNavigate('explore')}
              >
                <span>Browse All 560+ Destinations</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="cta-secondary-btn"
                onClick={() => onNavigate('planner')}
              >
                <Compass size={16} />
                <span>Plan Trip with AI</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

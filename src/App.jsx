import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, ChevronDown, Compass, Globe2, Heart, MapPin, Menu, Navigation, RotateCcw, Send, Sparkles, Star, X } from 'lucide-react'
import AllPlacesMap from './components/AllPlacesMap'
import AuthModal from './components/AuthModal'
import ErrorBoundary from './components/ErrorBoundary'
import LanguageSelector from './components/LanguageSelector'
import PlaceDetailModal from './components/PlaceDetailModal'
import SafeImage from './components/SafeImage'
import TourMap from './components/TourMap'
import TravelModeSegmentedControl from './components/TravelModeSegmentedControl'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
import { SavedPlacesProvider } from './context/SavedPlacesContext'
import { useSavedPlaces } from './context/useSavedPlaces'
import { TravelModeProvider } from './context/TravelModeContext'
import { useTravelMode } from './context/useTravelMode'
import { UserLocationProvider } from './context/UserLocationContext'
import { useUserLocation } from './context/useUserLocation'
import { allDatasetPlaces, enrichedHotels as hotels, enrichedPlaces as places, enrichedRestaurants as restaurants } from './data/tourismData'
import { askAI, fetchRoute, geocodeAddress } from './services/api'
import { formatPriceWithUnit } from './utils/formatCurrency'
import { openGoogleMapsDirections } from './utils/googleMaps'
import './App.css'

const featuredCandidates = places.filter((p) => {
  const cat = (p.category || '').toLowerCase()
  return (
    cat.includes('monument') ||
    cat.includes('fort') ||
    cat.includes('palace') ||
    cat.includes('temple') ||
    cat.includes('attraction') ||
    cat.includes('tomb') ||
    cat.includes('heritage')
  )
})

function getRandomFeaturedPlace() {
  const pool = featuredCandidates.length > 0 ? featuredCandidates : places
  const index = Math.floor(Math.random() * pool.length)
  return pool[index]
}

function Logo() {
  return <a className="logo" href="#top" aria-label="TourMate AI home"><span className="logo-mark"><Compass size={17} strokeWidth={2.5} /></span><span>tourmate<span className="logo-ai">ai</span></span></a>
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')
  const { user, logout } = useAuth()

  const handleOpenAuth = (mode) => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
    setOpen(false)
  }

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 40) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`navbar detail-nav ${scrolled ? 'glass-scrolled' : 'glass-top'}`}>
        <div className="nav-inner">
          <Logo />
          <nav className={open ? 'nav-links nav-open' : 'nav-links'}>
            <a href="#overview" onClick={() => setOpen(false)}>Overview</a>
            <a href="#nearby" onClick={() => setOpen(false)}>Nearby</a>
            <a href="#ask" onClick={() => setOpen(false)}>Ask AI <span className="new-pill">new</span></a>
          </nav>
          <div className="nav-actions">
            <LanguageSelector />
            {user ? (
              <div className="user-profile-badge">
                <span className="user-avatar">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                <span className="user-name">{user.name}</span>
                <button type="button" className="logout-button" onClick={logout}>Log out</button>
              </div>
            ) : (
              <>
                <button type="button" className="login-button" onClick={() => handleOpenAuth('login')}>Log in</button>
                <button type="button" className="signup-button" onClick={() => handleOpenAuth('signup')}>Sign up</button>
              </>
            )}
          </div>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  )
}

function NearbyCard({ item, type, onGetDirections, onSelectPlace }) {
  const [bouncing, setBouncing] = useState(false)
  const [routeInfo, setRouteInfo] = useState(null)
  const [loadingRoute, setLoadingRoute] = useState(false)
  const { travelMode } = useTravelMode()
  const { isSaved, toggleSave } = useSavedPlaces()
  const { activeOrigin, locationStatus } = useUserLocation()

  const saved = isSaved(item?.id)

  useEffect(() => {
    let isMounted = true

    const updateRoute = async () => {
      setLoadingRoute(true)
      const destCoords = item.position
        ? [item.position[1], item.position[0]]
        : item.location?.coordinates || [78.4747, 17.3616]

      try {
        const data = await fetchRoute(activeOrigin, destCoords, travelMode)
        if (!isMounted) return
        if (data && (data.duration || data.durationMeters)) {
          setRouteInfo({
            duration: data.duration?.formatted || (data.duration ? `${data.duration} min` : '10 min'),
            distance: data.distance?.km || data.distance || (data.distanceMeters ? (data.distanceMeters / 1000).toFixed(1) : 2.4),
            isLive: locationStatus === 'granted',
          })
        } else {
          setRouteInfo({ error: true })
        }
      } catch {
        if (isMounted) setRouteInfo({ error: true })
      } finally {
        if (isMounted) setLoadingRoute(false)
      }
    }

    updateRoute()

    return () => {
      isMounted = false
    }
  }, [item, travelMode, activeOrigin, locationStatus])

  function handleToggleSave(e) {
    e.stopPropagation()
    if (item?.id) {
      toggleSave(item.id)
      setBouncing(true)
      setTimeout(() => setBouncing(false), 500)
    }
  }

  const categoryLabel = item.category || (type === 'hotel' ? 'Luxury Hotel' : 'Fine Dining')
  const modeEmoji = travelMode === 'foot-walking' ? '🚶' : travelMode === 'cycling-regular' ? '🚴' : '🚗'
  const { priceDisplay, unitDisplay: priceUnitDisplay } = formatPriceWithUnit(item.price, type)

  return (
    <article className="nearby-card interactive-card" onClick={() => onSelectPlace?.(item)}>
      <div className="nearby-image-wrap">
        <SafeImage
          src={item.image}
          category={item.category}
          type={type}
          fallbackSrc={item.fallbackImage}
          alt={item.name}
        />
        <span className="card-category-chip">{categoryLabel}</span>

        {loadingRoute ? (
          <span className="travel-time-chip shimmer">
            <span className="shimmer-dot" /> Updating...
          </span>
        ) : routeInfo ? (
          <span className="travel-time-chip">
            {modeEmoji} {routeInfo.duration} ({routeInfo.distance} km)
          </span>
        ) : null}

        <button
          className={`frosted-save-button ${saved ? 'saved' : ''} ${bouncing ? 'heart-bounce' : ''}`}
          onClick={handleToggleSave}
          aria-label={saved ? `Remove ${item.name} from saved` : `Save ${item.name}`}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="nearby-card-body">
        <div className="nearby-card-header">
          <h3>{item.name}</h3>
          <p>{item.detail || item.description}</p>
        </div>

        <div className="nearby-card-divider" />

        <div className="nearby-card-footer">
          <div className="footer-meta">
            <span className="gold-rating">
              <Star size={14} fill="currentColor" />
              <strong>{item.rating}</strong>
            </span>

            <span className="card-price-tag">
              <strong>{priceDisplay}</strong>
              <small>/ {priceUnitDisplay}</small>
            </span>
          </div>

          <button
            className="card-directions-btn"
            onClick={(e) => {
              e.stopPropagation()
              onGetDirections?.(item)
            }}
            title={`Get directions to ${item.name}`}
          >
            <Navigation size={13} /> Directions
          </button>
        </div>
      </div>
    </article>
  )
}

let msgCounter = 0
function createMessageId(prefix) {
  msgCounter += 1
  return `${prefix}-${msgCounter}`
}

function AIPlacePrompt({ place }) {
  const placeName = place?.name || 'this attraction'

  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([
    {
      id: `welcome-${place?.id || 'default'}`,
      role: 'assistant',
      text: `Hello! I am TourMate AI. Ask me anything about ${placeName}—from golden hour photography tips to local food recommendations nearby.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend(textToSend) {
    const text = typeof textToSend === 'string' ? textToSend : prompt.trim()
    if (!text || loading) return

    const userMessage = {
      id: createMessageId('u'),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setPrompt('')
    setLoading(true)

    try {
      if (/where|location|find|address|reach/i.test(text)) {
        geocodeAddress(text).catch(() => null)
      }

      const historyPayload = messages.map((m) => ({ role: m.role, content: m.text }))
      const result = await askAI(text, historyPayload, placeName)
      const answerText = typeof result === 'string' ? result : (result.answer || `Here is what I found for ${placeName}.`)

      const aiMessage = {
        id: createMessageId('a'),
        role: 'assistant',
        text: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId('a'),
          role: 'assistant',
          text: `Explore ${placeName} at golden hour, then check surrounding markets and eateries for local food, crafts, and culture.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    setMessages([
      {
        id: `welcome-clear-${place?.id || 'default'}`,
        role: 'assistant',
        text: `Chat cleared. Ask me anything about visiting ${placeName}!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  const promptSuggestions = [
    { icon: '📍', label: '1-day itinerary', query: `What to see in 1 day at ${placeName}?` },
    { icon: '🍽️', label: 'Local food spots', query: `Where do locals eat near ${placeName}?` },
    { icon: '📸', label: 'Best photo spots', query: `When is the best time for photos at ${placeName}?` },
  ]

  return (
    <section className="place-ai" id="ask">
      <div className="place-ai-copy">
        <span className="eyebrow light"><Sparkles size={14} /> TourMate intelligence</span>
        <h2>Make {placeName}<br /><em>your own.</em></h2>
        <p>Ask anything about this landmark. We will help you find the right rhythm, from heritage walks to the best hour for evening photos.</p>
      </div>

      <div className="place-ai-box neat-chat-card">
        <div className="ai-box-heading">
          <div className="chat-avatar-status">
            <span className="ai-avatar"><Sparkles size={16} /></span>
            <span className="online-dot-pulse" title="Online">
              <span className="online-ping" />
            </span>
          </div>
          <div className="chat-header-info">
            <strong>TourMate AI Assistant</strong>
            <span className="sub-text">Personalised guidance • Online</span>
          </div>
          {messages.length > 1 && (
            <button className="clear-chat-btn" onClick={clearChat} title="Clear conversation" aria-label="Clear conversation">
              <RotateCcw size={14} />
            </button>
          )}
        </div>

        <div className="chat-messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message-row ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="msg-avatar">
                  <Sparkles size={12} />
                </div>
              )}
              <div className={`chat-bubble ${msg.role}`}>
                <p>{msg.text}</p>
                <span className="chat-timestamp">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message-row assistant">
              <div className="msg-avatar">
                <Sparkles size={12} />
              </div>
              <div className="chat-bubble assistant typing-bubble">
                <span className="typing-dots">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="typing-label">TourMate is typing...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="prompt-chips">
          {promptSuggestions.map((item, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSend(item.query)}
            >
              <span className="chip-emoji">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <form className="prompt-input" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={`Ask about ${placeName}...`}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !prompt.trim()} aria-label="Send message">
            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  )
}

function PlaceDetailsInner() {
  const [featuredPlace, setFeaturedPlace] = useState(() => getRandomFeaturedPlace())
  const [bouncing, setBouncing] = useState(false)
  const [selectedDetailPlace, setSelectedDetailPlace] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' | 'map'
  const [placesLimit, setPlacesLimit] = useState(8)
  const [hotelsLimit, setHotelsLimit] = useState(4)
  const [restaurantsLimit, setRestaurantsLimit] = useState(4)
  const { travelMode } = useTravelMode()
  const { isSaved, toggleSave } = useSavedPlaces()

  const saved = isSaved(featuredPlace?.id)

  function handleToggleSaveHero() {
    if (featuredPlace?.id) {
      toggleSave(featuredPlace.id)
      setBouncing(true)
      setTimeout(() => setBouncing(false), 500)
    }
  }

  function handleRotateFeatured() {
    setFeaturedPlace((current) => {
      const pool = featuredCandidates.filter((p) => p.id !== current?.id)
      if (pool.length === 0) return getRandomFeaturedPlace()
      const idx = Math.floor(Math.random() * pool.length)
      return pool[idx]
    })
  }

  function handleGetDirections(place) {
    openGoogleMapsDirections(place, travelMode)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.scroll-reveal')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const locationLabel = featuredPlace?.location?.address || featuredPlace?.city || 'Telangana'
  const coordString = featuredPlace?.position ? featuredPlace.position.join(', ') : '17.385, 78.4867'

  return (
    <div className="place-page" id="top">
      <Navbar />

      {/* Place Detail Modal / Bottom Sheet */}
      <PlaceDetailModal
        isOpen={!!selectedDetailPlace}
        onClose={() => setSelectedDetailPlace(null)}
        place={selectedDetailPlace}
        allPlaces={allDatasetPlaces}
        onSelectPlace={setSelectedDetailPlace}
        onGetDirections={handleGetDirections}
      />

      <main>
        <section className="place-hero">
          <SafeImage
            src={featuredPlace.image}
            category={featuredPlace.category}
            fallbackSrc={featuredPlace.fallbackImage}
            alt={`${featuredPlace.name} in Telangana`}
          />
          <div className="place-hero-shade" />

          <div className="place-hero-top">
            <a href="#overview" className="back-link"><ArrowLeft size={15} /> Back to destinations</a>
            <button
              className={`hero-save-pill ${saved ? 'saved' : ''} ${bouncing ? 'heart-bounce' : ''}`}
              onClick={handleToggleSaveHero}
              aria-label={saved ? 'Remove from saved places' : 'Save place'}
            >
              <Heart size={16} fill={saved ? 'currentColor' : 'none'} className="save-heart-icon" />
              <span>{saved ? 'Saved' : 'Save place'}</span>
            </button>
          </div>

          <div className="place-hero-title">
            <span className="eyebrow light fade-in-up delay-1"><MapPin size={13} /> {locationLabel}</span>
            <h1 className="fade-in-up delay-2">{featuredPlace.name}</h1>
            <p className="fade-in-up delay-3">{featuredPlace.description}</p>
          </div>

          <a href="#overview" className="hero-scroll-indicator fade-in-up delay-4" aria-label="Scroll to explore">
            <span>Scroll to explore</span>
            <ChevronDown size={16} className="scroll-chevron-bounce" />
          </a>
        </section>

        <section className="place-content scroll-reveal" id="overview">
          <div className="place-main">
            <div className="place-intro">
              <div>
                <span className="eyebrow">A landmark with a pulse</span>
                <h2>{featuredPlace.name}<br /><em>heritage & story.</em></h2>
              </div>
              <div className="place-rating">
                <span><Star size={17} fill="currentColor" /> {featuredPlace.rating || 4.7}</span>
                <small>Featured attraction</small>
              </div>
            </div>
            <p className="history-copy">
              {featuredPlace.description} Located in {locationLabel}, {featuredPlace.name} brings together architecture, history, prayer, and the everyday energy of the region. Walk its surrounding lanes slowly to discover layers of heritage, local food, crafts, and culture.
            </p>
            <div className="place-facts">
              <div><CalendarDays size={18} /><span><strong>Opening hours</strong><small>{featuredPlace.openingHours || 'Daily, 9:00 AM - 5:00 PM'}</small></span></div>
              <div><Navigation size={18} /><span><strong>Estimated visit</strong><small>{featuredPlace.estimatedVisitDuration || '1 - 3 hours'}</small></span></div>
              <div><MapPin size={18} /><span><strong>Location</strong><small>{locationLabel}</small></span></div>
            </div>
            <div className="place-action-buttons">
              <button className="directions-primary-button" onClick={() => handleGetDirections(featuredPlace)}>
                <Navigation size={16} /> Get Directions
              </button>
              <button className="map-button" onClick={() => setSelectedDetailPlace(featuredPlace)}>
                <Sparkles size={16} /> View Full Details
              </button>

              <button className="shuffle-hero-btn" onClick={handleRotateFeatured} title="Explore another featured attraction">
                <RotateCcw size={14} /> Explore Another
              </button>
            </div>
          </div>

          <aside className="place-side">
            <div className="side-card" onClick={() => setSelectedDetailPlace(featuredPlace)} style={{ cursor: 'pointer' }}>
              <span className="eyebrow">A little context</span>
              <p>{featuredPlace.category}. One of Telangana's most recognisable landmarks and a natural starting point for exploring the region.</p>
              <div className="side-divider" />
              <div className="side-stat">
                <Globe2 size={16} /><span><strong>Coordinates</strong><small>{coordString}</small></span>
              </div>
            </div>
            <div className="side-note">
              <Sparkles size={15} /><span>TourMate tip</span>
              <p>Visit near golden hour, then stay for the evening lights and local markets around {featuredPlace.name}.</p>
            </div>
          </aside>
        </section>

        {/* Section View Mode Switch (List vs Dataset Map) */}
        <section className="nearby-section scroll-reveal" id="nearby">
          <div className="section-header-switch-bar">
            <div>
              <span className="eyebrow">Explore Telangana Places</span>
              <h2>Hotels, Dining & Heritage</h2>
            </div>

            <div className="view-mode-segmented-switch">
              <button
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                📋 List View
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                🗺️ Dataset Map
              </button>
            </div>
          </div>

          {viewMode === 'map' ? (
            <AllPlacesMap
              places={allDatasetPlaces}
              onSelectPlace={setSelectedDetailPlace}
              onGetDirections={handleGetDirections}
            />
          ) : (
            <>
              {/* Heritage Attractions & Landmarks Grid */}
              <div className="nearby-heading">
                <div><span className="eyebrow">Discover Heritage & Culture</span><h2>Attractions & Monuments ({places.length})</h2></div>
                <TravelModeSegmentedControl />
              </div>
              <div className="nearby-grid">
                {places.slice(0, placesLimit).map((place) => (
                  <NearbyCard
                    item={place}
                    type="attraction"
                    onGetDirections={handleGetDirections}
                    onSelectPlace={setSelectedDetailPlace}
                    key={place.id}
                  />
                ))}
              </div>
              {placesLimit < places.length && (
                <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '40px' }}>
                  <button
                    className="shuffle-hero-btn"
                    onClick={() => setPlacesLimit((prev) => prev + 12)}
                  >
                    Load More Attractions ({places.length - placesLimit} remaining)
                  </button>
                </div>
              )}

              {/* Nearby Hotels Grid */}
              <div className="nearby-heading">
                <div><span className="eyebrow">Stay a little longer</span><h2>Nearby hotels ({hotels.length})</h2></div>
                {hotelsLimit < hotels.length ? (
                  <button
                    className="text-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => setHotelsLimit((prev) => prev + 8)}
                  >
                    See all ({hotels.length}) <ArrowRight size={15} />
                  </button>
                ) : null}
              </div>
              <div className="nearby-grid">
                {hotels.slice(0, hotelsLimit).map((hotel) => (
                  <NearbyCard
                    item={hotel}
                    type="hotel"
                    onGetDirections={handleGetDirections}
                    onSelectPlace={setSelectedDetailPlace}
                    key={hotel.id}
                  />
                ))}
              </div>

              {/* Nearby Restaurants Grid */}
              <div className="nearby-heading restaurant-heading" style={{ marginTop: '36px' }}>
                <div><span className="eyebrow">A taste of Hyderabad</span><h2>Nearby restaurants ({restaurants.length})</h2></div>
                {restaurantsLimit < restaurants.length ? (
                  <button
                    className="text-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => setRestaurantsLimit((prev) => prev + 8)}
                  >
                    See all ({restaurants.length}) <ArrowRight size={15} />
                  </button>
                ) : null}
              </div>
              <div className="nearby-grid">
                {restaurants.slice(0, restaurantsLimit).map((restaurant) => (
                  <NearbyCard
                    item={restaurant}
                    type="restaurant"
                    onGetDirections={handleGetDirections}
                    onSelectPlace={setSelectedDetailPlace}
                    key={restaurant.id}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        <section className="map-section scroll-reveal">
          <div className="map-section-heading">
            <div><span className="eyebrow">Attraction Map</span><h2>Find your next story.</h2></div>
            <p>Discover the places that make this region feel personal.</p>
          </div>
          <TourMap onViewDetails={(attraction) => setSelectedDetailPlace(attraction)} />
        </section>

        <div className="scroll-reveal">
          <AIPlacePrompt key={featuredPlace?.id || 'default'} place={featuredPlace} />
        </div>
      </main>

      <footer className="footer">
        <div><Logo /><p>Make room for the world.</p></div>
        <div className="footer-bottom">
          <span>© 2024 TourMate AI</span>
          <span>Made for meaningful journeys <Heart size={13} fill="currentColor" /></span>
        </div>
      </footer>
    </div>
  )
}

export default function PlaceDetails() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TravelModeProvider>
          <UserLocationProvider>
            <SavedPlacesProvider>
              <PlaceDetailsInner />
            </SavedPlacesProvider>
          </UserLocationProvider>
        </TravelModeProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

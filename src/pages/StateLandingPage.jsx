import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  Compass,
  Heart,
  Navigation,
  Sparkles,
  Star,
  ExternalLink,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SafeImage from '../components/SafeImage'
import PlaceWeatherBadge from '../components/PlaceWeatherBadge'
import { getBestTimeToVisit } from '../services/weatherService'
import { allDatasetPlaces } from '../data/tourismData'
import { useSavedPlaces } from '../context/useSavedPlaces'
import { useTravelMode } from '../context/useTravelMode'
import { openGoogleMapsDirections } from '../utils/googleMaps'

// State details metadata
const STATE_METADATA = {
  'tamil-nadu': {
    name: 'Tamil Nadu',
    capital: 'Chennai',
    region: 'South India',
    tagline: 'Land of Living Chola Temples & Ancient Dravidian Heritage',
    bestTime: 'October to March (Pleasant coastal breezes and festival season)',
    center: [11.1271, 78.6569],
    zoom: 7,
    highlights: ['UNESCO Great Living Chola Temples', 'Madurai Meenakshi Temple', 'Nilgiri Mountain Railway', 'Shore Temple Mahabalipuram'],
  },
  'rajasthan': {
    name: 'Rajasthan',
    capital: 'Jaipur',
    region: 'Northwest India',
    tagline: 'Land of Royalty, Golden Sand Dunes & Impregnable Hill Forts',
    bestTime: 'October to March (Golden desert winters and heritage festivals)',
    center: [27.0238, 74.2179],
    zoom: 7,
    highlights: ['Pink City Hawa Mahal', 'Amber Fort Sheesh Mahal', 'Mehrangarh Fort Jodhpur', 'Thar Desert Sam Dunes'],
  },
  'uttar-pradesh': {
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    region: 'North India',
    tagline: 'The Cradle of Indian Civilization & Monumental Heritage',
    bestTime: 'October to March (Cool winters ideal for heritage tours)',
    center: [26.8467, 80.9462],
    zoom: 7,
    highlights: ['Taj Mahal Agra', 'Varanasi Ancient Ghats', 'Fatehpur Sikri', 'Ayodhya Ram Mandir'],
  },
  'telangana': {
    name: 'Telangana',
    capital: 'Hyderabad',
    region: 'Deccan South India',
    tagline: 'City of Pearls, Qutb Shahi Dynasties & Kakatiya Architecture',
    bestTime: 'October to March (Pleasant mild winter and festive evenings)',
    center: [17.385, 78.4867],
    zoom: 7,
    highlights: ['Charminar 1591', 'Golconda Fort Acoustic Wonder', 'Ramappa Temple UNESCO', 'Hussain Sagar Buddha'],
  },
  'kerala': {
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    region: 'Southwest Coast',
    tagline: "God's Own Country, Tranquil Backwaters & Lush Tea Estates",
    bestTime: 'September to March (Verdant greenery and tranquil backwaters)',
    center: [10.8505, 76.2711],
    zoom: 7,
    highlights: ['Alleppey Kettuvallam Houseboats', 'Munnar Tea Hills', 'Fort Kochi Chinese Nets', 'Padmanabhaswamy Temple'],
  },
  'maharashtra': {
    name: 'Maharashtra',
    capital: 'Mumbai',
    region: 'West India',
    tagline: 'Western Ghats, UNESCO Caves & Commercial Powerhouse of India',
    bestTime: 'October to March (Pleasant coastal and hill-station weather)',
    center: [19.7515, 75.7139],
    zoom: 7,
    highlights: ['Gateway of India Mumbai', 'Ajanta & Ellora Caves', 'CSMT Victorian Gothic', 'Shirdi Sai Baba Sansthan'],
  },
  'punjab': {
    name: 'Punjab',
    capital: 'Chandigarh',
    region: 'North India',
    tagline: 'Land of Five Rivers, Golden Sanctuaries & Undaunted Spirit',
    bestTime: 'October to March (Golden mustard blooms and cool winter)',
    center: [31.1471, 75.3412],
    zoom: 7,
    highlights: ['Golden Temple Amritsar', 'Attari-Wagah Border Retreat', 'Jallianwala Bagh', 'Gobindgarh Fort'],
  },
  'odisha': {
    name: 'Odisha',
    capital: 'Bhubaneswar',
    region: 'East Coast India',
    tagline: 'Land of Sacred Kalinga Spreading to the Bay of Bengal',
    bestTime: 'October to March (Mild tropical winter and birdwatching)',
    center: [20.9517, 85.0985],
    zoom: 7,
    highlights: ['Konark Sun Temple 13th C.', 'Jagannath Temple Puri', 'Chilika Lake Dolphins', 'Lingaraj Temple'],
  },
  'west-bengal': {
    name: 'West Bengal',
    capital: 'Kolkata',
    region: 'East India',
    tagline: 'Culture, Victorian Marble Palaces & Himalayan Toy Trains',
    bestTime: 'October to March (Durga Puja and pleasant winter season)',
    center: [22.9868, 87.855],
    zoom: 7,
    highlights: ['Victoria Memorial Kolkata', 'Darjeeling Himalayan Railway', 'Sundarbans Tiger Delta', 'Howrah Bridge'],
  },
  'delhi': {
    name: 'Delhi',
    capital: 'New Delhi',
    region: 'National Capital Territory',
    tagline: 'The Seven Cities of Delhi, Imperial Avenues & Street Cuisine',
    bestTime: 'October to March (Sunny winter afternoons and garden walks)',
    center: [28.6139, 77.209],
    zoom: 11,
    highlights: ['Qutub Minar', 'Red Fort', "Humayun's Tomb", 'India Gate Kartavya Path'],
  },
}


export default function StateLandingPage({ slug, onNavigate, onSelectPlace, onGetDirections }) {
  const { isSaved, toggleSave } = useSavedPlaces()
  const { travelMode } = useTravelMode()
  const [beatingId, setBeatingId] = useState(null)

  const normalizedSlug = (slug || 'tamil-nadu').toLowerCase().replace(/^\/states\//, '').replace(/^states\//, '')
  
  // Find metadata or synthesize
  const stateMeta = useMemo(() => {
    if (STATE_METADATA[normalizedSlug]) {
      return STATE_METADATA[normalizedSlug]
    }
    // Synthesize fallback title from slug
    const formattedName = normalizedSlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    return {
      name: formattedName,
      capital: 'State Capital',
      region: 'India',
      tagline: `Discover authentic heritage, culture, and natural beauty in ${formattedName}.`,
      bestTime: 'October to March (Pleasant winter travel season)',
      center: [22.5, 79.5],
      zoom: 6,
      highlights: [`Heritage Monuments of ${formattedName}`, `Cuisine of ${formattedName}`],
    }
  }, [normalizedSlug])

  // Filter places for this state
  const statePlaces = useMemo(() => {
    return allDatasetPlaces.filter((p) => {
      const pState = (p.state || '').toLowerCase()
      const targetState = stateMeta.name.toLowerCase()
      return pState === targetState || pState.includes(targetState) || targetState.includes(pState)
    })
  }, [stateMeta.name])

  const handleSaveClick = (e, placeId) => {
    e.stopPropagation()
    toggleSave(placeId)
    setBeatingId(placeId)
    setTimeout(() => setBeatingId(null), 600)
  }

  const handleCardClick = (place) => {
    if (onSelectPlace) {
      onSelectPlace(place)
    }
    if (onNavigate) {
      onNavigate(`explore/${place.id}`)
    }
  }

  return (
    <div className="state-landing-page-shell">
      {/* Header Band */}
      <PageHeaderBand
        breadcrumbs={
          <div className="state-breadcrumb-row">
            <button
              type="button"
              className="breadcrumb-back-btn"
              onClick={() => onNavigate('explore')}
            >
              <ArrowLeft size={14} /> Back to All India
            </button>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{stateMeta.name}</span>
          </div>
        }
        eyebrow={`${stateMeta.region} · Capital: ${stateMeta.capital}`}
        title={`Explore ${stateMeta.name}`}
        subtitle={stateMeta.tagline}
        badge={
          <div className="state-badge-row">
            <span className="state-count-pill">
              <Compass size={13} /> {statePlaces.length} Curated Places
            </span>
            <span className="state-best-time-pill" title={stateMeta.bestTime}>
              <Calendar size={13} /> {stateMeta.bestTime}
            </span>
          </div>
        }
      />

      <div className="state-content-container">
        {/* Quick Highlights Ribbon */}
        <div className="state-highlights-card">
          <div className="highlights-header">
            <Sparkles size={16} className="sparkle-icon" />
            <h3>Signature Highlights in {stateMeta.name}</h3>
          </div>
          <div className="highlights-chips-list">
            {stateMeta.highlights.map((h, i) => (
              <span key={i} className="highlight-tag-chip">
                {h}
              </span>
            ))}
          </div>
          <div className="state-action-btn-row">
            <button
              type="button"
              className="state-explore-all-btn"
              onClick={() => onNavigate(`explore?state=${encodeURIComponent(stateMeta.name)}`)}
            >
              <span>Explore All {statePlaces.length} Destinations</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </div>

        {/* Places Grid */}
        <div className="state-places-section">
          <div className="section-title-row">
            <h2>Top Destinations in {stateMeta.name}</h2>
            <span className="section-subtitle">Verified attractions with authentic imagery & visitor information</span>
          </div>

          <div className="explore-cards-grid">
            {statePlaces.map((place, _idx) => {
              const saved = isSaved(place.id)
              const bestTime = getBestTimeToVisit(place)
              const priceDisplay = place.price?.amount !== null && place.price?.amount !== undefined
                ? `₹${place.price.amount.toLocaleString('en-IN')}`
                : 'Not listed, verify locally'

              return (
                <article
                  key={place.id}
                  className="explore-place-card interactive-card"
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

                    {/* Illustration Badge if vector illustration */}
                    {place.is_illustration && (
                      <span className="card-illustration-badge" title="AI Cultural Vector Illustration">
                        🎨 Illustration
                      </span>
                    )}

                    {/* Weather Badge */}
                    <div className="card-weather-overlay">
                      <PlaceWeatherBadge coordinates={place.position} placeId={place.id} compact />
                    </div>

                    <button
                      type="button"
                      className={`card-save-btn ${saved ? 'saved' : ''} ${beatingId === place.id ? 'heart-beat-active' : ''}`}
                      onClick={(e) => handleSaveClick(e, place.id)}
                      aria-label={saved ? 'Remove from saved' : 'Save place'}
                    >
                      <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="card-body">
                    <div className="card-header-row">
                      <h3 className="card-title" title={place.name}>
                        {place.name}
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

                    <div className="card-best-time-row">
                      <span className="card-best-time-pill" title={bestTime.fullText}>
                        <Sparkles size={11} /> {bestTime.badge}
                      </span>
                    </div>

                    <p className="card-desc">
                      {place.description || `${place.name} in ${stateMeta.name}.`}
                    </p>

                    <div className="card-footer-row">
                      <div className="card-price-block">
                        <span className="price-amount">{priceDisplay}</span>
                      </div>

                      <button
                        type="button"
                        className="card-directions-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onGetDirections) onGetDirections(place)
                          else openGoogleMapsDirections(place, travelMode)
                        }}
                        title="Get Directions"
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
        </div>
      </div>
    </div>
  )
}

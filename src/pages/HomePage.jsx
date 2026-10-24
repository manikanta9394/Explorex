import { ArrowRight, Compass, Sparkles } from 'lucide-react'
import LandingHero from '../components/LandingHero'
import AboutSection from '../components/AboutSection'
import FeaturesSection from '../components/FeaturesSection'
import HowItWorksSection from '../components/HowItWorksSection'
import FeaturedDestinations from '../components/FeaturedDestinations'
import PlaceMarquee from '../components/PlaceMarquee'
import CountUpNumber from '../components/CountUpNumber'
import { allDatasetPlaces } from '../data/tourismData'
import { useScrollReveal } from '../utils/useScrollReveal'

export default function HomePage({ onNavigate, onSelectPlace }) {
  useScrollReveal([])

  const handlePlaceClick = (place) => {
    if (onSelectPlace) {
      onSelectPlace(place)
    }
    if (onNavigate && place?.id) {
      onNavigate(`explore/${place.id}`)
    }
  }

  return (
    <div className="home-page-container">
      {/* Dynamic Hero Section with rotating Telangana landmarks & Multi-layer Skyline Parallax */}
      <LandingHero
        onStartExploring={() => onNavigate('explore')}
        onAskAI={() => onNavigate('ai')}
        onSelectPlace={handlePlaceClick}
        allPlaces={allDatasetPlaces}
      />

      {/* Stats Counter Strip with Count-Up Numbers */}
      <section className="stats-banner-strip reveal-fade-up">
        <div className="stats-container">
          <div className="stat-card reveal-zoom" style={{ '--reveal-index': 0 }}>
            <CountUpNumber target={400} suffix="+" />
            <span className="stat-label">Verified Destinations</span>
          </div>
          <div className="stat-card reveal-zoom" style={{ '--reveal-index': 1 }}>
            <CountUpNumber target={250} />
            <span className="stat-label">Historical Monuments</span>
          </div>
          <div className="stat-card reveal-zoom" style={{ '--reveal-index': 2 }}>
            <CountUpNumber target={75} />
            <span className="stat-label">Luxury Stays &amp; Resorts</span>
          </div>
          <div className="stat-card reveal-zoom" style={{ '--reveal-index': 3 }}>
            <CountUpNumber target={75} />
            <span className="stat-label">Authentic Dining Spots</span>
          </div>
          <div className="stat-card reveal-zoom" style={{ '--reveal-index': 4 }}>
            <CountUpNumber target={3} suffix=" Modes" />
            <span className="stat-label">Walk · Cycle · Drive</span>
          </div>
          <div className="stat-card reveal-zoom" style={{ '--reveal-index': 5 }}>
            <CountUpNumber target={100} suffix="%" />
            <span className="stat-label">Prices Verified in ₹</span>
          </div>
        </div>
      </section>

      {/* Project Introduction & Problem Solved */}
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

      {/* Looping Marquee of Place Names near end of Intro Page */}
      <PlaceMarquee />

      {/* Final Call to Action Banner */}
      <section className="home-final-cta reveal-fade-up">
        <div className="final-cta-card">
          <div className="final-cta-mesh" />
          <div className="final-cta-content">
            <span className="eyebrow light">
              <Sparkles size={14} /> Begin Your Journey
            </span>
            <h2>Ready to experience the heritage of Telangana?</h2>
            <p>
              Explore verified monuments, generate custom hour-by-hour itineraries, and get multimodal walking, cycling, and driving routes in seconds.
            </p>
            <div className="final-cta-actions">
              <button
                type="button"
                className="cta-primary-btn"
                onClick={() => onNavigate('explore')}
              >
                <span>Browse All 400 Places</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="cta-secondary-btn"
                onClick={() => onNavigate('planner')}
              >
                <Compass size={16} />
                <span>Plan a Trip with AI</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

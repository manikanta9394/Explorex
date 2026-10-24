import { useEffect, useState, useRef } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Compass, Sparkles } from 'lucide-react'
import SafeImage from './SafeImage'

const HERO_SLIDES = [
  {
    id: 'place-1-1',
    name: 'Charminar',
    tagline: 'Monument of Four Grand Arches',
    location: 'Old City, Hyderabad',
    rating: 4.7,
    image: '/images/charminar.jpg',
    category: 'Historical Monument',
    description: 'Built in 1591 by Muhammad Quli Qutb Shah, standing as the timeless heart and enduring symbol of Hyderabad.',
  },
  {
    id: 'place-2-2',
    name: 'Golconda Fort',
    tagline: 'Acoustic Marvel & Diamond Bastion',
    location: 'Golconda, Hyderabad',
    rating: 4.8,
    image: '/images/golconda-fort.jpg',
    category: 'Historical Fort',
    description: 'Medieval citadel famed for ingenious acoustics, majestic royal pavilions, and the birthplace of the Koh-i-Noor.',
  },
  {
    id: 'place-4-4',
    name: 'Chowmahalla Palace',
    tagline: 'Seat of Nizami Grandeur',
    location: 'Khilwat, Hyderabad',
    rating: 4.6,
    image: '/images/chowmahalla-palace.jpg',
    category: 'Historical Palace',
    description: 'Palace of the Asaf Jahi dynasty boasting Persian architecture, Belgian crystal chandeliers, and vintage car collections.',
  },
  {
    id: 'place-11-11',
    name: 'Salar Jung Museum',
    tagline: 'Treasury of Global Civilization',
    location: 'Darulshifa, Hyderabad',
    rating: 4.9,
    image: '/images/salar-jung-museum.jpg',
    category: 'Museum',
    description: 'One of the world’s largest one-man art collections, featuring the Veiled Rebecca and the iconic 19th-century musical clock.',
  },
  {
    id: 'place-25-25',
    name: 'Birla Mandir',
    tagline: 'Sanctuary of White Marble',
    location: 'Naubat Pahad, Hyderabad',
    rating: 4.7,
    image: '/images/birla-mandir.jpg',
    category: 'Religious Landmark',
    description: 'Pristine Rajasthani marble temple perched atop a 280-foot hillock with sweeping sunset vistas over Hussain Sagar Lake.',
  },
]

export default function LandingHero({ onStartExploring, onAskAI, onSelectPlace, allPlaces = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)
  const heroRef = useRef(null)

  const currentSlide = HERO_SLIDES[currentIndex]

  // Parallax on Intro hero: CSS variable updated in a requestAnimationFrame-throttled passive scroll listener
  // (Notice: does NOT store scroll position in React state!)
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current) {
            const scrollY = window.scrollY || window.pageYOffset
            if (scrollY <= 1000) {
              heroRef.current.style.setProperty('--hero-scroll', `${scrollY}px`)
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-rotate every 6 seconds unless user is hovering
  useEffect(() => {
    if (isPaused) return

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  const handleOpenCurrentDetail = () => {
    if (onSelectPlace) {
      const match = allPlaces.find((p) => p.id === currentSlide.id) || currentSlide
      onSelectPlace(match)
    }
  }

  return (
    <section
      ref={heroRef}
      className="landing-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Welcome Hero"
    >
      {/* Layer 1: Distant Background Slides (Moves at 0.38x parallax speed) */}
      <div className="hero-slides-wrapper hero-parallax-bg" aria-hidden="true">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`hero-slide-bg ${idx === currentIndex ? 'active' : ''}`}
          >
            <SafeImage
              src={slide.image}
              category={slide.category}
              alt={slide.name}
            />
          </div>
        ))}
        <div className="hero-gradient-overlay" />
        <div className="hero-pattern-mesh" />
      </div>

      {/* Layer 2: Midground Architectural Skyline Silhouette (Moves at 0.20x parallax speed) */}
      <div className="hero-parallax-skyline" aria-hidden="true">
        <svg
          className="skyline-svg"
          viewBox="0 0 1440 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Subtle architectural silhouette of Hyderabad monuments (Charminar, arches, Golconda battlements) */}
          <path
            d="M0 260L0 210C40 210 60 195 90 195C120 195 140 220 170 220C200 220 220 170 250 170C280 170 300 205 330 205C360 205 380 140 405 140C415 140 420 100 430 100C440 100 445 140 455 140C480 140 500 210 540 210C570 210 590 160 620 160C640 160 655 125 670 125C685 125 695 80 710 80C720 80 725 60 730 60C735 60 740 80 750 80C765 80 775 125 790 125C805 125 820 160 840 160C870 160 890 205 920 205C950 205 970 175 1000 175C1030 175 1050 215 1080 215C1110 215 1130 150 1160 150C1180 150 1195 110 1210 110C1225 110 1235 150 1255 150C1285 150 1310 210 1350 210C1380 210 1410 195 1440 195L1440 260Z"
            fill="url(#skyline-gold-glow)"
            opacity="0.16"
          />
          <path
            d="M0 260L0 230C50 230 80 215 120 215C160 215 190 235 240 235C290 235 320 190 370 190C420 190 450 225 500 225C550 225 580 180 630 180C670 180 700 140 730 140C760 140 790 180 830 180C880 180 910 225 960 225C1010 225 1040 190 1090 190C1140 190 1170 230 1220 230C1270 230 1300 215 1350 215C1390 215 1420 230 1440 230L1440 260Z"
            fill="url(#skyline-dark-layer)"
            opacity="0.32"
          />
          <defs>
            <linearGradient id="skyline-gold-glow" x1="720" y1="60" x2="720" y2="260" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C9A227" stopOpacity="0.4" />
              <stop offset="1" stopColor="#152A21" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="skyline-dark-layer" x1="720" y1="140" x2="720" y2="260" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1F3A2E" stopOpacity="0.6" />
              <stop offset="1" stopColor="#0B1712" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Layer 3: Foreground Ambient Particle Glow (Moves at 0.48x parallax speed) */}
      <div className="hero-parallax-fg" aria-hidden="true">
        <div className="ambient-star star-1" />
        <div className="ambient-star star-2" />
        <div className="ambient-star star-3" />
        <div className="ambient-star star-4" />
      </div>

      {/* Main Center Content (Moves gently at 0.12x speed) */}
      <div className="hero-container hero-parallax-content">
        <div className="hero-content-box">
          <div className="hero-eyebrow fade-in-up delay-1">
            <span className="eyebrow-spark-pill">
              <Sparkles size={13} className="spark-spin" />
              <span>Telangana Tourism Intelligence</span>
            </span>
            <span className="eyebrow-divider" />
            <span className="eyebrow-geo">Hyderabad &amp; Beyond</span>
          </div>

          <h1 className="hero-title fade-in-up delay-2">
            Heritage, Majesty &amp; Story.
            <br />
            <em>Unveiled with AI.</em>
          </h1>

          {/* Exact required one-line value proposition */}
          <p className="hero-value-prop fade-in-up delay-3">
            Your AI travel companion for Hyderabad and Telangana
          </p>

          <p className="hero-subtext fade-in-up delay-3">
            Effortlessly discover curated landmarks, get live walking, cycling, and driving routes, check rules &amp; ticket prices in ₹, and unearth authentic dining—all in one place.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="hero-cta-group fade-in-up delay-4">
            <button
              type="button"
              className="hero-primary-btn"
              onClick={onStartExploring}
              aria-label="Start exploring destinations"
            >
              <Compass size={18} />
              <span>Start exploring</span>
              <ArrowRight size={16} className="btn-arrow" />
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={onAskAI}
              aria-label="Ask the AI travel assistant"
            >
              <Sparkles size={16} />
              <span>Ask the AI</span>
            </button>
          </div>
        </div>

        {/* Bottom Slide Info & Controls Bar */}
        <div className="hero-bottom-deck fade-in-up delay-4">
          {/* Active destination card */}
          <div
            className="hero-place-card"
            onClick={handleOpenCurrentDetail}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleOpenCurrentDetail()
            }}
            aria-label={`View details for ${currentSlide.name}`}
          >
            <div className="place-card-meta">
              <span className="place-cat">{currentSlide.category}</span>
              <h4 className="place-name">{currentSlide.name}</h4>
              <p className="place-tagline">{currentSlide.tagline}</p>
            </div>
            <div className="place-card-action">
              <span>Explore</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Carousel controls */}
          <div className="hero-carousel-controls">
            <button
              type="button"
              className="hero-nav-arrow"
              onClick={handlePrev}
              aria-label="Previous destination"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Slide Indicators */}
            <div className="hero-indicators" role="tablist" aria-label="Destination slides">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Slide ${idx + 1}: ${slide.name}`}
                  aria-selected={idx === currentIndex}
                >
                  <span className="dot-fill" />
                </button>
              ))}
            </div>

            <button
              type="button"
              className="hero-nav-arrow"
              onClick={handleNext}
              aria-label="Next destination"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

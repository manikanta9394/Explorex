import { useEffect, useRef, useState, useCallback } from 'react'
import { Pause, Play, ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react'

export const INCREDIBLE_INDIA_SLIDES = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    state: 'Agra, Uttar Pradesh',
    src: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg',
    poster: '/images/charminar.jpg',
    attribution: 'Wikimedia Commons · CC BY-SA 4.0',
    alt: 'Ivory-white marble mausoleum of Taj Mahal in Agra, Uttar Pradesh',
    coords: { x: 48, y: 35 },
  },
  {
    id: 'hawa-mahal',
    name: 'Hawa Mahal (Palace of Winds)',
    state: 'Jaipur, Rajasthan',
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
    poster: '/images/charminar.jpg',
    attribution: 'Wikimedia Commons · CC BY-SA 4.0',
    alt: 'Pink and red sandstone facade of Hawa Mahal in Jaipur, Rajasthan',
    coords: { x: 38, y: 36 },
  },
  {
    id: 'golden-temple',
    name: 'Golden Temple (Harmandir Sahib)',
    state: 'Amritsar, Punjab',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amrithsar_7.jpg/3840px-The_Golden_Temple_of_Amrithsar_7.jpg',
    poster: '/images/charminar.jpg',
    attribution: 'Wikimedia Commons · CC BY-SA 4.0',
    alt: 'Gilded Golden Temple surrounded by the sacred Amrit Sarovar in Amritsar, Punjab',
    coords: { x: 34, y: 22 },
  },
  {
    id: 'gateway-of-india',
    name: 'Gateway of India',
    state: 'Mumbai, Maharashtra',
    src: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg',
    poster: '/images/charminar.jpg',
    attribution: 'Wikimedia Commons · CC BY-SA 4.0',
    alt: 'Basalt arch monument Gateway of India facing the Arabian Sea in Mumbai',
    coords: { x: 30, y: 62 },
  },
  {
    id: 'charminar',
    name: 'Charminar',
    state: 'Hyderabad, Telangana',
    src: '/images/charminar.jpg',
    poster: '/images/charminar.jpg',
    attribution: 'Explorex Archives · ASI Certified',
    alt: 'Iconic 16th-century Charminar with four grand minarets in Old Hyderabad',
    coords: { x: 46, y: 65 },
  },
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple (Black Pagoda)',
    state: 'Konark, Odisha',
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Konarka_Temple.jpg',
    poster: '/images/charminar.jpg',
    attribution: 'Wikimedia Commons · CC BY-SA 4.0',
    alt: 'Intricately carved 13th-century stone chariot wheels of Konark Sun Temple, Odisha',
    coords: { x: 67, y: 55 },
  },
  {
    id: 'alleppey-backwaters',
    name: 'Alleppey Backwaters & Vembanad Lake',
    state: 'Alappuzha, Kerala',
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Alappuzha_Boat_Beauty_W.jpg',
    poster: '/images/charminar.jpg',
    attribution: 'Wikimedia Commons · CC BY-SA 4.0',
    alt: 'Traditional wooden houseboat sailing on tranquil Kerala backwaters lined with coconut palms',
    coords: { x: 40, y: 88 },
  },
  {
    id: 'great-himalayas',
    name: 'Great Himalayan Range',
    state: 'Himachal Pradesh',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Himalayn_National_Park_01.jpg/3840px-Himalayn_National_Park_01.jpg',
    poster: '/images/charminar.jpg',
    attribution: 'Wikimedia Commons · CC BY-SA 4.0',
    alt: 'Snow-capped peaks and valleys of Great Himalayan National Park, Himachal Pradesh',
    coords: { x: 44, y: 16 },
  },
]

export function getTimeTheme() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 8) {
    return {
      period: 'dawn',
      label: 'Dawn in India',
      icon: '🌅',
      skyClass: 'sky-dawn',
      skyGradient: 'linear-gradient(180deg, #151833 0%, #372652 35%, #763760 65%, #B45E4E 85%, #E39962 100%)',
    }
  }
  if (hour >= 8 && hour < 17) {
    return {
      period: 'day',
      label: 'Daylight across India',
      icon: '☀️',
      skyClass: 'sky-day',
      skyGradient: 'linear-gradient(180deg, #0B243B 0%, #133954 30%, #1B5270 60%, #2E6886 85%, #E2BE80 100%)',
    }
  }
  if (hour >= 17 && hour < 19) {
    return {
      period: 'golden',
      label: 'Golden Hour in India',
      icon: '🌇',
      skyClass: 'sky-golden',
      skyGradient: 'linear-gradient(180deg, #1C1126 0%, #441731 30%, #862B36 60%, #C5552E 85%, #E08E36 100%)',
    }
  }
  return {
    period: 'night',
    label: 'Starlit Night across India',
    icon: '🌙',
    skyClass: 'sky-night',
    skyGradient: 'linear-gradient(180deg, #03060E 0%, #070E1E 35%, #0D162B 65%, #121F36 85%, #0A1220 100%)',
  }
}

export default function IncredibleIndiaBackground({ children, className = '', showControls = true }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [timeTheme, setTimeTheme] = useState(getTimeTheme)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [loadedImages, setLoadedImages] = useState({ 0: true })
  const containerRef = useRef(null)

  // 1. Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // 2. Refresh time theme periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTheme(getTimeTheme())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // 3. Slideshow 7-second auto-rotation
  useEffect(() => {
    if (prefersReducedMotion || isPaused || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % INCREDIBLE_INDIA_SLIDES.length
        // Lazy load next image ahead of time
        setLoadedImages((curr) => ({ ...curr, [next]: true, [(next + 1) % INCREDIBLE_INDIA_SLIDES.length]: true }))
        return next
      })
    }, 7000)

    return () => clearInterval(interval)
  }, [prefersReducedMotion, isPaused, isHovered])

  // 4. Parallax on desktop mousemove
  const handleMouseMove = useCallback((e) => {
    if (prefersReducedMotion || typeof window === 'undefined') return
    const { clientX, clientY } = e
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const deltaX = (clientX - cx) / cx
    const deltaY = (clientY - cy) / cy
    setParallax({
      x: Math.max(-12, Math.min(12, deltaX * 12)),
      y: Math.max(-10, Math.min(10, deltaY * 10)),
    })
  }, [prefersReducedMotion])

  const currentSlide = INCREDIBLE_INDIA_SLIDES[currentIndex]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? INCREDIBLE_INDIA_SLIDES.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % INCREDIBLE_INDIA_SLIDES.length)
  }

  return (
    <div
      ref={containerRef}
      className={`incredible-india-stage ${timeTheme.skyClass} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setParallax({ x: 0, y: 0 })
      }}
      style={{
        '--sky-gradient': timeTheme.skyGradient,
        '--parallax-x': `${parallax.x}px`,
        '--parallax-y': `${parallax.y}px`,
      }}
    >
      {/* Dynamic Sky Layer */}
      <div className="india-sky-backdrop" aria-hidden="true" />

      {/* Subtle Star Clusters (Night & Dawn) */}
      {(timeTheme.period === 'night' || timeTheme.period === 'dawn') && (
        <div className="india-star-field" aria-hidden="true">
          <div className="star s1" />
          <div className="star s2" />
          <div className="star s3" />
          <div className="star s4" />
          <div className="star s5" />
          <div className="star s6" />
        </div>
      )}

      {/* Slideshow Layer with Ken Burns Zoom */}
      <div className="india-slideshow-wrap" aria-hidden="true">
        {INCREDIBLE_INDIA_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex
          const shouldLoad = loadedImages[idx] || idx === 0 || idx === 1

          return (
            <div
              key={slide.id}
              className={`india-slide-layer ${isActive ? 'is-active' : ''} ${prefersReducedMotion ? 'no-motion' : ''}`}
            >
              {shouldLoad && (
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="india-slide-img"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding={idx === 0 ? 'sync' : 'async'}
                  onError={(e) => {
                    // Fallback to local verified asset if external CDN is blocked
                    if (e.currentTarget.src !== slide.poster) {
                      e.currentTarget.src = slide.poster
                    }
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Stylized SVG Map of India with Animated Dashed Routes & Landmarks */}
      <div className="india-svg-map-layer" aria-hidden="true">
        <svg
          viewBox="0 0 100 100"
          className="india-map-canvas"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {/* Subtle stylized geographical perimeter of India */}
          <path
            className="india-country-outline"
            d="M 38 10 
               Q 44 8 50 14 
               Q 54 20 50 25 
               Q 58 28 68 28 
               Q 80 30 84 38 
               Q 78 45 68 46 
               Q 68 55 64 62 
               Q 58 72 48 85 
               Q 44 94 42 96 
               Q 38 90 36 82 
               Q 32 72 28 62 
               Q 24 55 22 45 
               Q 20 38 28 32 
               Q 32 20 38 10 Z"
          />

          {/* Animated Dashed Golden Route connecting landmarks */}
          <path
            className="india-route-polyline"
            d="M 34 22 L 44 16 L 48 35 L 38 36 L 30 62 L 40 88 L 46 65 L 67 55 Z"
          />

          {/* Landmark coordinate nodes */}
          {INCREDIBLE_INDIA_SLIDES.map((slide, idx) => {
            const isSlideActive = idx === currentIndex
            return (
              <g
                key={slide.id}
                className={`india-map-pin ${isSlideActive ? 'is-active' : ''}`}
                transform={`translate(${slide.coords.x}, ${slide.coords.y})`}
              >
                {/* Outer pulse wave on active pin */}
                {isSlideActive && <circle className="pin-pulse" r="4.5" />}
                {/* Core dot */}
                <circle className="pin-core" r="1.5" />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Floating Diyas & Saffron Marigold Petals (CSS-only Particles) */}
      {!prefersReducedMotion && (
        <div className="india-floating-particles" aria-hidden="true">
          {/* Diyas with flickering golden aura */}
          <div className="particle diya d1">
            <span className="diya-glow" />
            <span className="diya-flame">🪔</span>
          </div>
          <div className="particle diya d2">
            <span className="diya-glow" />
            <span className="diya-flame">🪔</span>
          </div>
          <div className="particle diya d3">
            <span className="diya-glow" />
            <span className="diya-flame">🪔</span>
          </div>
          <div className="particle diya d4">
            <span className="diya-glow" />
            <span className="diya-flame">🪔</span>
          </div>

          {/* Marigold Petals */}
          <div className="particle petal p1" />
          <div className="particle petal p2" />
          <div className="particle petal p3" />
          <div className="particle petal p4" />
        </div>
      )}

      {/* Dark Vignette & Multi-Layer Scrim for Guaranteed AA Contrast */}
      <div className="india-scrim-overlay" aria-hidden="true" />
      <div className="india-noise-grain" aria-hidden="true" />

      {/* Active Photo Caption (Bottom Left) */}
      <div className="india-landmark-caption" aria-live="polite">
        <div className="caption-badge">
          <MapPin size={13} className="caption-pin-icon" />
          <div className="caption-meta">
            <span className="caption-name">{currentSlide.name}</span>
            <span className="caption-state">{currentSlide.state}</span>
          </div>
        </div>
        <span className="caption-attr">{currentSlide.attribution}</span>
      </div>

      {/* Slideshow Navigation & Visible Pause Control (Bottom Right) */}
      {showControls && (
        <div className="india-slideshow-dock" role="toolbar" aria-label="Slideshow Controls">
          {/* Play / Pause Toggle Button */}
          <button
            type="button"
            className={`dock-btn dock-pause-btn ${isPaused ? 'paused' : ''}`}
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
            title={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
            aria-pressed={isPaused}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
          </button>

          {/* Prev Slide */}
          <button
            type="button"
            className="dock-btn dock-arrow-btn"
            onClick={handlePrev}
            aria-label="Previous destination"
            title="Previous landmark"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Slide Indicator */}
          <span className="dock-counter">
            <strong>0{currentIndex + 1}</strong> / 0{INCREDIBLE_INDIA_SLIDES.length}
          </span>

          {/* Next Slide */}
          <button
            type="button"
            className="dock-btn dock-arrow-btn"
            onClick={handleNext}
            aria-label="Next destination"
            title="Next landmark"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Foreground Interactive Content Slot */}
      <div className="india-foreground-content">{children}</div>
    </div>
  )
}

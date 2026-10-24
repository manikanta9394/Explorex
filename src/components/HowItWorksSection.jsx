import { useEffect, useRef, useState } from 'react'
import { Compass, Navigation, Sparkles } from 'lucide-react'

export default function HowItWorksSection({ onStartExploring, onAskAI }) {
  const sectionRef = useRef(null)
  const pathRef = useRef(null)
  const [activeStepIndex, setActiveStepIndex] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 2
    }
    return 0
  })

  const steps = [
    {
      number: '01',
      title: 'Discover',
      tagline: 'Curated Telangana Heritage',
      icon: Compass,
      description:
        'Browse 400+ verified monuments, palaces, forts, and cultural landmarks. Filter by category, check transparent entry tickets in ₹, opening hours, and dress guidelines.',
      highlights: ['Transparent ₹ pricing', 'Verified coordinates', 'High-res gallery'],
      actionText: 'Explore Destinations',
      action: onStartExploring,
    },
    {
      number: '02',
      title: 'Plan with AI',
      tagline: 'Personalized Local Wisdom',
      icon: Sparkles,
      description:
        'Consult Explorex AI Guide for custom day itineraries, golden-hour photography advice, crowd-free visiting slots, and legendary culinary recommendations nearby.',
      highlights: ['1-day itineraries', 'Golden-hour tips', 'Local food culture'],
      actionText: 'Ask TourMate AI',
      action: onAskAI,
    },
    {
      number: '03',
      title: 'Navigate',
      tagline: 'Turn-by-Turn Multimodal Transit',
      icon: Navigation,
      description:
        'Choose your travel mode—walking, cycling, or driving. Get cached distance and duration estimates, then open one-click directions directly in Google Maps.',
      highlights: ['Walking · Cycling · Driving', 'Offline cached routes', 'Google Maps handoff'],
      actionText: 'View Transit Modes',
      action: onStartExploring,
    },
  ]

  // Scroll-drawn route line in "How it works" section
  useEffect(() => {
    // If user prefers reduced motion, draw line immediately
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (pathRef.current) {
        pathRef.current.style.strokeDashoffset = '0'
      }
      return
    }

    const path = pathRef.current
    if (!path) return

    const pathLength = path.getTotalLength()
    path.style.strokeDasharray = `${pathLength}`
    path.style.strokeDashoffset = `${pathLength}`

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current || !pathRef.current) return
          const rect = sectionRef.current.getBoundingClientRect()
          const windowHeight = window.innerHeight

          // Section entrance progress (0 when entering view, 1 when middle is at center)
          const start = windowHeight * 0.8
          const end = windowHeight * 0.2
          const current = rect.top

          let progress = 0
          if (current <= start) {
            progress = Math.min(1, Math.max(0, (start - current) / (start - end)))
          }

          const drawLength = pathLength * (1 - progress)
          pathRef.current.style.strokeDashoffset = `${drawLength}`

          if (progress >= 0.75) {
            setActiveStepIndex(2)
          } else if (progress >= 0.4) {
            setActiveStepIndex(1)
          } else {
            setActiveStepIndex(0)
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

  return (
    <section
      ref={sectionRef}
      className="how-it-works-section reveal-fade-up"
      id="how-it-works"
    >
      <div className="how-it-works-container">
        {/* Header */}
        <div className="how-header">
          <span className="eyebrow">
            <Sparkles size={14} /> Effortless Travel In 3 Steps
          </span>
          <h2>
            How Explorex Works
            <br />
            <em>from idea to journey.</em>
          </h2>
          <p className="how-lead">
            Whether you have 4 hours for an afternoon heritage walk or 3 days across Telangana, here is how Explorex simplifies your adventure.
          </p>
        </div>

        {/* Scroll-Drawn Route Line Container */}
        <div className="how-route-line-wrapper" aria-hidden="true">
          <svg
            className="how-route-svg"
            viewBox="0 0 1000 120"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Background faint trail */}
            <path
              d="M 120,60 Q 330,10 500,60 T 880,60"
              stroke="rgba(201, 162, 39, 0.2)"
              strokeWidth="3"
              strokeDasharray="6 6"
              fill="none"
            />
            {/* Animated gold drawn dashed route line */}
            <path
              ref={pathRef}
              className="scroll-route-line"
              d="M 120,60 Q 330,10 500,60 T 880,60"
              stroke="url(#route-gold-gradient)"
              strokeWidth="3.5"
              strokeDasharray="8 6"
              strokeLinecap="round"
              fill="none"
            />
            <defs>
              <linearGradient id="route-gold-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C9A227" />
                <stop offset="50%" stopColor="#F5D061" />
                <stop offset="100%" stopColor="#D48B28" />
              </linearGradient>
            </defs>
          </svg>

          {/* 3 Interactive Route Waypoint Nodes */}
          <div className="route-waypoints-bar">
            <div className={`waypoint-node ${activeStepIndex >= 0 ? 'active' : ''}`}>
              <span className="node-pulse" />
              <span className="node-core">1</span>
            </div>
            <div className={`waypoint-node ${activeStepIndex >= 1 ? 'active' : ''}`}>
              <span className="node-pulse" />
              <span className="node-core">2</span>
            </div>
            <div className={`waypoint-node ${activeStepIndex >= 2 ? 'active' : ''}`}>
              <span className="node-pulse" />
              <span className="node-core">3</span>
            </div>
          </div>
        </div>

        {/* 3 Step Cards (Staggered by index) */}
        <div className="steps-grid">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="step-card reveal-fade-up"
                style={{ '--reveal-index': idx }}
              >
                <div className="step-card-header">
                  <span className="step-badge">{step.number}</span>
                  <div className="step-icon-circle">
                    <Icon size={20} />
                  </div>
                </div>

                <div className="step-card-content">
                  <span className="step-tagline">{step.tagline}</span>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.description}</p>

                  <ul className="step-highlights-list">
                    {step.highlights.map((h, i) => (
                      <li key={i}>
                        <span className="step-check">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="step-card-footer">
                  <button
                    type="button"
                    className="step-cta-btn"
                    onClick={step.action}
                  >
                    <span>{step.actionText}</span>
                    <span className="step-cta-arrow">→</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

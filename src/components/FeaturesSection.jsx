import {
  ArrowRight,
  Banknote,
  Heart,
  Map as MapIcon,
  Navigation,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react'

export default function FeaturesSection({ onNavigateToSection, onOpenSaved }) {
  const features = [
    {
      id: 'ai-assistant',
      icon: Sparkles,
      iconColor: '#C9A227',
      tag: 'Generative Intelligence',
      title: 'TourMate AI Assistant',
      description:
        'Ask anything from golden hour photography angles to historical backstories. Get tailored 1-day itineraries and local food tips in natural language.',
      cta: 'Chat with AI',
      action: () => onNavigateToSection?.('ask'),
    },
    {
      id: 'interactive-map',
      icon: MapIcon,
      iconColor: '#1F3A2E',
      tag: 'Leaflet Clustering',
      title: 'Interactive Clustered Map',
      description:
        'Explore 120+ verified Telangana destinations with high-density marker clustering, real GPS coordinates, and instant place previews.',
      cta: 'Open Map',
      action: () => onNavigateToSection?.('map'),
    },
    {
      id: 'multimodal-directions',
      icon: Navigation,
      iconColor: '#C9682D',
      tag: 'Walking · Cycling · Driving',
      title: 'Multimodal Directions',
      description:
        'Live route calculation across walking, cycling, and driving modes with cached distances and instant turn-by-turn handoff to Google Maps.',
      cta: 'Explore Routes',
      action: () => onNavigateToSection?.('destinations'),
    },
    {
      id: 'place-details-pricing',
      icon: Banknote,
      iconColor: '#1F3A2E',
      tag: 'Zero Surprises',
      title: 'Rules & Prices in ₹',
      description:
        'Clear entry tickets in Indian Rupees, opening hours, photography permits, and dress codes for seamless visiting with zero surprises.',
      cta: 'View Destinations',
      action: () => onNavigateToSection?.('destinations'),
    },
    {
      id: 'nearby-stays-food',
      icon: UtensilsCrossed,
      iconColor: '#C9682D',
      tag: 'Heritage & Biryani',
      title: 'Nearby Stays & Iconic Food',
      description:
        'Curated heritage hotels and legendary Hyderabadi restaurants within radius of every landmark—from Irani chai to royal suites.',
      cta: 'Browse Nearby',
      action: () => onNavigateToSection?.('nearby'),
    },
    {
      id: 'save-places',
      icon: Heart,
      iconColor: '#C9682D',
      tag: 'Personal Wishlist',
      title: 'Save Places & Wishlists',
      description:
        'Bookmark favorite monuments, stays, and eateries with one click. Access your custom itinerary anywhere with a live count badge.',
      cta: 'View Saved Places',
      action: () => onOpenSaved?.(),
    },
  ]

  return (
    <section className="features-section scroll-reveal" id="features">
      <div className="features-container">
        {/* Section Header */}
        <div className="features-header">
          <span className="eyebrow">
            <Sparkles size={14} /> Built for Modern Travelers
          </span>
          <h2>
            Everything you need for Telangana
            <br />
            <em>in one intelligent place.</em>
          </h2>
          <p className="features-lead">
            Explorex unifies discovery, routing, transparent pricing, and local intelligence so you spend less time planning and more time immersed in history.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="features-grid">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.id}
                className="feature-card interactive-feature-card reveal-zoom"
                style={{ '--reveal-index': idx }}
              >
                <div className="feature-card-top">
                  <span className="feature-icon-wrapper" style={{ color: feat.iconColor }}>
                    <Icon size={24} />
                  </span>
                  <span className="feature-tag-chip">{feat.tag}</span>
                </div>

                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.description}</p>

                <div className="feature-card-footer">
                  <button
                    type="button"
                    className="feature-action-link"
                    onClick={feat.action}
                  >
                    <span>{feat.cta}</span>
                    <ArrowRight size={14} />
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

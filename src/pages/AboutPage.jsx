import {
  Compass,
  ShieldCheck,
  Globe2,
  Database,
  ArrowRight,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SEOHead from '../components/SEOHead'

export default function AboutPage({ onNavigate }) {
  return (
    <div className="about-page-shell">
      <SEOHead
        title="About Explorex | Our Cultural Mission & Data Integrity"
        description="Learn how Explorex is building India's most authentic, zero-hallucination cultural tourism guide grounded in verified open data."
      />

      <PageHeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'About Explorex' },
        ]}
        eyebrow="Cultural Heritage Mission"
        title="The Explorex Philosophy"
        subtitle="A quiet rebellion against generic travel scrapers. Curating authentic Indian heritage with verifiable facts, uninvented ticket fees, and image integrity."
      />

      <div className="about-page-container">
        {/* Editorial Story Section */}
        <section className="about-story-section">
          <div className="story-lead-card">
            <span className="story-dropcap">I</span>
            <p className="story-lead-para">
              ndia’s heritage is among the deepest and most diverse on earth—spanning over five millennia of monumental architecture, living traditions, temple towns, and royal citadels. Yet modern travel software has too often reduced this richness to hallucinated blog spam, transferred photos, fabricated entry fees, and SEO clickbait.
            </p>
            <p>
              Explorex was created to restore trust in travel intelligence. We believe that when a visitor plans a pilgrimage to Brihadeeswarar Temple in Thanjavur, or an evening stroll around the Charminar in Hyderabad, they deserve verified data: accurate INR ticket prices with source citations, exact timings, etiquette rules, and photos that genuinely depict the place they are visiting.
            </p>
          </div>
        </section>

        {/* 4 Pillars of Explorex */}
        <section className="about-pillars-section">
          <h3 className="pillars-title">The Four Pillars of Explorex</h3>
          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-wrap">
                <ShieldCheck size={24} color="#C9A227" />
              </div>
              <h4>Zero Hallucinations</h4>
              <p>
                We never guess prices, timings, or distances. If an entrance fee is not listed by the Archaeological Survey of India or a state tourism department, we label it as unverified rather than inventing numbers.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap">
                <Database size={24} color="#C9A227" />
              </div>
              <h4>Image Integrity</h4>
              <p>
                A photo of Charminar will never appear on the Taj Mahal. Every monument photo is tied directly to its persistent Wikidata entity ID and verified via SHA-256 byte hashing to enforce strict uniqueness.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap">
                <Compass size={24} color="#C9A227" />
              </div>
              <h4>Multimodal Travel</h4>
              <p>
                India is best explored by walking historic alleys, cycling lake promenades, and scenic road journeys. We calculate accurate distances and routes across all three transit modes.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap">
                <Globe2 size={24} color="#C9A227" />
              </div>
              <h4>All-India Scope</h4>
              <p>
                From Ladakh’s high-altitude monasteries to Tamil Nadu’s Great Living Chola Temples and the lush backwaters of Kerala, Explorex covers verified destinations across all 36 States and Union Territories.
              </p>
            </div>
          </div>
        </section>

        {/* Open Sources of Truth */}
        <section className="about-sources-section">
          <h3>Our Open Sources of Truth</h3>
          <div className="sources-list-grid">
            <div className="source-item-card">
              <strong>Wikidata (SPARQL)</strong>
              <p>Primary authority for monument identifiers, coordinates, and structured properties.</p>
            </div>
            <div className="source-item-card">
              <strong>Wikimedia Commons</strong>
              <p>High-resolution, verified photography with CC-BY-SA attribution and licensing.</p>
            </div>
            <div className="source-item-card">
              <strong>Archaeological Survey of India (ASI)</strong>
              <p>Official ticketing circulars, protected monument statuses, and visitor etiquette rules.</p>
            </div>
            <div className="source-item-card">
              <strong>OpenStreetMap (OSM)</strong>
              <p>Geospatial geometries, pedestrian paths, and multimodal transit networks.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="about-footer-cta">
          <h4>Start Exploring India Today</h4>
          <p>Browse over 170 verified monuments or build your custom day-by-day itinerary.</p>
          <div className="about-cta-btns">
            <button
              type="button"
              className="btn-explore-all"
              onClick={() => onNavigate?.('/explore')}
            >
              Explore Destinations <ArrowRight size={14} />
            </button>
            <button
              type="button"
              className="btn-plan-itinerary"
              onClick={() => onNavigate?.('/planner')}
            >
              Open Trip Planner
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

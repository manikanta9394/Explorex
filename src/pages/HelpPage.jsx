import { useState } from 'react'
import {
  HelpCircle,
  Search,
  ChevronDown,
  PhoneCall,
  ShieldCheck,
  Compass,
  Sparkles,
  MapPin,
  ExternalLink,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SEOHead from '../components/SEOHead'

const FAQS = [
  {
    category: 'Data & Authenticity',
    question: 'How are entry fees and visiting hours verified on Explorex?',
    answer:
      'Explorex enforces a strict anti-hallucination standard. Entry ticket prices are derived directly from the Archaeological Survey of India (ASI, asi.nic.in) official fee circulars and State Tourism Department gazettes. Where rates cannot be confirmed through an official government source, Explorex displays "Not listed, verify locally" rather than fabricating estimates.',
  },
  {
    category: 'Data & Authenticity',
    question: 'How does Explorex ensure photos match the monument?',
    answer:
      'Every place in our nationwide dataset is identified by its persistent Wikidata entity ID (e.g., Q844111 for Golconda Fort, Q471856 for Taj Mahal). Photos are fetched exclusively from Wikimedia Commons files attached to that exact Wikidata ID. A database-level SHA-256 hash constraint prevents any image from being erroneously attached to more than one monument.',
  },
  {
    category: 'AI Travel Guide',
    question: 'How does the Explorex AI Guide work without hallucinating?',
    answer:
      'Our AI Assistant uses Retrieval-Augmented Generation (RAG). When you ask a question, a server-side hybrid search retrieves verified text chunks (overview, rules, prices, and nearby spots) using Reciprocal Rank Fusion. The system prompt instructs the language model to answer solely from that verified data and cite sources using [1], [2] tags. If no verified data exists for your query (such as an out-of-country landmark), our Grounding Guard delivers an honest refusal.',
  },
  {
    category: 'Trip Planner',
    question: 'How does the Trip Planner sequence stops proximity-wise?',
    answer:
      'The Trip Planner uses a nearest-neighbour spatial proximity algorithm based on spherical haversine distances. It clusters places geographically to minimize back-and-forth travel time and automatically suggests a central dining midpoint for lunch on each day of your itinerary.',
  },
  {
    category: 'Visitor Guidelines',
    question: 'What are the general rules for photography at heritage sites in India?',
    answer:
      'At most ASI monuments, standard mobile phone photography is permitted free of charge. Video cameras or professional photography equipment with tripods typically require prior permission from the ASI Circle Superintending Archaeologist. Drone photography is strictly prohibited at all protected heritage monuments across India.',
  },
  {
    category: 'Offline & Access',
    question: 'Can I access my saved places and itineraries offline?',
    answer:
      'Yes! Explorex is equipped with Progressive Web App (PWA) offline service workers. Your saved places and planned itineraries remain available in local device storage even without an active internet connection.',
  },
]

const EMERGENCY_HELPLINES = [
  { service: 'National Tourist Helpline (24/7)', number: '1363 / 1800-11-1363', desc: 'Toll-free, multi-language visitor assistance by Ministry of Tourism' },
  { service: 'National Emergency Number', number: '112', desc: 'All-in-one emergency dispatch (Police, Fire, Ambulance)' },
  { service: 'Medical Ambulance', number: '108 / 102', desc: 'Emergency medical response and hospital transit' },
  { service: 'Women Tourist Helpline', number: '1091', desc: 'Dedicated safety and protection assistance' },
  { service: 'Railway Protection Force', number: '139', desc: 'Indian Railways transit security & passenger assistance' },
]

export default function HelpPage({ onNavigate }) {
  const [search, setSearch] = useState('')
  const [openIndex, setOpenIndex] = useState(0)

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="help-page-shell">
      <SEOHead
        title="Help & Visitor FAQ | Explorex"
        description="Frequently asked questions about verified entry fees, visitor rules, AI grounding, and 24/7 tourist emergency helplines in India."
      />

      <PageHeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Help & FAQ' },
        ]}
        eyebrow="Visitor Assistance"
        title="Help &amp; Frequently Asked Questions"
        subtitle="Clear answers on verified heritage data, itinerary planning, monument etiquette, and 24/7 traveler helplines."
      />

      <div className="help-page-container">
        {/* Search Bar */}
        <div className="help-search-row">
          <div className="help-search-box">
            <Search size={18} className="help-search-icon" />
            <input
              type="text"
              placeholder="Search topics: ticket fees, AI grounding, photography rules, offline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search FAQ"
            />
          </div>
        </div>

        <div className="help-content-grid">
          {/* FAQ Accordion */}
          <div className="faq-accordion-col">
            <h3 className="section-title">Common Questions</h3>
            <div className="faq-items-list">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx
                return (
                  <div key={idx} className={`faq-card-item ${isOpen ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-category-chip">{faq.category}</span>
                      <h4 className="faq-q-text">{faq.question}</h4>
                      <ChevronDown
                        size={16}
                        className={`faq-chevron ${isOpen ? 'rotate' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="faq-answer-pane">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                )
              })}

              {filteredFaqs.length === 0 && (
                <div className="no-faq-matches">
                  <HelpCircle size={28} color="#9CA3AF" />
                  <p>No questions matching "{search}". Have a specific question?</p>
                  <button
                    type="button"
                    className="ask-ai-link-btn"
                    onClick={() => onNavigate?.('/ai')}
                  >
                    Ask our AI Guide Directly
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Helplines Sidebar */}
          <div className="emergency-sidebar-col">
            <div className="emergency-helplines-card">
              <div className="card-top-row">
                <div className="sos-icon-wrap">
                  <PhoneCall size={18} color="#EF4444" />
                </div>
                <div>
                  <h4>Emergency &amp; Helpline Numbers</h4>
                  <p>24/7 official traveler assistance across India</p>
                </div>
              </div>

              <div className="helpline-rows-list">
                {EMERGENCY_HELPLINES.map((item, i) => (
                  <div key={i} className="helpline-row-item">
                    <div className="helpline-info">
                      <strong>{item.service}</strong>
                      <p>{item.desc}</p>
                    </div>
                    <a href={`tel:${item.number.split('/')[0].trim()}`} className="call-pill-btn">
                      {item.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Standard Box */}
            <div className="data-integrity-box">
              <ShieldCheck size={20} color="#C9A227" />
              <h4>Explorex Open Data Pledge</h4>
              <p>
                We do not sell sponsored placement or accept paid rankings. Every monument and stay is curated strictly for historical interest and visitor utility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

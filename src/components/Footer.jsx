import { ArrowUp, Heart, Sparkles } from 'lucide-react'
import { Logo } from './Navbar'

export default function Footer({ onOpenSaved, onNavigate }) {
  const scrollToTop = (e) => {
    if (e) e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLink = (e, path) => {
    if (e) e.preventDefault()
    if (onNavigate) {
      onNavigate(path)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="explorex-footer scroll-reveal" role="contentinfo">
      <div className="footer-container">
        {/* Top Grid */}
        <div className="footer-top-grid">
          {/* Brand & Description */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <Logo onClick={scrollToTop} />
            </div>
            <p className="footer-desc">
              Your AI travel companion for Hyderabad and Telangana. Unifying verified cultural landmarks, turn-by-turn multimodal directions, transparent prices in ₹, and authentic dining into a single intelligent view.
            </p>
            <div className="footer-hackathon-badge">
              <Sparkles size={14} className="badge-spark" />
              <span>Telangana Tourism AI Hackathon Edition</span>
            </div>
          </div>

          {/* Quick Links Column 1: Exploration */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Exploration</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/explore')}>
                  Featured Destinations
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/map')}>
                  Interactive Clustered Map
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/planner')}>
                  Trip Planner
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/ai')}>
                  Ask TourMate AI
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => {
                    if (onNavigate) onNavigate('/saved')
                    else onOpenSaved?.()
                  }}
                >
                  Saved Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2: Architecture & Project */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">About Project</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/')}>
                  The Mission &amp; Problem Solved
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/')}>
                  Key Features
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/planner')}>
                  How It Works (3 Steps)
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/explore')}>
                  Full Telangana Dataset (400 Places)
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 3: Regional Highlights */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Top Heritage</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/explore/place-charminar')}>
                  Charminar (1591 CE)
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/explore/place-golconda')}>
                  Golconda Fort
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/explore/place-chowmahalla')}>
                  Chowmahalla Palace
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/explore/place-salarjung')}>
                  Salar Jung Museum
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={(e) => handleLink(e, '/explore/place-birlamandir')}>
                  Birla Mandir
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle Divider */}
        <div className="footer-divider" />

        {/* Bottom Bar with Team & Hackathon Credit */}
        <div className="footer-bottom-bar">
          <div className="footer-team-credit">
            <p className="credit-text">
              Built with passion for <strong>Telangana Tourism AI Hackathon</strong> · Team <strong>Explorex</strong>
            </p>
          </div>

          <div className="footer-copyright">
            <span>© {new Date().getFullYear()} Explorex. All rights reserved.</span>
            <span className="footer-heart">
              Curated for meaningful journeys <Heart size={13} fill="#C9A227" color="#C9A227" />
            </span>
          </div>

          <button
            type="button"
            className="footer-scroll-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            title="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}

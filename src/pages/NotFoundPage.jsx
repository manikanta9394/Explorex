import { useState } from 'react'
import { Compass, Search, ArrowRight, Home, Sparkles } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function NotFoundPage({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim() && onNavigate) {
      onNavigate(`/explore?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <div className="not-found-page-shell">
      <SEOHead
        title="Page Not Found (404) | Explorex"
        description="The destination you are looking for has shifted on the map. Return to Explorex India cultural guide."
      />

      <div className="not-found-card">
        <div className="not-found-compass-orb">
          <Compass size={48} color="#C9A227" className="spin-slow" />
        </div>

        <span className="error-code-badge">404 · Uncharted Route</span>
        <h2>This destination has shifted on the map</h2>
        <p>
          The page or landmark URL you followed could not be found. Let’s get your journey back on the golden trail.
        </p>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="not-found-search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search verified Indian places (e.g. Taj Mahal, Charminar)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-submit-btn">
            Search
          </button>
        </form>

        {/* Popular Landmarks Suggestions */}
        <div className="popular-fallback-pills">
          <span className="pills-label">Popular destinations:</span>
          <button
            type="button"
            className="fallback-pill"
            onClick={() => onNavigate?.('/explore/golconda-fort-hyderabad')}
          >
            Golconda Fort
          </button>
          <button
            type="button"
            className="fallback-pill"
            onClick={() => onNavigate?.('/explore/taj-mahal-agra')}
          >
            Taj Mahal
          </button>
          <button
            type="button"
            className="fallback-pill"
            onClick={() => onNavigate?.('/explore/charminar-hyderabad')}
          >
            Charminar
          </button>
          <button
            type="button"
            className="fallback-pill"
            onClick={() => onNavigate?.('/explore/hawa-mahal-jaipur')}
          >
            Hawa Mahal
          </button>
        </div>

        {/* Action Buttons */}
        <div className="not-found-actions">
          <button
            type="button"
            className="btn-return-home"
            onClick={() => onNavigate?.('/')}
          >
            <Home size={15} />
            <span>Return to Home</span>
          </button>
          <button
            type="button"
            className="btn-explore-places"
            onClick={() => onNavigate?.('/explore')}
          >
            <Compass size={15} />
            <span>Explore All 170+ Places</span>
          </button>
          <button
            type="button"
            className="btn-ask-ai-fallback"
            onClick={() => onNavigate?.('/ai')}
          >
            <Sparkles size={15} />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>
    </div>
  )
}

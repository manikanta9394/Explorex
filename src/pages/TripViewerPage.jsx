import { useMemo, useState } from 'react'
import {
  Car,
  Navigation,
  Utensils,
  IndianRupee,
  Copy,
  Check,
  MapPin,
  Compass,
  Sparkles,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SafeImage from '../components/SafeImage'
import SEOHead from '../components/SEOHead'
import { useToast } from '../context/useToast'
import { allDatasetPlaces } from '../data/tourismData'
import { openGoogleMapsMultiStop } from '../utils/googleMaps'

export default function TripViewerPage({ tripId, onNavigate }) {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

  // Try to load trip from localStorage or parse tripId
  const trip = useMemo(() => {
    try {
      const raw = localStorage.getItem('explorex_saved_trips')
      if (raw) {
        const list = JSON.parse(raw)
        const found = list.find((t, i) => t.id === tripId || String(i + 1) === tripId)
        if (found) return found
      }
    } catch {}

    // Fallback: Default 2-Day Hyderabad Heritage Tour
    const p1 = allDatasetPlaces.find((p) => p.id === 'charminar-hyderabad') || allDatasetPlaces[0]
    const p2 = allDatasetPlaces.find((p) => p.id === 'golconda-fort-hyderabad') || allDatasetPlaces[1]
    const p3 = allDatasetPlaces.find((p) => p.id.includes('buddha') || p.id.includes('hussain')) || allDatasetPlaces[2]
    const p4 = allDatasetPlaces.find((p) => p.id.includes('qutb') || p.id.includes('chowmahalla')) || allDatasetPlaces[3]

    return {
      id: tripId || 'default-itinerary',
      title: 'Hyderabad Heritage & Culture Journey',
      travellers: 2,
      budget: 6500,
      days: [
        {
          day: 1,
          title: 'Charminar to Golconda Heritage Trail',
          totalKm: 14.8,
          stops: [p1, p2],
          lunchStop: 'Paradise Biryani or Nimrah Cafe',
        },
        {
          day: 2,
          title: 'Hussain Sagar & Royal Palaces',
          totalKm: 11.2,
          stops: [p3, p4],
          lunchStop: 'Chutneys Vegetarian Thali',
        },
      ],
      createdAt: new Date().toISOString(),
    }
  }, [tripId])

  const handleCopyShareLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    navigator.clipboard.writeText(url)
    setCopied(true)
    showToast('Shareable trip link copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2400)
  }

  const handleOpenGoogleMaps = (day) => {
    if (!day.stops || day.stops.length === 0) return
    openGoogleMapsMultiStop(day.stops)
  }

  return (
    <div className="trip-viewer-page-shell">
      <SEOHead
        title={`${trip.title} | Explorex Trip Viewer`}
        description={`Explore the day-by-day travel route, verified timings, lunch stops, and budget breakdown for ${trip.title} on Explorex.`}
      />

      <PageHeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Trip Planner', path: '/planner' },
          { label: trip.title },
        ]}
        eyebrow="Shareable Itinerary"
        title={trip.title}
        subtitle={`${trip.days?.length || 1}-Day Proximity-Optimized Route · ${trip.travellers || 1} Travelers · Est. Budget ₹${(trip.budget || 5000).toLocaleString('en-IN')}`}
        badge={
          <div className="trip-share-btn-wrap">
            <button
              type="button"
              className="trip-share-action-btn"
              onClick={handleCopyShareLink}
              title="Copy link to this itinerary"
            >
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>
          </div>
        }
      />

      <div className="trip-viewer-content">
        {/* Day-by-Day Timeline */}
        <div className="trip-timeline-container">
          {trip.days.map((day, idx) => (
            <div key={day.day || idx} className="day-route-card">
              <div className="day-header-band">
                <div className="day-badge">Day {day.day || idx + 1}</div>
                <div className="day-heading-col">
                  <h3>{day.title || `Day ${idx + 1} Exploration`}</h3>
                  <span className="day-metrics">
                    <Car size={13} /> Approx {day.totalKm || 12} km transit distance
                  </span>
                </div>
                <button
                  type="button"
                  className="open-maps-btn"
                  onClick={() => handleOpenGoogleMaps(day)}
                  title="Open this day's route in Google Maps"
                >
                  <Navigation size={14} />
                  <span>Open Route in Google Maps</span>
                </button>
              </div>

              {/* Stops List */}
              <div className="day-stops-list">
                {day.stops.map((stop, sIdx) => {
                  return (
                    <div key={stop.id || sIdx} className="day-stop-row">
                      <div className="stop-marker-col">
                        <span className="stop-number">{sIdx + 1}</span>
                        {sIdx < day.stops.length - 1 && <span className="stop-line" />}
                      </div>

                      <div
                        className="stop-details-card"
                        onClick={() => onNavigate?.(`/explore/${stop.id}`)}
                      >
                        <div className="stop-thumb">
                          <SafeImage
                            src={stop.image}
                            category={stop.category}
                            alt={stop.name}
                          />
                        </div>
                        <div className="stop-info">
                          <h4>{stop.name}</h4>
                          <span className="stop-loc">
                            <MapPin size={11} /> {stop.city}, {stop.state}
                          </span>
                          <p className="stop-desc">
                            {stop.category} · {stop.opening_hours || 'Open daily for visitors'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Lunch Midpoint Recommendation */}
                {day.lunchStop && (
                  <div className="lunch-midpoint-box">
                    <Utensils size={16} color="#C9A227" />
                    <div>
                      <strong>Recommended Lunch Midpoint:</strong>
                      <span>{day.lunchStop}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Actions */}
        <div className="trip-footer-actions">
          <button
            type="button"
            className="btn-edit-planner"
            onClick={() => onNavigate?.('/planner')}
          >
            <Compass size={15} />
            <span>Customize in Trip Planner</span>
          </button>
          <button
            type="button"
            className="btn-ask-ai"
            onClick={() => onNavigate?.('/ai')}
          >
            <Sparkles size={15} />
            <span>Ask AI to Refine Route</span>
          </button>
        </div>
      </div>
    </div>
  )
}

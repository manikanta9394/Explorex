import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Compass, Footprints, Locate, MapPin, Navigation, RotateCcw, Search, X } from 'lucide-react'
import RouteMap from './RouteMap'
import { fetchRoute, geocodeAddress } from '../services/api'

import { useTravelMode } from '../context/useTravelMode'
import TravelModeSegmentedControl from './TravelModeSegmentedControl'

const DEFAULT_START = {
  name: 'Charminar, Hyderabad',
  coordinates: [78.4747, 17.3616], // [lng, lat]
}

export default function DirectionsModal({ isOpen, onClose, destination }) {
  const [startPoint, setStartPoint] = useState(DEFAULT_START)
  const [geoStatus, setGeoStatus] = useState('idle') // 'detecting' | 'success' | 'denied' | 'idle'
  const { travelMode, setTravelMode } = useTravelMode()
  const [routeData, setRouteData] = useState(null)
  const [loadingRoute, setLoadingRoute] = useState(false)
  const [routeError, setRouteError] = useState(null)
  const [showSteps, setShowSteps] = useState(true)

  // Search input state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  // Extract destination coordinates [lng, lat]
  const destCoords = useMemo(() => {
    return destination?.position
      ? [destination.position[1], destination.position[0]]
      : destination?.location?.coordinates || [78.4747, 17.3616]
  }, [destination])
  const destName = destination?.name || 'Destination'
  const destAddress = destination?.location?.address || destination?.detail || 'Hyderabad, Telangana'

  // Request user current location on modal open
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!isMounted) return
          const coords = [pos.coords.longitude, pos.coords.latitude]
          setStartPoint({
            name: 'My Current Location',
            coordinates: coords,
          })
          setGeoStatus('success')
        },
        (err) => {
          if (!isMounted) return
          console.warn('Geolocation error or permission denied:', err.message)
          setGeoStatus('denied')
          setStartPoint(DEFAULT_START)
        },
        { timeout: 8000, enableHighAccuracy: true }
      )
    } else {
      queueMicrotask(() => {
        if (isMounted) setGeoStatus('denied')
      })
    }

    return () => {
      isMounted = false
    }
  }, [isOpen])

  // Re-fetch route whenever startPoint, destCoords, or travelMode changes
  useEffect(() => {
    if (!isOpen || !startPoint?.coordinates) return

    let cancelled = false
    const loadRoute = async () => {
      setLoadingRoute(true)
      setRouteError(null)
      try {
        const data = await fetchRoute(startPoint.coordinates, destCoords, travelMode)
        if (cancelled) return
        if (data?.error) {
          setRouteError(data.error)
          setRouteData(null)
        } else {
          setRouteData(data)
        }
      } catch (err) {
        if (!cancelled) setRouteError(err.message || 'Failed to fetch directions')
      } finally {
        if (!cancelled) setLoadingRoute(false)
      }
    }

    loadRoute()

    return () => {
      cancelled = true
    }
  }, [isOpen, startPoint, destCoords, travelMode])

  if (!isOpen) return null

  // Geocode search for start location
  async function handleSearchStart(e) {
    e.preventDefault()
    if (!searchQuery.trim() || searching) return

    setSearching(true)
    try {
      const res = await geocodeAddress(searchQuery.trim())
      const results = res?.results || res?.data?.results || []
      setSearchResults(results)
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  function selectStartResult(result) {
    setStartPoint({
      name: result.name,
      coordinates: result.coordinates,
    })
    setSearchResults([])
    setSearchQuery('')
  }

  function useCurrentLocationAgain() {
    setGeoStatus('detecting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStartPoint({
          name: 'My Current Location',
          coordinates: [pos.coords.longitude, pos.coords.latitude],
        })
        setGeoStatus('success')
      },
      () => {
        setGeoStatus('denied')
      }
    )
  }

  // Format distance & duration displays
  const distKm = routeData?.distance?.km ?? (routeData?.distanceMeters ? (routeData.distanceMeters / 1000).toFixed(1) : (routeData?.distance || '--'))
  const distMi = routeData?.distance?.mi ?? (distKm !== '--' ? (Number(distKm) * 0.621371).toFixed(1) : '--')
  const durationText = routeData?.duration?.formatted || (routeData?.duration ? `${routeData.duration} min` : '--')
  const routeCoordinates = routeData?.geometry?.coordinates || routeData?.coordinates || []
  const instructions = routeData?.instructions || []

  return (
    <div className="directions-modal-overlay" onClick={onClose}>
      <div className="directions-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="directions-header">
          <div className="header-title-wrap">
            <span className="eyebrow"><Navigation size={13} /> Route directions</span>
            <h2>{destName}</h2>
            <p className="sub-address">{destAddress}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close directions">
            <X size={18} />
          </button>
        </div>

        {/* Responsive 2-Column Desktop Grid */}
        <div className="directions-layout-grid">
          {/* Left Column: Controls, Summary, and Step Instructions */}
          <div className="directions-left-col">
            {/* Start Location & Search Controls */}
            <div className="directions-start-bar">
              <div className="start-location-pill">
                <MapPin size={15} className="start-icon" />
                <span className="start-name">{startPoint.name}</span>
                {geoStatus === 'detecting' && <small className="geo-badge">Locating...</small>}
                {geoStatus === 'success' && <span className="geo-dot" title="Using exact GPS location" />}
              </div>

              <div className="start-actions">
                {geoStatus === 'denied' && (
                  <button className="relocate-btn" onClick={useCurrentLocationAgain} title="Retry GPS location">
                    <Locate size={14} /> GPS
                  </button>
                )}

                <form className="start-search-form" onSubmit={handleSearchStart}>
                  <input
                    type="text"
                    placeholder="Search start location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" disabled={searching || !searchQuery.trim()} aria-label="Search start location">
                    <Search size={14} />
                  </button>
                </form>
              </div>
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <ul className="search-results-dropdown">
                {searchResults.map((item, idx) => (
                  <li key={idx} onClick={() => selectStartResult(item)}>
                    <Compass size={14} />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Travel Mode Segmented Control */}
            <div className="directions-mode-selector">
              <TravelModeSegmentedControl value={travelMode} onChange={setTravelMode} />
            </div>

            {/* Route Summary & State Handling */}
            {loadingRoute ? (
              <div className="route-skeleton-card">
                <div className="skeleton-bar skeleton-title" />
                <div className="skeleton-row">
                  <div className="skeleton-chip" />
                  <div className="skeleton-chip" />
                </div>
              </div>
            ) : routeError ? (
              <div className="route-error-card">
                <div className="error-card-icon">🧭</div>
                <h4>Unable to calculate route</h4>
                <p>{routeError}</p>
                <button className="error-retry-btn" onClick={() => setTravelMode('driving-car')}>
                  <RotateCcw size={14} /> Retry with Driving Mode
                </button>
              </div>
            ) : (
              <div className="directions-summary-bar">
                <div className="stat-block">
                  <small>Est. Duration</small>
                  <strong>{durationText}</strong>
                </div>
                <div className="stat-divider" />
                <div className="stat-block">
                  <small>Distance</small>
                  <strong>{distKm} km <span className="sub-unit">({distMi} mi)</span></strong>
                </div>
                <div className="stat-divider" />
                <div className="stat-block">
                  <small>Route Source</small>
                  <strong className="source-tag">{routeData?.source === 'openrouteservice' ? 'OpenRouteService' : 'Direct Path'}</strong>
                </div>
              </div>
            )}

            {/* Collapsible Step-by-Step Instructions */}
            {!loadingRoute && !routeError && instructions.length > 0 && (
              <div className="directions-steps-collapsible">
                <button
                  className="steps-toggle-btn"
                  onClick={() => setShowSteps(!showSteps)}
                  aria-expanded={showSteps}
                >
                  <span>
                    <Footprints size={15} /> Turn-by-turn directions ({instructions.length} steps)
                  </span>
                  {showSteps ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showSteps && (
                  <ol className="steps-list">
                    {instructions.map((step, idx) => (
                      <li key={idx} className="step-item">
                        <span className="step-number">{idx + 1}</span>
                        <div className="step-copy">
                          <p>{step.instruction}</p>
                          {step.distance > 0 && (
                            <small>{step.distance} m ({Math.round(step.duration)}s)</small>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Responsive Interactive Map Panel */}
          <div className="directions-right-col">
            <div className="directions-map-container">
              <RouteMap
                startCoords={startPoint.coordinates}
                destCoords={destCoords}
                routeCoordinates={routeCoordinates}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Component } from 'react'
import { AlertTriangle, MapPin, Navigation, RotateCcw, Sparkles } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Uncaught error in ${this.props.name || 'ErrorBoundary'}:`, error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.handleReset)
      }
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="error-boundary-fallback">
          <div className="error-card">
            <AlertTriangle size={28} className="error-icon" />
            <h4>Something went wrong</h4>
            <p>We couldn't load directions or details right now.</p>
            <button className="error-reset-btn" onClick={this.handleReset}>
              <RotateCcw size={14} /> Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Scoped Error Boundary for Maps (TourMap, AllPlacesMap, RouteMap)
 */
export class MapErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Map ErrorBoundary caught error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="map-error-fallback"
          style={{
            minHeight: this.props.minHeight || '360px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(31, 58, 46, 0.04)',
            borderRadius: '18px',
            border: '1px dashed #c0b8aa',
            padding: '24px',
            textAlign: 'center',
            gap: '12px',
          }}
        >
          <MapPin size={32} color="#C9682D" />
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1F3A2E' }}>
            Map Temporarily Unavailable
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#666', maxWidth: '380px' }}>
            We encountered an issue rendering the interactive map canvas. You can still browse all destinations and get directions directly.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: '#1F3A2E',
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '4px',
            }}
          >
            <RotateCcw size={14} /> Retry Map
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Scoped Error Boundary for Directions & Routing
 */
export class DirectionsErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Directions ErrorBoundary caught error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="directions-error-fallback"
          style={{
            padding: '20px',
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e8e3d8',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Navigation size={28} color="#C9682D" />
          <h4 style={{ margin: 0, fontSize: '15px', color: '#1F3A2E' }}>Route calculation unavailable</h4>
          <p style={{ margin: 0, fontSize: '12px', color: '#666', maxWidth: '300px' }}>
            Unable to calculate route preview. You can still navigate directly with Google Maps.
          </p>
          {this.props.onOpenGoogleMaps && (
            <button
              onClick={this.props.onOpenGoogleMaps}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: '#1F3A2E',
                color: '#ffffff',
                border: 'none',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Navigation size={13} /> Open in Google Maps
            </button>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Scoped Error Boundary for Distance Badges
 */
export class DistanceBadgeErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.warn('DistanceBadge ErrorBoundary caught error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <span className="travel-time-chip travel-time-unavailable">
          {this.props.modeEmoji || '🚗'} Distance unavailable
        </span>
      )
    }

    return this.props.children
  }
}

/**
 * Scoped Error Boundary for AI Travel Chat
 */
export class AIChatErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('AIChat ErrorBoundary caught error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="place-ai" id="ask">
          <div className="place-ai-copy">
            <span className="eyebrow light"><Sparkles size={14} /> Explorex Intelligence</span>
            <h2>Travel Guide<br /><em>Assistant.</em></h2>
            <p>Our intelligent Hyderabad travel assistant is temporarily reloading.</p>
          </div>
          <div
            className="place-ai-box neat-chat-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '36px 24px',
              textAlign: 'center',
            }}
          >
            <div style={{ maxWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={32} color="#C9A227" />
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1F3A2E' }}>
                Chat Assistant Unavailable
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                We encountered an issue rendering the conversation. You can reset the assistant to continue asking questions.
              </p>
              <button
                onClick={this.handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  background: '#1F3A2E',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '6px',
                }}
              >
                <RotateCcw size={14} /> Reset Assistant
              </button>
            </div>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}

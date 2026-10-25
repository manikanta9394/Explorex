import React, { Component } from 'react'
import {
  AlertTriangle,
  MapPin,
  Navigation,
  RotateCcw,
  Sparkles,
  CloudOff,
  CalendarOff,
  MessageSquare,
  PhoneCall,
  Activity,
  Home,
  RefreshCw,
} from 'lucide-react'
import { Sentry } from '../services/sentry.js'

/**
 * Base Error Boundary providing route change resets and Sentry telemetry
 */
export class BaseErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', this.handleRouteChange)
      window.addEventListener('hashchange', this.handleRouteChange)
      window.addEventListener('explorex:routechange', this.handleRouteChange)
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('popstate', this.handleRouteChange)
      window.removeEventListener('hashchange', this.handleRouteChange)
      window.removeEventListener('explorex:routechange', this.handleRouteChange)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.resetKey !== undefined && prevProps.resetKey !== this.props.resetKey) {
      if (this.state.hasError) {
        this.handleReset()
      }
    }
  }

  handleRouteChange = () => {
    if (this.state.hasError) {
      this.handleReset()
    }
  }

  componentDidCatch(error, errorInfo) {
    const componentName = this.props.name || this.constructor.name || 'ErrorBoundary'
    console.error(`Uncaught error in ${componentName}:`, error, errorInfo)
    Sentry.captureException(error, { component: componentName, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }
}

/**
 * App-level root Error Boundary (Last resort fallback)
 * Offers generic message, "Reload", and "Go to Home"
 */
export default class RootErrorBoundary extends BaseErrorBoundary {
  handleGoHome = () => {
    if (typeof this.props.onNavigate === 'function') {
      this.props.onNavigate('/')
      this.handleReset()
    } else if (typeof window !== 'undefined') {
      const base = import.meta.env?.BASE_URL || '/Explorex/'
      window.location.href = base.endsWith('/') ? base : `${base}/`
    }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.handleReset)
      }
      if (this.props.fallback) {
        return this.props.fallback
      }

      return React.createElement(
        'div',
        { className: 'error-boundary-fallback' },
        React.createElement(
          'div',
          { className: 'error-card' },
          React.createElement(AlertTriangle, { size: 32, className: 'error-icon' }),
          React.createElement('h4', null, 'Something went wrong on this page'),
          React.createElement(
            'p',
            null,
            'An unexpected error occurred while rendering this page. You can reload the view, return to the home page, or try again.'
          ),
          React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: '12px',
              },
            },
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'error-reset-btn',
                onClick: this.handleReload,
                style: { display: 'inline-flex', alignItems: 'center', gap: '6px' },
              },
              React.createElement(RefreshCw, { size: 14 }),
              ' Reload'
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'error-reset-btn',
                onClick: this.handleGoHome,
                style: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#3D5245' },
              },
              React.createElement(Home, { size: 14 }),
              ' Go to Home'
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'error-reset-btn',
                onClick: this.handleReset,
                style: {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  color: '#1F3A2E',
                  border: '1px solid #1F3A2E',
                },
              },
              React.createElement(RotateCcw, { size: 14 }),
              ' Try again'
            )
          )
        )
      )
    }

    return this.props.children
  }
}

/**
 * Scoped Error Boundary for Directions & Routing
 * "We couldn't load directions or details" appears ONLY here.
 */
export class DirectionsErrorBoundary extends BaseErrorBoundary {
  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        {
          className: 'directions-error-fallback',
          style: {
            padding: '20px',
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e8e3d8',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          },
        },
        React.createElement(Navigation, { size: 28, color: '#C9682D' }),
        React.createElement(
          'h4',
          { style: { margin: 0, fontSize: '15px', color: '#1F3A2E', fontWeight: 600 } },
          "We couldn't load directions or details"
        ),
        React.createElement(
          'p',
          { style: { margin: 0, fontSize: '12px', color: '#666', maxWidth: '300px' } },
          'Unable to calculate route or fetch directions right now. You can try again or open directly in Google Maps.'
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' } },
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: this.handleReset,
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                background: '#1F3A2E',
                color: '#ffffff',
                border: 'none',
                borderRadius: '18px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              },
            },
            React.createElement(RotateCcw, { size: 12 }),
            ' Try again'
          ),
          this.props.onOpenGoogleMaps &&
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: this.props.onOpenGoogleMaps,
                style: {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  background: '#F0ECE1',
                  color: '#1F3A2E',
                  border: '1px solid #dcd5c7',
                  borderRadius: '18px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                },
              },
              React.createElement(Navigation, { size: 12 }),
              ' Open in Google Maps'
            )
        )
      )
    }

    return this.props.children
  }
}

/**
 * Scoped Error Boundary for Weather Badge
 * Tiny inline fallback with "Try again", leaves parent card completely intact.
 */
export class WeatherErrorBoundary extends BaseErrorBoundary {
  render() {
    if (this.state.hasError) {
      return React.createElement(
        'span',
        {
          className: 'weather-error-badge-fallback',
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: '12px',
            background: 'rgba(201, 104, 45, 0.08)',
            color: '#8C4217',
            border: '1px solid rgba(201, 104, 45, 0.25)',
            fontFamily: 'inherit',
          },
          title: 'Weather data unavailable',
        },
        React.createElement(CloudOff, { size: 12 }),
        React.createElement('span', null, 'Weather unavailable'),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: this.handleReset,
            style: {
              background: 'none',
              border: 'none',
              color: '#8C4217',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              padding: '0 2px',
              fontSize: '11px',
              fontWeight: 600,
              textDecoration: 'underline',
            },
          },
          React.createElement(RotateCcw, { size: 10 }),
          ' Try again'
        )
      )
    }

    return this.props.children
  }
}

/**
 * Scoped Error Boundary for Maps (TourMap, AllPlacesMap, RouteMap, MapPage)
 */
export class MapErrorBoundary extends BaseErrorBoundary {
  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        {
          className: 'map-error-fallback',
          style: {
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
          },
        },
        React.createElement(MapPin, { size: 32, color: '#C9682D' }),
        React.createElement(
          'h4',
          { style: { margin: 0, fontSize: '16px', fontWeight: 600, color: '#1F3A2E' } },
          'Map preview unavailable'
        ),
        React.createElement(
          'p',
          { style: { margin: 0, fontSize: '13px', color: '#666', maxWidth: '380px' } },
          'We encountered an issue rendering the interactive map canvas. You can still browse all destinations and view directions directly.'
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: this.handleReset,
            style: {
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
            },
          },
          React.createElement(RotateCcw, { size: 14 }),
          ' Try again'
        )
      )
    }

    return this.props.children
  }
}

/**
 * Scoped Error Boundary for Distance Badges
 */
export class DistanceBadgeErrorBoundary extends BaseErrorBoundary {
  render() {
    if (this.state.hasError) {
      return React.createElement(
        'span',
        {
          className: 'travel-time-chip travel-time-unavailable',
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
          },
        },
        `${this.props.modeEmoji || '🚗'} Distance unavailable`,
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: this.handleReset,
            style: {
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              padding: '0 2px',
              fontSize: '10.5px',
              fontWeight: 600,
              textDecoration: 'underline',
            },
            title: 'Try again',
          },
          React.createElement(RotateCcw, { size: 10 }),
          ' Try again'
        )
      )
    }

    return this.props.children
  }
}

/**
 * Scoped Error Boundary for AI Travel Chat
 */
export class AIChatErrorBoundary extends BaseErrorBoundary {
  render() {
    if (this.state.hasError) {
      return React.createElement(
        'section',
        { className: 'place-ai', id: 'ask' },
        React.createElement(
          'div',
          { className: 'place-ai-copy' },
          React.createElement(
            'span',
            { className: 'eyebrow light' },
            React.createElement(Sparkles, { size: 14 }),
            ' Explorex Intelligence'
          ),
          React.createElement('h2', null, 'Travel Guide', React.createElement('br'), React.createElement('em', null, 'Assistant.')),
          React.createElement('p', null, 'Our intelligent cultural travel assistant is temporarily reloading.')
        ),
        React.createElement(
          'div',
          {
            className: 'place-ai-box neat-chat-card',
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '36px 24px',
              textAlign: 'center',
            },
          },
          React.createElement(
            'div',
            { style: { maxWidth: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' } },
            React.createElement(Sparkles, { size: 32, color: '#C9A227' }),
            React.createElement(
              'h4',
              { style: { margin: 0, fontSize: '16px', fontWeight: 600, color: '#1F3A2E' } },
              'Travel assistant unavailable'
            ),
            React.createElement(
              'p',
              { style: { margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.5 } },
              'We encountered an issue rendering the conversation. You can retry the assistant to continue asking questions.'
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: this.handleReset,
                style: {
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
                },
              },
              React.createElement(RotateCcw, { size: 14 }),
              ' Try again'
            )
          )
        )
      )
    }

    return this.props.children
  }
}

/**
 * Scoped Error Boundary for Festival Cards
 */
export class FestivalCardErrorBoundary extends BaseErrorBoundary {
  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        {
          className: 'festival-card-error-fallback',
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '180px',
            padding: '20px',
            background: 'rgba(31, 58, 46, 0.03)',
            borderRadius: '16px',
            border: '1px dashed #d1c8b8',
            textAlign: 'center',
            gap: '8px',
          },
        },
        React.createElement(CalendarOff, { size: 26, color: '#C9682D' }),
        React.createElement(
          'h5',
          { style: { margin: 0, fontSize: '13px', fontWeight: 600, color: '#1F3A2E' } },
          'Festival information unavailable'
        ),
        React.createElement('p', { style: { margin: 0, fontSize: '11px', color: '#666' } }, 'Unable to display this celebration card.'),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: this.handleReset,
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 14px',
              background: '#1F3A2E',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '4px',
            },
          },
          React.createElement(RotateCcw, { size: 11 }),
          ' Try again'
        )
      )
    }

    return this.props.children
  }
}

/**
 * Scoped Error Boundary for Feedback Drawer
 */
export class FeedbackDrawerErrorBoundary extends BaseErrorBoundary {
  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        {
          className: 'feedback-drawer-error-fallback',
          style: {
            padding: '28px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #dcd5c7',
          },
        },
        React.createElement(MessageSquare, { size: 28, color: '#C9682D' }),
        React.createElement(
          'h4',
          { style: { margin: 0, fontSize: '15px', color: '#1F3A2E', fontWeight: 600 } },
          'Feedback drawer unavailable'
        ),
        React.createElement(
          'p',
          { style: { margin: 0, fontSize: '12px', color: '#666', maxWidth: '300px' } },
          "We couldn't display the feedback panel right now."
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: this.handleReset,
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: '#1F3A2E',
              color: '#ffffff',
              border: 'none',
              borderRadius: '18px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '4px',
            },
          },
          React.createElement(RotateCcw, { size: 12 }),
          ' Try again'
        )
      )
    }

    return this.props.children
  }
}

/**
 * Scoped Error Boundary for SOS & Emergency Helplines Popup
 */
export class SOSPopupErrorBoundary extends BaseErrorBoundary {
  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        {
          className: 'sos-popup-error-fallback',
          style: {
            padding: '30px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            background: '#ffffff',
            borderRadius: '20px',
          },
        },
        React.createElement(AlertTriangle, { size: 32, color: '#DC2626' }),
        React.createElement(
          'h3',
          { style: { margin: 0, fontSize: '17px', color: '#1F3A2E', fontWeight: 700 } },
          'Emergency helpline panel unavailable'
        ),
        React.createElement(
          'p',
          { style: { margin: 0, fontSize: '13px', color: '#666', maxWidth: '360px', lineHeight: 1.5 } },
          'For immediate life-threatening assistance or emergency response, please dial direct numbers:'
        ),
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              margin: '8px 0',
            },
          },
          React.createElement(
            'a',
            {
              href: 'tel:112',
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: '#DC2626',
                color: '#ffffff',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
              },
            },
            React.createElement(PhoneCall, { size: 13 }),
            ' Dial 112 (National SOS)'
          ),
          React.createElement(
            'a',
            {
              href: 'tel:100',
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: '#1F3A2E',
                color: '#ffffff',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
              },
            },
            '👮 Dial 100 (Police)'
          ),
          React.createElement(
            'a',
            {
              href: 'tel:108',
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: '#047857',
                color: '#ffffff',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
              },
            },
            '🚑 Dial 108 (Ambulance)'
          )
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: this.handleReset,
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: '#F0ECE1',
              color: '#1F3A2E',
              border: '1px solid #dcd5c7',
              borderRadius: '18px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '4px',
            },
          },
          React.createElement(RotateCcw, { size: 12 }),
          ' Try again'
        )
      )
    }

    return this.props.children
  }
}
export const SOSElementErrorBoundary = SOSPopupErrorBoundary

/**
 * Scoped Error Boundary for Admin Dashboard & Panel Widgets
 */
export class AdminWidgetErrorBoundary extends BaseErrorBoundary {
  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        {
          className: 'admin-widget-error-fallback',
          style: {
            padding: '20px',
            background: 'var(--adm-surface, #ffffff)',
            border: '1px dashed var(--adm-border, #e2e8f0)',
            borderRadius: '12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: this.props.minHeight || '110px',
            gap: '8px',
          },
        },
        React.createElement(Activity, { size: 20, color: '#DC2626' }),
        React.createElement(
          'span',
          { style: { fontSize: '13px', fontWeight: 600, color: 'var(--adm-text, #1e293b)' } },
          'Widget data unavailable'
        ),
        React.createElement(
          'p',
          { style: { margin: 0, fontSize: '11px', color: 'var(--adm-text-muted, #64748b)' } },
          'An error occurred while loading this metric widget.'
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: this.handleReset,
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              background: 'var(--adm-accent, #1F3A2E)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '4px',
            },
          },
          React.createElement(RotateCcw, { size: 11 }),
          ' Try again'
        )
      )
    }

    return this.props.children
  }
}

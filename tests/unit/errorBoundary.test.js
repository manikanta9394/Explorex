import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import RootErrorBoundary, {
  DirectionsErrorBoundary,
  WeatherErrorBoundary,
  MapErrorBoundary,
  DistanceBadgeErrorBoundary,
  AIChatErrorBoundary,
  FestivalCardErrorBoundary,
  FeedbackDrawerErrorBoundary,
  SOSPopupErrorBoundary,
  AdminWidgetErrorBoundary,
} from '../../src/components/ErrorBoundary.js'
import { Sentry } from '../../src/services/sentry.js'

describe('Error Boundaries Suite', () => {
  it('RootErrorBoundary displays generic message with Reload and Go to Home, NOT directions message', () => {
    const boundary = new RootErrorBoundary({})
    boundary.state = { hasError: true, error: new Error('Critical root error') }

    const html = renderToStaticMarkup(boundary.render())
    assert.match(html, /Something went wrong on this page/)
    assert.match(html, /Reload/)
    assert.match(html, /Go to Home/)
    assert.match(html, /Try again/)
    assert.doesNotMatch(html, /We couldn't load directions or details/)
  })

  it('DirectionsErrorBoundary exclusively displays the directions and details error message', () => {
    const boundary = new DirectionsErrorBoundary({})
    boundary.state = { hasError: true, error: new Error('Routing geometry error') }

    const html = renderToStaticMarkup(boundary.render())
    assert.match(html, /We couldn(?:'|&#x27;)t load directions or details/)
    assert.match(html, /Try again/)
    assert.doesNotMatch(html, /Something went wrong on this page/)
  })

  it('WeatherErrorBoundary renders compact inline fallback with Try again', () => {
    const boundary = new WeatherErrorBoundary({})
    boundary.state = { hasError: true, error: new Error('Weather API timeout') }

    const html = renderToStaticMarkup(boundary.render())
    assert.match(html, /Weather unavailable/)
    assert.match(html, /Try again/)
    assert.match(html, /weather-error-badge-fallback/)
  })

  it('MapErrorBoundary renders scoped map preview unavailable message with Try again', () => {
    const boundary = new MapErrorBoundary({ minHeight: '400px' })
    boundary.state = { hasError: true, error: new Error('WebGL context lost') }

    const html = renderToStaticMarkup(boundary.render())
    assert.match(html, /Map preview unavailable/)
    assert.match(html, /Try again/)
  })

  it('DistanceBadgeErrorBoundary renders inline chip with Try again', () => {
    const boundary = new DistanceBadgeErrorBoundary({ modeEmoji: '🚕' })
    boundary.state = { hasError: true, error: new Error('Matrix calculation failed') }

    const html = renderToStaticMarkup(boundary.render())
    assert.match(html, /Distance unavailable/)
    assert.match(html, /Try again/)
    assert.match(html, /🚕/)
  })

  it('AIChatErrorBoundary renders inline travel assistant fallback with Try again', () => {
    const boundary = new AIChatErrorBoundary({})
    boundary.state = { hasError: true, error: new Error('Stream token parse error') }

    const html = renderToStaticMarkup(boundary.render())
    assert.match(html, /Travel assistant unavailable/)
    assert.match(html, /Try again/)
  })

  it('FestivalCardErrorBoundary renders scoped festival card fallback with Try again', () => {
    const boundary = new FestivalCardErrorBoundary({})
    boundary.state = { hasError: true, error: new Error('Festival card asset missing') }

    const html = renderToStaticMarkup(boundary.render())
    assert.match(html, /Festival information unavailable/)
    assert.match(html, /Try again/)
  })

  it('FeedbackDrawerErrorBoundary renders inline drawer fallback with Try again', () => {
    const boundary = new FeedbackDrawerErrorBoundary({})
    boundary.state = { hasError: true, error: new Error('Feedback service error') }

    const html = renderToStaticMarkup(boundary.render())
    assert.match(html, /Feedback drawer unavailable/)
    assert.match(html, /Try again/)
  })

  it('SOSPopupErrorBoundary renders emergency fallback with direct dial numbers and Try again', () => {
    const boundary = new SOSPopupErrorBoundary({})
    boundary.state = { hasError: true, error: new Error('SOS geolocation unavailable') }

    const html = renderToStaticMarkup(boundary.render())
    assert.match(html, /Emergency helpline panel unavailable/)
    assert.match(html, /Dial 112/)
    assert.match(html, /Dial 100/)
    assert.match(html, /Dial 108/)
    assert.match(html, /Try again/)
  })

  it('AdminWidgetErrorBoundary renders scoped widget fallback with Try again', () => {
    const boundary = new AdminWidgetErrorBoundary({ name: 'AdminKpiTotalUsers' })
    boundary.state = { hasError: true, error: new Error('KPI aggregation error') }

    const html = renderToStaticMarkup(boundary.render())
    assert.match(html, /Widget data unavailable/)
    assert.match(html, /Try again/)
  })

  it('clears error state when route change is triggered or resetKey changes', () => {
    const boundary = new AdminWidgetErrorBoundary({ resetKey: '/admin/places' })
    boundary.state = { hasError: true, error: new Error('Query error') }
    boundary.setState = (update) => {
      boundary.state = { ...boundary.state, ...update }
    }

    // Simulate route change event
    boundary.handleRouteChange()
    assert.equal(boundary.state.hasError, false)
    assert.equal(boundary.state.error, null)

    // Set error again
    boundary.state = { hasError: true, error: new Error('Another error') }
    // Simulate resetKey update
    boundary.componentDidUpdate({ resetKey: '/admin/dashboard' })
    assert.equal(boundary.state.hasError, false)
    assert.equal(boundary.state.error, null)
  })

  it('records component name to Sentry upon componentDidCatch without crashing', () => {
    Sentry.clearErrorGroups()
    const boundary = new AdminWidgetErrorBoundary({ name: 'AdminKpiSavedPlaces' })
    const testError = new Error('Widget calculation failed')

    boundary.componentDidCatch(testError, { componentStack: 'in AdminKpiSavedPlaces' })

    const groups = Sentry.getErrorGroups()
    const match = groups.find((g) => g.component === 'AdminKpiSavedPlaces')
    assert.ok(match, 'Expected Sentry group to record AdminKpiSavedPlaces')
    assert.equal(match.count, 1)
  })
})

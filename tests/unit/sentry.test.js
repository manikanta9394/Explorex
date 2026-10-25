import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SentryClient } from '../../src/services/sentry.js'

describe('Sentry Observability & Deduplication Suite', () => {
  it('attaches route and component name to captured exceptions', () => {
    const client = new SentryClient()
    const payload = client.captureException(new Error('Sample test crash'), {
      component: 'TourMap',
      route: '/explore/charminar',
    })

    assert.equal(payload.component, 'TourMap')
    assert.equal(payload.route, '/explore/charminar')
    assert.equal(payload.name, 'Error')
    assert.equal(payload.message, 'Sample test crash')
    assert.equal(payload.count, 1)
    assert.equal(payload.suppressed, false)
  })

  it('groups duplicate errors and suppresses spam in loops', () => {
    const client = new SentryClient({ suppressionWindowMs: 5000 })
    const err = new TypeError('Cannot read properties of undefined')

    // First occurrence
    const p1 = client.captureException(err, { component: 'WeatherBadge', route: '/explore' })
    assert.equal(p1.count, 1)
    assert.equal(p1.suppressed, false)

    // Second occurrence immediately after (render loop)
    const p2 = client.captureException(err, { component: 'WeatherBadge', route: '/explore' })
    assert.equal(p2.count, 2)
    assert.equal(p2.suppressed, true, 'Subsequent identical error within window must be suppressed')

    // Third occurrence
    const p3 = client.captureException(err, { component: 'WeatherBadge', route: '/explore' })
    assert.equal(p3.count, 3)
    assert.equal(p3.suppressed, true)

    // Check tracked error groups
    const groups = client.getErrorGroups()
    assert.equal(groups.length, 1)
    assert.equal(groups[0].count, 3)
    assert.equal(groups[0].component, 'WeatherBadge')
  })

  it('distinguishes errors from different components or routes', () => {
    const client = new SentryClient()
    const err = new Error('Database read failed')

    client.captureException(err, { component: 'AdminKpiWidget', route: '/admin' })
    client.captureException(err, { component: 'FestivalCard', route: '/festivals' })

    const groups = client.getErrorGroups()
    assert.equal(groups.length, 2, 'Errors from distinct components should form separate groups')
  })
})

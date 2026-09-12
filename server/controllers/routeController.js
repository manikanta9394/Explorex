import { fetchMatrix, fetchRouteDirections, geocodeSearch } from '../services/orsService.js'

export async function getRoute(req, res) {
  try {
    const start = req.body?.start ?? req.query?.start
    const end = req.body?.end ?? req.query?.end
    const profile = req.body?.profile ?? req.query?.profile

    const routeData = await fetchRouteDirections({
      start,
      end,
      profile,
    })

    res.json({
      success: true,
      data: routeData,
    })
  } catch (error) {
    const statusCode = error.statusCode || 500
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to compute route directions',
    })
  }
}

export async function geocode(req, res) {
  try {
    const text = req.query?.text ?? req.body?.text
    const limit = Number(req.query?.limit ?? req.body?.limit ?? 5)

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter text is required',
      })
    }

    const result = await geocodeSearch({ text, limit })
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    const statusCode = error.statusCode || 500
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Geocoding search failed',
    })
  }
}

export async function getMatrix(req, res) {
  try {
    const { locations, sources, destinations, profile } = req.body || {}

    if (!Array.isArray(locations) || locations.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'locations array with at least 2 coordinate pairs is required',
      })
    }

    const result = await fetchMatrix({ locations, sources, destinations, profile })
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    const statusCode = error.statusCode || 500
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to compute matrix distances',
    })
  }
}

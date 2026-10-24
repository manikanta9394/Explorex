import mongoose from 'mongoose'
import { Place } from '../models/placeModel.js'
import { enrichedPlaces } from '../data/tourismData.js'

export async function getPlaces(req, res) {
  const { category, search, limit = 50 } = req.query

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {}
      if (category) filter.category = new RegExp(escapeRegex(category), 'i')
      if (search) filter.$text = { $search: search }

      const places = await Place.find(filter)
        .sort({ rating: -1 })
        .limit(Math.min(Number(limit) || 50, 100))
        .lean()
      if (places.length > 0) {
        return res.json({ data: places, count: places.length })
      }
    } catch {
      // Fall through to in-memory fallback
    }
  }

  // Resilient dataset fallback
  let filtered = [...enrichedPlaces]
  if (category) {
    filtered = filtered.filter((p) =>
      p.category?.toLowerCase().includes(category.toLowerCase())
    )
  }
  if (search) {
    const s = search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name?.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s) ||
        p.category?.toLowerCase().includes(s)
    )
  }

  const finalPlaces = filtered.slice(0, Math.min(Number(limit) || 50, 100))
  res.json({ data: finalPlaces, count: finalPlaces.length })
}

export async function getPlaceById(req, res) {
  const id = req.params.id
  if (mongoose.connection.readyState === 1) {
    try {
      const place = await Place.findById(id).lean()
      if (place) return res.json({ data: place })
    } catch {
      // Fall through
    }
  }

  const place = enrichedPlaces.find((p) => p.id === id)
  if (!place) return res.status(404).json({ error: 'Place not found' })
  res.json({ data: place })
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')
}

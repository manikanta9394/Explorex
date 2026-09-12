import { Place } from '../models/placeModel.js'

export async function getPlaces(req, res) {
  const { city, category, search, limit = 50 } = req.query
  const filter = {}
  if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, 'i')
  if (category) filter.category = new RegExp(escapeRegex(category), 'i')
  if (search) filter.$text = { $search: search }

  const places = await Place.find(filter).sort({ rating: -1 }).limit(Math.min(Number(limit) || 50, 100)).lean()
  res.json({ data: places, count: places.length })
}

export async function getPlaceById(req, res) {
  const place = await Place.findById(req.params.id).lean()
  if (!place) return res.status(404).json({ error: 'Place not found' })
  res.json({ data: place })
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')
}

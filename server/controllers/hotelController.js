import { Hotel } from '../models/hotelModel.js'

export async function getHotels(req, res) {
  const { city, minRating, limit = 50 } = req.query
  const filter = {}
  if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, 'i')
  if (minRating) filter.rating = { $gte: Number(minRating) }

  const hotels = await Hotel.find(filter).sort({ rating: -1 }).limit(Math.min(Number(limit) || 50, 100)).lean()
  res.json({ data: hotels, count: hotels.length })
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')
}

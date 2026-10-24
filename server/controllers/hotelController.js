import mongoose from 'mongoose'
import { Hotel } from '../models/hotelModel.js'
import { enrichedHotels } from '../data/tourismData.js'

export async function getHotels(req, res) {
  const { minRating, limit = 50 } = req.query

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {}
      if (minRating) filter.rating = { $gte: Number(minRating) }

      const hotels = await Hotel.find(filter)
        .sort({ rating: -1 })
        .limit(Math.min(Number(limit) || 50, 100))
        .lean()
      if (hotels.length > 0) {
        return res.json({ data: hotels, count: hotels.length })
      }
    } catch {
      // Fall through to in-memory fallback
    }
  }

  let filtered = [...enrichedHotels]
  if (minRating) {
    filtered = filtered.filter((h) => Number(h.rating) >= Number(minRating))
  }

  const finalHotels = filtered.slice(0, Math.min(Number(limit) || 50, 100))
  res.json({ data: finalHotels, count: finalHotels.length })
}

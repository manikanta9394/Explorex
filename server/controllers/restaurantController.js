import mongoose from 'mongoose'
import { Restaurant } from '../models/restaurantModel.js'
import { enrichedRestaurants } from '../data/tourismData.js'

export async function getRestaurants(req, res) {
  const { minRating, limit = 50 } = req.query

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {}
      if (minRating) filter.rating = { $gte: Number(minRating) }

      const restaurants = await Restaurant.find(filter)
        .sort({ rating: -1 })
        .limit(Math.min(Number(limit) || 50, 100))
        .lean()
      if (restaurants.length > 0) {
        return res.json({ data: restaurants, count: restaurants.length })
      }
    } catch {
      // Fall through to in-memory fallback
    }
  }

  let filtered = [...enrichedRestaurants]
  if (minRating) {
    filtered = filtered.filter((r) => Number(r.rating) >= Number(minRating))
  }

  const finalRestaurants = filtered.slice(0, Math.min(Number(limit) || 50, 100))
  res.json({ data: finalRestaurants, count: finalRestaurants.length })
}

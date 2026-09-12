import { Restaurant } from '../models/restaurantModel.js'

export async function getRestaurants(req, res) {
  const { city, cuisine, minRating, limit = 50 } = req.query
  const filter = {}
  if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, 'i')
  if (cuisine) filter.cuisine = new RegExp(escapeRegex(cuisine), 'i')
  if (minRating) filter.rating = { $gte: Number(minRating) }

  const restaurants = await Restaurant.find(filter).sort({ rating: -1 }).limit(Math.min(Number(limit) || 50, 100)).lean()
  res.json({ data: restaurants, count: restaurants.length })
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')
}

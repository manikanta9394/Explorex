import mongoose from 'mongoose'

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  cuisine: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  priceLevel: { type: String, enum: ['$', '$$', '$$$', '$$$$'], default: '$$' },
  rating: { type: Number, required: true, min: 0, max: 5 },
  openingHours: { type: String, required: true },
  location: { type: [Number], required: true },
}, { timestamps: true })

restaurantSchema.index({ city: 1, rating: -1 })

export const Restaurant = mongoose.model('Restaurant', restaurantSchema)

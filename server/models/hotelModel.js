import mongoose from 'mongoose'

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  pricePerNight: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  rating: { type: Number, required: true, min: 0, max: 5 },
  amenities: [{ type: String, trim: true }],
  location: { type: [Number], required: true },
}, { timestamps: true })

hotelSchema.index({ city: 1, rating: -1 })

export const Hotel = mongoose.model('Hotel', hotelSchema)

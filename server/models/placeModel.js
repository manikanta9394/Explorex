import mongoose from 'mongoose'

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  openingHours: { type: String, required: true },
  estimatedVisitDuration: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    coordinates: { type: [Number], required: true },
  },
}, { timestamps: true })

placeSchema.index({ name: 'text', city: 'text', country: 'text', category: 'text' })

export const Place = mongoose.model('Place', placeSchema)

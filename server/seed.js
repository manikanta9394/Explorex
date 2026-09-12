import mongoose from 'mongoose'
import { connectDatabase, disconnectDatabase } from './config/db.js'
import { Place } from './models/placeModel.js'
import { Hotel } from './models/hotelModel.js'
import { Restaurant } from './models/restaurantModel.js'
import { hotels, places, restaurants } from './data/tourismData.js'

async function seed() {
  await connectDatabase()
  await Promise.all([Place.deleteMany({}), Hotel.deleteMany({}), Restaurant.deleteMany({})])
  await Promise.all([Place.insertMany(places), Hotel.insertMany(hotels), Restaurant.insertMany(restaurants)])
  console.log('TourMate sample data seeded')
}

try {
  await seed()
} catch (error) {
  console.error('Seed failed:', error.message)
  process.exitCode = 1
} finally {
  await disconnectDatabase()
  await mongoose.connection.close()
}

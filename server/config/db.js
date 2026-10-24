import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDatabase() {
  if (process.env.ENABLE_MONGO !== 'true') {
    // By default, use fast local JSON storage engine for 100% reliable zero-dependency operation
    return Promise.resolve()
  }

  mongoose.connection.on('connected', () => console.log('MongoDB connected'))
  mongoose.connection.on('error', (error) => console.error('MongoDB error:', error.message))
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 1500 })
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}

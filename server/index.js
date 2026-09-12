import app from './app.js'
import { connectDatabase, disconnectDatabase } from './config/db.js'
import { env } from './config/env.js'

let server

async function startServer() {
  try {
    await connectDatabase()
  } catch (error) {
    console.error('MongoDB unavailable; database routes will be unavailable:', error.message)
  }
  server = app.listen(env.port, () => console.log(`TourMate API listening on http://localhost:${env.port}`))
}

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`)
  if (server) await new Promise((resolve) => server.close(resolve))
  await disconnectDatabase()
  process.exit(0)
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
startServer()

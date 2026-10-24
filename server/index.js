import app from './app.js'
import { connectDatabase, disconnectDatabase } from './config/db.js'
import { env } from './config/env.js'

let server

async function startServer() {
  // Non-blocking database connection attempt with quick fallback
  connectDatabase()
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log('Running with local JSON storage engine (MongoDB not connected:', error.message + ')'))

  server = app.listen(env.port, () => {
    console.log(`Explorex API listening on http://localhost:${env.port}`)
  })
  // Keep process alive for daemon managers
  setInterval(() => {}, 1000 * 60 * 60)
}

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`)
  if (server) await new Promise((resolve) => server.close(resolve))
  await disconnectDatabase().catch(() => null)
  process.exit(0)
}

process.on('uncaughtException', (err) => {
  console.error('Server uncaughtException:', err.message)
})

process.on('unhandledRejection', (reason) => {
  console.error('Server unhandledRejection:', reason?.message || reason)
})

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

startServer()

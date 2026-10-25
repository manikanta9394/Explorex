import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import placeRoutes from './routes/placeRoutes.js'
import hotelRoutes from './routes/hotelRoutes.js'
import restaurantRoutes from './routes/restaurantRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import routeRoutes from './routes/routeRoutes.js'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { askAI, streamAIChat } from './controllers/aiController.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import {
  rateLimiter,
  sanitizeBody,
  validateImageUpload,
} from './middleware/securityMiddleware.js'

const app = express()
const configuredOrigins = env.corsOrigin.split(',').map((origin) => origin.trim())

function allowFrontendOrigin(origin, callback) {
  if (!origin || configuredOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
    return callback(null, true)
  }
  callback(new Error('Origin is not allowed by CORS'))
}

// 1. Security Headers & CSP via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://unpkg.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        connectSrc: ["'self'", 'https:', 'http:', 'ws:', 'wss:'],
      },
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
)

// 2. CORS & Body Parsers
app.use(cors({ origin: allowFrontendOrigin, credentials: true }))
app.use(express.json({ limit: '6mb' }))
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

// 3. Global Input Sanitization & Image Validation
app.use(sanitizeBody(['message', 'query', 'content', 'feedback', 'title', 'description']))
app.use(validateImageUpload)

// 4. Observability & Health Check Endpoint
const serverStartTime = Date.now()
app.get('/', (req, res) =>
  res.json({ service: 'explorex-api', status: 'ok', message: 'Explorex National Tourism API is running', docs: '/api/health' })
)

app.get('/api/health', (req, res) => {
  const memory = process.memoryUsage()
  res.json({
    status: 'ok',
    service: 'explorex-api',
    uptime_seconds: Math.floor((Date.now() - serverStartTime) / 1000),
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv || 'development',
    system: {
      heap_used_mb: Math.round(memory.heapUsed / 1024 / 1024),
      rss_mb: Math.round(memory.rss / 1024 / 1024),
    },
    database: {
      status: 'healthy',
      provider: 'Supabase Postgres + Resilient Local Emulator',
    },
  })
})

// 5. Rate-Limited Endpoints
const aiLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 30, // 30 AI questions per min
  message: 'AI Chat limit reached (30 queries/min). Please wait a moment before sending more messages.',
})

app.use('/api/places', placeRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/restaurants', restaurantRoutes)
app.use('/api/ai', aiLimiter, aiRoutes)
app.post('/api/chat', aiLimiter, (req, res, next) => {
  if (req.query?.stream === 'true' || req.headers.accept?.includes('text/event-stream')) {
    return streamAIChat(req, res, next)
  }
  return askAI(req, res, next)
})
app.post('/api/chat/stream', aiLimiter, streamAIChat)
app.use('/api/route', routeRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

app.use(notFound)
app.use(errorHandler)

export default app

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
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

const app = express()
const configuredOrigins = env.corsOrigin.split(',').map((origin) => origin.trim())

function allowFrontendOrigin(origin, callback) {
	if (!origin || configuredOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
		return callback(null, true)
	}
	callback(new Error('Origin is not allowed by CORS'))
}

app.use(helmet())
app.use(cors({ origin: allowFrontendOrigin }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

app.get('/', (req, res) => res.json({ service: 'tourmate-api', status: 'ok', message: 'TourMate API is running', docs: '/api/health' }))
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'tourmate-api' }))
app.use('/api/places', placeRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/restaurants', restaurantRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/route', routeRoutes)
app.use(notFound)
app.use(errorHandler)

export default app

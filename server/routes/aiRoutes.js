import { Router } from 'express'
import { askAI, generateItinerary } from '../controllers/aiController.js'

const router = Router()
router.post('/ask', askAI)
router.post('/itinerary', generateItinerary)
export default router

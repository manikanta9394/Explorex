import { Router } from 'express'
import {
  askAI,
  streamAIChat,
  generateItinerary,
  fetchAiLogs,
  recordMessageFeedback,
} from '../controllers/aiController.js'

const router = Router()

router.post('/ask', askAI)
router.post('/chat', askAI)
router.post('/stream', streamAIChat)
router.post('/itinerary', generateItinerary)
router.get('/logs', fetchAiLogs)
router.post('/feedback', recordMessageFeedback)

export default router

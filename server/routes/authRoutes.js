import express from 'express'
import {
  signup,
  login,
  googleAuth,
  getMe,
  syncSavedPlaces,
  syncChatHistory,
  logout,
} from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/google', googleAuth)
router.get('/me', requireAuth, getMe)
router.post('/saved-places', requireAuth, syncSavedPlaces)
router.post('/chat-history', requireAuth, syncChatHistory)
router.post('/logout', logout)

export default router

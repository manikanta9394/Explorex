import express from 'express'
import { adminController } from '../controllers/adminController.js'
import { requireAdmin } from '../middleware/adminMiddleware.js'

const router = express.Router()

// All admin routes strictly require role = 'admin'
router.use(requireAdmin)

// 1. Dashboard
router.get('/metrics', adminController.getDashboardMetrics)

// 2. Places Management
router.get('/places', adminController.getPlaces)
router.post('/places', adminController.createOrUpdatePlace)
router.patch('/places/:id/publish', adminController.togglePublishPlace)
router.delete('/places/:id', adminController.softDeletePlace)

// 3. Image Review Queue
router.get('/images', adminController.getImageQueue)
router.post('/images/review', adminController.reviewImage)

// 4. Users Management
router.get('/users', adminController.getUsers)
router.patch('/users/role', adminController.updateUserRole)
router.patch('/users/status', adminController.toggleUserStatus)
router.post('/users/cleanup-guests', adminController.runGuestCleanupJob)

// 5. Feedback Inbox
router.get('/feedback', adminController.getFeedbackInbox)
router.patch('/feedback/:id/reply', adminController.replyFeedback)

// 6. AI Quality & Evaluation
router.get('/ai-quality', adminController.getAIQualityLogs)
router.post('/ai-quality/:id/eval', adminController.recordAIEval)

// 7. Audit Logs
router.get('/audit-logs', adminController.getAuditLogs)

// 8. Settings & Feature Flags
router.get('/settings', adminController.getSettings)
router.patch('/settings', adminController.updateSettings)

// 9. Two-Factor Authentication (TOTP)
router.post('/auth/verify-totp', adminController.verifyTOTP)

export default router

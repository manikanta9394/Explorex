import { Router } from 'express'
import { geocode, getMatrix, getRoute } from '../controllers/routeController.js'

const router = Router()

router.post('/', getRoute)
router.get('/', getRoute)
router.get('/geocode', geocode)
router.post('/matrix', getMatrix)

export default router

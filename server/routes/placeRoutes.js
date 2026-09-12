import { Router } from 'express'
import { getPlaceById, getPlaces } from '../controllers/placeController.js'
import { validateObjectId } from '../middleware/validateObjectId.js'

const router = Router()
router.get('/', getPlaces)
router.get('/:id', validateObjectId, getPlaceById)
export default router

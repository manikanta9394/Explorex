import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { userService } from '../services/userService.js'

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, env.jwtSecret)

    const user = await userService.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists or session expired.' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' })
    }
    return res.status(401).json({ error: 'Invalid authentication token.' })
  }
}

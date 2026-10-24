import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { userService } from '../services/userService.js'

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    env.jwtSecret,
    { expiresIn: '7d' }
  )
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export async function signup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body

    // 1. Validate Email
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    // 2. Validate Password (min 8 chars)
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' })
    }

    // 3. Validate Confirm Password if provided
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' })
    }

    // 4. Check existing account
    const existing = await userService.findByEmail(email)
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please log in.' })
    }

    // 5. Create User
    const user = await userService.createUser({
      name: name?.trim() || email.split('@')[0],
      email: email.trim().toLowerCase(),
      password,
    })

    const token = generateToken(user)
    return res.status(201).json({
      message: 'Account created successfully',
      user,
      token,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ error: 'Failed to create account. Please try again.' })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' })
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required.' })
    }

    const userWithPassword = await userService.findByEmail(email)
    if (!userWithPassword || !userWithPassword.password) {
      return res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' })
    }

    const isMatch = await userService.validatePassword(password, userWithPassword.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' })
    }

    const safeUser = userService.sanitizeUser(userWithPassword)
    const token = generateToken(safeUser)

    return res.json({
      message: 'Logged in successfully',
      user: safeUser,
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Failed to log in. Please try again.' })
  }
}

export async function googleAuth(req, res) {
  try {
    const { email, name, googleId } = req.body

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid Google account data.' })
    }

    let user = await userService.findByEmail(email)
    if (!user) {
      user = await userService.createUser({
        name: name || email.split('@')[0],
        email: email.trim().toLowerCase(),
        googleId: googleId || `goog_${Date.now()}`,
      })
    } else {
      user = userService.sanitizeUser(user)
    }

    const token = generateToken(user)
    return res.json({
      message: 'Google authentication successful',
      user,
      token,
    })
  } catch (error) {
    console.error('Google auth error:', error)
    return res.status(500).json({ error: 'Google authentication failed.' })
  }
}

export async function getMe(req, res) {
  try {
    const safeUser = userService.sanitizeUser(req.user)
    return res.json({ user: safeUser })
  } catch (error) {
    console.error('Get profile error:', error)
    return res.status(500).json({ error: 'Failed to fetch user profile.' })
  }
}

export async function syncSavedPlaces(req, res) {
  try {
    const { savedPlaces } = req.body
    if (!Array.isArray(savedPlaces)) {
      return res.status(400).json({ error: 'savedPlaces must be an array of IDs.' })
    }

    const updatedUser = await userService.updateSavedPlaces(req.user.id, savedPlaces)
    return res.json({ user: updatedUser, savedPlaces: updatedUser.savedPlaces })
  } catch (error) {
    console.error('Sync saved places error:', error)
    return res.status(500).json({ error: 'Failed to sync saved places.' })
  }
}

export async function syncChatHistory(req, res) {
  try {
    const { chatHistory } = req.body
    if (!Array.isArray(chatHistory)) {
      return res.status(400).json({ error: 'chatHistory must be an array of messages.' })
    }

    const updatedUser = await userService.updateChatHistory(req.user.id, chatHistory)
    return res.json({ user: updatedUser, chatHistory: updatedUser.chatHistory })
  } catch (error) {
    console.error('Sync chat history error:', error)
    return res.status(500).json({ error: 'Failed to sync chat history.' })
  }
}

export function logout(req, res) {
  return res.json({ message: 'Logged out successfully.' })
}

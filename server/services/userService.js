import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_FILE = path.join(__dirname, '../data/users.json')

// Ensure directory and file exist
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8')
  }
}

function readUsers() {
  ensureDataFile()
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw) || []
  } catch {
    return []
  }
}

function writeUsers(users) {
  ensureDataFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

export const userService = {
  async findByEmail(email) {
    if (!email) return null
    const users = readUsers()
    return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null
  },

  async findById(id) {
    if (!id) return null
    const users = readUsers()
    return users.find((u) => u.id === id) || null
  },

  async createUser({ name, email, password, googleId = null }) {
    const users = readUsers()
    const cleanEmail = email.trim().toLowerCase()

    let hashedPassword = null
    if (password) {
      const salt = await bcrypt.genSalt(10)
      hashedPassword = await bcrypt.hash(password, salt)
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: name?.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      password: hashedPassword,
      googleId,
      savedPlaces: [],
      chatHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(newUser)
    writeUsers(users)

    // Return safe user without password
    const { password: _, ...safeUser } = newUser
    return safeUser
  },

  async validatePassword(plainPassword, hashedPassword) {
    if (!plainPassword || !hashedPassword) return false
    return bcrypt.compare(plainPassword, hashedPassword)
  },

  async updateSavedPlaces(userId, savedPlaces) {
    const users = readUsers()
    const idx = users.findIndex((u) => u.id === userId)
    if (idx === -1) return null

    users[idx].savedPlaces = Array.isArray(savedPlaces) ? savedPlaces : []
    users[idx].updatedAt = new Date().toISOString()
    writeUsers(users)

    const { password: _, ...safeUser } = users[idx]
    return safeUser
  },

  async updateChatHistory(userId, chatHistory) {
    const users = readUsers()
    const idx = users.findIndex((u) => u.id === userId)
    if (idx === -1) return null

    users[idx].chatHistory = Array.isArray(chatHistory) ? chatHistory : []
    users[idx].updatedAt = new Date().toISOString()
    writeUsers(users)

    const { password: _, ...safeUser } = users[idx]
    return safeUser
  },

  sanitizeUser(user) {
    if (!user) return null
    const { password: _, ...safeUser } = user
    return safeUser
  },
}

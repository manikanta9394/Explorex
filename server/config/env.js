import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT) || 5005,
  jwtSecret: process.env.JWT_SECRET || 'explorex_jwt_secret_dev_key_2026',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tourmate',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5180,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://localhost:5177',
  nodeEnv: process.env.NODE_ENV || 'development',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  openRouterModel: process.env.OPENROUTER_MODEL || 'openrouter/free',
  openRouterFallbackModels: ['openrouter/free', 'google/gemma-3-27b-it:free', 'meta-llama/llama-3.3-70b-instruct:free'],
  orsApiKey: process.env.ORS_API_KEY || '',
}

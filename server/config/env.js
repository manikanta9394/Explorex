import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tourmate',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://localhost:5177',
  nodeEnv: process.env.NODE_ENV || 'development',
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  openRouterModel: process.env.OPENROUTER_MODEL || 'openrouter/free',
  openRouterFallbackModels: ['openrouter/free', 'google/gemma-3-27b-it:free', 'meta-llama/llama-3.3-70b-instruct:free'],
  orsApiKey: process.env.ORS_API_KEY || '',
}

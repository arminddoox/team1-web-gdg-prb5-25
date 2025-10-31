// backend/app.js
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import createError from 'http-errors'
import cors from 'cors'

// ——————————————————————————————————————
// 1. LOAD ENVIRONMENT VARIABLES
// ——————————————————————————————————————
dotenv.config() // ← CHANGED: Remove the path parameter

const app = express()
const PORT = process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// ——————————————————————————————————————
// 2. MIDDLEWARE
// ——————————————————————————————————————
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(morgan('dev'))

// Enable CORS for frontend
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
)

// ——————————————————————————————————————
// 3. ROUTES
// ——————————————————————————————————————
app.get('/api', (req, res) => {
  res.json({ message: '✅ API is running', port: PORT }) // ← CHANGED: Removed apiUrl
})

// Example route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    mongo: process.env.MONGODB_URI ? 'configured' : 'not configured',
  })
})

// ——————————————————————————————————————
// 4. 404 + ERROR HANDLING
// ——————————————————————————————————————
app.use((req, res, next) => next(createError(404, 'Not Found')))

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  })
})

// ——————————————————————————————————————
// 5. START SERVER
// ——————————————————————————————————————
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
  console.log(`🌐 Frontend allowed from: ${FRONTEND_URL}`)
  console.log(`📦 MongoDB URI: ${process.env.MONGODB_URI ? 'Loaded' : 'Missing'}`)
})

export default app
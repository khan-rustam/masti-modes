import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cloudinaryRoutes from './routes/cloudinaryRoutes.js'
import softwareRoutes from './routes/softwareRoutes.js'
import publicSoftwareRoutes from './routes/publicSoftwareRoutes.js'
import { getEnv } from './utils/env.js'
import { connectToDatabase } from './utils/db.js'

config()
const env = getEnv()

// Init app-level middlewares
const app = express()
app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Health route
app.get('/health', (_req, res) => res.json({ ok: true }))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/admin/contacts', contactRoutes)
app.use('/api/admin/categories', categoryRoutes)
app.use('/api/admin/cloudinary', cloudinaryRoutes)
app.use('/api/admin/software', softwareRoutes)
app.use('/api/software', publicSoftwareRoutes)

// Start server and optionally connect DB
const PORT = Number(env.PORT) || 5000
app.listen(PORT, async () => {
  console.log(`API running on http://localhost:${PORT}`)
  await connectToDatabase(env.MONGODB_URI, 'mastimode')
})

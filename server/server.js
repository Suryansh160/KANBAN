import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './db.js'
import logger from './logger.js'
import authRoutes from './routes/auth-routes.js'
import listRoutes from './routes/list-routes.js'
import cardRoutes from './routes/card-routes.js'

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/lists', listRoutes)
app.use('/api/cards', cardRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => logger.info(`Server is listening to port ${PORT}`))

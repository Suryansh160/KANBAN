import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './db.js'
import logger from './logger.js'
import authRoutes from './routes/auth-routes.js'
import listRoutes from './routes/list-routes.js'
import cardRoutes from './routes/card-routes.js'
import http from 'http'
import { Server } from 'socket.io'
import { initSocket } from './socket/index.js'
import activityRoutes from './routes/activity-routes.js'

dotenv.config()

const app = express()
app.use(express.json())

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
})

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
)

app.set('io', io)

initSocket(io)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/lists', listRoutes)
app.use('/api/cards', cardRoutes)
app.use('/api/activity', activityRoutes)

const PORT = process.env.PORT || 4000

async function startServer () {
  await connectDB()
  httpServer.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
}

startServer()

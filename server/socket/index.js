import logger from '../logger.js'
import { socketAuthMiddleware } from './socketAuth.js'
import { registerPresenceHandlers } from './presence.js'

export function initSocket (io) {
  io.use(socketAuthMiddleware)

  io.on('connection', socket => {
    logger.info(`${socket.userName} connected`, {
      socketId: socket.id,
      userId: socket.userId
    })

    registerPresenceHandlers(io, socket)

    socket.on('disconnect', () => {
      logger.info(`${socket.userName} disconnected`, {
        socketId: socket.id,
        userId: socket.userId
      })
    })
  })
}

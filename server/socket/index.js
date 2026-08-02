import logger from '../logger.js'
import { socketAuthMiddleware } from './socketAuth.js'
import { registerPresenceHandlers } from './presence.js'
import { registerChatHandlers } from './chat.js'
import { registerDragPresenceHandlers } from './dragPresence.js'

export function initSocket (io) {
  io.use(socketAuthMiddleware)

  io.on('connection', socket => {
    logger.info('Socket connected', {
      socketId: socket.id,
      userId: socket.userId
    })

    registerPresenceHandlers(io, socket)
    registerChatHandlers(io, socket)
    registerDragPresenceHandlers(io, socket)

    socket.on('disconnect', () => {
      logger.info('Socket disconnected', {
        socketId: socket.id,
        userId: socket.userId
      })
    })
  })
}

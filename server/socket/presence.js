import logger from '../logger.js'

const onlineUsers = new Map()

export function registerPresenceHandlers (io, socket) {
  const existing = onlineUsers.get(socket.userId)
  if (existing) {
    existing.socketCount += 1
  } else {
    onlineUsers.set(socket.userId, {
      userId: socket.userId,
      name: socket.userName,
      email: socket.userEmail,
      socketCount: 1
    })
  }
  broadcastPresence(io)

  socket.on('presence:request', () => {
    socket.emit('presence:update', getOnlineUsers())
  })

  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.userId)
    if (user) {
      user.socketCount -= 1
      if (user.socketCount <= 0) {
        onlineUsers.delete(socket.userId)
      }
    }
    broadcastPresence(io)
  })
}

function broadcastPresence (io) {
  const users = getOnlineUsers()
  logger.info('Broadcasting presence', { count: users.length })
  io.emit('presence:update', users)
}

function getOnlineUsers () {
  return Array.from(onlineUsers.values())
}

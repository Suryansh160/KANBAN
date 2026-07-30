export function registerChatHandlers (io, socket) {
  socket.on('chat:message', ({ text }) => {
    if (!text || !text.trim()) return

    const message = {
      id: `${socket.userId}-${Date.now()}`,
      senderId: socket.userId,
      sender: socket.userName,
      text: text.trim(),
      timestamp: new Date().toISOString()
    }

    io.emit('chat:message', message)
  })

  socket.on('chat:typing', ({ isTyping }) => {
    socket.broadcast.emit('chat:typing', {
      userId: socket.userId,
      name: socket.userName,
      isTyping
    })
  })
}

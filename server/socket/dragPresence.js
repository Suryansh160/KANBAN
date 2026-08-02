const draggingCards = new Map()

export function registerDragPresenceHandlers (io, socket) {
  socket.on('card:drag-start', ({ cardId }) => {
    draggingCards.set(cardId, {
      userId: socket.userId,
      userName: socket.userName,
      socketId: socket.id
    })
    socket.broadcast.emit('card:drag-start', {
      cardId,
      userId: socket.userId,
      userName: socket.userName
    })
  })

  socket.on('card:drag-end', ({ cardId }) => {
    draggingCards.delete(cardId)
    socket.broadcast.emit('card:drag-end', { cardId })
  })

  socket.on('disconnect', () => {
    for (const [cardId, dragger] of draggingCards.entries()) {
      if (dragger.socketId === socket.id) {
        draggingCards.delete(cardId)
        io.emit('card:drag-end', { cardId })
      }
    }
  })
}

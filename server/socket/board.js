export function emitCardCreated (io, card) {
  io.emit('card:created', card)
}

export function emitCardUpdated (io, card) {
  console.log('RECEIVED card:updated', card)

  io.emit('card:updated', card)
}

export function emitCardDeleted (io, cardId) {
  io.emit('card:deleted', cardId)
}

export function emitListCreated (io, list) {
  io.emit('list:created', list)
}

export function emitListUpdated (io, list) {
  io.emit('list:updated', list)
}

export function emitListDeleted (io, listId) {
  io.emit('list:deleted', listId)
}

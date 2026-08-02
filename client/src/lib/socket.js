import { io } from 'socket.io-client'

const socketURL =
  import.meta.env.VITE_SOCKET_URL ||
  'https://kanban-muew.onrender.com'

export const socket = io(socketURL, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem('accessToken')
  }
})

export function connectSocket () {
  socket.auth = { token: localStorage.getItem('accessToken') }
  socket.connect()
}

export function disconnectSocket () {
  socket.disconnect()
}

socket.on('connect_error', error => {
  console.error('Socket connection failed:', error.message)
})

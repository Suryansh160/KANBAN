import { io } from 'socket.io-client'

export const socket = io('http://localhost:4000', {
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

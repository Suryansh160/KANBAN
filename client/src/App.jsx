import { useState, useEffect } from 'react'
import Board from './components/Board'
import AuthDialog from './components/AuthDialog'
import { AUTH_REQUIRED_EVENT } from './lib/authEvents'
import { connectSocket, disconnectSocket } from './lib/socket'

export default function App () {
  const [authOpen, setAuthOpen] = useState(!localStorage.getItem('accessToken'))

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      connectSocket()
    }

    const handler = () => {
      setAuthOpen(true)
      disconnectSocket()
    }
    window.addEventListener(AUTH_REQUIRED_EVENT, handler)
    return () => window.removeEventListener(AUTH_REQUIRED_EVENT, handler)
  }, [])

  const handleSuccess = () => {
    setAuthOpen(false)
    connectSocket()
  }

  return (
    <>
      <Board />
      <AuthDialog
        open={authOpen}
        forced
        onOpenChange={setAuthOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
}

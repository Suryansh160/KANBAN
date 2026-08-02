import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Board from './components/Board'
import AuthDialog from './components/AuthDialog'
import { AUTH_REQUIRED_EVENT } from './lib/authEvents'
import { connectSocket, disconnectSocket } from './lib/socket'

export default function App () {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem('accessToken'))
  )
  const queryClient = useQueryClient()

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(false)
      disconnectSocket()
      queryClient.removeQueries({ queryKey: ['lists'] })
      queryClient.removeQueries({ queryKey: ['cards'] })
      queryClient.removeQueries({ queryKey: ['activity'] })
    }
    window.addEventListener(AUTH_REQUIRED_EVENT, handler)
    return () => window.removeEventListener(AUTH_REQUIRED_EVENT, handler)
  }, [queryClient])

  useEffect(() => {
    if (isAuthenticated) connectSocket()

    return () => disconnectSocket()
  }, [isAuthenticated])

  const handleSuccess = () => {
    // The token is stored by AuthDialog before this callback runs. Mounting the
    // board now ensures its initial requests include that token.
    setIsAuthenticated(true)
  }

  return (
    <>
      {isAuthenticated && <Board />}
      <AuthDialog
        open={!isAuthenticated}
        forced
        onOpenChange={() => {}}
        onSuccess={handleSuccess}
      />
    </>
  )
}

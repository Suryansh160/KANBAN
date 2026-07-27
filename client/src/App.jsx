import { useState, useEffect } from 'react'
import Board from './components/Board'
import AuthDialog from './components/AuthDialog'
import { AUTH_REQUIRED_EVENT } from './lib/authEvents'

function hasStoredToken () {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token')
  return Boolean(token && token !== 'undefined' && token !== 'null')
}

export default function App () {
  const [authOpen, setAuthOpen] = useState(!hasStoredToken())

  useEffect(() => {
    const handler = () => setAuthOpen(true)
    window.addEventListener(AUTH_REQUIRED_EVENT, handler)
    return () => window.removeEventListener(AUTH_REQUIRED_EVENT, handler)
  }, [])

  return (
    <>
      {!authOpen && <Board />}
      <AuthDialog open={authOpen} onSuccess={() => setAuthOpen(false)} />
    </>
  )
}

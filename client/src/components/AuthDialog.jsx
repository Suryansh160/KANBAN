import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { login, signup } from '../api/auth'

export default function AuthDialog ({ open, forced, onOpenChange, onSuccess }) {
  const [tab, setTab] = useState('login')

  return (
    <Dialog open={open} onOpenChange={forced ? undefined : onOpenChange}>
      <DialogContent
        className='bg-zinc-900 border-zinc-800 sm:max-w-sm'
        onInteractOutside={e => forced && e.preventDefault()}
        onEscapeKeyDown={e => forced && e.preventDefault()}
        showCloseButton={!forced}
      >
        <DialogHeader>
          <DialogTitle className='text-zinc-100'>
            {forced
              ? 'Session expired — log in to continue'
              : tab === 'login'
              ? 'Log in'
              : 'Create an account'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className='grid w-full grid-cols-2 bg-zinc-800'>
            <TabsTrigger value='login'>Log in</TabsTrigger>
            <TabsTrigger value='signup'>Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value='login'>
            <LoginForm onSuccess={onSuccess} />
          </TabsContent>
          <TabsContent value='signup'>
            <SignupForm onSwitchToLogin={() => setTab('login')} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function LoginForm ({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login({ email, password })
      localStorage.setItem('accessToken', res.accessToken)
      localStorage.removeItem('token')
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className='space-y-3 pt-3'>
      <Input
        type='email'
        placeholder='Email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        className='bg-zinc-800 border-zinc-700 text-zinc-100'
        required
      />
      <Input
        type='password'
        placeholder='Password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        className='bg-zinc-800 border-zinc-700 text-zinc-100'
        required
      />
      {error && <p className='text-sm text-red-400'>{error}</p>}
      <button
        type='submit'
        disabled={loading}
        className='w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded py-2 text-sm transition-colors disabled:opacity-50'
      >
        {loading ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  )
}

function SignupForm ({ onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup({ name, email, password })
      onSwitchToLogin()
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className='space-y-3 pt-3'>
      <Input
        placeholder='Name'
        value={name}
        onChange={e => setName(e.target.value)}
        className='bg-zinc-800 border-zinc-700 text-zinc-100'
        required
      />
      <Input
        type='email'
        placeholder='Email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        className='bg-zinc-800 border-zinc-700 text-zinc-100'
        required
      />
      <Input
        type='password'
        placeholder='Password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        className='bg-zinc-800 border-zinc-700 text-zinc-100'
        required
      />
      {error && <p className='text-sm text-red-400'>{error}</p>}
      <button
        type='submit'
        disabled={loading}
        className='w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded py-2 text-sm transition-colors disabled:opacity-50'
      >
        {loading ? 'Creating account...' : 'Sign up'}
      </button>
    </form>
  )
}

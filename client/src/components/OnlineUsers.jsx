import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { socket } from '@/lib/socket'

export default function OnlineUsers () {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const updatePresence = users => setUsers(users)
    const requestPresence = () => socket.emit('presence:request')

    socket.on('presence:update', updatePresence)
    socket.on('connect', requestPresence)

    if (socket.connected) requestPresence()

    return () => {
      socket.off('presence:update', updatePresence)
      socket.off('connect', requestPresence)
    }
  }, [])

  return (
    <div>
      <div className='flex flex-wrap items-stretch gap-4 px-6 py-4'>
        {users.map((user, index) => {
          const initials = user.name
            .split(' ')
            .map(n => n[0])
            .join('')
          return (
            <div key={user.userId} className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='relative'>
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback className='bg-zinc-700 text-xs text-zinc-200'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className='absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-400'
                  />
                </div>
                <div className='leading-tight'>
                  <p className='text-sm text-zinc-200'>{user.name}</p>
                  <p className='text-xs text-zinc-500'>{user.email}</p>
                </div>
              </div>
              {index < users.length - 1 && (
                <Separator orientation='vertical' className='bg-zinc-800' />
              )}
            </div>
          )
        })}
      </div>
      <Separator className='bg-zinc-800' />
    </div>
  )
}

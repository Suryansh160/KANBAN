import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const dummyUsers = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    online: true
  },
  { id: 2, name: 'Jamie Lee', email: 'jamie.lee@example.com', online: true },
  {
    id: 3,
    name: 'Morgan Smith',
    email: 'morgan.smith@example.com',
    online: false
  },
  {
    id: 4,
    name: 'Taylor Nguyen',
    email: 'taylor.nguyen@example.com',
    online: true
  }
]

export default function OnlineUsers () {
  return (
    <div>
      <div className='flex flex-wrap items-stretch gap-4 px-6 py-4'>
        {dummyUsers.map((user, index) => {
          const initials = user.name
            .split(' ')
            .map(n => n[0])
            .join('')
          return (
            <div key={user.id} className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='relative'>
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback className='bg-zinc-700 text-xs text-zinc-200'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 ${
                      user.online ? 'bg-emerald-400' : 'bg-zinc-600'
                    }`}
                  />
                </div>
                <div className='leading-tight'>
                  <p className='text-sm text-zinc-200'>{user.name}</p>
                  <p className='text-xs text-zinc-500'>{user.email}</p>
                </div>
              </div>
              {index < dummyUsers.length - 1 && (
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

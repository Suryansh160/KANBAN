import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const dummyLogs = [
  {
    time: '10:42:01',
    text: 'Jamie moved "Design marketing strategy" to In Progress'
  },
  { time: '10:43:15', text: 'Casey created card "Test mobile app on iOS"' },
  {
    time: '10:44:02',
    text: 'Taylor updated due date on "Optimize website SEO"'
  }
]

export default function LogsPanel () {
  const [open, setOpen] = useState(false)

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-zinc-950'>
      <Separator className='bg-zinc-800' />
      <button
        onClick={() => setOpen(!open)}
        className='w-full flex items-center justify-center gap-1 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900'
      >
        {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        Activity Log
      </button>
      {open && (
        <>
          <Separator className='bg-zinc-800' />
          <div className='h-40 overflow-y-auto bg-black px-4 py-2 font-mono text-xs'>
            {dummyLogs.map((log, i) => (
              <p key={i} className='py-0.5'>
                <span className='text-blue-400'>[{log.time}]</span>{' '}
                <span className='text-yellow-200'>{log.text}</span>
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

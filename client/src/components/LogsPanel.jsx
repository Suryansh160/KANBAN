import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useActivityStore } from '../store/activityStore'

export default function LogsPanel () {
  const [open, setOpen] = useState(false)
  const logs = useActivityStore(s => s.logs)

  return (
    <div className='fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950'>
      <button
        onClick={() => setOpen(!open)}
        className='w-full flex items-center justify-center gap-1 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900'
      >
        {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        Activity Log
      </button>
      {open && (
        <div className='h-40 overflow-y-auto px-4 py-2 font-mono text-xs bg-black border-t border-zinc-800'>
          {logs.length === 0 && (
            <p className='text-zinc-600 py-0.5'>No activity yet</p>
          )}
          {logs.map(log => (
            <p key={log._id} className='py-0.5'>
              <span className='text-blue-400'>
                [{new Date(log.createdAt).toLocaleTimeString()}]
              </span>{' '}
              <span className='text-yellow-300'>{log.message}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AddListDialog ({
  open,
  onOpenChange,
  onCreate,
  isPending
}) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('todo')

  const handleSubmit = e => {
    e.preventDefault()
    if (!title.trim()) return
    onCreate({ title, status })
    setTitle('')
    setStatus('todo')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-zinc-900 border-zinc-800 sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle className='text-zinc-100'>Add List</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 pt-2'>
          <div className='space-y-1.5'>
            <Label className='text-zinc-300'>Title</Label>
            <Input
              autoFocus
              placeholder='e.g. In Review'
              value={title}
              onChange={e => setTitle(e.target.value)}
              className='bg-zinc-800 border-zinc-700 text-zinc-100'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-zinc-300'>Status</Label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className='w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded px-3 py-2 text-sm'
            >
              <option value='todo'>To Do</option>
              <option value='progress'>In Progress</option>
              <option value='review'>Review</option>
              <option value='done'>Done</option>
            </select>
          </div>

          <DialogFooter>
            <button
              type='submit'
              disabled={isPending}
              className='w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded py-2 text-sm transition-colors disabled:opacity-50'
            >
              {isPending ? 'Creating...' : 'Create List'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function EditCardDialog({ open, onOpenChange, card, onUpdate, isPending }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [labelsInput, setLabelsInput] = useState('')

  useEffect(() => {
    if (card) {
      setTitle(card.title || '')
      setDescription(card.description || '')
      setDueDate(card.dueDate ? card.dueDate.slice(0, 10) : '')
      setLabelsInput((card.labels || []).join(', '))
    }
  }, [card])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const labels = labelsInput
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean)

    onUpdate({
      id: card._id,
      data: {
        title,
        description,
        dueDate: dueDate || null,
        labels
      }
    })

    onOpenChange(false)
  }

  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Edit Card</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-zinc-300">Title</Label>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-300">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-300">Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-300">Labels</Label>
            <Input
              placeholder="bug, urgent (comma separated)"
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          <DialogFooter>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded py-2 text-sm transition-colors disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
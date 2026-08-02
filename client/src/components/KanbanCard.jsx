import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { useDeleteCard } from '../hooks/useCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDragStore } from '../store/dragStore'

export default function KanbanCard ({ card, onEdit }) {
  const deleteCard = useDeleteCard()
  const draggingCards = useDragStore(s => s.draggingCards)
  const draggedBy = draggingCards[card._id]
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const revertTimeoutRef = useRef(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card._id, data: { type: 'card', card } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  }

  const initials = card.assignee
    ? card.assignee
        .split(' ')
        .map(n => n[0])
        .join('')
    : '?'

  const handleDeleteClick = e => {
    e.stopPropagation()
    if (!confirmingDelete) {
      setConfirmingDelete(true)
      revertTimeoutRef.current = setTimeout(
        () => setConfirmingDelete(false),
        3000
      )
      return
    }
    clearTimeout(revertTimeoutRef.current)
    deleteCard.mutate(card._id)
  }

  const handleCancelDelete = e => {
    e.stopPropagation()
    clearTimeout(revertTimeoutRef.current)
    setConfirmingDelete(false)
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={`mb-3 bg-zinc-800 transition-colors cursor-grab active:cursor-grabbing ${
          draggedBy
            ? 'border-emerald-500 border-2'
            : 'border-zinc-700 hover:border-zinc-600'
        }`}
      >
        <CardContent className='p-3 space-y-2'>
          {draggedBy && (
            <p className='text-[10px] text-emerald-400 font-medium'>
              {draggedBy.userName} is moving this
            </p>
          )}
          <div className='flex justify-between items-start gap-2'>
            <p className='text-sm font-medium text-zinc-100'>{card.title}</p>
            <Avatar className='h-6 w-6 shrink-0'>
              <AvatarFallback className='text-[10px] bg-zinc-700 text-zinc-200'>
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          {card.description && (
            <p className='text-xs text-zinc-400 leading-relaxed'>
              {card.description}
            </p>
          )}
          <div className='flex justify-between items-center pt-1'>
            <span className='text-xs text-zinc-500'>
              {confirmingDelete
                ? 'Delete this card?'
                : card.assignee
                ? `Created by ${card.assignee}`
                : 'Unassigned'}
            </span>
            <div className='flex gap-1'>
              {confirmingDelete ? (
                <>
                  <button
                    onClick={handleDeleteClick}
                    disabled={deleteCard.isPending}
                    className='p-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 disabled:opacity-50'
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className='p-1 rounded hover:bg-zinc-700 text-zinc-400'
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleDeleteClick}
                    className='p-1 rounded hover:bg-zinc-700 text-red-400'
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      onEdit(card)
                    }}
                    className='p-1 rounded hover:bg-zinc-700 text-zinc-400'
                  >
                    <Pencil size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

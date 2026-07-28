import { Card, CardContent } from '@/components/ui/card'
import KanbanCard from './KanbanCard'
import { Plus, Trash2 } from 'lucide-react'
import { useDeleteList } from '../hooks/useLists'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

const statusColors = {
  todo: 'bg-zinc-400',
  progress: 'bg-amber-400',
  review: 'bg-purple-400',
  done: 'bg-emerald-400'
}

export default function List ({ list, onAddCard, onEditCard }) {
  const deleteList = useDeleteList()

  const { setNodeRef } = useDroppable({
    id: list._id,
    data: { type: 'list', listId: list._id }
  })

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${list.title}" and all its cards?`
    )
    if (!confirmed) return
    deleteList.mutate(list._id)
  }

  const cardIds = list.cards.map(c => c._id)

  return (
    <Card className='w-72 shrink-0 bg-zinc-900 border-zinc-800 flex flex-col'>
      <CardContent className='p-3 flex flex-col h-full'>
        <div className='flex items-center justify-between gap-2 mb-3 px-1'>
          <div className='flex items-center gap-2'>
            <span
              className={`h-2 w-2 rounded-full ${statusColors[list.status]}`}
            />
            <h3 className='text-sm font-semibold text-zinc-200'>
              {list.title}
            </h3>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleteList.isPending}
            className='p-1 rounded hover:bg-zinc-800 text-red-400 disabled:opacity-50'
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div ref={setNodeRef} className='flex-1 overflow-y-auto min-h-[40px]'>
          <SortableContext
            items={cardIds}
            strategy={verticalListSortingStrategy}
          >
            {list.cards.map(card => (
              <KanbanCard key={card._id} card={card} onEdit={onEditCard} />
            ))}
          </SortableContext>
        </div>

        <button
          onClick={() => onAddCard(list._id)}
          className='flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded px-2 py-1.5 mt-1 transition-colors'
        >
          <Plus size={14} />
          Add Card
        </button>
      </CardContent>
    </Card>
  )
}

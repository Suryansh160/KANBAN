import { Card, CardContent } from '@/components/ui/card'
import KanbanCard from './KanbanCard'

const statusColors = {
  todo: 'bg-zinc-400',
  progress: 'bg-amber-400',
  review: 'bg-purple-400',
  done: 'bg-emerald-400'
}

export default function List ({ list }) {
  return (
    <Card className='w-72 shrink-0 bg-zinc-900 border-zinc-800 flex flex-col'>
      <CardContent className='p-3 flex flex-col h-full'>
        <div className='flex items-center gap-2 mb-3 px-1'>
          <span
            className={`h-2 w-2 rounded-full ${statusColors[list.status]}`}
          />
          <h3 className='text-sm font-semibold text-zinc-200'>{list.title}</h3>
        </div>
        <div className='flex-1 overflow-y-auto'>
          {list.cards.map(card => (
            <KanbanCard key={card._id} card={card} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Trash2, Pencil } from 'lucide-react'

export default function KanbanCard ({ card }) {
  return (
    <Card className='mb-3 bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-colors cursor-grab active:cursor-grabbing'>
      {' '}
      <CardContent className='p-3 space-y-2'>
        <div className='flex justify-between items-start gap-2'>
          <p className='text-sm font-medium text-zinc-100'>{card.title}</p>
          <Avatar className='h-6 w-6 shrink-0'>
            <AvatarFallback className='text-[10px] bg-zinc-700 text-zinc-200'>
              {card.assignee
                .split(' ')
                .map(n => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <p className='text-xs text-zinc-400 leading-relaxed'>
          {card.description}
        </p>
        <div className='flex justify-between items-center pt-1'>
          <span className='text-xs text-zinc-500'>
            Assigned to {card.assignee}
          </span>
          <div className='flex gap-1'>
            <button className='p-1 rounded hover:bg-zinc-800 text-red-400'>
              <Trash2 size={14} />
            </button>
            <button className='p-1 rounded hover:bg-zinc-800 text-zinc-400'>
              <Pencil size={14} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

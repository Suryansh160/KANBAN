import { Card as UICard, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Card ({ card }) {
  return (
    <UICard className='mb-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow'>
      <CardContent className='p-3 space-y-2'>
        <p className='text-sm font-medium'>{card.title}</p>
        {card.labels?.length > 0 && (
          <div className='flex gap-1 flex-wrap'>
            {card.labels.map(label => (
              <Badge key={label} variant='secondary' className='text-xs'>
                {label}
              </Badge>
            ))}
          </div>
        )}
        {card.dueDate && (
          <p className='text-xs text-muted-foreground'>Due {card.dueDate}</p>
        )}
      </CardContent>
    </UICard>
  )
}

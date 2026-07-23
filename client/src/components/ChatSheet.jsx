import { useState, useRef, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Menu, Send } from 'lucide-react'

const dummyMessages = [
  { id: 1, sender: 'Jamie', text: 'pushed the auth fix', self: false },
  { id: 2, sender: 'Casey', text: 'reviewing now', self: false },
  { id: 3, sender: 'You', text: 'nice, lmk if it breaks anything', self: true },
  {
    id: 4,
    sender: 'Jamie',
    text: 'will do, testing on staging now',
    self: false
  },
  {
    id: 5,
    sender: 'Taylor',
    text: 'can someone review my PR too?',
    self: false
  }
]

function ChatBubble ({ message }) {
  const initials = message.sender
    .split(' ')
    .map(n => n[0])
    .join('')

  return (
    <div className={`flex gap-2 ${message.self ? 'flex-row-reverse' : ''}`}>
      <Avatar className='h-7 w-7 shrink-0'>
        <AvatarFallback className='text-[10px] bg-zinc-700 text-zinc-200'>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div
        className={`flex flex-col ${
          message.self ? 'items-end' : 'items-start'
        } max-w-[75%]`}
      >
        {!message.self && (
          <span className='text-[11px] text-zinc-500 px-1 mb-0.5'>
            {message.sender}
          </span>
        )}
        <div
          className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
            message.self
              ? 'bg-emerald-600 text-white rounded-br-sm'
              : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  )
}

export default function ChatSheet () {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(dummyMessages)
  const unreadCount = 2
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='relative p-2 rounded hover:bg-zinc-800 text-zinc-300'
      >
        <Menu size={20} />
        {unreadCount > 0 && (
          <span className='absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center'>
            {unreadCount}
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side='left'
          className='bg-zinc-950 border-zinc-800 w-80 flex flex-col p-0'
        >
          <SheetHeader className='px-4 py-3 border-b border-zinc-800'>
            <SheetTitle className='text-zinc-100'>Board Chat</SheetTitle>
          </SheetHeader>

          <ScrollArea className='flex-1 px-4 py-4'>
            <div className='space-y-4'>
              {messages.map(message => (
                <ChatBubble key={message.id} message={message} />
              ))}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className='p-3 border-t border-zinc-800 flex gap-2'>
            <Input
              placeholder='Type a message...'
              className='bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-600'
            />
            <button className='p-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white shrink-0'>
              <Send size={16} />
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

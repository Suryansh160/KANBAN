import { useState, useEffect, useRef } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport
} from '@/components/ui/message-scroller'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Menu, Send } from 'lucide-react'
import { socket } from '../lib/socket'
import { useChatStore } from '../store/chatStore'

function getCurrentUserId () {
  const token = localStorage.getItem('accessToken')
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    return JSON.parse(atob(paddedBase64)).userId ?? null
  } catch {
    return null
  }
}

function ChatBubble ({ message, isSelf }) {
  const initials = message.sender
    .split(' ')
    .map(n => n[0])
    .join('')

  return (
    <div className={`flex gap-2 ${isSelf ? 'flex-row-reverse' : ''}`}>
      <Avatar className='h-7 w-7 shrink-0'>
        <AvatarFallback className='text-[10px] bg-zinc-700 text-zinc-200'>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div
        className={`flex flex-col ${
          isSelf ? 'items-end' : 'items-start'
        } max-w-[75%]`}
      >
        {!isSelf && (
          <span className='text-[11px] text-zinc-500 px-1 mb-0.5'>
            {message.sender}
          </span>
        )}
        <div
          className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
            isSelf
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
  const [input, setInput] = useState('')
  const messages = useChatStore(s => s.messages)
  const unreadCount = useChatStore(s => s.unreadCount)
  const clearUnread = useChatStore(s => s.clearUnread)
  const typingUsers = useChatStore(s => s.typingUsers)
  const typingTimeoutRef = useRef(null)

  const currentUserId = getCurrentUserId()
  const isOwnMessage = message =>
    currentUserId !== null && String(message.senderId) === String(currentUserId)

  const handleOpen = () => {
    setOpen(true)
    clearUnread()
  }

  const handleSend = e => {
    e.preventDefault()
    if (!input.trim()) return
    socket.emit('chat:message', { text: input })
    setInput('')
    socket.emit('chat:typing', { isTyping: false })
  }

  const handleInputChange = e => {
    setInput(e.target.value)
    socket.emit('chat:typing', { isTyping: true })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('chat:typing', { isTyping: false })
    }, 1500)
  }

  const typingNames = Object.values(typingUsers)

  return (
    <>
      <button
        onClick={handleOpen}
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

          <MessageScrollerProvider
            autoScroll
            defaultScrollPosition='end'
            className='flex-1 min-h-0'
          >
            <MessageScroller className='h-full'>
              <MessageScrollerViewport>
                <MessageScrollerContent className='px-4 py-4 space-y-4'>
                  {messages.map(message => {
                    const isSelf = isOwnMessage(message)

                    return (
                      <MessageScrollerItem
                        key={message.id}
                        messageId={message.id}
                        scrollAnchor={isSelf}
                      >
                        <ChatBubble message={message} isSelf={isSelf} />
                      </MessageScrollerItem>
                    )
                  })}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>

          {typingNames.length > 0 && (
            <p className='px-4 py-1 text-xs text-zinc-500 italic'>
              {typingNames.join(', ')} {typingNames.length === 1 ? 'is' : 'are'}{' '}
              typing...
            </p>
          )}

          <form
            onSubmit={handleSend}
            className='p-3 border-t border-zinc-800 flex gap-2'
          >
            <Input
              placeholder='Type a message...'
              value={input}
              onChange={handleInputChange}
              className='bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-600'
            />
            <button
              type='submit'
              className='p-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white shrink-0'
            >
              <Send size={16} />
            </button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}

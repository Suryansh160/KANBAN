import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { socket } from '../lib/socket'
import { useChatStore } from '../store/chatStore'

export function useSocket () {
  const queryClient = useQueryClient()
  const addMessage = useChatStore(s => s.addMessage)
  const incrementUnread = useChatStore(s => s.incrementUnread)
  const setTyping = useChatStore(s => s.setTyping)

  useEffect(() => {
    const onCardCreated = card => {
      queryClient.setQueryData(['cards'], old => {
        if (!old?.cards) return old
        const exists = old.cards.some(c => c._id === card._id)
        if (exists) return old
        return { ...old, cards: [...old.cards, card] }
      })
    }

    const onCardUpdated = card => {
      console.log('RECEIVED card:updated', card)
      queryClient.setQueryData(['cards'], old => {
        if (!old?.cards) return old
        return {
          ...old,
          cards: old.cards.map(c => (c._id === card._id ? card : c))
        }
      })
    }

    const onCardDeleted = cardId => {
      queryClient.setQueryData(['cards'], old => {
        if (!old?.cards) return old
        return { ...old, cards: old.cards.filter(c => c._id !== cardId) }
      })
    }

    const onListCreated = list => {
      queryClient.setQueryData(['lists'], old => {
        if (!old?.lists) return old
        const exists = old.lists.some(l => l._id === list._id)
        if (exists) return old
        return { ...old, lists: [...old.lists, list] }
      })
    }

    const onListUpdated = list => {
      queryClient.setQueryData(['lists'], old => {
        if (!old?.lists) return old
        return {
          ...old,
          lists: old.lists.map(l => (l._id === list._id ? list : l))
        }
      })
    }

    const onListDeleted = listId => {
      queryClient.setQueryData(['lists'], old => {
        if (!old?.lists) return old
        return { ...old, lists: old.lists.filter(l => l._id !== listId) }
      })
      queryClient.setQueryData(['cards'], old => {
        if (!old?.cards) return old
        return { ...old, cards: old.cards.filter(c => c.list !== listId) }
      })
    }

    const onChatMessage = message => {
      addMessage(message)
      incrementUnread()
    }

    const onChatTyping = ({ userId, name, isTyping }) => {
      setTyping(userId, name, isTyping)
    }

    socket.on('card:created', onCardCreated)
    socket.on('card:updated', onCardUpdated)
    socket.on('card:deleted', onCardDeleted)
    socket.on('list:created', onListCreated)
    socket.on('list:updated', onListUpdated)
    socket.on('list:deleted', onListDeleted)
    socket.on('chat:message', onChatMessage)
    socket.on('chat:typing', onChatTyping)

    return () => {
      socket.off('card:created', onCardCreated)
      socket.off('card:updated', onCardUpdated)
      socket.off('card:deleted', onCardDeleted)
      socket.off('list:created', onListCreated)
      socket.off('list:updated', onListUpdated)
      socket.off('list:deleted', onListDeleted)
      socket.off('chat:message', onChatMessage)
      socket.off('chat:typing', onChatTyping)
    }
  }, [queryClient, addMessage, incrementUnread, setTyping])
}

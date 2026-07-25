import List from './List'
import ChatSheet from './ChatSheet'
import LogsPanel from './LogsPanel'
import OnlineUsers from './OnlineUsers'
import { Plus } from 'lucide-react'
import { useLists, useCreateList } from '../hooks/useLists'
import { useCards, useCreateCard } from '../hooks/useCards'

export default function Board() {
  const { data: listsData, isLoading: listsLoading, isError: listsError, error: listsRequestError } = useLists()
  const { data: cardsData, isLoading: cardsLoading, isError: cardsError, error: cardsRequestError } = useCards()

  const createList = useCreateList()
  const createCard = useCreateCard()

  const handleAddList = () => {
    const title = prompt('List title')
    if (!title) return
    createList.mutate({ title })
  }

  const handleAddCard = (listId) => {
    const title = prompt('Card title')
    if (!title) return
    createCard.mutate({ title, list: listId })
  }

  if (listsLoading || cardsLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm">
        Loading board...
      </div>
    )
  }

  if (listsError || cardsError) {
    const requestError = listsRequestError || cardsRequestError
    const message = requestError?.response?.data?.message || 'Failed to load board. Check your connection or login again.'

    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-400 text-sm">
        {message}
      </div>
    )
  }

  const lists = listsData?.lists ?? []
  const cards = cardsData?.cards ?? []

  return (
    <div className="min-h-screen bg-zinc-950 pb-12">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800">
        <ChatSheet />
        <h1 className="text-lg font-semibold text-zinc-100">Realtime Kanban</h1>
      </header>

      <OnlineUsers />

      <div className="px-6 py-3 border-b border-zinc-800">
        <button
          onClick={handleAddList}
          className="flex items-center gap-1.5 text-sm text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded px-3 py-1.5 transition-colors"
        >
          <Plus size={14} />
          Add List
        </button>
      </div>

      <div className="flex gap-4 p-6 overflow-x-auto">
        {lists.map((list) => (
          <List
            key={list._id}
            list={{
              ...list,
              cards: cards.filter((card) => card.list === list._id)
            }}
            onAddCard={handleAddCard}
          />
        ))}
      </div>

      <LogsPanel />
    </div>
  )
}

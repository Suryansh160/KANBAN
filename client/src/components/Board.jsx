import { useState } from 'react'
import List from './List'
import ChatSheet from './ChatSheet'
import LogsPanel from './LogsPanel'
import OnlineUsers from './OnlineUsers'
import AddListDialog from './AddListDialog'
import AddCardDialog from './AddCardDialog'
import { Plus } from 'lucide-react'
import { useLists, useCreateList } from '../hooks/useLists'
import { useCards, useCreateCard, useUpdateCard } from '../hooks/useCards'
import EditCardDialog from './EditCardDialog'

export default function Board () {
  const {
    data: listsData,
    isLoading: listsLoading,
    isError: listsError
  } = useLists()
  const {
    data: cardsData,
    isLoading: cardsLoading,
    isError: cardsError
  } = useCards()

  const createList = useCreateList()
  const createCard = useCreateCard()

  const [listDialogOpen, setListDialogOpen] = useState(false)
  const [cardDialogOpen, setCardDialogOpen] = useState(false)
  const [activeListId, setActiveListId] = useState(null)

  const updateCard = useUpdateCard()
  const [editCardDialogOpen, setEditCardDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState(null)

  const handleEditCard = card => {
    setEditingCard(card)
    setEditCardDialogOpen(true)
  }

  const handleAddCardClick = listId => {
    setActiveListId(listId)
    setCardDialogOpen(true)
  }

  const handleCreateCard = data => {
    createCard.mutate({ ...data, list: activeListId })
  }

  if (listsLoading || cardsLoading) {
    return (
      <div className='min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm'>
        Loading board...
      </div>
    )
  }

  if (listsError || cardsError) {
    return (
      <div className='min-h-screen bg-zinc-950 flex items-center justify-center text-red-400 text-sm'>
        Failed to load board. Check your connection or login again.
      </div>
    )
  }

  const lists = listsData?.lists ?? []
  const cards = cardsData?.cards ?? []

  return (
    <div className='min-h-screen bg-zinc-950 pb-12'>
      <header className='flex items-center gap-3 px-6 py-4 border-b border-zinc-800'>
        <ChatSheet />
        <h1 className='text-lg font-semibold text-zinc-100'>Realtime Kanban</h1>
      </header>

      <OnlineUsers />

      <div className='px-6 py-3 border-b border-zinc-800'>
        <button
          onClick={() => setListDialogOpen(true)}
          className='flex items-center gap-1.5 text-sm text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded px-3 py-1.5 transition-colors'
        >
          <Plus size={14} />
          Add List
        </button>
      </div>

      <div className='flex gap-4 p-6 overflow-x-auto'>
        {lists.map(list => (
          <List
            key={list._id}
            list={{
              ...list,
              cards: cards.filter(card => card.list === list._id)
            }}
            onAddCard={handleAddCardClick}
            onEditCard={handleEditCard}
          />
        ))}
      </div>

      <LogsPanel />

      <AddListDialog
        open={listDialogOpen}
        onOpenChange={setListDialogOpen}
        onCreate={data => createList.mutate(data)}
        isPending={createList.isPending}
      />

      <AddCardDialog
        open={cardDialogOpen}
        onOpenChange={setCardDialogOpen}
        onCreate={handleCreateCard}
        isPending={createCard.isPending}
      />

      <EditCardDialog
        open={editCardDialogOpen}
        onOpenChange={setEditCardDialogOpen}
        card={editingCard}
        onUpdate={payload => updateCard.mutate(payload)}
        isPending={updateCard.isPending}
      />
    </div>
  )
}

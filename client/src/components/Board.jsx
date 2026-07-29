import { useState } from 'react'
import List from './List'
import ChatSheet from './ChatSheet'
import LogsPanel from './LogsPanel'
import OnlineUsers from './OnlineUsers'
import AddListDialog from './AddListDialog'
import AddCardDialog from './AddCardDialog'
import EditCardDialog from './EditCardDialog'
import KanbanCard from './KanbanCard'
import { Plus } from 'lucide-react'
import { useLists, useCreateList } from '../hooks/useLists'
import { useCards, useCreateCard, useUpdateCard } from '../hooks/useCards'
import { useSocket } from '../hooks/useSocket'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core'

export default function Board () {
  useSocket()

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
  const updateCard = useUpdateCard()

  const [listDialogOpen, setListDialogOpen] = useState(false)
  const [cardDialogOpen, setCardDialogOpen] = useState(false)
  const [editCardDialogOpen, setEditCardDialogOpen] = useState(false)
  const [activeListId, setActiveListId] = useState(null)
  const [editingCard, setEditingCard] = useState(null)
  const [activeCard, setActiveCard] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleAddCardClick = listId => {
    setActiveListId(listId)
    setCardDialogOpen(true)
  }

  const handleCreateCard = data => {
    createCard.mutate({ ...data, list: activeListId })
  }

  const handleEditCard = card => {
    setEditingCard(card)
    setEditCardDialogOpen(true)
  }

  const lists = listsData?.lists ?? []
  const cards = cardsData?.cards ?? []

  const handleDragStart = event => {
    const card = cards.find(c => c._id === event.active.id)
    setActiveCard(card || null)
  }

  const handleDragEnd = event => {
    const { active, over } = event
    setActiveCard(null)
    if (!over) return

    const activeCard = cards.find(c => c._id === active.id)
    if (!activeCard) return

    // Dropped over a card -> take that card's list, dropped over empty list area -> over.id is the list id
    const overType = over.data.current?.type
    const targetListId =
      overType === 'card' ? over.data.current.card.list : over.id

    if (!targetListId) return

    const targetListCards = cards
      .filter(c => c.list === targetListId && c._id !== activeCard._id)
      .sort((a, b) => a.position - b.position)

    let newPosition

    if (overType === 'card' && over.id !== active.id) {
      const overCard = over.data.current.card
      const overIndex = targetListCards.findIndex(c => c._id === overCard._id)
      newPosition = overIndex >= 0 ? overIndex : targetListCards.length
    } else {
      newPosition = targetListCards.length
    }

    // no-op if nothing actually changed
    if (activeCard.list === targetListId && activeCard.position === newPosition)
      return

    updateCard.mutate({
      id: activeCard._id,
      data: { list: targetListId, position: newPosition }
    })
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className='flex gap-4 p-6 overflow-x-auto'>
          {lists.map(list => (
            <List
              key={list._id}
              list={{
                ...list,
                cards: cards
                  .filter(card => card.list === list._id)
                  .sort((a, b) => a.position - b.position)
              }}
              onAddCard={handleAddCardClick}
              onEditCard={handleEditCard}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <KanbanCard card={activeCard} onEdit={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

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

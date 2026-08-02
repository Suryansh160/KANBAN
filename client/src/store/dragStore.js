import { create } from 'zustand'

export const useDragStore = create(set => ({
  draggingCards: {}, // { cardId: { userId, userName } }

  setDragging: (cardId, userId, userName) =>
    set(state => ({
      draggingCards: { ...state.draggingCards, [cardId]: { userId, userName } }
    })),

  clearDragging: cardId =>
    set(state => {
      const next = { ...state.draggingCards }
      delete next[cardId]
      return { draggingCards: next }
    })
}))

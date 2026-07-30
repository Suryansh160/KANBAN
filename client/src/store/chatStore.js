import { create } from 'zustand'

export const useChatStore = create(set => ({
  messages: [],
  unreadCount: 0,
  typingUsers: {},

  addMessage: message =>
    set(state => ({ messages: [...state.messages, message] })),

  incrementUnread: () => set(state => ({ unreadCount: state.unreadCount + 1 })),

  clearUnread: () => set({ unreadCount: 0 }),

  setTyping: (userId, name, isTyping) =>
    set(state => {
      const next = { ...state.typingUsers }
      if (isTyping) {
        next[userId] = name
      } else {
        delete next[userId]
      }
      return { typingUsers: next }
    })
}))

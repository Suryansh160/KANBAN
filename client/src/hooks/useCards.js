import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCards, createCard, updateCard, deleteCard } from '../api/cards'

export function useCards () {
  return useQuery({ queryKey: ['cards'], queryFn: getCards })
}

export function useCreateCard () {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createCard,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] })
  })
}

export function useUpdateCard () {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateCard,
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ['cards'] })
      const prevData = qc.getQueryData(['cards'])
      qc.setQueryData(['cards'], old =>
        old?.cards
          ? {
              ...old,
              cards: old.cards.map(c => (c._id === id ? { ...c, ...data } : c))
            }
          : old
      )
      return { prevData }
    },
    onError: (err, variables, context) => {
      if (context?.prevData) qc.setQueryData(['cards'], context.prevData)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['cards'] })
  })
}

export function useDeleteCard () {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteCard,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] })
  })
}

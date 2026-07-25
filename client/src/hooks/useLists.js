import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLists, createList, updateList, deleteList } from '../api/lists'

export function useLists () {
  return useQuery({ queryKey: ['lists'], queryFn: getLists })
}

export function useCreateList () {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createList,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lists'] })
  })
}

export function useUpdateList () {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateList,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lists'] })
  })
}

export function useDeleteList () {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lists'] })
      qc.invalidateQueries({ queryKey: ['cards'] })
    }
  })
}

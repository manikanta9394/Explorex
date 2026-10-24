import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SavedPlacesContext } from './SavedPlacesContextObject'
import { useAuth } from './useAuth'
import { fetchSavedPlaces, savePlace, unsavePlace } from '../lib/api/savedPlaces'

export function SavedPlacesProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || null
  const queryClient = useQueryClient()

  // 1. Fetch saved place IDs from Supabase DB via React Query
  const { data: savedIds = [], isLoading } = useQuery({
    queryKey: ['saved_places', userId],
    queryFn: async () => {
      if (!userId) return []
      return await fetchSavedPlaces(userId)
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  })

  // 2. Optimistic Mutation for Save/Unsave
  const saveMutation = useMutation({
    mutationFn: async ({ placeId, willSave }) => {
      if (!userId) throw new Error('No user session available')
      if (willSave) {
        return await savePlace(userId, placeId)
      } else {
        return await unsavePlace(userId, placeId)
      }
    },
    onMutate: async ({ placeId, willSave }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['saved_places', userId] })

      // Snapshot previous state for rollback on error
      const previousSaved = queryClient.getQueryData(['saved_places', userId]) || []

      // Optimistically update cache instantly
      queryClient.setQueryData(['saved_places', userId], (old = []) => {
        if (willSave) {
          return old.includes(placeId) ? old : [...old, placeId]
        } else {
          return old.filter((id) => id !== placeId)
        }
      })

      return { previousSaved }
    },
    onError: (err, _variables, context) => {
      // Rollback to previous state on failure
      if (context?.previousSaved) {
        queryClient.setQueryData(['saved_places', userId], context.previousSaved)
      }
      console.warn('[SavedPlaces] Database mutation failed, rolled back:', err)
    },
    onSettled: () => {
      // Invalidate to guarantee database synchronization
      queryClient.invalidateQueries({ queryKey: ['saved_places', userId] })
    },
  })

  const isSaved = useCallback(
    (id) => {
      if (!id) return false
      return savedIds.includes(id)
    },
    [savedIds]
  )

  const toggleSave = useCallback(
    (id) => {
      if (!id || !userId) return false
      const currentlySaved = savedIds.includes(id)
      saveMutation.mutate({ placeId: id, willSave: !currentlySaved })
      return true
    },
    [userId, savedIds, saveMutation]
  )

  return (
    <SavedPlacesContext.Provider value={{ savedIds, isSaved, toggleSave, isLoading }}>
      {children}
    </SavedPlacesContext.Provider>
  )
}

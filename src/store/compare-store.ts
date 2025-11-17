"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CompareItem {
  id: string
  name: string
  slug: string
  price: number
  discountPrice: number | null
  imageUrl: string
  brand: string
  category: string
  stockQuantity: number
  specifications: Array<{
    key: string
    value: string
  }>
}

interface CompareStore {
  items: CompareItem[]
  userId: string | null
  addItem: (item: CompareItem) => void
  removeItem: (id: string) => void
  clearCompare: () => void
  clearAll: () => void
  isInCompare: (id: string) => boolean
  setUserId: (userId: string | null) => void
  loadUserCompare: (userId: string | null) => void
  saveUserCompare: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      
      addItem: (item) => {
        const items = get().items
        
        // Maximum 4 items for comparison
        if (items.length >= 4) {
          return
        }
        
        const existingItem = items.find((i) => i.id === item.id)
        
        if (!existingItem) {
          set({ items: [...items, item] })
          get().saveUserCompare()
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
        get().saveUserCompare()
      },
      
      clearCompare: () => {
        set({ items: [] })
        get().saveUserCompare()
      },
      
      clearAll: () => {
        set({ items: [] })
        get().saveUserCompare()
      },
      
      isInCompare: (id) => {
        return get().items.some((i) => i.id === id)
      },

      setUserId: (userId: string | null) => {
        const currentUserId = get().userId
        
        if (currentUserId !== userId) {
          set({ userId })
          get().loadUserCompare(userId)
        }
      },

      loadUserCompare: (userId: string | null) => {
        if (!userId) {
          set({ items: [], userId: null })
        } else {
          const storageKey = `compare-storage-${userId}`
          const stored = localStorage.getItem(storageKey)
          
          if (stored) {
            try {
              const data = JSON.parse(stored)
              set({ items: data.items || [], userId })
            } catch (e) {
              set({ items: [], userId })
            }
          } else {
            set({ items: [], userId })
          }
        }
      },

      saveUserCompare: () => {
        const { userId, items } = get()
        if (userId) {
          const storageKey = `compare-storage-${userId}`
          localStorage.setItem(storageKey, JSON.stringify({ items }))
        }
      },
    }),
    {
      name: 'compare-storage-guest',
      version: 1,
      migrate: (persistedState: any) => {
        // Validate and clean up persisted data
        if (persistedState && Array.isArray(persistedState.items)) {
          persistedState.items = persistedState.items.filter((item: any) => 
            item && typeof item.price === 'number'
          )
        }
        return persistedState
      },
    }
  )
)

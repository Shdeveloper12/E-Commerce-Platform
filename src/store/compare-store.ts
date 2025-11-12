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
  addItem: (item: CompareItem) => void
  removeItem: (id: string) => void
  clearCompare: () => void
  isInCompare: (id: string) => boolean
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        
        // Maximum 4 items for comparison
        if (items.length >= 4) {
          return
        }
        
        const existingItem = items.find((i) => i.id === item.id)
        
        if (!existingItem) {
          set({ items: [...items, item] })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },
      
      clearCompare: () => {
        set({ items: [] })
      },
      
      isInCompare: (id) => {
        return get().items.some((i) => i.id === id)
      },
    }),
    {
      name: 'compare-storage',
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

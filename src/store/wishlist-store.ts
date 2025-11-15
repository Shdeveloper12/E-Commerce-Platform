"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: string
  slug: string
  price: number
  discountPrice: number | null
  imageUrl: string
  brand: string
  category: string
  stockQuantity: number
  addedAt: string
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
  getTotalItems: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)
        
        if (!existingItem) {
          set({ 
            items: [...items, { 
              ...item, 
              addedAt: new Date().toISOString() 
            }] 
          })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
      
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id)
      },
      
      getTotalItems: () => {
        return get().items.length
      },
    }),
    {
      name: 'wishlist-storage',
      version: 1,
      migrate: (persistedState: any) => {
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

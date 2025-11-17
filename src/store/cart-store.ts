"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  discountPrice: number | null
  quantity: number
  imageUrl: string
  stockQuantity: number
  brand: string
}

interface CartStore {
  items: CartItem[]
  userId: string | null
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  setUserId: (userId: string | null) => void
  loadUserCart: (userId: string | null) => void
  saveUserCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [] as CartItem[],
      userId: null,
      
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)
        
        if (existingItem) {
          const newItems = items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: Math.min(i.quantity + 1, item.stockQuantity) }
              : i
          )
          set({ items: newItems })
          get().saveUserCart()
        } else {
          const newItems = [...items, { ...item, quantity: 1 }]
          set({ items: newItems })
          get().saveUserCart()
        }
      },
      
      removeItem: (id) => {
        const newItems = get().items.filter((i) => i.id !== id)
        set({ items: newItems })
        get().saveUserCart()
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        const newItems = get().items.map((i) =>
          i.id === id
            ? { ...i, quantity: Math.min(quantity, i.stockQuantity) }
            : i
        )
        set({ items: newItems })
        get().saveUserCart()
      },
      
      clearCart: () => {
        set({ items: [] })
        get().saveUserCart()
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.discountPrice || item.price || 0
          return total + price * item.quantity
        }, 0)
      },

      setUserId: (userId: string | null) => {
        const currentUserId = get().userId
        
        // If userId changed, load the new user's cart
        if (currentUserId !== userId) {
          set({ userId })
          get().loadUserCart(userId)
        }
      },

      loadUserCart: (userId: string | null) => {
        if (!userId) {
          // User logged out - clear cart
          set({ items: [], userId: null })
        } else {
          // User logged in - load their cart from storage
          const storageKey = `cart-storage-${userId}`
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

      saveUserCart: () => {
        const { userId, items } = get()
        if (userId) {
          const storageKey = `cart-storage-${userId}`
          localStorage.setItem(storageKey, JSON.stringify({ items }))
        }
      },
    }),
    {
      name: 'cart-storage-guest',
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

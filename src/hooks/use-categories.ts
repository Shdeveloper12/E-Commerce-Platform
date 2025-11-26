'use client'

import { useState, useEffect } from 'react'

interface SubCategory {
  name: string
  href: string
}

interface Category {
  name: string
  href: string
  subcategories: SubCategory[]
}

export function useCategoriesFromDB() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading }
}

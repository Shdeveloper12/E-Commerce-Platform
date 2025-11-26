'use server'

import { db } from '@/lib/db'

export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        sortOrder: true,
      },
    })

    // Organize into parent-child structure
    const parentCategories = categories.filter(cat => !cat.parentId)
    const childCategories = categories.filter(cat => cat.parentId)

    const organizedCategories = parentCategories.map(parent => ({
      name: parent.name,
      href: `/category/${parent.slug}`,
      subcategories: childCategories
        .filter(child => child.parentId === parent.id)
        .map(child => ({
          name: child.name,
          href: `/category/${child.slug}`,
        })),
    }))

    return organizedCategories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

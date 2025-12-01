import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Revalidate every 5 minutes
export const revalidate = 300

export async function GET() {
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
      slug: parent.slug,
      subcategories: childCategories
        .filter(child => child.parentId === parent.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(child => ({
          name: child.name,
          href: `/category/${child.slug}`,
          slug: child.slug,
        })),
    }))

    return NextResponse.json(organizedCategories, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

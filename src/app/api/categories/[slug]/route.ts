import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const category = await db.category.findUnique({
      where: { slug: params.slug },
      include: {
        children: true, // Get subcategories
        products: {
          where: {
            isActive: true,
          },
          include: {
            category: true,
            images: {
              orderBy: {
                sortOrder: 'asc',
              },
              take: 1,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!category || !category.isActive) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if this is a main category (has children/subcategories)
    const isMainCategory = category.children && category.children.length > 0

    // If it's a main category, get all products from this category AND all its subcategories
    let allProducts = [...category.products]

    if (isMainCategory) {
      // Get subcategory IDs
      const subcategoryIds = category.children.map((child) => child.id)

      // Fetch products from all subcategories
      const subcategoryProducts = await db.product.findMany({
        where: {
          categoryId: {
            in: subcategoryIds,
          },
          isActive: true,
        },
        include: {
          category: true,
          images: {
            orderBy: {
              sortOrder: 'asc',
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      allProducts = [...allProducts, ...subcategoryProducts]
    }

    return NextResponse.json({
      ...category,
      products: allProducts,
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

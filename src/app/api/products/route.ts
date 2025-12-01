import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Revalidate every 60 seconds
export const revalidate = 60

// Query parameters validation schema
const querySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('12').transform(Number),
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().optional().transform(Number),
  maxPrice: z.string().optional().transform(Number),
  brand: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const validatedQuery = querySchema.parse(Object.fromEntries(searchParams))

    const {
      page,
      limit,
      category,
      search,
      minPrice,
      maxPrice,
      brand,
      sortBy,
      sortOrder,
    } = validatedQuery

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (category) {
      where.category = {
        slug: category,
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' }
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Get products with pagination
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            where: {
              isPrimary: true,
            },
            select: {
              id: true,
              imageUrl: true,
              altText: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ])

    // Get unique brands for filtering
    const brands = await db.product.findMany({
      where: { isActive: true },
      select: { brand: true },
      distinct: ['brand'],
    })

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
        filters: {
          brands: brands.map((b) => b.brand).filter(Boolean),
        },
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// Create product validation schema
const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Product slug is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  discountPrice: z.number().optional(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  stockQuantity: z.number().int().min(0, 'Stock quantity must be non-negative'),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  images: z.array(
    z.object({
      imageUrl: z.string().url('Invalid image URL'),
      altText: z.string().optional(),
      isPrimary: z.boolean().default(false),
      sortOrder: z.number().int().min(0).default(0),
    })
  ).optional(),
  specifications: z.array(
    z.object({
      key: z.string().min(1, 'Specification key is required'),
      value: z.string().min(1, 'Specification value is required'),
    })
  ).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    // Check if product with same slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product with this slug already exists',
        },
        { status: 409 }
      )
    }

    // Check if category exists
    const category = await db.category.findUnique({
      where: { id: validatedData.categoryId },
    })

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      )
    }

    // Create product with images and specifications
    const product = await db.product.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        shortDescription: validatedData.shortDescription,
        price: validatedData.price,
        discountPrice: validatedData.discountPrice,
        sku: validatedData.sku,
        brand: validatedData.brand,
        categoryId: validatedData.categoryId,
        stockQuantity: validatedData.stockQuantity,
        isFeatured: validatedData.isFeatured,
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        images: validatedData.images
          ? {
              create: validatedData.images,
            }
          : undefined,
        specifications: validatedData.specifications
          ? {
              create: validatedData.specifications,
            }
          : undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: true,
        specifications: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully',
    })
  } catch (error) {
    console.error('Error creating product:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid product data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
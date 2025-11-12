import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET all products
export async function GET(request: NextRequest) {
  try {
    const products = await db.product.findMany({
      include: {
        category: true,
        images: true,
        specifications: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      discountPrice,
      sku,
      brand,
      categoryId,
      stockQuantity,
      isActive,
      isFeatured,
      metaTitle,
      metaDescription,
      images,
      specifications,
    } = body

    // Check if slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 400 }
      )
    }

    // Create product with images and specifications
    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        price,
        discountPrice,
        sku,
        brand,
        categoryId,
        stockQuantity,
        isActive,
        isFeatured,
        metaTitle,
        metaDescription,
        images: {
          create: images?.map((imageUrl: string, index: number) => ({
            imageUrl,
            isPrimary: index === 0,
            sortOrder: index,
          })) || [],
        },
        specifications: {
          create: specifications?.map((spec: { key: string; value: string }) => ({
            key: spec.key,
            value: spec.value,
          })) || [],
        },
      },
      include: {
        images: true,
        specifications: true,
        category: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

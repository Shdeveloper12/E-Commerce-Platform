import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: true,
        specifications: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: params.id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Check if slug is taken by another product
    if (slug !== existingProduct.slug) {
      const slugTaken = await db.product.findUnique({
        where: { slug },
      })

      if (slugTaken) {
        return NextResponse.json(
          { error: "Product with this slug already exists" },
          { status: 400 }
        )
      }
    }

    // Delete existing images and specifications
    await db.productImage.deleteMany({
      where: { productId: params.id },
    })

    await db.productSpecification.deleteMany({
      where: { productId: params.id },
    })

    // Update product with new data
    const product = await db.product.update({
      where: { id: params.id },
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

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Delete product (cascade will delete images and specifications)
    await db.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}

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

    return NextResponse.json({
      message: "Product updated successfully",
      product,
    })
  } catch (error: any) {
    console.error("Error updating product:", error)
    
    let errorMessage = "Failed to update product"
    
    if (error.code === 'P2002') {
      const target = error.meta?.target
      if (target?.includes('slug')) {
        errorMessage = "A product with this slug already exists"
      } else if (target?.includes('sku')) {
        errorMessage = "A product with this SKU already exists"
      } else {
        errorMessage = "Duplicate value detected"
      }
    } else if (error.code === 'P2003') {
      errorMessage = "Invalid category selected or category does not exist"
    } else if (error.code === 'P2025') {
      errorMessage = "Product not found"
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    )
  }
}

// DELETE product (Soft Delete - Logical Deletion)
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
      include: {
        orderItems: true,
        cartItems: true,
        reviews: true,
        wishlistItems: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Check if product is associated with any orders
    const hasOrders = product.orderItems.length > 0

    if (hasOrders) {
      // Soft delete - set isActive to false instead of deleting
      const updatedProduct = await db.product.update({
        where: { id: params.id },
        data: {
          isActive: false,
          isFeatured: false, // Also remove from featured if it was featured
        },
      })

      return NextResponse.json({
        message: "Product deactivated successfully (soft delete)",
        type: "soft_delete",
        product: {
          id: updatedProduct.id,
          name: updatedProduct.name,
          isActive: updatedProduct.isActive,
        },
        reason: "Product has associated orders and cannot be permanently deleted",
      })
    } else {
      // Hard delete - completely remove the product if no orders exist
      // First remove from cart and wishlist
      await db.cartItem.deleteMany({
        where: { productId: params.id },
      })

      await db.wishlistItem.deleteMany({
        where: { productId: params.id },
      })

      // Delete reviews
      await db.productReview.deleteMany({
        where: { productId: params.id },
      })

      // Delete product (cascade will delete images and specifications)
      await db.product.delete({
        where: { id: params.id },
      })

      return NextResponse.json({
        message: "Product permanently deleted successfully",
        type: "hard_delete",
        productId: params.id,
      })
    }
  } catch (error: any) {
    console.error("Error deleting product:", error)
    
    let errorMessage = "Failed to delete product"
    if (error.code === 'P2003') {
      errorMessage = "Cannot delete product due to existing references. Product will be deactivated instead."
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    )
  }
}

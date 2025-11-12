import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST - Bulk operations on products
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, productIds } = body

    if (!action || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. Provide action and productIds array." },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case "activate":
        // Activate multiple products
        result = await db.product.updateMany({
          where: { id: { in: productIds } },
          data: { isActive: true },
        })
        return NextResponse.json({
          message: `${result.count} product(s) activated successfully`,
          count: result.count,
        })

      case "deactivate":
        // Deactivate multiple products
        result = await db.product.updateMany({
          where: { id: { in: productIds } },
          data: { isActive: false },
        })
        return NextResponse.json({
          message: `${result.count} product(s) deactivated successfully`,
          count: result.count,
        })

      case "feature":
        // Mark products as featured
        result = await db.product.updateMany({
          where: { id: { in: productIds } },
          data: { isFeatured: true },
        })
        return NextResponse.json({
          message: `${result.count} product(s) marked as featured`,
          count: result.count,
        })

      case "unfeature":
        // Remove featured status
        result = await db.product.updateMany({
          where: { id: { in: productIds } },
          data: { isFeatured: false },
        })
        return NextResponse.json({
          message: `${result.count} product(s) removed from featured`,
          count: result.count,
        })

      case "delete":
        // Only ADMIN can bulk delete
        if (session.user.role !== "ADMIN") {
          return NextResponse.json({ error: "Only admins can delete products" }, { status: 403 })
        }

        // Soft delete products (set isActive to false)
        result = await db.product.updateMany({
          where: { id: { in: productIds } },
          data: { 
            isActive: false,
            isFeatured: false,
          },
        })
        return NextResponse.json({
          message: `${result.count} product(s) deleted successfully (soft delete)`,
          count: result.count,
          type: "soft_delete",
        })

      case "update_category":
        // Update category for multiple products
        const { categoryId } = body
        if (!categoryId) {
          return NextResponse.json(
            { error: "categoryId is required for update_category action" },
            { status: 400 }
          )
        }

        // Verify category exists
        const category = await db.category.findUnique({
          where: { id: categoryId },
        })

        if (!category) {
          return NextResponse.json({ error: "Category not found" }, { status: 404 })
        }

        result = await db.product.updateMany({
          where: { id: { in: productIds } },
          data: { categoryId },
        })
        return NextResponse.json({
          message: `${result.count} product(s) moved to category "${category.name}"`,
          count: result.count,
        })

      case "update_stock":
        // Update stock for multiple products
        const { stockQuantity } = body
        if (stockQuantity === undefined || stockQuantity === null) {
          return NextResponse.json(
            { error: "stockQuantity is required for update_stock action" },
            { status: 400 }
          )
        }

        result = await db.product.updateMany({
          where: { id: { in: productIds } },
          data: { stockQuantity: parseInt(stockQuantity) },
        })
        return NextResponse.json({
          message: `Stock updated to ${stockQuantity} for ${result.count} product(s)`,
          count: result.count,
        })

      case "apply_discount":
        // Apply percentage discount to multiple products
        const { discountPercentage } = body
        if (!discountPercentage || discountPercentage < 0 || discountPercentage > 100) {
          return NextResponse.json(
            { error: "Valid discountPercentage (0-100) is required" },
            { status: 400 }
          )
        }

        // Get products to calculate discount
        const products = await db.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, price: true },
        })

        // Update each product with calculated discount price
        const updatePromises = products.map((product) => {
          const discountPrice = Number(product.price) * (1 - discountPercentage / 100)
          return db.product.update({
            where: { id: product.id },
            data: { discountPrice: discountPrice },
          })
        })

        await Promise.all(updatePromises)

        return NextResponse.json({
          message: `${discountPercentage}% discount applied to ${products.length} product(s)`,
          count: products.length,
        })

      case "remove_discount":
        // Remove discount from multiple products
        result = await db.product.updateMany({
          where: { id: { in: productIds } },
          data: { discountPrice: null },
        })
        return NextResponse.json({
          message: `Discount removed from ${result.count} product(s)`,
          count: result.count,
        })

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error("Error performing bulk operation:", error)
    return NextResponse.json(
      { error: "Failed to perform bulk operation", details: error.message },
      { status: 500 }
    )
  }
}

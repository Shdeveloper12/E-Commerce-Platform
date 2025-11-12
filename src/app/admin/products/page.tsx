import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import ProductsTable from "@/components/admin/products-table"

export default async function ProductsPage() {
  const products = await db.product.findMany({
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      _count: {
        select: {
          orderItems: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Transform Decimal to number for client component
  const productsData = products.map((product) => ({
    ...product,
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
  }))

  const activeProducts = products.filter((p) => p.isActive).length
  const featuredProducts = products.filter((p) => p.isFeatured).length
  const lowStockProducts = products.filter((p) => p.stockQuantity < 10).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Total Products</div>
            <div className="text-3xl font-bold mt-2">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Active Products</div>
            <div className="text-3xl font-bold mt-2 text-green-600">{activeProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Featured Products</div>
            <div className="text-3xl font-bold mt-2 text-yellow-600">{featuredProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Low Stock</div>
            <div className="text-3xl font-bold mt-2 text-red-600">{lowStockProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductsTable products={productsData} />
        </CardContent>
      </Card>
    </div>
  )
}

import { db } from "@/lib/db"
import ProductForm from "@/components/admin/product-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      parent: true,
      children: true,
    },
  })

  // If no categories exist, show message to create categories first
  if (categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-gray-600 mt-2">Create a new product for your store</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">No Categories Found</h3>
              <p className="text-yellow-800 mb-4">
                You need to create product categories before adding products. Categories help organize your products.
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-yellow-900 mb-2">Quick Setup (Recommended):</p>
                  <form action="/api/admin/categories/seed" method="POST">
                    <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
                      Create Default Categories
                    </Button>
                  </form>
                  <p className="text-sm text-yellow-700 mt-2">
                    This will create 15 default categories (Desktop, Laptop, Phone, etc.)
                  </p>
                </div>

                <div className="border-t border-yellow-200 pt-3">
                  <p className="font-semibold text-yellow-900 mb-2">Or create manually:</p>
                  <Link href="/admin/categories">
                    <Button variant="outline">
                      Go to Categories Page
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-600 mt-2">Create a new product for your store</p>
        </div>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}

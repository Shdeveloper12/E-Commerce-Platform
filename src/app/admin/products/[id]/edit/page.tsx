import { db } from "@/lib/db"
import ProductForm from "@/components/admin/product-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      specifications: true,
    },
  })

  if (!product) {
    notFound()
  }

  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      parent: true,
      children: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product information</p>
        </div>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  )
}

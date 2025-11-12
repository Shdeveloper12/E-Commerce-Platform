"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, EyeOff, Star, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

interface Product {
  id: string
  name: string
  slug: string
  sku?: string | null
  price: number
  discountPrice?: number | null
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
  category: {
    name: string
  }
  images: Array<{
    imageUrl: string
    isPrimary: boolean
  }>
  _count?: {
    orderItems: number
  }
}

interface ProductsTableProps {
  products: Product[]
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDeleteClick = async (product: Product) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      html: `
        Are you sure you want to delete <strong>${product.name}</strong>?
        <br><br>
        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 12px; font-size: 13px; text-align: left;">
          <strong>⚠️ Note:</strong> If this product has any orders, it will be deactivated (soft delete) instead of permanently deleted. Otherwise, it will be completely removed from the database.
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    })

    if (!result.isConfirmed) return

    setLoading(true)
    
    // Show loading
    Swal.fire({
      title: "Deleting...",
      text: "Please wait while we process your request",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product")
      }

      // Show success message based on delete type
      if (data.type === "soft_delete") {
        await Swal.fire({
          icon: "info",
          title: "Product Deactivated",
          html: `
            <p><strong>${product.name}</strong> has been deactivated.</p>
            <br>
            <p style="font-size: 14px; color: #6b7280;">
              ${data.reason}
            </p>
            <br>
            <p style="font-size: 13px; color: #6b7280;">
              The product is still in the database but hidden from customers.
            </p>
          `,
          confirmButtonColor: "#f97316",
        })
      } else {
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `${product.name} has been permanently deleted.`,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        })
      }

      // Refresh the page to show updated list
      router.refresh()
    } catch (error: any) {
      console.error("Delete error:", error)
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message || "An error occurred while deleting the product",
        confirmButtonColor: "#f97316",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (product: Product) => {
    setLoading(true)
    
    Swal.fire({
      title: "Updating...",
      text: "Please wait",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          price: Number(product.price),
          discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
          isActive: !product.isActive,
          categoryId: product.category ? (product as any).categoryId : null,
          images: product.images.map((img) => img.imageUrl),
          specifications: [],
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update product")
      }

      await Swal.fire({
        icon: "success",
        title: !product.isActive ? "Activated!" : "Deactivated!",
        text: `Product ${!product.isActive ? "activated" : "deactivated"} successfully`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })

      router.refresh()
    } catch (error: any) {
      console.error("Toggle active error:", error)
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Failed to update product status",
        confirmButtonColor: "#f97316",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFeatured = async (product: Product) => {
    setLoading(true)
    
    Swal.fire({
      title: "Updating...",
      text: "Please wait",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          price: Number(product.price),
          discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
          isFeatured: !product.isFeatured,
          categoryId: product.category ? (product as any).categoryId : null,
          images: product.images.map((img) => img.imageUrl),
          specifications: [],
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update product")
      }

      await Swal.fire({
        icon: "success",
        title: !product.isFeatured ? "Featured!" : "Unfeatured!",
        text: `Product ${!product.isFeatured ? "added to" : "removed from"} featured section`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })

      router.refresh()
    } catch (error: any) {
      console.error("Toggle featured error:", error)
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Failed to update featured status",
        confirmButtonColor: "#f97316",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Image</th>
              <th className="text-left py-3 px-4">Product</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Price</th>
              <th className="text-left py-3 px-4">Stock</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No products yet</p>
                  <p className="text-gray-400 text-sm">Add your first product to get started</p>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="w-16 h-16 bg-gray-200 rounded relative overflow-hidden">
                      {product.images[0]?.imageUrl ? (
                        <Image
                          src={product.images[0].imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <div className="font-medium">{product.name}</div>
                      {product.sku && (
                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                      )}
                      <div className="flex gap-1 mt-1">
                        {product.isFeatured && (
                          <Badge variant="default" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{product.category.name}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <div className="font-semibold">৳{Number(product.price).toFixed(2)}</div>
                      {product.discountPrice && (
                        <div className="text-sm text-green-600 font-medium">
                          ৳{Number(product.discountPrice).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-medium ${
                        product.stockQuantity > 10
                          ? "text-green-600"
                          : product.stockQuantity > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                      className={
                        product.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(product)}
                        disabled={loading}
                        title={product.isActive ? "Deactivate" : "Activate"}
                      >
                        {product.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(product)}
                        disabled={loading}
                        title={product.isFeatured ? "Remove from Featured" : "Add to Featured"}
                        className={product.isFeatured ? "text-yellow-600" : ""}
                      >
                        <Star className={`w-4 h-4 ${product.isFeatured ? "fill-current" : ""}`} />
                      </Button>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClick(product)}
                        disabled={loading}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

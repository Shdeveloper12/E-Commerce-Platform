"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, X, Upload } from "lucide-react"
import Swal from "sweetalert2"

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  parent?: {
    id: string
    name: string
  } | null
  children?: Category[]
}

interface ProductFormProps {
  product?: any
  categories: Category[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>(product?.images?.map((img: any) => img.imageUrl) || [])
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>(
    product?.specifications || []
  )
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.categoryId || "")
  const [isActive, setIsActive] = useState<boolean>(product?.isActive !== false)
  const [isFeatured, setIsFeatured] = useState<boolean>(product?.isFeatured || false)

  // Organize categories hierarchically
  const parentCategories = categories.filter(cat => !cat.parentId)
  const childCategories = categories.filter(cat => cat.parentId)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate category selection
    if (!selectedCategory) {
      Swal.fire({
        icon: "warning",
        title: "Missing Category",
        text: "Please select a category for the product",
        confirmButtonColor: "#f97316",
      })
      return
    }

    // Validate required fields
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const price = formData.get("price") as string
    const stockQuantity = formData.get("stockQuantity") as string

    if (!name || !slug || !price) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields (Name, Slug, Price)",
        confirmButtonColor: "#f97316",
      })
      return
    }
    
    setLoading(true)

    // Filter out empty specifications
    const validSpecifications = specifications.filter(
      (spec) => spec.key.trim() !== "" && spec.value.trim() !== ""
    )

    const data = {
      name,
      slug,
      description: formData.get("description") || null,
      shortDescription: formData.get("shortDescription") || null,
      price: parseFloat(price),
      discountPrice: formData.get("discountPrice") ? parseFloat(formData.get("discountPrice") as string) : null,
      sku: formData.get("sku") || null,
      brand: formData.get("brand") || null,
      categoryId: selectedCategory,
      stockQuantity: parseInt(stockQuantity) || 0,
      isActive: isActive,
      isFeatured: isFeatured,
      metaTitle: formData.get("metaTitle") || null,
      metaDescription: formData.get("metaDescription") || null,
      images,
      specifications: validSpecifications,
    }

    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products"
      const method = product ? "PUT" : "POST"

      console.log("Submitting product data:", data)

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      console.log("API Response:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to save product: ${response.status}`)
      }

      // Show success animation
      await Swal.fire({
        icon: "success",
        title: product ? "Product Updated!" : "Product Created!",
        text: product 
          ? `${name} has been updated successfully` 
          : `${name} has been added to your inventory`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      })

      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      console.error("Error saving product:", error)
      
      Swal.fire({
        icon: "error",
        title: "Failed to Save",
        text: error.message || "An error occurred while saving the product",
        confirmButtonColor: "#f97316",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const filesArray = Array.from(files)
    const invalidFiles = filesArray.filter(file => !validTypes.includes(file.type))

    if (invalidFiles.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid File Type",
        text: "Please upload only images (JPEG, PNG, GIF, WebP)",
        confirmButtonColor: "#f97316",
      })
      return
    }

    // Validate file size (max 32MB per file)
    const maxSize = 32 * 1024 * 1024 // 32MB in bytes
    const oversizedFiles = filesArray.filter(file => file.size > maxSize)

    if (oversizedFiles.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "File Too Large",
        text: "Each image must be less than 32MB",
        confirmButtonColor: "#f97316",
      })
      return
    }

    try {
      setLoading(true)
      
      // Show uploading message
      Swal.fire({
        title: "Uploading Images...",
        text: `Uploading ${filesArray.length} image(s) to ImgBB`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })
      
      // Import the upload function
      const { uploadMultipleToImgBB } = await import('@/lib/imgbb')
      
      // Upload all images to ImgBB
      const uploadedUrls = await uploadMultipleToImgBB(filesArray)
      
      // Add uploaded URLs to images array
      setImages([...images, ...uploadedUrls])
      
      // Show success message
      Swal.fire({
        icon: "success",
        title: "Upload Successful!",
        text: `Successfully uploaded ${uploadedUrls.length} image(s)`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })
    } catch (error: any) {
      console.error('Image upload error:', error)
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.message || "Failed to upload images. Please check your ImgBB API key and try again.",
        confirmButtonColor: "#f97316",
      })
    } finally {
      setLoading(false)
      // Reset file input
      e.target.value = ""
    }
  }

  const removeImage = async (index: number) => {
    const result = await Swal.fire({
      title: "Remove Image?",
      text: "Are you sure you want to remove this image?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      setImages(images.filter((_, i) => i !== index))
      Swal.fire({
        icon: "success",
        title: "Removed!",
        text: "Image has been removed",
        showConfirmButton: false,
        timer: 1000,
      })
    }
  }

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }])
  }

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    const updated = [...specifications]
    updated[index][field] = value
    setSpecifications(updated)
  }

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={product?.name}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={product?.slug}
                  required
                  placeholder="product-url-slug"
                />
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={product?.shortDescription}
                  rows={2}
                  placeholder="Brief product description"
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={product?.description}
                  rows={6}
                  placeholder="Detailed product description"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={product?.price}
                    required
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="discountPrice">Discount Price</Label>
                  <Input
                    id="discountPrice"
                    name="discountPrice"
                    type="number"
                    step="0.01"
                    defaultValue={product?.discountPrice}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    defaultValue={product?.sku}
                    placeholder="PRODUCT-SKU"
                  />
                </div>

                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    defaultValue={product?.stockQuantity || 0}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  defaultValue={product?.brand}
                  placeholder="Brand name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={loading}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <label className={`aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-gray-400'} transition-colors`}>
                  <div className="text-center">
                    {loading ? (
                      <>
                        <div className="w-8 h-8 mx-auto border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-500 mt-2 block">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <span className="text-sm text-gray-500 mt-2 block">Upload</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={loading}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Images will be uploaded to ImgBB. Supported formats: JPG, PNG, GIF. Max 32MB per image.
              </p>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Key (e.g., Processor)"
                    value={spec.key}
                    onChange={(e) => updateSpecification(index, "key", e.target.value)}
                  />
                  <Input
                    placeholder="Value (e.g., Intel i7)"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, "value", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSpecification(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addSpecification}>
                <Plus className="w-4 h-4 mr-2" />
                Add Specification
              </Button>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  defaultValue={product?.metaTitle}
                  placeholder="SEO title"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  defaultValue={product?.metaDescription}
                  rows={3}
                  placeholder="SEO description"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="categoryId">Category *</Label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-[400px]">
                  {parentCategories.map((parent) => (
                    <div key={parent.id}>
                      {/* Parent Category */}
                      <SelectItem value={parent.id} className="font-semibold">
                        {parent.name}
                      </SelectItem>
                      
                      {/* Child Categories */}
                      {childCategories
                        .filter(child => child.parentId === parent.id)
                        .map((child) => (
                          <SelectItem 
                            key={child.id} 
                            value={child.id}
                            className="pl-8"
                          >
                            ↳ {child.name}
                          </SelectItem>
                        ))
                      }
                    </div>
                  ))}
                  
                  {/* Orphan categories (no parent) */}
                  {categories.filter(cat => cat.parentId && !categories.find(p => p.id === cat.parentId)).map((orphan) => (
                    <SelectItem key={orphan.id} value={orphan.id}>
                      {orphan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                {selectedCategory && (() => {
                  const selected = categories.find(c => c.id === selectedCategory)
                  if (selected?.parentId) {
                    const parent = categories.find(c => c.id === selected.parentId)
                    return parent ? `${parent.name} → ${selected.name}` : selected.name
                  }
                  return selected?.name || ''
                })()}
              </p>
              {!selectedCategory && (
                <p className="text-xs text-red-500 mt-1">Please select a category</p>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  name="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Featured</Label>
                <Switch
                  id="isFeatured"
                  name="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestUploadPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Test 1: Check ImgBB API Key
  const testApiKey = () => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
    setResult({
      test: "API Key Check",
      hasKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      keyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : "Not set"
    })
  }

  // Test 2: Test Image Upload to ImgBB
  const testImageUpload = async () => {
    try {
      setLoading(true)
      setError(null)

      // Create a test canvas image
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#FF6B00'
        ctx.fillRect(0, 0, 100, 100)
        ctx.fillStyle = 'white'
        ctx.font = '20px Arial'
        ctx.fillText('TEST', 25, 55)
      }

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      })

      const file = new File([blob], 'test-image.png', { type: 'image/png' })

      const { uploadToImgBB } = await import('@/lib/imgbb')
      const imageUrl = await uploadToImgBB(file)

      setResult({
        test: "Image Upload Test",
        success: true,
        imageUrl,
        fileSize: file.size,
        fileName: file.name
      })
    } catch (err: any) {
      setError(err.message)
      setResult({
        test: "Image Upload Test",
        success: false,
        error: err.message
      })
    } finally {
      setLoading(false)
    }
  }

  // Test 3: Test Product Creation
  const testProductCreation = async () => {
    try {
      setLoading(true)
      setError(null)

      const testProduct = {
        name: "Test Product " + Date.now(),
        slug: "test-product-" + Date.now(),
        description: "This is a test product description",
        shortDescription: "Test short description",
        price: 1000,
        discountPrice: null,
        sku: "TEST-SKU-" + Date.now(),
        brand: "Test Brand",
        categoryId: "", // Will need to be filled
        stockQuantity: 10,
        isActive: true,
        isFeatured: false,
        metaTitle: "Test Product",
        metaDescription: "Test product meta description",
        images: [],
        specifications: []
      }

      // First, get categories
      const categoriesRes = await fetch('/api/admin/categories')
      const categories = await categoriesRes.json()

      if (categories && categories.length > 0) {
        testProduct.categoryId = categories[0].id
      } else {
        throw new Error("No categories found. Please seed categories first.")
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testProduct)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product')
      }

      setResult({
        test: "Product Creation Test",
        success: true,
        productId: data.id,
        productName: data.name,
        response: data
      })
    } catch (err: any) {
      setError(err.message)
      setResult({
        test: "Product Creation Test",
        success: false,
        error: err.message
      })
    } finally {
      setLoading(false)
    }
  }

  // Test 4: Check Categories
  const testCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/categories')
      const categories = await response.json()

      setResult({
        test: "Categories Check",
        categoryCount: categories.length,
        categories: categories.map((cat: any) => ({ id: cat.id, name: cat.name }))
      })
    } catch (err: any) {
      setError(err.message)
      setResult({
        test: "Categories Check",
        success: false,
        error: err.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product Upload Diagnostic Tool</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button onClick={testApiKey} disabled={loading}>
          Test 1: Check ImgBB API Key
        </Button>
        <Button onClick={testImageUpload} disabled={loading}>
          Test 2: Test Image Upload
        </Button>
        <Button onClick={testCategories} disabled={loading}>
          Test 3: Check Categories
        </Button>
        <Button onClick={testProductCreation} disabled={loading}>
          Test 4: Test Product Creation
        </Button>
      </div>

      {loading && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-3">Running test...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mb-6 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Test Result: {result.test}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  BsCart3,
  BsHeart,
  BsHeartFill,
  BsStar,
  BsStarFill,
  BsStarHalf,
  BsCheck,
  BsX,
  BsShare,
  BsTruck,
  BsShield,
  BsArrowRepeat,
} from "react-icons/bs"
import { TbScale } from "react-icons/tb"
import { FiMinus, FiPlus } from "react-icons/fi"
import Swal from "sweetalert2"
import { useCartStore } from "@/store/cart-store"
import { useCompareStore } from "@/store/compare-store"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  discountPrice: number | null
  sku: string
  brand: string
  stockQuantity: number
  category: {
    id: string
    name: string
    slug: string
  }
  images: Array<{
    id: string
    imageUrl: string
    isPrimary: boolean
    sortOrder: number
  }>
  specifications: Array<{
    id: string
    key: string
    value: string
  }>
  reviews: Array<{
    id: string
    rating: number
    comment: string
    userName: string
    createdAt: string
  }>
}

interface RelatedProduct {
  id: string
  name: string
  slug: string
  price: number
  discountPrice: number | null
  brand: string
  imageUrl: string
  stockQuantity: number
  category: string
}

interface ProductDetailsClientProps {
  product: Product
  relatedProducts: RelatedProduct[]
}

export default function ProductDetailsClient({
  product,
  relatedProducts,
}: ProductDetailsClientProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]?.imageUrl || "/placeholder.png")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  const { addItem: addToCartStore } = useCartStore()
  const { addItem: addToCompare, isInCompare, removeItem: removeFromCompare, items: compareItems } = useCompareStore()

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  const finalPrice = product.discountPrice || product.price
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0

  const isProductInCompare = isInCompare(product.id)

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment" && quantity < product.stockQuantity) {
      setQuantity(quantity + 1)
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCartStore({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        imageUrl: product.images[0]?.imageUrl || "/placeholder.png",
        stockQuantity: product.stockQuantity,
        brand: product.brand,
      })
    }
    
    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${quantity} x ${product.name} added to your cart`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    setTimeout(() => {
      window.location.href = "/checkout"
    }, 1600)
  }

  const handleCompare = () => {
    if (isProductInCompare) {
      removeFromCompare(product.id)
      Swal.fire({
        icon: "success",
        title: "Removed from Compare",
        showConfirmButton: false,
        timer: 1000,
      })
    } else {
      if (compareItems.length >= 4) {
        Swal.fire({
          icon: "warning",
          title: "Compare Limit Reached",
          text: "You can compare up to 4 products at a time",
          confirmButtonColor: "#f97316",
        })
        return
      }
      
      addToCompare({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        imageUrl: product.images[0]?.imageUrl || "/placeholder.png",
        brand: product.brand,
        category: product.category.name,
        stockQuantity: product.stockQuantity,
        specifications: product.specifications,
      })
      
      Swal.fire({
        icon: "success",
        title: "Added to Compare",
        showConfirmButton: false,
        timer: 1000,
      })
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    Swal.fire({
      icon: "success",
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      showConfirmButton: false,
      timer: 1000,
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      Swal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "Product link copied to clipboard",
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }

  const renderStars = (rating: number, size: string = "text-base") => {
    const stars: React.ReactElement[] = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsStarFill key={`full-${i}`} className={`text-orange-400 ${size}`} />)
    }

    if (hasHalfStar) {
      stars.push(<BsStarHalf key="half" className={`text-orange-400 ${size}`} />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<BsStar key={`empty-${i}`} className={`text-gray-300 ${size}`} />)
    }

    return stars
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2 text-gray-600">
          <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
          <li>/</li>
          <li><Link href={`/category/${product.category.slug}`} className="hover:text-orange-600">{product.category.name}</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{discount}%
              </div>
            )}
            {product.stockQuantity === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image.imageUrl)}
                  className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === image.imageUrl
                      ? "border-orange-500"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.category.name}</Badge>
              {product.brand !== "No Brand" && (
                <Badge variant="secondary">{product.brand}</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1">
                {renderStars(averageRating)}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews.length} {product.reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
            <p className="text-gray-600">{product.shortDescription}</p>
          </div>

          {/* Price */}
          <div className="border-y py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-orange-600">
                ৳{finalPrice.toFixed(2)}
              </span>
              {product.discountPrice && (
                <span className="text-2xl text-gray-400 line-through">
                  ৳{product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stockQuantity > 0 ? (
              <>
                <BsCheck className="text-green-600 text-2xl" />
                <span className="text-green-600 font-medium">
                  In Stock ({product.stockQuantity} available)
                </span>
              </>
            ) : (
              <>
                <BsX className="text-red-600 text-2xl" />
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stockQuantity > 0 && (
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity <= 1}
                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiMinus />
                </button>
                <span className="px-6 py-2 font-medium border-x">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  disabled={quantity >= product.stockQuantity}
                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className="flex-1 h-12 text-base"
              size="lg"
            >
              <BsCart3 className="mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={product.stockQuantity === 0}
              variant="outline"
              className="flex-1 h-12 text-base"
              size="lg"
            >
              Buy Now
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleWishlist}
              variant="outline"
              className="flex-1"
            >
              {isWishlisted ? (
                <BsHeartFill className="mr-2 text-red-500" />
              ) : (
                <BsHeart className="mr-2" />
              )}
              Wishlist
            </Button>
            <Button 
              onClick={handleCompare} 
              variant="outline" 
              className={`flex-1 ${isProductInCompare ? 'bg-orange-50 border-orange-500' : ''}`}
            >
              <TbScale className={`mr-2 ${isProductInCompare ? 'text-orange-600' : ''}`} />
              {isProductInCompare ? 'In Compare' : 'Compare'}
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <BsShare className="mr-2" />
              Share
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <BsTruck className="text-orange-600 text-2xl" />
              <div>
                <div className="font-medium text-sm">Free Delivery</div>
                <div className="text-xs text-gray-600">On orders over ৳500</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <BsShield className="text-orange-600 text-2xl" />
              <div>
                <div className="font-medium text-sm">Warranty</div>
                <div className="text-xs text-gray-600">1 Year Official</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <BsArrowRepeat className="text-orange-600 text-2xl" />
              <div>
                <div className="font-medium text-sm">Easy Return</div>
                <div className="text-xs text-gray-600">7 Days Return</div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="text-sm space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-gray-600">SKU:</span>
              <span className="font-medium">{product.sku || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <Link href={`/category/${product.category.slug}`} className="font-medium text-orange-600 hover:underline">
                {product.category.name}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Brand:</span>
              <span className="font-medium">{product.brand}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {product.description || "No description available."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              {product.specifications.length > 0 ? (
                <div className="space-y-2">
                  {product.specifications.map((spec) => (
                    <div
                      key={spec.id}
                      className="flex border-b py-3 last:border-b-0"
                    >
                      <div className="w-1/3 font-medium text-gray-700">{spec.key}</div>
                      <div className="w-2/3 text-gray-600">{spec.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No specifications available.</p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              {product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {/* Reviews Summary */}
                  <div className="flex items-center gap-6 pb-6 border-b">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-orange-600 mb-2">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        {renderStars(averageRating, "text-lg")}
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.reviews.length} {product.reviews.length === 1 ? "review" : "reviews"}
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-bold">
                              {review.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{review.userName}</div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating, "text-sm")}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700 ml-13">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No reviews yet</p>
                  <p className="text-sm text-gray-400">Be the first to review this product!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => {
              const relatedDiscount = relatedProduct.discountPrice
                ? Math.round(
                    ((relatedProduct.price - relatedProduct.discountPrice) / relatedProduct.price) * 100
                  )
                : 0
              const relatedFinalPrice = relatedProduct.discountPrice || relatedProduct.price

              return (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      {relatedDiscount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          -{relatedDiscount}%
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-orange-600">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-orange-600">
                          ৳{relatedFinalPrice.toFixed(2)}
                        </span>
                        {relatedProduct.discountPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ৳{relatedProduct.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

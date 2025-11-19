'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { BsArrowLeft, BsHeart, BsTrash, BsCart3 } from 'react-icons/bs'
import { useWishlistStore } from '@/store/wishlist-store'
import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items: wishlistItems, removeItem } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleRemoveFromWishlist = (id: string) => {
    removeItem(id)
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      discountPrice: item.discountPrice,
      quantity: 1,
      imageUrl: item.imageUrl,
      stockQuantity: item.stockQuantity,
      brand: item.brand,
    })
    toast.success('Added to cart')
  }

  if (status === 'loading' || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef4a23]"></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <span>/</span>
          <Link href="/account" className="hover:text-orange-500">Account</Link>
          <span>/</span>
          <span className="text-gray-800">Wish List</span>
        </div>

        {/* Back Button */}
        <Link 
          href="/account"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6"
        >
          <BsArrowLeft />
          Back to Account
        </Link>

        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Wish List</h1>
          <p className="text-gray-600 mt-2">Your favorite products saved for later</p>
        </div>

        {/* Wishlist Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative group">
                  {/* Discount Badge */}
                  {item.discountPrice && (
                    <div className="absolute top-2 left-2 z-10 bg-[#ef4a23] text-white px-2 py-1 rounded text-xs font-semibold">
                      {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <BsTrash className="text-red-500" size={16} />
                  </button>

                  {/* Product Image */}
                  <Link href={`/products/${item.slug}`}>
                    <div className="aspect-square bg-gray-50 p-4 flex items-center justify-center">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={200}
                          height={200}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <div className="text-gray-300 text-4xl">📦</div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="text-sm font-medium text-gray-900 hover:text-[#ef4a23] line-clamp-2 mb-2">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Brand */}
                    {item.brand && (
                      <p className="text-xs text-gray-500 mb-2">{item.brand}</p>
                    )}

                    {/* Price */}
                    <div className="mb-3">
                      {item.discountPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-[#ef4a23]">
                            {item.discountPrice.toLocaleString()}৳
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {item.price.toLocaleString()}৳
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-[#ef4a23]">
                          {item.price.toLocaleString()}৳
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="mb-3">
                      {item.stockQuantity > 0 ? (
                        <span className="text-xs text-green-600 font-medium">In Stock</span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stockQuantity === 0}
                      className="w-full bg-[#ef4a23] hover:cursor-pointer hover:bg-[#d43f1e] text-white py-2 rounded font-semibold transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <BsCart3 size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BsHeart className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Wish List is Empty</h3>
              <p className="text-gray-500 mb-6">Save your favorite products to your wish list.</p>
              <Link
                href="/"
                className="inline-block bg-[#ef4a23] hover:bg-[#d43f1e] text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

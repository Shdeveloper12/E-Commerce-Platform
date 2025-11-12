'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BsCart3, BsHeart, BsHeartFill, BsStar, BsStarFill, BsEye, BsX } from 'react-icons/bs'
import { TbScale } from 'react-icons/tb'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cart-store'
import { useCompareStore } from '@/store/compare-store'
import Swal from 'sweetalert2'

interface ProductProps {
  products: any[]
}

export default function Product({ products }: ProductProps) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  const { addItem: addToCartStore } = useCartStore()
  const { addItem: addToCompare, isInCompare, items: compareItems } = useCompareStore()

  // Use only real products from database
  const displayProducts = products || []

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const addToCart = (product: any) => {
    addToCartStore({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
      brand: product.brand || 'No Brand',
    })
    
    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${product.name} added to your cart`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })
  }

  const handleCompare = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInCompare(product.id)) {
      return
    }
    
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
      imageUrl: product.imageUrl,
      brand: product.brand || 'No Brand',
      category: product.category,
      stockQuantity: product.stockQuantity,
      specifications: [],
    })
    
    Swal.fire({
      icon: "success",
      title: "Added to Compare",
      showConfirmButton: false,
      timer: 1000,
    })
  }

  const openQuickView = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickViewProduct(product)
    setIsZoomed(false)
  }

  const closeQuickView = () => {
    setQuickViewProduct(null)
    setIsZoomed(false)
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  const renderStars = (rating: number) => {
    const stars: React.ReactElement[] = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsStarFill key={i} className="text-orange-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<BsStarFill key="half" className="text-orange-400" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<BsStar key={`empty-${i}`} className="text-gray-300" />)
    }

    return stars
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Featured Products</h1>
        <p className="text-center text-gray-600">
          Explore our exclusive range of products designed to meet your needs.
        </p>
      </div>

      {displayProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Available</h3>
          <p className="text-gray-600 mb-4">
            Products will appear here once added to the store.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => {
          const discount = product.discountPrice 
            ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
            : 0

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                  {discount}% OFF
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-orange-50 transition-colors"
              >
                {wishlist.includes(product.id) ? (
                  <BsHeartFill className="text-red-500" size={18} />
                ) : (
                  <BsHeart className="text-gray-600" size={18} />
                )}
              </button>

              {/* Product Image */}
              <div className="relative h-56 bg-gray-100 overflow-hidden">
                <Link href={`/products/${product.slug}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
                
                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <button 
                    onClick={(e) => openQuickView(e, product)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-orange-500 hover:text-white px-6 py-3 rounded-md flex items-center gap-2 font-medium shadow-lg"
                  >
                    <BsEye size={20} /> Quick View
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Brand */}
                <p className="text-xs text-gray-500 mb-1">{product.brand}</p>

                {/* Product Name */}
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 hover:text-orange-500 transition-colors min-h-[40px]">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex gap-0.5">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-orange-500">
                      ৳{product.discountPrice?.toLocaleString()}
                    </span>
                  </div>
                  {product.discountPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ৳{product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-3">
                  {product.isInStock ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      In Stock ({product.stockQuantity} available)
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={!product.isInStock}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-md flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <BsCart3 size={18} />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          )
        })}
        </div>
      )}

      {/* View All Products Link */}
      {displayProducts.length > 0 && (
        <div className="text-center mt-8">
          <Link 
            href="/products"
            className="inline-block bg-[#1a2332] hover:bg-[#2a3342] text-white px-8 py-3 rounded-md font-medium transition-colors"
          >
            View All Products
          </Link>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-300 bg-opacity-75 p-4"
          onClick={closeQuickView}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <BsX size={28} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Left Side - Image with Zoom */}
              <div className="relative">
                <div 
                  className={`relative bg-gray-100 rounded-lg overflow-hidden cursor-zoom-${isZoomed ? 'out' : 'in'}`}
                  onClick={toggleZoom}
                >
                  <img
                    src={quickViewProduct.imageUrl}
                    alt={quickViewProduct.name}
                    className={`w-full object-cover transition-transform duration-300 ${
                      isZoomed ? 'scale-150' : 'scale-100'
                    }`}
                    style={{ minHeight: '400px' }}
                  />
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">
                  {isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
                </p>
              </div>

              {/* Right Side - Product Details */}
              <div className="flex flex-col">
                {/* Brand */}
                <p className="text-sm text-gray-500 mb-2">{quickViewProduct.brand}</p>

                {/* Product Name */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {quickViewProduct.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {renderStars(quickViewProduct.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({quickViewProduct.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-orange-500">
                      ৳{quickViewProduct.discountPrice?.toLocaleString()}
                    </span>
                    {quickViewProduct.discountPrice && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          ৳{quickViewProduct.price.toLocaleString()}
                        </span>
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-bold">
                          {Math.round(
                            ((quickViewProduct.price - quickViewProduct.discountPrice) /
                              quickViewProduct.price) *
                              100
                          )}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {quickViewProduct.isInStock ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                      <span className="font-medium">
                        In Stock ({quickViewProduct.stockQuantity} available)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                      <span className="font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct.id)
                      closeQuickView()
                    }}
                    disabled={!quickViewProduct.isInStock}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-md flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    <BsCart3 size={20} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    className={`px-4 py-3 rounded-md border-2 transition-colors ${
                      wishlist.includes(quickViewProduct.id)
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-red-500 hover:bg-red-50'
                    }`}
                  >
                    {wishlist.includes(quickViewProduct.id) ? (
                      <BsHeartFill className="text-red-500" size={22} />
                    ) : (
                      <BsHeart className="text-gray-600" size={22} />
                    )}
                  </button>
                </div>

                {/* View Full Details Link */}
                <Link
                  href={`/products/${quickViewProduct.slug}`}
                  className="text-center py-3 border-2 border-gray-300 rounded-md hover:border-orange-500 hover:text-orange-500 font-medium transition-colors"
                  onClick={closeQuickView}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

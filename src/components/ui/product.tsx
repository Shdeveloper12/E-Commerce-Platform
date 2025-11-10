'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BsCart3, BsHeart, BsHeartFill, BsStar, BsStarFill, BsEye } from 'react-icons/bs'
import { motion } from 'framer-motion'

// Sample featured products data
const featuredProducts = [
  {
    id: '1',
    name: 'MSI Modern 14 C13M Core i3 13th Gen 14" FHD Laptop',
    slug: 'msi-modern-14-c13m-laptop',
    price: 55000,
    discountPrice: 52000,
    brand: 'MSI',
    imageUrl: '/msi.png',
    rating: 4.5,
    reviews: 42,
    stockQuantity: 15,
    isFeatured: true,
    isInStock: true,
  },
  {
    id: '2',
    name: 'Apple MacBook Air 13.6" M2 Chip 8GB RAM 256GB SSD',
    slug: 'apple-macbook-air-m2',
    price: 125000,
    discountPrice: 118000,
    brand: 'Apple',
    imageUrl: '/apple.png',
    rating: 5,
    reviews: 128,
    stockQuantity: 8,
    isFeatured: true,
    isInStock: true,
  },
  {
    id: '3',
    name: 'ASUS ROG Strix G16 Core i7 13th Gen RTX 4060',
    slug: 'asus-rog-strix-g16',
    price: 165000,
    discountPrice: 155000,
    brand: 'ASUS',
    imageUrl: '/asus.png',
    rating: 4.8,
    reviews: 89,
    stockQuantity: 5,
    isFeatured: true,
    isInStock: true,
  },
  {
    id: '4',
    name: 'HP Pavilion 15 Core i5 12th Gen 15.6" FHD Laptop',
    slug: 'hp-pavilion-15-i5',
    price: 68000,
    discountPrice: 64500,
    brand: 'HP',
    imageUrl: '/hp.png',
    rating: 4.2,
    reviews: 67,
    stockQuantity: 20,
    isFeatured: true,
    isInStock: true,
  },
  {
    id: '5',
    name: 'Lenovo IdeaPad Slim 3 Ryzen 5 7th Gen 15.6" Laptop',
    slug: 'lenovo-ideapad-slim-3',
    price: 58000,
    discountPrice: 55000,
    brand: 'Lenovo',
    imageUrl: '/lenovo.png',
    rating: 4.3,
    reviews: 54,
    stockQuantity: 12,
    isFeatured: true,
    isInStock: true,
  },
  {
    id: '6',
    name: 'Dell Inspiron 15 3520 Core i3 12th Gen Laptop',
    slug: 'dell-inspiron-15-3520',
    price: 52000,
    discountPrice: 49500,
    brand: 'Dell',
    imageUrl: '/dell.png',
    rating: 4.1,
    reviews: 38,
    stockQuantity: 18,
    isFeatured: true,
    isInStock: true,
  },
  {
    id: '7',
    name: 'Acer Aspire 5 Core i5 12th Gen 15.6" FHD Laptop',
    slug: 'acer-aspire-5-i5',
    price: 62000,
    discountPrice: 58500,
    brand: 'Acer',
    imageUrl: '/acer.png',
    rating: 4.4,
    reviews: 71,
    stockQuantity: 10,
    isFeatured: true,
    isInStock: true,
  },
  {
    id: '8',
    name: 'Microsoft Surface Laptop 5 Core i7 13.5" Touchscreen',
    slug: 'microsoft-surface-laptop-5',
    price: 145000,
    discountPrice: 138000,
    brand: 'Microsoft',
    imageUrl: '/microsoft.png',
    rating: 4.7,
    reviews: 95,
    stockQuantity: 6,
    isFeatured: true,
    isInStock: true,
  },
]

export default function Product() {
  const [wishlist, setWishlist] = useState<string[]>([])

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const addToCart = (productId: string) => {
    // TODO: Implement add to cart functionality
    console.log('Added to cart:', productId)
    alert('Product added to cart!')
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
        <p className="text-center text-gray-600">Explore our exclusive range of products designed to meet your needs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => {
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
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-contain mask-auto p-4 group-hover:scale-105 transition-transform duration-300"
                   
                  />
                  
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-md flex items-center gap-2">
                      <BsEye /> Quick View
                    </button>
                  </div>
                </div>
              </Link>

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

      {/* View All Products Link */}
      <div className="text-center mt-8">
        <Link 
          href="/products"
          className="inline-block bg-[#1a2332] hover:bg-[#2a3342] text-white px-8 py-3 rounded-md font-medium transition-colors"
        >
          View All Products
        </Link>
      </div>
    </div>
  )
}

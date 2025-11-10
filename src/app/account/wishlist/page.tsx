'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BsArrowLeft, BsHeart, BsTrash, BsCart3 } from 'react-icons/bs'

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) return null

  // Sample wishlist data - replace with actual data from API/database
  const wishlistItems = [
    // You can add sample items here or fetch from API
  ]

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                  {/* Wishlist item details will go here */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BsHeart className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Wish List is Empty</h3>
              <p className="text-gray-500 mb-6">Save your favorite products to your wish list.</p>
              <Link
                href="/products"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
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

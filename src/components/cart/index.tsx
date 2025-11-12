"use client"

import dynamic from 'next/dynamic'

const FloatingCartCompare = dynamic(
  () => import('./floating-cart-compare'),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
        <button className="relative bg-white text-gray-800 w-14 h-14 rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M8 6V4m8 0v2m-8 4h8" />
          </svg>
        </button>
        <button className="relative bg-orange-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      </div>
    )
  }
)

export default FloatingCartCompare

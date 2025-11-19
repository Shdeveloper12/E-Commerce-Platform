"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCartStore } from "@/store/cart-store"
import { useCompareStore } from "@/store/compare-store"
import { BsCart3, BsX } from "react-icons/bs"
import { TbScale } from "react-icons/tb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { FiMinus, FiPlus } from "react-icons/fi"

export default function FloatingCartCompare() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCompareOpen, setIsCompareOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [compareItems, setCompareItems] = useState<any[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  
  const cartStore = useCartStore()
  const compareStore = useCompareStore()

  useEffect(() => {
    setMounted(true)
    // Only access store after mounting
    setCartItems(cartStore.items)
    setCompareItems(compareStore.items)
    setTotalItems(cartStore.getTotalItems())
    setTotalPrice(cartStore.getTotalPrice())
  }, [cartStore, compareStore])

  // Update when store changes
  useEffect(() => {
    if (mounted) {
      setCartItems(cartStore.items)
      setCompareItems(compareStore.items)
      setTotalItems(cartStore.getTotalItems())
      setTotalPrice(cartStore.getTotalPrice())
    }
  }, [cartStore.items, compareStore.items, mounted, cartStore, compareStore])

  if (!mounted) {
    return (
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
        <button className="relative bg-white hover:bg-gray-50 text-gray-800 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all border-2 border-gray-200">
          <TbScale className="text-2xl" />
        </button>
        <button className="relative bg-orange-600 hover:bg-orange-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all">
          <BsCart3 className="text-2xl" />
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
        {/* Compare Button */}
        <button
          onClick={() => setIsCompareOpen(!isCompareOpen)}
          className="relative hover:cursor-pointer bg-white hover:bg-gray-50 text-gray-800 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 border-2 border-gray-200"
        >
          <TbScale className="text-2xl" />
          {compareItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-orange-500">
              {compareItems.length}
            </Badge>
          )}
        </button>

        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative hover:cursor-pointer bg-orange-600 hover:bg-orange-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        >
          <BsCart3 className="text-2xl" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-red-500">
              {totalItems}
            </Badge>
          )}
        </button>
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0  bg-opacity-50 z-[9990]"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-[9991] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Shopping Cart ({totalItems})</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <BsX className="text-2xl" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <BsCart3 className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const price = item.discountPrice || item.price || 0
                    return (
                      <Card key={item.id} className="p-3">
                        <div className="flex gap-3">
                          <div className="relative w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                            <Image
                              src={item.imageUrl || '/placeholder.png'}
                              alt={item.name || 'Product'}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm line-clamp-2 mb-1">
                              {item.name}
                            </h3>
                            <div className="text-orange-600 font-bold mb-2">
                              ৳{price.toFixed(2)}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border rounded">
                                <button
                                  onClick={() => cartStore.updateQuantity(item.id, item.quantity - 1)}
                                  className="px-2 py-1 hover:bg-gray-100"
                                >
                                  <FiMinus size={12} />
                                </button>
                                <span className="px-3 py-1 text-sm border-x">{item.quantity}</span>
                                <button
                                  onClick={() => cartStore.updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.stockQuantity}
                                  className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                                >
                                  <FiPlus size={12} />
                                </button>
                              </div>
                              <button
                                onClick={() => cartStore.removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t space-y-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-orange-600">৳{totalPrice.toFixed(2)}</span>
                </div>
                <Link href="/cart" onClick={() => setIsCartOpen(false)}>
                  <Button className="w-full" size="lg">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                  <Button className="w-full" variant="outline" size="lg">
                    Checkout
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* Compare Sidebar */}
      {isCompareOpen && (
        <>
          <div
            className="fixed inset-0 bg-opacity-50 z-[9990]"
            onClick={() => setIsCompareOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-[9991] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Compare ({compareItems.length}/4)</h2>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <BsX className="text-2xl" />
              </button>
            </div>

            {/* Compare Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {compareItems.length === 0 ? (
                <div className="text-center py-12">
                  <TbScale className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No products to compare</p>
                  <p className="text-sm text-gray-400 mt-2">Add up to 4 products</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {compareItems.map((item) => {
                    const price = item.discountPrice || item.price || 0
                    return (
                      <Card key={item.id} className="p-3">
                        <div className="flex gap-3">
                          <div className="relative w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                            <Image
                              src={item.imageUrl || '/placeholder.png'}
                              alt={item.name || 'Product'}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm line-clamp-2 mb-1">
                              {item.name}
                            </h3>
                            <div className="text-orange-600 font-bold mb-1">
                              ৳{price.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              {item.category || 'Uncategorized'}
                            </div>
                            <button
                              onClick={() => compareStore.removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {compareItems.length > 0 && (
              <div className="p-4 border-t">
                <Link href="/compare" onClick={() => setIsCompareOpen(false)}>
                  <Button className="w-full" size="lg">
                    Compare Products
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

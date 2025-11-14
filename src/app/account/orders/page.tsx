'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { BsArrowLeft, BsBoxSeam, BsCheckCircleFill } from 'react-icons/bs'

interface OrderItem {
  id: string
  productName: string
  productSlug: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  orderItems: OrderItem[]
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/user')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef4a23]"></div>
      </div>
    )
  }

  if (!session) return null

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'text-orange-500',
      CONFIRMED: 'text-blue-500',
      PROCESSING: 'text-purple-500',
      SHIPPED: 'text-indigo-500',
      DELIVERED: 'text-green-500',
      CANCELLED: 'text-red-500',
      REFUNDED: 'text-gray-500',
    }
    return colors[status] || 'text-gray-500'
  }

  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-orange-100 text-orange-600',
      CONFIRMED: 'bg-blue-100 text-blue-600',
      PROCESSING: 'bg-purple-100 text-purple-600',
      SHIPPED: 'bg-indigo-100 text-indigo-600',
      DELIVERED: 'bg-green-100 text-green-600',
      CANCELLED: 'bg-red-100 text-red-600',
      REFUNDED: 'bg-gray-100 text-gray-600',
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  // Sample order data - replace with actual data from API/database
  const sampleOrders = [
    // You can add sample orders here or fetch from API
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
          <span className="text-gray-800">Orders</span>
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
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600 mt-2">View and track your order history</p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Order# {order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">Date Added: {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <BsCheckCircleFill className="text-green-500" />
                    <span className={`font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="space-y-3">
                    {order.orderItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <BsBoxSeam className="text-gray-400 text-2xl" />
                          </div>
                          <div className="flex-1">
                            <Link
                              href={`/products/${item.productSlug}`}
                              className="text-gray-900 hover:text-[#ef4a23] font-medium line-clamp-2"
                            >
                              {item.productName}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:ml-auto">
                          <span className="text-xl font-bold text-[#ef4a23]">
                            {item.total.toLocaleString()}৳
                          </span>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="bg-[#4a5fc4] hover:bg-[#3d4fb3] text-white px-6 py-2 rounded font-semibold transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <BsBoxSeam className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h3>
              <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
              <Link
                href="/"
                className="inline-block bg-[#ef4a23] hover:bg-[#d43f1e] text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

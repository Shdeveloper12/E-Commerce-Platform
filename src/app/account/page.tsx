'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  BsPerson, 
  BsFileText, 
  BsClipboardCheck, 
  BsLock, 
  BsGeoAlt, 
  BsHeart, 
  BsLaptop,
  BsStar,
  BsReceipt
} from 'react-icons/bs'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
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

  if (!session) {
    return null
  }

  const userName = session.user?.name || 'User'
  const userEmail = session.user?.email || ''

  // Action cards data matching StarTech design
  const actionCards = [
    {
      icon: <BsFileText className="text-3xl text-blue-600" />,
      title: 'Orders',
      href: '/account/orders',
      description: 'View your order history'
    },
    {
      icon: <BsClipboardCheck className="text-3xl text-blue-600" />,
      title: 'Quote',
      href: '/account/quote',
      description: 'Request product quotes'
    },
    {
      icon: <BsPerson className="text-3xl text-blue-600" />,
      title: 'Edit Profile',
      href: '/account/edit-profile',
      description: 'Update your information'
    },
    {
      icon: <BsLock className="text-3xl text-blue-600" />,
      title: 'Change Password',
      href: '/account/change-password',
      description: 'Update your password'
    },
    {
      icon: <BsGeoAlt className="text-3xl text-blue-600" />,
      title: 'Addresses',
      href: '/account/addresses',
      description: 'Manage shipping addresses'
    },
    {
      icon: <BsHeart className="text-3xl text-blue-600" />,
      title: 'Wish List',
      href: '/account/wishlist',
      description: 'Your saved products'
    },
    {
      icon: <BsLaptop className="text-3xl text-blue-600" />,
      title: 'Saved PC',
      href: '/account/saved-pc',
      description: 'Your PC Builder configurations'
    },
    {
      icon: <BsStar className="text-3xl text-blue-600" />,
      title: 'Star Points',
      href: '/account/star-points',
      description: 'View your rewards'
    },
    {
      icon: <BsReceipt className="text-3xl text-blue-600" />,
      title: 'Your Transactions',
      href: '/account/transactions',
      description: 'Transaction history'
    },
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
          <span className="text-gray-800">Account</span>
        </div>

        {/* Profile Card & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  {session.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt={userName}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <BsPerson className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <p className="text-gray-600 text-sm mb-1">Hello,</p>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{userName}</h1>
                <p className="text-gray-500 text-sm">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Star Points & Store Credit */}
          <div className="space-y-4 w-full grid grid-cols-2 lg:grid-cols-2 lg:space-y-0 lg:gap-4 bg-white rounded-lg shadow-md p-6 text-center">
            <div className="">
              <h3 className="text-gray-600 text-sm mb-2">Star Points</h3>
              <p className="text-4xl font-bold text-orange-500">0</p>
            </div>
            <div className="">
              <h3 className="text-gray-600 text-sm mb-2">Store Credit</h3>
              <p className="text-4xl font-bold text-orange-500">0</p>
            </div>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {actionCards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center group"
            >
              <div className="mb-4 p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

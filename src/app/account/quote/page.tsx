'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BsArrowLeft, BsClipboardCheck } from 'react-icons/bs'

export default function QuotePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-orange-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></Link>
          <span>/</span>
          <Link href="/account" className="hover:text-orange-500">Account</Link>
          <span>/</span>
          <span className="text-gray-800">Quote</span>
        </div>
        <Link href="/account" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6"><BsArrowLeft />Back to Account</Link>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6"><h1 className="text-3xl font-bold text-gray-800">Request Quote</h1><p className="text-gray-600 mt-2">Get price quotes for bulk orders or custom requests</p></div>
        <div className="bg-white rounded-lg shadow-md p-6"><div className="text-center py-12"><BsClipboardCheck className="mx-auto text-6xl text-gray-300 mb-4" /><h3 className="text-xl font-semibold text-gray-700 mb-2">No Quote Requests</h3><p className="text-gray-500 mb-6">Request a quote for bulk orders or special requirements.</p><button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium transition-colors">Request New Quote</button></div></div>
      </div>
    </div>
  )
}

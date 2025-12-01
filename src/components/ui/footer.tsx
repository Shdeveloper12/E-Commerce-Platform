'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  IoLogoFacebook, 
  IoLogoTwitter, 
  IoLogoInstagram, 
  IoLogoYoutube,
  IoMail,
  IoCall,
  IoLocation,
  IoSend,
  IoCheckmarkCircle,
  IoChevronUp
} from 'react-icons/io5'
import { FaTiktok } from 'react-icons/fa'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Company Info - Larger Section */}
          <div className="lg:col-span-4">
            <div className="mb-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
                TechBazar
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Your trusted destination for cutting-edge technology and electronics. 
                We bring you the latest products at competitive prices with exceptional service.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   className="group relative w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50">
                  <IoLogoFacebook className="text-xl group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                   className="group relative w-10 h-10 bg-gray-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-sky-500/50">
                  <IoLogoTwitter className="text-xl group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                   className="group relative w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50">
                  <IoLogoInstagram className="text-xl group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                   className="group relative w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50">
                  <IoLogoYoutube className="text-xl group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                   className="group relative w-10 h-10 bg-gray-800 hover:bg-black rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-500/50">
                  <FaTiktok className="text-lg group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm group">
                  <span className="inline-block group-hover:text-blue-400">›</span> Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm group">
                  <span className="inline-block group-hover:text-blue-400">›</span> Products
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm group">
                  <span className="inline-block group-hover:text-blue-400">›</span> Offers
                </Link>
              </li>
              <li>
                <Link href="/pc-builder" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm group">
                  <span className="inline-block group-hover:text-blue-400">›</span> PC Builder
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm group">
                  <span className="inline-block group-hover:text-blue-400">›</span> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-bold mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm group">
                  <span className="inline-block group-hover:text-purple-400">›</span> Help Center
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm group">
                  <span className="inline-block group-hover:text-purple-400">›</span> My Account
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm group">
                  <span className="inline-block group-hover:text-purple-400">›</span> Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm group">
                  <span className="inline-block group-hover:text-purple-400">›</span> Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm group">
                  <span className="inline-block group-hover:text-purple-400">›</span> Warranty
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-bold mb-4 text-white">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {subscribed ? (
                  <>
                    <IoCheckmarkCircle className="text-xl" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <IoSend />
                    Subscribe
                  </>
                )}
              </button>
            </form>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <IoMail className="text-blue-400" />
                <span>info@techbazar.com.bd</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <IoCall className="text-green-400" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <IoLocation className="text-red-400" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} TechBazar BD. All rights reserved.
              </p>
              <div className="flex gap-4 mt-2 justify-center md:justify-start">
                <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-gray-700">•</span>
                <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  Terms of Service
                </Link>
                <span className="text-gray-700">•</span>
                <Link href="/refund" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  Refund Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">We Accept:</span>
              <div className="flex gap-2">
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-blue-600">
                  VISA
                </div>
                <div className="w-12 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center text-xs font-bold">
                  MC
                </div>
                <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center text-xs font-bold">
                  bKash
                </div>
                <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-xs font-bold">
                  Nagad
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Scroll to top"
      >
        <IoChevronUp className="text-2xl text-white group-hover:animate-bounce" />
      </button>
    </footer>
  )
}

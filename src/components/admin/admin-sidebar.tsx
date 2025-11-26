'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderTree,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  userEmail?: string
  userRole?: string
}

export default function AdminSidebar({ userEmail, userRole }: AdminSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 text-white p-4 flex items-center justify-between border-b border-gray-700">
        <div>
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <p className="text-xs text-gray-400">{userRole}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:bg-gray-800"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-16"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen bg-gray-900 text-white flex flex-col z-50 transition-transform duration-300 ease-in-out",
          "w-64 lg:w-64",
          // Mobile: slide in from left
          isMobileMenuOpen ? "translate-x-0 mt-16 lg:mt-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Desktop Header */}
        <div className="hidden lg:block p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400 truncate">{userEmail}</p>
          <p className="text-xs text-gray-500 mt-1">{userRole}</p>
        </div>

        {/* Mobile User Info */}
        <div className="lg:hidden p-4 border-b border-gray-700">
          <p className="text-sm text-gray-400 truncate">{userEmail}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                              (item.href !== '/admin' && pathname?.startsWith(item.href))
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                      isActive 
                        ? "bg-blue-600 text-white" 
                        : "hover:bg-gray-800 text-gray-300"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <Link href="/api/auth/signout">
            <Button 
              variant="outline" 
              className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 justify-start"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-16" />
    </>
  )
}

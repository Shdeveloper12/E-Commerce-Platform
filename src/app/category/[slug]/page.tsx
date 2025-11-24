'use client'

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Product from "@/components/ui/product"
import CategoryFilter from "@/components/filters/category-filter"
import { getFiltersByCategory } from "@/lib/filters"
import { BiFilter, BiX } from "react-icons/bi"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

function CategoryPageContent({ params }: CategoryPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [category, setCategory] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({})
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Load category and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/categories/${params.slug}`)
        if (!response.ok) throw new Error('Category not found')
        
        const data = await response.json()
        setCategory(data)
        
        // Transform products
        const formatted = data.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
          brand: product.brand || 'No Brand',
          imageUrl: product.images?.[0]?.imageUrl || '/placeholder.png',
          rating: 0,
          reviews: 0,
          stockQuantity: product.stockQuantity,
          isFeatured: product.isFeatured,
          isInStock: product.stockQuantity > 0,
          category: product.category?.name || 'Unknown',
          // Additional fields for filtering
          specifications: product.specifications || {},
        }))
        
        setProducts(formatted)
        setFilteredProducts(formatted)
      } catch (error) {
        console.error('Error fetching category:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.slug])

  // Apply filters whenever selectedFilters or products change
  useEffect(() => {
    let filtered = [...products]

    Object.entries(selectedFilters).forEach(([filterTitle, filterValue]) => {
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) return

      if (filterTitle === 'Price Range' && Array.isArray(filterValue)) {
        const [min, max] = filterValue
        filtered = filtered.filter(product => {
          const price = product.discountPrice || product.price
          return price >= min && price <= max
        })
      } else if (Array.isArray(filterValue) && filterValue.length > 0) {
        // For checkbox filters, match against product specifications
        filtered = filtered.filter(product => {
          const specs = product.specifications || {}
          const specString = JSON.stringify(specs).toLowerCase() + 
                           product.name.toLowerCase() + 
                           product.brand.toLowerCase()
          
          return filterValue.some(val => 
            specString.includes(val.toLowerCase().replace(/_/g, ' '))
          )
        })
      }
    })

    setFilteredProducts(filtered)
  }, [selectedFilters, products])

  const handleFilterChange = (filterType: string, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
          <Link href="/" className="text-orange-600 hover:underline mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const isMainCategory = category.children && category.children.length > 0
  const filters = getFiltersByCategory(category.name)
  const activeFilterCount = Object.values(selectedFilters).filter(val => 
    Array.isArray(val) ? val.length > 0 : val !== null
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{category.name}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 text-lg">{category.description}</p>
          )}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span>{filteredProducts.length} of {products.length} {products.length === 1 ? 'Product' : 'Products'}</span>
            {isMainCategory && (
              <span className="text-orange-600">• Including all subcategories</span>
            )}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                <BiX size={18} />
                Clear all filters ({activeFilterCount})
              </button>
            )}
          </div>
          
          {/* Subcategories Filter - Show if main category */}
          {isMainCategory && category.children.length > 0 && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Subcategory:</h3>
              <div className="flex flex-wrap gap-2">
                <Link 
                  href={`/category/${category.slug}`}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
                >
                  All {category.name}
                </Link>
                {category.children.map((subcat: any) => (
                  <Link
                    key={subcat.id}
                    href={`/category/${subcat.slug}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {subcat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <BiFilter size={20} />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <CategoryFilter
                filters={filters}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Mobile Filters Modal */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[9999]">
              <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <BiX size={24} />
                  </button>
                </div>
                <div className="p-4">
                  <CategoryFilter
                    filters={filters}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    Apply Filters ({filteredProducts.length} products)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <Product products={filteredProducts} />
            ) : (
              <div className="text-center py-16 bg-white rounded-lg">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">
                  {activeFilterCount > 0 
                    ? 'Try adjusting your filters to see more products.'
                    : 'There are no products available in this category at the moment.'
                  }
                </p>
                {activeFilterCount > 0 ? (
                  <button
                    onClick={clearAllFilters}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Clear All Filters
                  </button>
                ) : (
                  <Link href="/">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium">
                      Continue Shopping
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CategoryPageContent params={params} />
    </Suspense>
  )
}

import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import Product from "@/components/ui/product"

// Disable caching to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      description: true,
    },
  })

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.name} - Shop Now`,
    description: category.description || `Browse all ${category.name} products`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
    include: {
      children: true, // Get subcategories
      products: {
        where: {
          isActive: true,
        },
        include: {
          category: true,
          images: {
            orderBy: {
              sortOrder: 'asc',
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!category || !category.isActive) {
    notFound()
  }

  // Check if this is a main category (has children/subcategories)
  const isMainCategory = category.children && category.children.length > 0

  // If it's a main category, get all products from this category AND all its subcategories
  let allProducts = [...category.products]

  if (isMainCategory) {
    // Get subcategory IDs
    const subcategoryIds = category.children.map(child => child.id)
    
    // Fetch products from all subcategories
    const subcategoryProducts = await db.product.findMany({
      where: {
        categoryId: {
          in: subcategoryIds
        },
        isActive: true,
      },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    allProducts = [...allProducts, ...subcategoryProducts]
  }

  // Transform products for the Product component
  const formattedProducts = allProducts.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    brand: product.brand || 'No Brand',
    imageUrl: product.images[0]?.imageUrl || '/placeholder.png',
    rating: 0,
    reviews: 0,
    stockQuantity: product.stockQuantity,
    isFeatured: product.isFeatured,
    isInStock: product.stockQuantity > 0,
    category: product.category.name,
  }))

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
            <span>{formattedProducts.length} {formattedProducts.length === 1 ? 'Product' : 'Products'} Found</span>
            {isMainCategory && (
              <span className="text-orange-600">• Including all subcategories</span>
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
                {category.children.map((subcat) => (
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

        {/* Products */}
        {formattedProducts.length > 0 ? (
          <Product products={formattedProducts} />
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              There are no products available in this category at the moment.
            </p>
            <Link href="/">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium">
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

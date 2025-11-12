import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import ProductDetailsClient from "@/components/product/product-details-client"

// Disable caching to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      metaTitle: true,
      metaDescription: true,
      shortDescription: true,
    },
  })

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || product.name,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
      specifications: true,
      reviews: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!product || !product.isActive) {
    notFound()
  }

  // Get related products from the same category
  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: {
        not: product.id,
      },
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
    take: 4,
  })

  // Transform data for client component
  const productData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    shortDescription: product.shortDescription || '',
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    sku: product.sku || '',
    brand: product.brand || 'No Brand',
    stockQuantity: product.stockQuantity,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    images: product.images.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })),
    specifications: product.specifications.map((spec) => ({
      id: spec.id,
      key: spec.key,
      value: spec.value,
    })),
    reviews: product.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment || '',
      userName: `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || review.user.email,
      createdAt: review.createdAt.toISOString(),
    })),
  }

  const relatedProductsData = relatedProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
    brand: p.brand || 'No Brand',
    imageUrl: p.images[0]?.imageUrl || '/placeholder.png',
    stockQuantity: p.stockQuantity,
    category: p.category.name,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetailsClient 
        product={productData} 
        relatedProducts={relatedProductsData}
      />
    </div>
  )
}

import { db } from '@/lib/db'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tech-bazar-swart.vercel.app'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Get all products
  let products: MetadataRoute.Sitemap = []
  try {
    const dbProducts = await db.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    products = dbProducts.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
  }

  // Get all categories
  let categories: MetadataRoute.Sitemap = []
  try {
    const dbCategories = await db.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    categories = dbCategories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  return [...staticPages, ...categories, ...products]
}

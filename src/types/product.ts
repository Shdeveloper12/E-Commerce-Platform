export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  imageUrl?: string
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  parent?: Category
  children?: Category[]
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: number
  discountPrice?: number
  sku?: string
  brand?: string
  categoryId: string
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt: Date
  updatedAt: Date
  category?: Category
  images?: ProductImage[]
  specifications?: ProductSpecification[]
}

export interface ProductImage {
  id: string
  productId: string
  imageUrl: string
  altText?: string
  isPrimary: boolean
  sortOrder: number
  createdAt: Date
}

export interface ProductSpecification {
  id: string
  productId: string
  key: string
  value: string
  createdAt: Date
}

export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ProductQueryParams {
  page: number
  limit: number
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ProductResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters: {
    brands: string[]
  }
}

export interface CreateProductData {
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: number
  discountPrice?: number
  sku?: string
  brand?: string
  categoryId: string
  stockQuantity: number
  isFeatured?: boolean
  metaTitle?: string
  metaDescription?: string
  images?: Omit<ProductImage, 'id' | 'productId' | 'createdAt'>[]
  specifications?: Omit<ProductSpecification, 'id' | 'productId' | 'createdAt'>[]
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}
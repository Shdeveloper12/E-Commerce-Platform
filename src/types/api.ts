export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: any
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ValidationError {
  field: string
  message: string
}

export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimetype: string
}

export interface SearchSuggestion {
  id: string
  type: 'product' | 'category' | 'brand'
  title: string
  subtitle?: string
  url: string
}

export interface AnalyticsData {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  popularProducts: Array<{
    product: Product
    orderCount: number
  }>
  salesByCategory: Array<{
    category: Category
    revenue: number
    orderCount: number
  }>
  recentOrders: Order[]
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  orderUpdates: boolean
  promotions: boolean
  newsletter: boolean
}

export interface UserPreferences {
  currency: string
  language: string
  theme: 'light' | 'dark' | 'auto'
  notifications: NotificationSettings
}
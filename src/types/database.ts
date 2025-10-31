// This file contains database-specific types that map to Prisma models
// Import types from other files to avoid circular dependencies
import { User, UserRole } from './auth'
import { Category, Product, ProductImage, ProductSpecification } from './product'
import { 
  Order, 
  OrderItem, 
  OrderStatus, 
  PaymentStatus, 
  PaymentTransaction 
} from './order'
import { 
  UserAddress, 
  AddressType, 
  WishlistItem, 
  ProductReview, 
  PCBuild, 
  PCBuildComponent 
} from './user'

// Re-export all database models for easy access
export {
  User,
  UserRole,
  Category,
  Product,
  ProductImage,
  ProductSpecification,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  PaymentTransaction,
  UserAddress,
  AddressType,
  WishlistItem,
  ProductReview,
  PCBuild,
  PCBuildComponent,
}

// Database configuration types
export interface DatabaseConfig {
  url: string
  ssl?: boolean
  pool?: {
    min: number
    max: number
  }
}

export interface MigrationOptions {
  name?: string
  dryRun?: boolean
}

// Database query helpers
export interface QueryOptions {
  include?: string[]
  select?: string[]
  where?: Record<string, any>
  orderBy?: Record<string, 'asc' | 'desc'>
  skip?: number
  take?: number
}

export interface AggregateOptions {
  _count?: Record<string, boolean>
  _sum?: Record<string, boolean>
  _avg?: Record<string, boolean>
  _min?: Record<string, boolean>
  _max?: Record<string, boolean>
}

// Database connection health check
export interface DatabaseHealth {
  status: 'healthy' | 'unhealthy'
  responseTime: number
  lastChecked: Date
  error?: string
}

// Database backup types
export interface BackupConfig {
  enabled: boolean
  schedule: string // cron expression
  retention: number // days
  storage: 'local' | 's3' | 'gcs'
  destination?: string
}

export interface BackupJob {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startTime: Date
  endTime?: Date
  size?: number
  filename?: string
  error?: string
}

// Database indexing types
export interface DatabaseIndex {
  name: string
  table: string
  columns: string[]
  unique: boolean
  createdAt: Date
}

// Database statistics
export interface DatabaseStats {
  totalTables: number
  totalRecords: Record<string, number>
  tableSizes: Record<string, number>
  indexCount: number
  lastAnalyzed: Date
}
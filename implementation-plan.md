# Star Tech Bangladesh - Implementation Plan

## 1. Environment Setup

### 1.1 Package.json Dependencies

```json
{
  "name": "startech-nextjs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "@prisma/client": "^5.7.0",
    "prisma": "^5.7.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-query-devtools": "^5.0.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.294.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-select": "^2.0.0",
    "embla-carousel-react": "^8.0.0",
    "react-intersection-observer": "^9.5.0",
    "next-themes": "^0.2.1",
    "stripe": "^14.9.0",
    "nodemailer": "^6.9.0",
    "sharp": "^0.33.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/nodemailer": "^6.4.14",
    "@types/uuid": "^9.0.7",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "eslint": "^8.55.0",
    "eslint-config-next": "15.0.0",
    "tsx": "^4.6.0"
  }
}
```

### 1.2 Environment Variables

```env
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_postgresql_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 2. Database Schema (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User Management
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      UserRole @default(CUSTOMER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  profile   Profile?
  addresses Address[]
  orders    Order[]
  cartItems CartItem[]
  wishlist  WishlistItem[]
  reviews   Review[]
  
  @@map("users")
}

model Profile {
  id          String   @id @default(cuid())
  userId      String   @unique
  firstName   String?
  lastName    String?
  phone       String?
  avatar      String?
  dateOfBirth DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("profiles")
}

model Address {
  id        String   @id @default(cuid())
  userId    String
  label     String
  firstName String
  lastName  String
  phone     String
  address   String
  city      String
  state     String
  postalCode String
  country   String   @default("Bangladesh")
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders Order[]
  
  @@map("addresses")
}

// Product Catalog
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  image       String?
  parentId    String?
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
  products Product[]
  
  @@map("categories")
}

model Brand {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  logo      String?
  website   String?
  isActive  Boolean  @default(true)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  products Product[]
  
  @@map("brands")
}

model Product {
  id            String      @id @default(cuid())
  name          String
  slug          String      @unique
  description   String?
  shortDesc     String?
  price         Float
  discountPrice Float?
  sku           String      @unique
  brandId       String
  categoryId    String
  isActive      Boolean     @default(true)
  isFeatured    Boolean     @default(false)
  isNew         Boolean     @default(false)
  stockQuantity Int         @default(0)
  weight        Float?
  dimensions    String?
  warranty      String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  brand         Brand           @relation(fields: [brandId], references: [id])
  category      Category        @relation(fields: [categoryId], references: [id])
  images        ProductImage[]
  specifications ProductSpecification[]
  reviews       Review[]
  cartItems     CartItem[]
  wishlistItems WishlistItem[]
  orderItems    OrderItem[]
  pcBuildComponents PcBuildComponent[]
  
  @@map("products")
}

model ProductImage {
  id        String   @id @default(cuid())
  productId String
  url       String
  alt       String?
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@map("product_images")
}

model ProductSpecification {
  id        String   @id @default(cuid())
  productId String
  key       String
  value     String
  createdAt DateTime @default(now())
  
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@map("product_specifications")
}

// Shopping & Orders
model CartItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  quantity  Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
  @@map("cart_items")
}

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  createdAt DateTime @default(now())
  
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
  @@map("wishlist_items")
}

model Order {
  id            String      @id @default(cuid())
  userId        String
  orderNumber   String      @unique
  status        OrderStatus @default(PENDING)
  subtotal      Float
  discount      Float       @default(0)
  tax           Float       @default(0)
  shipping      Float       @default(0)
  total         Float
  paymentMethod String?
  paymentStatus PaymentStatus @default(PENDING)
  notes         String?
  addressId     String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  user     User        @relation(fields: [userId], references: [id])
  address  Address?    @relation(fields: [addressId], references: [id])
  items    OrderItem[]
  payment  Payment?
  
  @@map("orders")
}

model OrderItem {
  id         String   @id @default(cuid())
  orderId    String
  productId  String
  quantity   Int
  price      Float
  totalPrice Float
  createdAt  DateTime @default(now())
  
  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])
  
  @@map("order_items")
}

model Payment {
  id            String        @id @default(cuid())
  orderId       String        @unique
  amount        Float
  method        String
  transactionId String?
  status        PaymentStatus
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@map("payments")
}

// Reviews & Ratings
model Review {
  id        String   @id @default(cuid())
  userId    String
  productId String
  rating    Int      @db.SmallInt
  comment   String?
  isApproved Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
  @@map("reviews")
}

// PC Builder
model PcBuild {
  id          String   @id @default(cuid())
  userId      String?
  name        String
  description String?
  totalPrice  Float
  isPublic    Boolean  @default(false)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user       User?             @relation(fields: [userId], references: [id])
  components PcBuildComponent[]
  
  @@map("pc_builds")
}

model PcBuildComponent {
  id          String           @id @default(cuid())
  buildId     String
  productId   String
  componentType PcComponentType
  isSelected  Boolean          @default(true)
  createdAt   DateTime         @default(now())
  
  build   PcBuild  @relation(fields: [buildId], references: [id], onDelete: Cascade)
  product Product  @relation(fields: [productId], references: [id])
  
  @@unique([buildId, componentType])
  @@map("pc_build_components")
}

// Marketing & Promotions
model Offer {
  id          String      @id @default(cuid())
  title       String
  description String?
  type        OfferType
  value       Float
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@map("offers")
}

model HappyHourDeal {
  id          String   @id @default(cuid())
  productId   String
  discount    Float
  startTime   DateTime
  endTime     DateTime
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  product Product @relation(fields: [productId], references: [id])
  
  @@unique([productId])
  @@map("happy_hour_deals")
}

// Enums
enum UserRole {
  CUSTOMER
  ADMIN
  STAFF
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum OfferType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_SHIPPING
}

enum PcComponentType {
  CPU
  MOTHERBOARD
  RAM
  GPU
  STORAGE
  PSU
  CASE
  COOLER
}
```

## 3. Supabase Integration

### 3.1 Supabase Client Configuration

```typescript
// src/lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './types'

export const supabase = createClientComponentClient<Database>()
```

```typescript
// src/lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './types'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })
}
```

### 3.2 Authentication Middleware

```typescript
// src/lib/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes
  if (req.nextUrl.pathname.startsWith('/account') && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Admin routes
  if (req.nextUrl.pathname.startsWith('/admin') && 
      session?.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
}
```

## 4. Key Component Examples

### 4.1 Product Card Component

```typescript
// src/components/product/product-card.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils/formatters'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const addItemToWishlist = useWishlistStore((state) => state.addItem)
  
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      quantity: 1,
      price: product.discountPrice || product.price,
    })
  }

  const handleAddToWishlist = () => {
    addItemToWishlist(product.id)
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Link href={`/products/${product.slug}`}>
            <Image
              src={product.images[0]?.url || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </Link>
          
          {discountPercentage > 0 && (
            <Badge className="absolute left-2 top-2 bg-red-500">
              -{discountPercentage}%
            </Badge>
          )}
          
          {product.isNew && (
            <Badge className="absolute left-2 top-8 bg-green-500">
              New
            </Badge>
          )}
          
          <div className="absolute right-2 top-2 flex flex-col gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={handleAddToWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              asChild
            >
              <Link href={`/products/${product.slug}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-2">
            <Link 
              href={`/brands/${product.brand.slug}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {product.brand.name}
            </Link>
          </div>
          
          <h3 className="mb-2 line-clamp-2">
            <Link 
              href={`/products/${product.slug}`}
              className="font-medium transition-colors hover:text-primary"
            >
              {product.name}
            </Link>
          </h3>
          
          <div className="mb-3 flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 4.2 PC Builder Component

```typescript
// src/components/pc-builder/pc-builder-interface.tsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ComponentSelector } from './component-selector'
import { CompatibilityChecker } from './compatibility-checker'
import { BuildSummary } from './build-summary'
import { PcComponentType } from '@/types/product'
import { usePcBuildStore } from '@/lib/store/pc-build-store'

const componentTypes = [
  { type: PcComponentType.CPU, label: 'Processor', icon: '🖥️' },
  { type: PcComponentType.MOTHERBOARD, label: 'Motherboard', icon: '🔧' },
  { type: PcComponentType.RAM, label: 'Memory', icon: '💾' },
  { type: PcComponentType.GPU, label: 'Graphics Card', icon: '🎮' },
  { type: PcComponentType.STORAGE, label: 'Storage', icon: '💿' },
  { type: PcComponentType.PSU, label: 'Power Supply', icon: '⚡' },
  { type: PcComponentType.CASE, label: 'Case', icon: '📦' },
  { type: PcComponentType.COOLER, label: 'Cooler', icon: '❄️' },
]

export function PcBuilderInterface() {
  const { build, saveBuild, loadBuild } = usePcBuildStore()
  const [activeTab, setActiveTab] = useState(PcComponentType.CPU)
  const [showCompatibility, setShowCompatibility] = useState(false)

  const selectedComponent = (type: PcComponentType) => {
    return build.components.find(c => c.componentType === type)
  }

  const handleSaveBuild = async () => {
    await saveBuild({
      name: 'My Custom PC Build',
      description: 'Built with PC Builder',
      components: build.components,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">PC Builder</h1>
        <p className="text-muted-foreground">
          Build your custom PC with compatible components
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Component Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Components</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  {componentTypes.slice(0, 4).map(({ type, label, icon }) => (
                    <TabsTrigger key={type} value={type} className="text-xs">
                      <span className="mr-1">{icon}</span>
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsList className="mt-2 grid w-full grid-cols-4">
                  {componentTypes.slice(4).map(({ type, label, icon }) => (
                    <TabsTrigger key={type} value={type} className="text-xs">
                      <span className="mr-1">{icon}</span>
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {componentTypes.map(({ type, label }) => (
                  <TabsContent key={type} value={type}>
                    <ComponentSelector 
                      componentType={type}
                      selectedComponent={selectedComponent(type)}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Build Summary */}
        <div className="space-y-6">
          <BuildSummary />
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={handleSaveBuild}
                disabled={build.components.length === 0}
              >
                Save Build
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowCompatibility(true)}
              >
                Check Compatibility
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={loadBuild}
              >
                Load Build
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compatibility Modal */}
      {showCompatibility && (
        <CompatibilityChecker 
          onClose={() => setShowCompatibility(false)}
        />
      )}
    </div>
  )
}
```

## 5. API Routes Examples

### 5.1 Products API

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  category: z.string().optional(),
  brand: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['price', 'name', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    const {
      page,
      limit,
      category,
      brand,
      search,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
    } = query

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (category) {
      where.category = {
        slug: category,
      }
    }

    if (brand) {
      where.brand = {
        slug: brand,
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    // Get products with relations
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: true,
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1,
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => ({
      ...product,
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0,
      reviewCount: product.reviews.length,
    }))

    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 5.2 Cart API

```typescript
// src/app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1).max(99),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            brand: true,
            images: {
              orderBy: { sortOrder: 'asc' },
              take: 1,
            },
          },
        },
      },
    })

    return NextResponse.json({ cartItems })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity } = cartItemSchema.parse(body)

    // Check if product exists and has sufficient stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.stockQuantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })

    let cartItem

    if (existingCartItem) {
      // Update existing cart item
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: {
          product: {
            include: {
              brand: true,
              images: {
                orderBy: { sortOrder: 'asc' },
                take: 1,
              },
            },
          },
        },
      })
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              brand: true,
              images: {
                orderBy: { sortOrder: 'asc' },
                take: 1,
              },
            },
          },
        },
      })
    }

    return NextResponse.json({ cartItem })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

This implementation plan provides a comprehensive foundation for rebuilding startech.com.bd with modern Next.js technologies, PostgreSQL database, and Supabase integration. The structure is scalable, maintainable, and includes all the essential features of a modern e-commerce platform.
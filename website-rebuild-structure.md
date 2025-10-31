# Star Tech Bangladesh - Next.js Rebuild Architecture

## Website Analysis Summary

**startech.com.bd** is a leading e-commerce platform in Bangladesh specializing in:
- Computer & Laptop products
- Gaming PCs & Components
- Mobile Phones & Electronics
- Home Appliances
- Office Equipment
- Camera & Photography
- Apple Products

## Key Features Identified
- Product catalog with categories
- Shopping cart & checkout
- User accounts & authentication
- Product comparison
- PC Builder feature
- Payment gateway integration
- Search & filtering
- EMI options
- Order tracking

---

## Next.js Folder Structure

```
startech-rebuild/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── (auth)/                   # Auth group (login, register)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (shop)/                   # Shop group (products, categories)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── products/
│   │   │   │   ├── [category]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── search/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   ├── pc-builder/
│   │   │   │   └── page.tsx
│   │   │   ├── compare/
│   │   │   │   └── page.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (account)/                # Account group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/[id]/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── addresses/
│   │   │   │   └── page.tsx
│   │   │   ├── wishlist/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (admin)/                  # Admin panel
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   ├── customers/
│   │   │   │   └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── support/
│   │   │   └── page.tsx
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── refresh/
│   │   │   │       └── route.ts
│   │   │   ├── products/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── categories/
│   │   │   │   │   └── route.ts
│   │   │   │   └── search/
│   │   │   │       └── route.ts
│   │   │   ├── cart/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── orders/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── users/
│   │   │   │   ├── route.ts
│   │   │   │   ├── profile/
│   │   │   │   │   └── route.ts
│   │   │   │   └── addresses/
│   │   │   │       └── route.ts
│   │   │   ├── payments/
│   │   │   │   ├── create/
│   │   │   │   │   └── route.ts
│   │   │   │   └── verify/
│   │   │   │       └── route.ts
│   │   │   ├── upload/
│   │   │   │   └── route.ts
│   │   │   └── health/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── sitemap.ts
│   ├── components/                   # Reusable Components
│   │   ├── ui/                       # shadcn/ui components (already exists)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductSort.tsx
│   │   │   ├── ProductPagination.tsx
│   │   │   └── ProductComparison.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── AddToCartButton.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── AuthProvider.tsx
│   │   ├── forms/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   └── ProductForm.tsx
│   │   ├── common/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── SuccessMessage.tsx
│   │   │   └── PriceDisplay.tsx
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── OrderManagement.tsx
│   │   │   ├── ProductManagement.tsx
│   │   │   └── UserManagement.tsx
│   │   └── pc-builder/
│   │       ├── PCBuilder.tsx
│   │       ├── ComponentSelector.tsx
│   │       ├── CompatibilityChecker.tsx
│   │       └── BuildSummary.tsx
│   ├── lib/                         # Utility libraries
│   │   ├── db/                       # Database connection (already exists)
│   │   │   ├── index.ts
│   │   │   └── migrations/
│   │   ├── auth/
│   │   │   ├── config.ts
│   │   │   └── middleware.ts
│   │   ├── validations/
│   │   │   ├── auth.ts
│   │   │   ├── product.ts
│   │   │   ├── order.ts
│   │   │   └── user.ts
│   │   ├── utils/
│   │   │   ├── currency.ts
│   │   │   ├── date.ts
│   │   │   ├── image.ts
│   │   │   └── helpers.ts
│   │   ├── services/
│   │   │   ├── product-service.ts
│   │   │   ├── order-service.ts
│   │   │   ├── user-service.ts
│   │   │   ├── payment-service.ts
│   │   │   └── email-service.ts
│   │   ├── constants/
│   │   │   ├── categories.ts
│   │   │   ├── payment.ts
│   │   │   └── shipping.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCart.ts
│   │   │   ├── useProducts.ts
│   │   │   ├── useOrders.ts
│   │   │   └── useDebounce.ts
│   │   ├── store/
│   │   │   ├── cart-store.ts
│   │   │   ├── user-store.ts
│   │   │   └── product-store.ts
│   │   └── supabase/                 # Supabase integration
│   │       ├── client.ts
│   │       ├── auth.ts
│   │       ├── storage.ts
│   │       └── real-time.ts
│   ├── types/                       # TypeScript types
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   ├── api.ts
│   │   └── database.ts
│   └── styles/                      # Additional styles
│       └── components.css
├── prisma/                          # Database schema (already exists)
│   ├── schema.prisma
│   └── migrations/
├── public/                          # Static assets
│   ├── images/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── banners/
│   │   └── logos/
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── docs/                           # Documentation
│   ├── api.md
│   ├── database.md
│   └── deployment.md
├── scripts/                        # Build and deployment scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── migrate.sh
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Database Schema (PostgreSQL with Supabase)

### Core Tables

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE,
  brand VARCHAR(100),
  category_id UUID REFERENCES categories(id),
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product images table
CREATE TABLE product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product specifications table
CREATE TABLE product_specifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping cart table
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User addresses table
CREATE TABLE user_addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  address_type VARCHAR(20) DEFAULT 'shipping',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Bangladesh',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE wishlist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Product reviews table
CREATE TABLE product_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PC Builds table
CREATE TABLE pc_builds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_price DECIMAL(10,2),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PC Build components table
CREATE TABLE pc_build_components (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  build_id UUID REFERENCES pc_builds(id) ON DELETE CASCADE,
  component_type VARCHAR(50) NOT NULL,
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions table
CREATE TABLE payment_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  transaction_id VARCHAR(100),
  payment_method VARCHAR(50),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20),
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Key Features Implementation

### 1. Authentication System
- NextAuth.js with Supabase adapter
- JWT tokens for session management
- Role-based access control
- Password reset functionality

### 2. Product Management
- CRUD operations for products
- Category hierarchy
- Product variants and specifications
- Image upload with Supabase Storage
- Search and filtering
- Product comparison

### 3. Shopping Cart & Checkout
- Session-based cart persistence
- Real-time cart updates
- Multi-step checkout process
- Address management
- Payment gateway integration

### 4. Order Management
- Order tracking
- Status updates
- Order history
- Invoice generation
- Email notifications

### 5. User Account Management
- Profile management
- Address book
- Order history
- Wishlist functionality
- Account settings

### 6. Admin Panel
- Dashboard with analytics
- Product management
- Order management
- User management
- Category management
- Reports and analytics

### 7. PC Builder Feature
- Component compatibility checking
- Real-time pricing
- Build saving and sharing
- Compatibility validation

### 8. Search & SEO
- Full-text search
- Product filtering
- SEO optimization
- Sitemap generation
- Meta tags management

---

## Technology Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Zustand** for state management
- **TanStack Query** for server state
- **Framer Motion** for animations

### Backend
- **Next.js API Routes** for backend
- **PostgreSQL** as primary database
- **Supabase** for:
  - Database hosting
  - Authentication
  - File storage
  - Real-time subscriptions
- **Prisma** ORM for database management
- **NextAuth.js** for authentication

### Additional Services
- **Email service** (SendGrid/Resend)
- **Payment gateway** (Stripe/Local payment methods)
- **Image optimization** (Next.js Image + Supabase Storage)
- **Real-time updates** (Supabase Realtime)

---

## Development Setup

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Payment
STRIPE_SECRET_KEY="your-stripe-secret"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable"

# Email
RESEND_API_KEY="your-resend-key"
FROM_EMAIL="noreply@startech.com.bd"

# Storage
NEXT_PUBLIC_UPLOAD_URL="https://your-project.supabase.co/storage/v1"
```

### Key Scripts
```bash
# Development
npm run dev

# Database
npm run db:push
npm run db:generate
npm run db:migrate

# Build
npm run build
npm run start

# Linting
npm run lint
```

---

## Deployment Strategy

### 1. Frontend Deployment
- **Vercel** for Next.js application
- Automatic deployments on git push
- Environment variables configuration
- Custom domain setup

### 2. Database & Backend
- **Supabase** for PostgreSQL hosting
- Real-time subscriptions
- File storage
- Authentication

### 3. CI/CD Pipeline
- GitHub Actions for automated testing
- Automated database migrations
- Build and deployment automation

### 4. Monitoring & Analytics
- Application performance monitoring
- Error tracking
- User analytics
- Conversion tracking

This comprehensive architecture provides a scalable, maintainable, and feature-rich e-commerce platform that can handle the requirements of a modern online retail business like Star Tech Bangladesh.
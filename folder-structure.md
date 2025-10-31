# Star Tech Bangladesh - Next.js E-commerce Website Structure

## Project Overview
This folder structure is designed to rebuild startech.com.bd using Next.js 15 with App Router, PostgreSQL database, and Supabase for authentication and real-time features.

## Root Folder Structure

```
startech-nextjs/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── .env.example
├── .gitignore
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   ├── images/
│   │   ├── banners/
│   │   ├── categories/
│   │   ├── products/
│   │   └── brands/
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   ├── account/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── addresses/
│   │   │   │   └── page.tsx
│   │   │   ├── wishlist/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── products/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   ├── compare/
│   │   │   │   └── page.tsx
│   │   │   └── search/
│   │   │       └── page.tsx
│   │   ├── categories/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── brands/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── offers/
│   │   │   └── page.tsx
│   │   ├── happy-hour/
│   │   │   └── page.tsx
│   │   ├── pc-builder/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   ├── register/route.ts
│   │       │   ├── logout/route.ts
│   │       │   └── refresh/route.ts
│   │       ├── products/
│   │       │   ├── route.ts
│   │       │   ├── [id]/route.ts
│   │       │   ├── search/route.ts
│   │       │   └── related/route.ts
│   │       ├── categories/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── brands/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── cart/
│   │       │   ├── route.ts
│   │       │   ├── add/route.ts
│   │       │   ├── update/route.ts
│   │       │   └── remove/route.ts
│   │       ├── orders/
│   │       │   ├── route.ts
│   │       │   ├── create/route.ts
│   │       │   └── [id]/route.ts
│   │       ├── users/
│   │       │   ├── profile/route.ts
│   │       │   ├── addresses/route.ts
│   │       │   └── wishlist/route.ts
│   │       ├── offers/
│   │       │   └── route.ts
│   │       ├── pc-builder/
│   │       │   ├── save/route.ts
│   │       │   ├── load/route.ts
│   │       │   └── compatible/route.ts
│   │       └── upload/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── dropdown.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── carousel.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── mobile-menu.tsx
│   │   │   └── breadcrumbs.tsx
│   │   ├── product/
│   │   │   ├── product-card.tsx
│   │   │   ├── product-grid.tsx
│   │   │   ├── product-list.tsx
│   │   │   ├── product-filters.tsx
│   │   │   ├── product-sort.tsx
│   │   │   ├── product-comparison.tsx
│   │   │   └── quick-view.tsx
│   │   ├── cart/
│   │   │   ├── cart-item.tsx
│   │   │   ├── cart-summary.tsx
│   │   │   ├── cart-drawer.tsx
│   │   │   └── checkout-form.tsx
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── forgot-password-form.tsx
│   │   ├── forms/
│   │   │   ├── address-form.tsx
│   │   │   ├── profile-form.tsx
│   │   │   └── contact-form.tsx
│   │   ├── sections/
│   │   │   ├── hero-banner.tsx
│   │   │   ├── category-showcase.tsx
│   │   │   ├── featured-products.tsx
│   │   │   ├── brand-showcase.tsx
│   │   │   ├── offers-section.tsx
│   │   │   └── newsletter.tsx
│   │   ├── common/
│   │   │   ├── search-bar.tsx
│   │   │   ├── price-display.tsx
│   │   │   ├── rating-stars.tsx
│   │   │   ├── image-gallery.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   └── error-boundary.tsx
│   │   └── pc-builder/
│   │       ├── pc-builder-interface.tsx
│   │       ├── component-selector.tsx
│   │       ├── compatibility-checker.tsx
│   │       └── build-summary.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   ├── db/
│   │   │   ├── schema.ts
│   │   │   ├── queries.ts
│   │   │   └── mutations.ts
│   │   ├── utils/
│   │   │   ├── currency.ts
│   │   │   ├── helpers.ts
│   │   │   ├── validators.ts
│   │   │   └── formatters.ts
│   │   ├── hooks/
│   │   │   ├── use-cart.ts
│   │   │   ├── use-wishlist.ts
│   │   │   ├── use-auth.ts
│   │   │   ├── use-products.ts
│   │   │   └── use-debounce.ts
│   │   ├── store/
│   │   │   ├── cart-store.ts
│   │   │   ├── wishlist-store.ts
│   │   │   ├── auth-store.ts
│   │   │   └── product-store.ts
│   │   ├── services/
│   │   │   ├── product-service.ts
│   │   │   ├── order-service.ts
│   │   │   ├── user-service.ts
│   │   │   └── upload-service.ts
│   │   └── constants/
│   │       ├── categories.ts
│   │       ├── brands.ts
│   │       └── routes.ts
│   ├── types/
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── brand.ts
│   │   ├── user.ts
│   │   ├── order.ts
│   │   ├── cart.ts
│   │   └── api.ts
│   └── styles/
│       ├── components.css
│       ├── animations.css
│       └── custom.css
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
└── docs/
    ├── api-documentation.md
    ├── database-schema.md
    └── deployment-guide.md
```

## Key Features Implementation

### 1. Database Schema (PostgreSQL with Supabase)

The database will include the following main tables:

```sql
-- Users & Authentication
users
profiles
addresses

-- Products & Catalog
products
categories
brands
product_categories
product_images
product_specifications
inventory

-- Orders & Transactions
orders
order_items
order_payments
order_shipments

-- Shopping & User Interaction
cart_items
wishlist_items
product_reviews
product_comparisons

-- Marketing & Promotions
offers
coupons
happy_hour_deals

-- PC Builder
pc_builds
pc_build_components
compatibility_rules
```

### 2. Core E-commerce Features

- **Product Catalog**: Advanced filtering, search, sorting
- **Shopping Cart**: Real-time cart updates, persistent storage
- **Checkout**: Multi-step checkout with multiple payment options
- **User Accounts**: Profile management, order history, addresses
- **PC Builder**: Interactive PC building tool with compatibility checking
- **Offers & Promotions**: Dynamic offers, happy hour deals
- **Product Comparison**: Side-by-side product comparison
- **Reviews & Ratings**: User-generated reviews and ratings

### 3. Technology Stack

- **Frontend**: Next.js 15 with App Router, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: PostgreSQL with Supabase
- **Authentication**: Supabase Auth
- **State Management**: Zustand for client state, TanStack Query for server state
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Form Handling**: React Hook Form with Zod validation
- **Payment**: Integration with popular payment gateways

### 4. Performance Optimizations

- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: Supabase caching, Next.js caching
- **SEO**: Dynamic meta tags, structured data
- **PWA**: Service worker for offline functionality
- **Analytics**: Integration with analytics tools

### 5. Security Features

- **Authentication**: JWT-based authentication with Supabase
- **Authorization**: Role-based access control
- **Data Validation**: Zod schemas for form validation
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Rate Limiting**: API rate limiting
- **Secure Headers**: Security headers configuration

This structure provides a solid foundation for building a scalable, maintainable, and feature-rich e-commerce website similar to startech.com.bd with modern Next.js technologies and Supabase integration.
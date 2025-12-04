# 🛒 TechBazar - Modern E-Commerce Platform

> A feature-rich, full-stack e-commerce platform for tech products built with Next.js 15, TypeScript, Prisma, and PostgreSQL. Specializing in computers, laptops, gaming gear, and tech accessories with comprehensive admin management and seamless user experience.


## 🌟 Live Demo

- **Frontend**: [TechBazar Store](https://techbazar.vercel.app)
- **Admin Panel**: [Admin Dashboard](https://techbazar.vercel.app/admin)

## ✨ Key Features

### 🛍️ Customer Features
- **Modern UI/UX** - Beautiful, responsive design with gradient themes and animations
- **Product Catalog** - Browse laptops, desktops, components, gaming gear, and accessories
- **Advanced Search** - Real-time search with debouncing and instant results
- **Smart Filtering** - Filter by category, brand, price range, and specifications
- **Product Comparison** - Compare up to 3 products side-by-side
- **Wishlist System** - Save favorite products with instant sync
- **Shopping Cart** - Persistent cart with real-time updates using Zustand
- **Checkout System** - Multi-step checkout with multiple payment and delivery options
- **Order Tracking** - Real-time order status updates with detailed history
- **User Authentication** - Secure login/register with NextAuth.js
- **Profile Management** - Manage account, addresses, and order history
- **Product Reviews** - Rate and review purchased products
- **Responsive Design** - Perfect mobile, tablet, and desktop experience
- **SEO Optimized** - Meta tags, sitemaps, and structured data for better ranking

### 🎯 Admin Features
- **Dashboard Overview** - Sales analytics, order statistics, and revenue tracking
- **Product Management** - Full CRUD operations with image upload (ImgBB integration)
- **Order Management** - View, update status, and process orders
- **User Management** - Manage users, roles (Admin, Moderator, Customer), and permissions
- **Category Management** - Organize products into hierarchical categories
- **Offer Management** - Create and manage promotional offers
- **Real-time Updates** - Instant UI updates with optimistic rendering
- **Role-Based Access** - Granular permission control for different admin levels

### 🎨 UI/UX Highlights
- **Modern Design** - Gradient backgrounds, glassmorphism effects, and smooth animations
- **Scroll Animations** - Framer Motion-like scroll-triggered product card animations
- **Interactive Elements** - Hover effects, transitions, and micro-interactions
- **Dark Mode Ready** - Theme support with Tailwind CSS
- **Loading States** - Skeleton screens and loading indicators
- **Toast Notifications** - Success/error feedback with Sonner and SweetAlert2
- **Modal Dialogs** - Confirmation dialogs for critical actions
- **Dropdown Menus** - Intuitive navigation with submenu support

## 🚀 Tech Stack

### Frontend
- **⚛️ React 19** - Latest React with server components
- **📘 TypeScript** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🎭 Framer Motion** - Animation library for smooth transitions
- **🎯 Zustand** - Lightweight state management with persistence
- **📦 React Icons** - Comprehensive icon library
- **🔔 Sonner & SweetAlert2** - Toast notifications and modals

### Backend
- **🗄️ Prisma 6.19.0** - Next-generation ORM for PostgreSQL
- **🐘 PostgreSQL (Supabase)** - Scalable relational database
- **🔐 NextAuth.js v5** - Complete authentication solution
- **🔑 bcryptjs** - Password hashing and security

### Development Tools
- **📦 pnpm** - Fast, disk space efficient package manager
- **🧪 ESLint** - Code linting and quality checks
- **🎨 Prettier** - Code formatting
- **🔧 PostCSS** - CSS processing

### APIs & Integrations
- **📸 ImgBB** - Image hosting and management
- **💳 Nagad** - Payment gateway integration (ready)
- **📊 Vercel Analytics** - Performance monitoring
- **🚀 Speed Insights** - Web vitals tracking


## 📁 Project Structure

```
TechBazar/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Authentication routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── admin/                # Admin dashboard
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── users/
│   │   │   ├── categories/
│   │   │   └── settings/
│   │   ├── api/                  # API routes
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── admin/
│   │   │   └── search/
│   │   ├── cart/                 # Shopping cart
│   │   ├── checkout/             # Checkout process
│   │   ├── products/             # Product pages
│   │   ├── category/             # Category pages
│   │   ├── account/              # User account
│   │   │   ├── orders/
│   │   │   ├── wishlist/
│   │   │   └── addresses/
│   │   └── order-success/        # Order confirmation
│   ├── components/               # React components
│   │   ├── admin/                # Admin components
│   │   ├── cart/                 # Cart components
│   │   ├── product/              # Product components
│   │   ├── filters/              # Filter components
│   │   ├── providers/            # Context providers
│   │   └── ui/                   # UI components
│   ├── lib/                      # Utilities & configs
│   │   ├── auth.ts               # NextAuth config
│   │   ├── db.ts                 # Prisma client
│   │   ├── categories.ts         # Category helpers
│   │   └── imgbb.ts              # Image upload
│   ├── store/                    # Zustand stores
│   │   ├── cart-store.ts
│   │   ├── wishlist-store.ts
│   │   └── compare-store.ts
│   ├── types/                    # TypeScript types
│   └── middleware.ts             # Auth middleware
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # DB migrations
├── public/                       # Static assets
└── package.json
```

- **📱 Responsive** - Mobile-first design principles with smooth animations
- **🗄️ Database Ready** - Prisma ORM configured for rapid backend development
## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database (or Supabase account)
- ImgBB API key (for image uploads)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Shdeveloper12/E-Commerce-Platform.git
cd TechBazar
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# ImgBB (Image Upload)
IMGBB_API_KEY="your-imgbb-api-key"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
# Push schema to database
pnpm prisma db push

# Or run migrations
pnpm prisma migrate dev

# Seed categories (optional)
pnpm prisma db seed
```

5. **Create admin user**

Run the SQL script in `create-admin-user.sql` or:

```sql
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
```

6. **Start development server**
```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `IMGBB_API_KEY` | ImgBB API key for image uploads | ✅ |
| `NEXT_PUBLIC_BASE_URL` | Public base URL | ✅ |

## 🗄️ Database Schema

### Main Tables
- **User** - User accounts with roles (CUSTOMER, MODERATOR, ADMIN)
- **Product** - Product catalog with specs and pricing
- **Category** - Hierarchical product categories
- **Order** - Customer orders with status tracking
- **OrderItem** - Order line items
- **Review** - Product reviews and ratings
- **Address** - User shipping addresses

## 🎨 UI Components

### Custom Components
- **Navbar** - Responsive navigation with search and mega menu
- **Footer** - Newsletter signup, social links, payment methods
- **ProductCard** - Animated product cards with quick actions
- **FilterSidebar** - Advanced filtering system
- **CartDrawer** - Slide-out shopping cart
- **CompareDrawer** - Product comparison panel
- **OrderActions** - Admin order management dropdown
- **UserActions** - Admin user management dropdown

### Shadcn/UI Components
- Button, Card, Dialog, Dropdown Menu
- Select, Input, Textarea, Alert
- Toast, Badge, Skeleton

## 🔐 Authentication & Authorization

### User Roles
- **CUSTOMER** - Standard user with shopping access
- **MODERATOR** - Can manage products and view orders
- **ADMIN** - Full system access and user management

### Protected Routes
- `/admin/*` - Admin only
- `/account/*` - Authenticated users
- `/checkout` - Authenticated users

### Session Management
- Server-side session with NextAuth.js
- Client-side state management with Zustand
- Automatic session refresh
- **📊 Data Visualization** - Charts, tables, and drag-and-drop functionality
- **🌍 i18n Ready** - Multi-language support with Next Intl
- **🚀 Production Ready** - Optimized build and deployment settings
- **🤖 AI-Friendly** - Structured codebase perfect for AI assistance

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

## 📁 Project Structure

```
src/
## 🎯 API Routes

### Public APIs
- `GET /api/products` - List products with filtering
- `GET /api/products/[slug]` - Product details
- `GET /api/categories` - Category tree
- `GET /api/search` - Product search
- `POST /api/auth/register` - User registration

### Protected APIs
- `POST /api/orders/create` - Create order
- `GET /api/orders/user` - User's orders
- `PATCH /api/orders/[id]/cancel` - Cancel order

### Admin APIs
- `GET /api/admin/orders` - All orders
- `PATCH /api/admin/orders/[id]` - Update order
- `DELETE /api/admin/orders/[id]` - Delete order
- `PATCH /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

## 🎨 Styling & Theming

### Design System
- **Primary Color**: Orange (#ef4a23)
- **Secondary Color**: Blue (#4a5fc4)
- **Gradient Themes**: Purple/Pink, Blue/Purple
- **Font**: Geist Sans & Geist Mono

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Animations
- Scroll-triggered product cards
- Hover effects and transitions
- Loading skeletons
- Modal animations
- Toast notifications

## 📱 Mobile Optimization

- ✅ Responsive grid layouts
- ✅ Touch-optimized buttons (min 44x44px)
- ✅ Mobile navigation drawer
- ✅ Swipeable cart drawer
- ✅ Optimized images with Next.js Image
- ✅ Lazy loading and code splitting
- ✅ Progressive Web App ready

## 🔍 SEO Features

- ✅ Dynamic meta tags per page
- ✅ Structured data (JSON-LD)
- ✅ Sitemap generation
- ✅ Robots.txt configuration
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Google Search Console integration
- ✅ Canonical URLs
## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy automatically

### Manual Deployment

```bash
pnpm build
pnpm start
```

### Database Deployment
- Use Supabase for PostgreSQL hosting
- Run migrations: `pnpm prisma migrate deploy`
- Generate client: `pnpm prisma generate`

## 📊 Performance

- **Lighthouse Score**: 90+ (Desktop)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Speed Index**: < 2.5s

### Optimizations
- Server-side rendering (SSR)
- Static generation where possible
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Zustand for efficient state management
- Debounced search queries
- Optimistic UI updates

## 🧪 Testing

```bash
# Run tests (when configured)
pnpm test

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 📚 Documentation

Additional documentation available:
- [Admin Setup Guide](ADMIN_SETUP_GUIDE.md)
- [Checkout System](CHECKOUT_SYSTEM_README.md)
- [Category System](CATEGORY_SYSTEM_README.md)
- [Search Functionality](SEARCH_FUNCTIONALITY_README.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [ImgBB Setup](IMGBB_SETUP_GUIDE.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Shafayet Hossain**
- GitHub: [@Shdeveloper12](https://github.com/Shdeveloper12)
- Email: shafayets422@gmail.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Prisma for the excellent ORM
- Supabase for database hosting
- ImgBB for image hosting
- All open-source contributors

## 📞 Support

For support, email shafayets422@gmail.com or open an issue on GitHub.

---

<div align="center">
  Made with ❤️ by Shafayet Hossain
  <br>
  <sub>Built with Next.js 15 & TypeScript</sub>
</div>




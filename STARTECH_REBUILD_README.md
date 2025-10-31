# Star Tech Bangladesh - Next.js E-commerce Rebuild

A comprehensive Next.js 15 e-commerce platform rebuild for startech.com.bd, featuring modern architecture, PostgreSQL database with Supabase integration, and scalable component structure.

## 🚀 Project Overview

This project is a complete rebuild of the Star Tech Bangladesh e-commerce platform, one of Bangladesh's leading computer and electronics retailers. The rebuild leverages modern web technologies to provide a scalable, maintainable, and feature-rich shopping experience.

### 🎯 Key Features

- **Product Catalog**: Comprehensive product management with categories, brands, and advanced filtering
- **Shopping Cart**: Real-time cart management with session persistence
- **User Authentication**: Secure authentication with NextAuth.js and Supabase
- **Order Management**: Complete order lifecycle with tracking and notifications
- **Payment Integration**: Multiple payment gateway support
- **PC Builder**: Interactive PC building tool with compatibility checking
- **Admin Panel**: Comprehensive admin dashboard for store management
- **Search & SEO**: Advanced search capabilities with SEO optimization
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Technology Stack

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
- **Supabase** for database hosting, auth, and storage
- **Prisma** ORM for database management
- **NextAuth.js** for authentication

### Infrastructure
- **Vercel** for frontend deployment
- **Supabase** for backend services
- **Resend** for email services
- **Stripe** for payment processing

## 📁 Project Structure

```
src/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (shop)/                   # Shop & product routes
│   ├── (account)/                # User account routes
│   ├── (admin)/                  # Admin panel routes
│   ├── api/                      # API routes
│   ├── globals.css
│   ├── layout.tsx
│   └── sitemap.ts
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components
│   ├── product/                  # Product components
│   ├── cart/                     # Cart components
│   ├── auth/                     # Authentication components
│   ├── forms/                    # Form components
│   ├── common/                   # Common utilities
│   ├── admin/                    # Admin components
│   └── pc-builder/               # PC Builder components
├── lib/                         # Utility libraries
│   ├── db/                       # Database connection
│   ├── auth/                     # Authentication config
│   ├── validations/              # Zod validations
│   ├── utils/                    # Utility functions
│   ├── services/                 # Business logic
│   ├── constants/                # Application constants
│   ├── hooks/                    # Custom React hooks
│   ├── store/                    # Zustand stores
│   └── supabase/                 # Supabase integration
├── types/                       # TypeScript type definitions
└── styles/                      # Additional styles
```

## 🗄️ Database Schema

The application uses PostgreSQL with a comprehensive schema designed for e-commerce:

### Core Tables
- **Users**: User management with roles and profiles
- **Categories**: Hierarchical product categories
- **Products**: Product catalog with specifications
- **Product Images**: Product image management
- **Orders**: Order management and tracking
- **Order Items**: Individual order line items
- **Cart Items**: Shopping cart management
- **User Addresses**: Customer address management
- **Wishlist Items**: Product wishlist functionality
- **Product Reviews**: Customer review system
- **PC Builds**: Custom PC build configurations
- **Payment Transactions**: Payment processing records

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Supabase account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd startech-rebuild
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/startech_db"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Payment
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

4. **Set up database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Key Components

### Product Management
- **ProductCard**: Display product information
- **ProductGrid**: Grid layout for products
- **ProductFilters**: Advanced filtering options
- **ProductComparison**: Side-by-side product comparison

### Shopping Cart
- **CartItem**: Individual cart item display
- **CartSummary**: Cart total and checkout
- **CartDrawer**: Slide-out cart interface
- **AddToCartButton**: Add products to cart

### Authentication
- **LoginForm**: User login interface
- **RegisterForm**: User registration
- **AuthProvider**: Authentication context
- **ProtectedRoute**: Route protection wrapper

### PC Builder
- **PCBuilder**: Main PC building interface
- **ComponentSelector**: Component selection
- **CompatibilityChecker**: Build validation
- **BuildSummary**: Build overview and pricing

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Products
- `GET /api/products` - Get products with filtering
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove cart item

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status

## 🎯 Feature Highlights

### 1. Advanced Product Search
- Full-text search across products
- Filter by category, price range, brand
- Sort by relevance, price, popularity
- Search suggestions and autocomplete

### 2. Shopping Experience
- Real-time cart updates
- Product comparison tool
- Wishlist functionality
- Recently viewed products

### 3. User Account Management
- Profile management
- Order history and tracking
- Address book management
- Product reviews and ratings

### 4. PC Builder Tool
- Component compatibility checking
- Real-time pricing updates
- Build saving and sharing
- Performance estimation

### 5. Admin Dashboard
- Sales analytics and reports
- Product management
- Order processing
- Customer management

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Database Setup (Supabase)
1. Create a new Supabase project
2. Set up PostgreSQL database
3. Configure storage buckets
4. Set up authentication providers

### Environment Variables
```env
# Production
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
# ... other production variables
```

## 📊 Performance Optimization

### Frontend Optimization
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Caching strategies
- Bundle size optimization

### Database Optimization
- Database indexing
- Query optimization
- Connection pooling
- Caching strategies

### SEO Optimization
- Meta tags and structured data
- Sitemap generation
- Open Graph tags
- Canonical URLs

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Password hashing
- Session management

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### Payment Security
- PCI compliance
- Secure payment processing
- Fraud detection
- Data encryption

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test products.test.ts

# Run tests with coverage
npm run test:coverage
```

### Test Structure
```
tests/
├── __mocks__/
├── utils/
├── components/
├── api/
└── e2e/
```

## 📚 Documentation

### API Documentation
- Comprehensive API reference
- Request/response examples
- Authentication methods
- Error handling

### Component Documentation
- Component props and usage
- Examples and best practices
- Customization options

### Deployment Guide
- Step-by-step deployment instructions
- Environment configuration
- Monitoring and maintenance

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write comprehensive tests
- Document your code

## 📞 Support

### Getting Help
- Read the documentation
- Check existing issues
- Create a new issue
- Contact the development team

### Bug Reports
- Describe the bug
- Include reproduction steps
- Add screenshots if applicable
- Include environment details

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Star Tech Bangladesh** for the original platform inspiration
- **Next.js** team for the excellent framework
- **Supabase** for the backend services
- **shadcn/ui** for the beautiful components
- **Tailwind CSS** for the utility-first CSS framework

---

**Built with ❤️ for the Bangladeshi e-commerce community**
# Admin Dashboard Documentation

## Overview
The admin dashboard provides a comprehensive interface for managing the e-commerce platform. Only users with `ADMIN` or `MODERATOR` roles can access these features.

## Access Control

### Authentication & Authorization
- Authentication is handled via NextAuth.js
- Middleware protects all `/admin/*` routes
- Only users with `ADMIN` or `MODERATOR` roles can access the dashboard
- If unauthorized users try to access admin routes, they are redirected to `/account` or `/login`

### Creating an Admin User
To create an admin user, you need to update the database directly:

```sql
-- Update existing user to admin
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';

-- Or create a new admin user (after registering normally)
UPDATE users SET role = 'ADMIN' WHERE id = 'user-id-here';
```

Or use Prisma Studio:
```bash
npm run db:push
npx prisma studio
```
Then update the user's role to `ADMIN` or `MODERATOR`.

## Dashboard Features

### 1. Dashboard Home (`/admin`)
- Overview statistics:
  - Total Products
  - Total Orders
  - Total Users
  - Revenue (placeholder)
- Recent orders table with quick view
- Quick access to all management sections

### 2. Products Management (`/admin/products`)

#### Features:
- **View All Products**: List all products with images, prices, stock, and status
- **Add New Product** (`/admin/products/new`):
  - Basic information (name, slug, descriptions)
  - Pricing & inventory (price, discount, SKU, stock quantity)
  - Product images (multiple images with primary selection)
  - Specifications (key-value pairs)
  - Category assignment
  - SEO metadata
  - Active/Featured toggles

- **Edit Product** (`/admin/products/[id]/edit`):
  - Update all product information
  - Manage images and specifications
  - Change product status

- **Delete Product**: Remove products from the store

#### API Endpoints:
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create new product
- `GET /api/admin/products/[id]` - Get single product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product (ADMIN only)

### 3. Categories Management (`/admin/categories`)
- View all product categories
- See product count per category
- Manage category hierarchy
- Set sort order and status

### 4. Orders Management (`/admin/orders`)
- View all customer orders
- See order status (PENDING, PROCESSING, DELIVERED, CANCELLED)
- Check payment status (PAID, PENDING, FAILED)
- View order items and customer information
- Track order dates and totals

### 5. Users Management (`/admin/users`)
- View all registered users
- See user roles (CUSTOMER, MODERATOR, ADMIN)
- Track user activity (orders, reviews)
- View user status (Active/Inactive)
- See registration dates

### 6. Settings (`/admin/settings`)
Placeholder for future settings:
- Store information
- Payment settings
- Shipping settings
- Tax settings
- Email settings
- Security settings

## File Structure

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx              # Admin dashboard layout with sidebar
│       ├── page.tsx                # Dashboard home with statistics
│       ├── products/
│       │   ├── page.tsx            # Products list
│       │   ├── new/
│       │   │   └── page.tsx        # Create product form
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx    # Edit product form
│       ├── categories/
│       │   └── page.tsx            # Categories management
│       ├── orders/
│       │   └── page.tsx            # Orders management
│       ├── users/
│       │   └── page.tsx            # Users management
│       └── settings/
│           └── page.tsx            # Settings page
├── components/
│   └── admin/
│       └── product-form.tsx        # Reusable product form component
├── middleware.ts                   # Route protection
└── lib/
    └── auth.ts                     # Authentication configuration
```

## API Endpoints

### Products API
- **GET** `/api/admin/products` - Get all products
- **POST** `/api/admin/products` - Create product (ADMIN/MODERATOR)
- **GET** `/api/admin/products/[id]` - Get product by ID
- **PUT** `/api/admin/products/[id]` - Update product (ADMIN/MODERATOR)
- **DELETE** `/api/admin/products/[id]` - Delete product (ADMIN only)

## Product Upload Process

### Image Upload
Currently, images use temporary URLs. For production, integrate with:
- **Cloudinary**: Cloud-based image storage and CDN
- **AWS S3**: Amazon's object storage service
- **Vercel Blob**: Vercel's file storage solution

Example Cloudinary integration:
```typescript
// Install: npm install cloudinary
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload function
const uploadImage = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const result = await cloudinary.uploader.upload(
    `data:${file.type};base64,${Buffer.from(buffer).toString('base64')}`
  )
  return result.secure_url
}
```

## Security Features

1. **Role-Based Access Control**:
   - Middleware checks user role on every admin request
   - API endpoints verify authentication and authorization
   - Different permissions for ADMIN vs MODERATOR

2. **Protected Routes**:
   - All `/admin/*` routes require authentication
   - Unauthorized access redirects to login
   - Non-admin users are redirected to account page

3. **Session Management**:
   - JWT-based sessions via NextAuth.js
   - Secure session storage
   - Automatic token refresh

## Usage Instructions

### 1. Initial Setup
1. Ensure database is set up: `npm run db:push`
2. Create an admin user (see "Creating an Admin User" above)
3. Start the development server: `npm run dev`
4. Navigate to `/admin` and log in

### 2. Adding Products
1. Go to `/admin/products`
2. Click "Add Product"
3. Fill in all required fields:
   - Product name and slug
   - Price and stock quantity
   - Select category
4. Upload product images
5. Add specifications (optional)
6. Set SEO metadata (optional)
7. Toggle active/featured status
8. Click "Create Product"

### 3. Managing Orders
1. Go to `/admin/orders`
2. View all orders in the table
3. Click on an order to view details
4. Update order status as needed

### 4. Managing Users
1. Go to `/admin/users`
2. View all registered users
3. Check user activity and roles
4. Manage user permissions

## Next Steps

### Recommended Enhancements:
1. **Image Upload Integration**:
   - Integrate Cloudinary or AWS S3
   - Add image optimization and resizing
   - Implement drag-and-drop upload

2. **Order Management**:
   - Add order detail view
   - Implement status updates
   - Add order tracking

3. **Bulk Operations**:
   - Bulk product import (CSV)
   - Bulk status updates
   - Bulk deletion with confirmation

4. **Analytics**:
   - Sales charts and graphs
   - Revenue tracking
   - Popular products analytics

5. **Notifications**:
   - Email notifications for new orders
   - Low stock alerts
   - Order status updates

6. **Search & Filters**:
   - Product search in admin panel
   - Filter by category, status, stock
   - Date range filters for orders

## Troubleshooting

### Cannot Access Admin Panel
- Verify user role is set to 'ADMIN' or 'MODERATOR' in database
- Clear browser cookies and log in again
- Check middleware configuration

### Images Not Uploading
- Currently using temporary URLs (not production-ready)
- Implement cloud storage solution (Cloudinary, S3, etc.)
- Check file size limits

### API Errors
- Check database connection
- Verify authentication token
- Review console for detailed errors
- Ensure Prisma schema is up to date: `npm run db:generate`

## Environment Variables

Required environment variables:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

For image upload (when implemented):
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check the console for error messages
4. Verify database schema with: `npx prisma studio`

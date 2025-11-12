# Admin Dashboard Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Push schema to database
npm run db:push

# Generate Prisma Client
npm run db:generate
```

### 3. Create Admin User

#### Option A: Using Prisma Studio (Recommended)
```bash
# Open Prisma Studio
npx prisma studio

# Steps:
# 1. First, register a user normally through the app
# 2. Open Prisma Studio
# 3. Go to the "User" model
# 4. Find your user and edit it
# 5. Change the "role" field from "CUSTOMER" to "ADMIN"
# 6. Save
```

#### Option B: Using SQL
```bash
# Connect to your database and run:
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access Admin Dashboard
Navigate to: http://localhost:3000/admin

Login with your admin credentials.

---

## Admin Features Checklist

✅ Dashboard Home
- View statistics (products, orders, users)
- Recent orders overview

✅ Product Management
- List all products
- Add new products
- Edit products
- Delete products
- Upload images
- Add specifications
- SEO settings

✅ Category Management
- View categories
- Track products per category

✅ Order Management
- View all orders
- Check order status
- View payment status
- See customer details

✅ User Management
- View all users
- Check user roles
- Track user activity

✅ Settings
- Placeholder for future features

---

## Default Admin Credentials

**Important**: After setting up, you need to:
1. Register a new user through `/register`
2. Update that user's role to 'ADMIN' in the database
3. Login at `/login` with those credentials
4. Access admin panel at `/admin`

---

## Environment Variables

Make sure you have these in your `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Roles

- **ADMIN**: Full access to all features including delete operations
- **MODERATOR**: Can create and edit but has limited delete permissions
- **CUSTOMER**: Regular user, no admin access

---

## Troubleshooting

### Cannot access /admin
1. Make sure you're logged in
2. Check your user role in database
3. Clear cookies and login again

### Product images not working
Images currently use temporary URLs. For production:
- Integrate Cloudinary, AWS S3, or Vercel Blob
- See ADMIN_DASHBOARD_README.md for integration guide

### Database errors
```bash
# Reset database (WARNING: deletes all data)
npm run db:reset

# Or just push schema again
npm run db:push
```

---

## Next Steps

1. ✅ Access admin dashboard
2. ✅ Create product categories
3. ✅ Add your first product
4. ✅ Test order management
5. 📸 Setup image upload (Cloudinary recommended)
6. 📧 Configure email notifications
7. 💳 Setup payment gateway

---

For detailed documentation, see `ADMIN_DASHBOARD_README.md`

# Netlify Deployment Quick Start

## Prerequisites
- GitHub account
- Netlify account (free)
- PostgreSQL database (Supabase/Neon recommended)

## Quick Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### 2. Connect to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up or log in
3. Click **"Add new site"** > **"Import an existing project"**
4. Choose **"Deploy with GitHub"**
5. Authorize Netlify
6. Select your repository: `TechBazar`

### 3. Configure Build

The `netlify.toml` file is already configured, but verify these settings:

- **Base directory:** (leave empty)
- **Build command:** `npm run build`
- **Publish directory:** `.next`

Click **"Show advanced"** and ensure Node version is 18+

### 4. Add Environment Variables

Before deploying, add these environment variables:

**Go to:** Site settings > Environment variables > Add a variable

#### Required Variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-site-name.netlify.app

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-site-name.netlify.app

# Image Upload (ImgBB)
IMGBB_API_KEY=your-imgbb-api-key

# Payment (Nagad) - Optional for testing
NAGAD_MODE=sandbox
NAGAD_MERCHANT_ID=your-merchant-id
NAGAD_MERCHANT_NUMBER=your-merchant-number
NAGAD_PUBLIC_KEY=your-public-key
NAGAD_PRIVATE_KEY=your-private-key
```

### 5. Deploy

Click **"Deploy site"** and wait for the build to complete (3-5 minutes)

### 6. Setup Database

After deployment, initialize your database:

```bash
# Install dependencies
npm install

# Run migrations
DATABASE_URL="your_production_database_url" npx prisma migrate deploy

# Generate Prisma Client
DATABASE_URL="your_production_database_url" npx prisma generate

# Seed categories (optional)
DATABASE_URL="your_production_database_url" node setup-categories.js
```

### 7. Create Admin User

Run this SQL in your database:

```sql
-- Update with your email
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
```

Or use the SQL file:
```bash
# Connect to your database and run
psql $DATABASE_URL -f create-admin-user.sql
```

### 8. Test Your Site

Visit your Netlify URL (e.g., `https://your-site-name.netlify.app`) and test:

- ✅ Homepage loads
- ✅ User registration
- ✅ User login
- ✅ Browse products
- ✅ Add to cart
- ✅ Checkout process
- ✅ Admin dashboard (if admin user created)

## Troubleshooting

### Build Fails

**Check build logs** in Netlify dashboard:
- Common issues: Missing environment variables, dependency errors
- Solution: Review logs and fix errors

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check if database allows external connections
3. Ensure migrations are deployed

### Next.js Runtime Error

Install the Next.js plugin:
```bash
netlify plugins:install @netlify/plugin-nextjs
```

Or via dashboard: Integrations > Next.js Runtime > Install

### Environment Variables Not Working

1. Ensure variables don't have quotes
2. Redeploy after adding variables
3. Check variable names match exactly

### 404 Errors on Routes

The `netlify.toml` handles this, but if issues persist:
1. Check `netlify.toml` is in root directory
2. Verify redirects are configured
3. Clear cache and redeploy

## Custom Domain Setup

### Add Your Domain

1. Go to **Site settings** > **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `techbazar.com`)

### Configure DNS

Add these records to your domain provider:

**For apex domain (techbazar.com):**
```
A Record
Name: @
Value: 75.2.60.5
```

**For www subdomain:**
```
CNAME Record
Name: www
Value: your-site-name.netlify.app
```

### Update Environment Variables

After adding custom domain:
```env
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

Then redeploy.

## Continuous Deployment

Every push to your main branch automatically deploys:

```bash
git add .
git commit -m "Update features"
git push origin main
# Netlify auto-deploys in ~3 minutes
```

## Database Providers

### Supabase (Recommended)
- Free tier: 500MB database
- Go to [supabase.com](https://supabase.com)
- Create project > Get connection string

### Neon
- Free tier: 10GB storage
- Go to [neon.tech](https://neon.tech)
- Create project > Get connection string

### Railway
- Free tier: 500MB + limited hours
- Go to [railway.app](https://railway.app)
- Deploy PostgreSQL > Get connection string

## ImgBB Setup (Free Image Hosting)

1. Go to [imgbb.com](https://imgbb.com)
2. Sign up for free account
3. Go to [API page](https://api.imgbb.com/)
4. Get your API key
5. Add to Netlify environment variables

## Need Help?

- **Netlify Docs:** https://docs.netlify.com
- **Next.js on Netlify:** https://docs.netlify.com/frameworks/next-js/
- **Netlify Support:** https://answers.netlify.com/

## Commands Reference

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to existing site
netlify link

# Deploy to draft
netlify deploy

# Deploy to production
netlify deploy --prod

# View site info
netlify status

# Open site in browser
netlify open

# View logs
netlify logs
```

## Environment Setup Checklist

- [ ] GitHub repository created and pushed
- [ ] Netlify account created
- [ ] Database created (Supabase/Neon)
- [ ] `DATABASE_URL` added to Netlify
- [ ] `NEXTAUTH_SECRET` generated and added
- [ ] `NEXTAUTH_URL` set to Netlify URL
- [ ] `IMGBB_API_KEY` added (for images)
- [ ] Site deployed successfully
- [ ] Database migrations run
- [ ] Admin user created
- [ ] Site tested and working

## Success! 🎉

Your TechBazar e-commerce site is now live on Netlify!

**Next Steps:**
1. Share your site URL
2. Monitor analytics in Netlify dashboard
3. Set up custom domain (optional)
4. Configure email notifications
5. Enable branch deploys for testing

Happy selling! 🛒

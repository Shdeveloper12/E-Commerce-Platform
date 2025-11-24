# Complete Deployment Guide

## Overview
This guide covers deploying your Next.js e-commerce platform to production, including database, environment setup, and various hosting options.

---

## Pre-Deployment Checklist

### ✅ Required Setup

- [ ] Database configured (PostgreSQL)
- [ ] Environment variables set
- [ ] Authentication working (NextAuth)
- [ ] Payment gateway credentials (Nagad)
- [ ] Image uploads configured
- [ ] Build succeeds locally
- [ ] All tests pass

### ✅ Code Quality

```bash
# Check for build errors
npm run build

# Run linting
npm run lint

# Check TypeScript
npx tsc --noEmit
```

---

## Option 1: Vercel (Recommended for Next.js)

### Why Vercel?
- ✅ Built for Next.js
- ✅ Zero configuration deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier available
- ✅ Serverless functions support

### Step 1: Prepare Your Project

1. **Install Vercel CLI** (optional)
```bash
npm install -g vercel
```

2. **Create `vercel.json`** (optional configuration)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "regions": ["sin1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url"
  }
}
```

### Step 2: Setup Database (Supabase/Neon)

**Option A: Supabase (Recommended)**

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Get connection string:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```
4. Run migrations:
   ```bash
   DATABASE_URL="your_supabase_url" npx prisma migrate deploy
   ```

**Option B: Neon Database**

1. Go to [Neon](https://neon.tech)
2. Create project
3. Get connection string
4. Deploy migrations

### Step 3: Deploy to Vercel

**Method A: GitHub Integration (Recommended)**

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to [Vercel](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

6. Add Environment Variables:
   ```
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=https://yourdomain.vercel.app
   NAGAD_MODE=production
   NAGAD_MERCHANT_ID=your_merchant_id
   NAGAD_MERCHANT_NUMBER=your_merchant_number
   NAGAD_PUBLIC_KEY=your_public_key
   NAGAD_PRIVATE_KEY=your_private_key
   NEXT_PUBLIC_BASE_URL=https://yourdomain.vercel.app
   ```

7. Click "Deploy"

**Method B: Vercel CLI**

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Step 4: Post-Deployment

1. **Run Database Migrations:**
   ```bash
   # In Vercel dashboard, go to Settings > Functions
   # Or run manually:
   DATABASE_URL="your_production_url" npx prisma migrate deploy
   ```

2. **Seed Initial Data:**
   ```bash
   DATABASE_URL="your_production_url" npm run seed
   ```

3. **Test Your Site:**
   - Visit your Vercel URL
   - Test authentication
   - Test payment flow
   - Check all pages

### Step 5: Custom Domain (Optional)

1. Go to Vercel Dashboard > Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Update DNS records as instructed
4. Update environment variables:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```

---

## Option 2: Netlify

### Why Netlify?
- ✅ Easy deployment with Git integration
- ✅ Excellent Next.js support
- ✅ Built-in CI/CD
- ✅ Free tier with custom domains
- ✅ Edge functions support
- ✅ Form handling and serverless functions

### Step 1: Prepare for Netlify

1. **Install Netlify CLI** (optional)
```bash
npm install -g netlify-cli
```

2. **netlify.toml is already created** at the root of your project with the following configuration:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  node_bundler = "esbuild"
  external_node_modules = ["@prisma/client", "prisma"]
```

### Step 2: Setup Database

**Recommended: Supabase or Neon**

1. Create a PostgreSQL database (Supabase/Neon)
2. Get your connection string
3. Run migrations:
   ```bash
   DATABASE_URL="your_database_url" npx prisma migrate deploy
   ```

### Step 3: Deploy to Netlify

**Method A: Netlify Dashboard (Recommended)**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Deploy via Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub
   - Select your repository

3. **Configure Build Settings:**
   - Base directory: Leave empty (or `./`)
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions` (auto-detected)

4. **Add Environment Variables:**
   Go to Site settings > Environment variables and add:
   ```
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_secret_key_generate_with_openssl
   NEXTAUTH_URL=https://your-site-name.netlify.app
   NAGAD_MODE=production
   NAGAD_MERCHANT_ID=your_merchant_id
   NAGAD_MERCHANT_NUMBER=your_merchant_number
   NAGAD_PUBLIC_KEY=your_public_key
   NAGAD_PRIVATE_KEY=your_private_key
   NEXT_PUBLIC_BASE_URL=https://your-site-name.netlify.app
   IMGBB_API_KEY=your_imgbb_key
   ```

5. **Deploy:**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

**Method B: Netlify CLI**

```bash
# Login to Netlify
netlify login

# Initialize your project
netlify init

# Deploy to draft
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Step 4: Install Next.js Plugin

If not automatically installed, add the Netlify Next.js plugin:

1. Go to your site in Netlify Dashboard
2. Navigate to "Integrations" > "Search plugins"
3. Search for "Next.js Runtime"
4. Click "Install"

Or install via CLI:
```bash
netlify plugins:install @netlify/plugin-nextjs
```

### Step 5: Post-Deployment

1. **Initialize Database:**
   ```bash
   # Run from your local machine
   DATABASE_URL="your_production_url" npx prisma migrate deploy
   DATABASE_URL="your_production_url" npm run seed
   ```

2. **Test Your Deployment:**
   - Visit your Netlify URL
   - Test user registration and login
   - Test adding items to cart
   - Test checkout process
   - Verify admin dashboard access
   - Test payment integration

3. **Monitor Logs:**
   - Go to Netlify Dashboard > "Functions" tab
   - Check for any errors or warnings

### Step 6: Custom Domain (Optional)

1. **Add Custom Domain:**
   - Go to Site settings > Domain management
   - Click "Add custom domain"
   - Enter your domain name
   - Follow DNS configuration instructions

2. **Update Environment Variables:**
   ```
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```

3. **Enable HTTPS:**
   - Netlify automatically provisions SSL certificate
   - Usually takes a few minutes

### Step 7: Continuous Deployment

Netlify automatically deploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main
# Netlify will auto-deploy
```

### Netlify Deploy Hooks

For manual or scheduled deployments:

1. Go to Site settings > Build & deploy > Build hooks
2. Click "Add build hook"
3. Name it and save
4. Use the webhook URL to trigger builds

---

## Option 3: DigitalOcean App Platform

### Features
- ✅ Full server control
- ✅ Database included
- ✅ Easy scaling
- ✅ $5-12/month pricing

### Deployment Steps

1. **Create `app.yaml`:**
```yaml
name: ecommerce-platform
region: sgp
services:
  - name: web
    github:
      repo: yourusername/your-repo
      branch: main
      deploy_on_push: true
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    instance_size_slug: basic-xxs
    envs:
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
      - key: NEXTAUTH_SECRET
        value: ${NEXTAUTH_SECRET}
      - key: NEXTAUTH_URL
        value: ${APP_URL}

databases:
  - name: db
    engine: PG
    production: true
    version: "14"
```

2. **Deploy:**
   - Go to [DigitalOcean](https://www.digitalocean.com)
   - Create App
   - Connect GitHub
   - Configure environment variables
   - Deploy

---

## Option 4: AWS (Advanced)

### Services Used
- **EC2** - Server
- **RDS** - PostgreSQL Database
- **S3** - Static files/images
- **CloudFront** - CDN
- **Route 53** - DNS

### Basic Setup

1. **Launch EC2 Instance:**
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "ecommerce" -- start
pm2 save
pm2 startup
```

2. **Setup RDS PostgreSQL:**
   - Create RDS instance
   - Configure security groups
   - Get connection string
   - Run migrations

3. **Setup Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **SSL Certificate:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Option 5: Docker + Any Cloud

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ecommerce
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Deploy

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Environment Variables Setup

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://yourdomain.com"

# Nagad Payment
NAGAD_MODE="production"
NAGAD_MERCHANT_ID="your_merchant_id"
NAGAD_MERCHANT_NUMBER="your_merchant_number"
NAGAD_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----..."
NAGAD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# App
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
NODE_ENV="production"
```

### Generate Secrets

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate app secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Database Migration

### Deploy Migrations

```bash
# Production migration
DATABASE_URL="your_production_url" npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed data (if needed)
npm run seed
```

### Backup Database

```bash
# PostgreSQL backup
pg_dump -h hostname -U username -d database > backup.sql

# Restore
psql -h hostname -U username -d database < backup.sql
```

---

## CI/CD Pipeline (GitHub Actions)

### `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx prisma migrate deploy

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Performance Optimization

### 1. Image Optimization

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
}
```

### 2. Enable Caching

```javascript
// In API routes
export async function GET(request) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  })
}
```

### 3. Database Connection Pooling

```javascript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## Monitoring & Maintenance

### 1. Setup Error Tracking

**Sentry Integration:**

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.config.js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

### 2. Analytics

**Google Analytics:**

```javascript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 3. Uptime Monitoring

- **UptimeRobot** - Free uptime monitoring
- **Pingdom** - Advanced monitoring
- **New Relic** - APM monitoring

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Secure headers configured
- [ ] Database backups automated
- [ ] Secrets rotation policy

### Security Headers

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db push

# Check connection string format
echo $DATABASE_URL
```

### 500 Errors

1. Check server logs
2. Verify environment variables
3. Check database connectivity
4. Review error tracking (Sentry)

---

## Cost Estimation

### Vercel + Supabase (Recommended for Small-Medium)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **Total**: ~$45/month

### DigitalOcean
- **App Platform**: $12/month
- **Managed Database**: $15/month
- **Total**: ~$27/month

### AWS (Enterprise)
- **EC2 (t3.small)**: $15/month
- **RDS (db.t3.micro)**: $15/month
- **S3 + CloudFront**: $5-10/month
- **Total**: ~$35-40/month

---

## Quick Start Commands

```bash
# 1. Prepare for deployment
npm run build
npm run lint

# 2. Setup production database
DATABASE_URL="production_url" npx prisma migrate deploy

# 3. Deploy to Vercel
vercel --prod

# 4. Or deploy with Docker
docker-compose up -d

# 5. Check deployment
curl https://yourdomain.com/api/health
```

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs/deployment
- **Vercel Support**: https://vercel.com/support
- **Prisma Docs**: https://www.prisma.io/docs/guides/deployment
- **Community**: Join Next.js Discord

---

## Recommended: Vercel + Supabase

For most use cases, we recommend:

1. **Vercel** for hosting (optimized for Next.js)
2. **Supabase** for PostgreSQL database
3. **Vercel's built-in CDN** for static assets
4. **Sentry** for error tracking
5. **Google Analytics** for user analytics

This combination provides the best developer experience, performance, and reliability for a production e-commerce platform.

---

**Ready to deploy?** Start with Vercel and expand as you grow! 🚀

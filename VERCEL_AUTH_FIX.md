# Vercel Environment Variables Setup

## Critical Fix for Admin Authentication Issue

### Problem
Admin/Moderator accounts redirect to login page in production (Vercel) but work fine on localhost.

### Root Cause
1. Missing or incorrect `NEXTAUTH_SECRET` in production
2. `NEXTAUTH_URL` not properly configured
3. Cookie settings incompatible with production environment

### Solution - Required Environment Variables

Go to your Vercel Dashboard → Your Project → Settings → Environment Variables

## 1. NEXTAUTH_SECRET (CRITICAL!)

**Generate a secure secret:**
```bash
# On Windows PowerShell:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or use this online tool:
# https://generate-secret.vercel.app/32
```

**Add to Vercel:**
```
Name: NEXTAUTH_SECRET
Value: [YOUR_GENERATED_SECRET_HERE]
Environment: Production, Preview, Development
```

⚠️ **IMPORTANT**: This MUST be set for authentication to work!

## 2. NEXTAUTH_URL

**Set to your production domain:**
```
Name: NEXTAUTH_URL
Value: https://your-project.vercel.app
Environment: Production
```

If you have a custom domain:
```
Value: https://yourdomain.com
```

## 3. Database URL

```
Name: DATABASE_URL
Value: postgresql://user:password@host:5432/dbname
Environment: Production, Preview, Development
```

## 4. Complete Environment Variables List

### Authentication (Required)
```env
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://your-project.vercel.app
```

### Database (Required)
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Base URL (Required)
```env
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
```

### Image Upload (Required if using ImgBB)
```env
IMGBB_API_KEY=your_imgbb_api_key
```

### Payment Gateway (Optional - for Nagad)
```env
NAGAD_MODE=production
NAGAD_MERCHANT_ID=your_merchant_id
NAGAD_MERCHANT_NUMBER=your_merchant_number
NAGAD_PUBLIC_KEY=your_public_key
NAGAD_PRIVATE_KEY=your_private_key
```

## Step-by-Step Fix

### Step 1: Generate NEXTAUTH_SECRET

**Windows PowerShell:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output (e.g., `dGhpc2lzYXNlY3JldGtleWZvcm5leHRhdXRo...`)

### Step 2: Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** tab
4. Click **Environment Variables** in sidebar
5. Add each variable:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: [paste your generated secret]
   - **Environments**: Check all (Production, Preview, Development)
   - Click **Save**

### Step 3: Update NEXTAUTH_URL

1. Find your Vercel deployment URL (e.g., `https://techbazar.vercel.app`)
2. Add environment variable:
   - **Key**: `NEXTAUTH_URL`
   - **Value**: `https://your-project.vercel.app`
   - **Environment**: Production
   - Click **Save**

### Step 4: Redeploy

After adding environment variables, you MUST redeploy:

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Find latest deployment
3. Click **⋮** (three dots)
4. Click **Redeploy**

**Option B: Via Git Push**
```bash
git add .
git commit -m "Fix: Update NextAuth configuration for production"
git push origin main
```

**Option C: Via Vercel CLI**
```bash
vercel --prod
```

### Step 5: Test Admin Access

1. Clear your browser cookies for the site
2. Visit your Vercel URL
3. Login with admin credentials
4. Navigate to `/admin`
5. Should now work without redirecting to login!

## Verification Checklist

- [ ] `NEXTAUTH_SECRET` is set (32+ character random string)
- [ ] `NEXTAUTH_URL` matches your production domain exactly
- [ ] `DATABASE_URL` is correct and accessible from Vercel
- [ ] All environment variables are set to "Production"
- [ ] Redeployed after adding environment variables
- [ ] Cleared browser cookies before testing
- [ ] Can login successfully
- [ ] Admin/Moderator can access `/admin` page
- [ ] No redirect loop to login page

## Common Issues & Solutions

### Issue 1: Still Redirecting to Login

**Solution:**
1. Double-check `NEXTAUTH_SECRET` is exactly the same format (no extra spaces)
2. Clear browser cookies completely
3. Try incognito/private browsing mode
4. Check Vercel deployment logs for errors

### Issue 2: Session Not Persisting

**Solution:**
1. Verify `NEXTAUTH_URL` matches your domain exactly (including https://)
2. Ensure you're not mixing www and non-www domains
3. Check cookie settings in browser (must allow cookies)

### Issue 3: Database Connection Error

**Solution:**
1. Verify `DATABASE_URL` is correct
2. Check if database allows connections from Vercel IP ranges
3. For Supabase: Enable "Connection Pooling" 
4. For Neon: Use connection string with `?sslmode=require`

### Issue 4: Role Not Detected

**Solution:**
1. Check database: `SELECT id, email, role FROM "User"`
2. Verify role is exactly `ADMIN` or `MODERATOR` (case-sensitive)
3. Clear session and re-login

## Testing Commands

### Check if environment variables are loaded
Add this temporarily to your admin page:

```tsx
// src/app/admin/page.tsx
console.log('Environment check:', {
  hasSecret: !!process.env.NEXTAUTH_SECRET,
  nextauthUrl: process.env.NEXTAUTH_URL,
  nodeEnv: process.env.NODE_ENV,
})
```

### View Vercel Logs
```bash
vercel logs [deployment-url]
```

Or in dashboard: Deployments → Select deployment → View Function Logs

## Security Best Practices

1. **Never commit** `.env` files to Git
2. **Use different secrets** for development and production
3. **Rotate secrets** periodically
4. **Limit access** to environment variables in Vercel
5. **Use environment-specific** values (dev, preview, prod)

## Need Help?

If still not working:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Test with `curl` to see if API is responding:
   ```bash
   curl https://your-project.vercel.app/api/auth/session
   ```

## Summary

The main fix for your issue:
1. ✅ Set `NEXTAUTH_SECRET` in Vercel environment variables
2. ✅ Set `NEXTAUTH_URL` to your production domain
3. ✅ Updated auth configuration with `trustHost: true`
4. ✅ Improved cookie settings for production
5. ✅ Redeploy your application

Your admin authentication should now work perfectly in production! 🎉

# 🚀 Quick Fix: Admin Authentication on Vercel

## The Problem
✗ Admin login works on localhost  
✗ Admin redirects to login on Vercel production  

## The Solution (5 Minutes)

### Step 1: Generate Secret Key
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Copy the output!

### Step 2: Add to Vercel
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add these TWO variables:

```
Name: NEXTAUTH_SECRET
Value: [paste your generated key]
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: NEXTAUTH_URL  
Value: https://your-project.vercel.app
Environments: ✓ Production
```

### Step 3: Redeploy
```bash
git add .
git commit -m "Fix admin auth for production"
git push origin main
```

OR click "Redeploy" in Vercel dashboard

### Step 4: Test
1. Clear browser cookies
2. Login with admin account
3. Click admin page
4. ✓ Should work now!

## What Changed in Code

✅ Added `trustHost: true` to NextAuth config  
✅ Added proper cookie settings for production  
✅ Added explicit `secret` configuration  
✅ Improved token validation in middleware  

## Files Modified
- `src/lib/auth.ts` - NextAuth configuration
- `src/middleware.ts` - Token validation
- `.env.example` - Environment template

## Documentation
- `VERCEL_AUTH_FIX.md` - Detailed fix guide
- Check Vercel logs if issues persist

---
**Still not working?** Check `VERCEL_AUTH_FIX.md` for detailed troubleshooting.

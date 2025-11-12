# 🔧 Admin Role Not Working - Troubleshooting Guide

## Problem: Set ADMIN role in database but user still can't access /admin

### ✅ Step-by-Step Solution

#### 1️⃣ **Verify Database Role**
First, confirm the role is set correctly in the database:

```sql
SELECT id, email, role, is_active 
FROM users 
WHERE email = 'your-email@example.com';
```

**Expected Result:** `role` should show `ADMIN`

---

#### 2️⃣ **Check Your Current Session**
Visit this special diagnostic page:
```
http://localhost:3000/check-role
```

This page shows:
- Your current session role (from token)
- Your database role (real-time)
- Whether they match
- Whether you can access admin panel

---

#### 3️⃣ **Clear Session & Log Back In** ⚠️ MOST IMPORTANT

The issue is that your **session token was created before you changed the role**. 

**You MUST do ALL of these steps:**

1. **Log Out Completely**
   - Go to: http://localhost:3000/api/auth/signout
   - OR click "Logout" in the UI

2. **Clear Browser Cookies** (Choose ONE method):
   
   **Method A: Use Incognito/Private Mode** (Easiest)
   - Close all browser windows
   - Open a NEW Incognito/Private window
   - Go to http://localhost:3000/login
   
   **Method B: Clear Cookies Manually**
   - Chrome: Press `Ctrl+Shift+Delete` → Clear cookies
   - Firefox: Press `Ctrl+Shift+Delete` → Clear cookies
   - Edge: Press `Ctrl+Shift+Delete` → Clear cookies

3. **Log Back In**
   - Go to: http://localhost:3000/login
   - Enter your credentials
   - The system will fetch your NEW role from database

4. **Test Admin Access**
   - Go to: http://localhost:3000/admin
   - You should now see the admin dashboard

---

### 🔍 Quick Diagnostic Steps

#### Check 1: Is the user ACTIVE?
```sql
SELECT email, role, is_active FROM users WHERE email = 'your@email.com';
```
If `is_active = false`, update it:
```sql
UPDATE users SET is_active = true WHERE email = 'your@email.com';
```

#### Check 2: Are you logged in?
Visit: http://localhost:3000/check-role

If it says "Not Logged In", go to /login first.

#### Check 3: Role mismatch?
If `/check-role` shows:
- Session Role: CUSTOMER
- Database Role: ADMIN

**→ This means you need to log out and back in!**

---

### 🛠️ Common Issues & Fixes

#### Issue 1: "Still redirects to /account after logging in"
**Cause:** Browser cached the old session

**Fix:**
```bash
# Try these in order:
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache completely
3. Use Incognito mode
4. Try a different browser
```

#### Issue 2: "Can log in but /admin redirects to /account"
**Cause:** Role not updated in session token

**Fix:**
1. Visit `/check-role` to see the mismatch
2. Click "Log Out"
3. Clear cookies
4. Log back in

#### Issue 3: "Role is ADMIN in database but shows CUSTOMER in session"
**Cause:** Old JWT token still active

**Fix:**
```bash
# The JWT token caches your role
# You MUST invalidate it by:
1. Logging out
2. Clearing cookies
3. Logging back in
```

#### Issue 4: "Getting 'Unauthorized' error"
**Check:**
1. Is user active? `SELECT is_active FROM users WHERE email = 'your@email.com';`
2. Is NEXTAUTH_SECRET set in .env?
3. Is the database connection working?

---

### 📋 Complete Setup Checklist

Use this checklist when setting up a new admin:

- [ ] User is registered (visited /register)
- [ ] User can log in successfully
- [ ] Ran SQL: `UPDATE users SET role = 'ADMIN' WHERE email = 'email@example.com';`
- [ ] Verified in database: `SELECT email, role FROM users WHERE email = 'email@example.com';`
- [ ] User clicked "Log Out" or visited `/api/auth/signout`
- [ ] Cleared browser cookies OR used Incognito mode
- [ ] User logged back in at `/login`
- [ ] Visited `/check-role` to verify role matches
- [ ] Tested `/admin` access - should see dashboard!

---

### 🔐 How The System Works

1. **When you log in:**
   - System checks email/password
   - Creates a JWT token with your role
   - Stores token in cookie

2. **When you visit /admin:**
   - Middleware checks the JWT token
   - Gets your role from the token
   - **System NOW fetches fresh role from database** (updated in auth.ts)
   - Allows/denies access based on role

3. **Why you need to log out:**
   - Even though the system fetches fresh role, the session object needs to be rebuilt
   - Logging out destroys the old session
   - Logging back in creates a new session with new role

---

### 🧪 Test Your Admin Access

After following the steps above, test these URLs:

1. **Check Role Page:**
   ```
   http://localhost:3000/check-role
   ```
   Should show: Session Role = ADMIN, Database Role = ADMIN

2. **Admin Dashboard:**
   ```
   http://localhost:3000/admin
   ```
   Should show: Admin dashboard with sidebar

3. **Products Page:**
   ```
   http://localhost:3000/admin/products
   ```
   Should show: Products list with "Add Product" button

---

### 🚨 Still Not Working?

If you've followed ALL steps above and it still doesn't work:

#### Debug Checklist:

1. **Check Environment Variables:**
   ```env
   # .env file must have:
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check Database Connection:**
   ```bash
   npx prisma studio
   # Should open and show your database
   ```

4. **Verify Prisma Schema is Synced:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Check Console for Errors:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

6. **Try This Emergency Reset:**
   ```bash
   # 1. Stop the dev server
   # 2. Clear all browser data
   # 3. Run these commands:
   npm run db:generate
   
   # 4. Restart dev server
   npm run dev
   
   # 5. Use Incognito mode
   # 6. Log in fresh
   ```

---

### 📞 Getting More Help

If still stuck, check:

1. `/check-role` page output
2. Browser console errors (F12)
3. Server terminal errors
4. Database query results

**The `/check-role` page is your best friend** - it shows exactly what's happening with your session vs database role!

---

## 🎯 Quick Reference: The 3 Required Steps

**After changing role in database:**

1. 🚪 **Log Out** → http://localhost:3000/api/auth/signout
2. 🧹 **Clear Cookies** → Use Incognito OR clear browser data
3. 🔑 **Log Back In** → http://localhost:3000/login

**Then visit** → http://localhost:3000/admin

✅ Done!

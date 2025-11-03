# Next.js Layout Structure Guide

## 🎯 How Next.js Layouts Work (No `<Outlet>` needed!)

### Structure Overview

```
src/app/
├── layout.tsx         ← Root layout (wraps ALL pages)
├── page.tsx           ← Home page (/)
├── login/
│   └── page.tsx       ← Login page (/login)
├── register/
│   └── page.tsx       ← Register page (/register)
└── products/
    ├── layout.tsx     ← Products layout (optional)
    └── page.tsx       ← Products page (/products)
```

## 🔑 Key Concepts

### 1. Root Layout (`src/app/layout.tsx`)
- Wraps **ALL pages** automatically
- Use `{children}` instead of `<Outlet>`
- Perfect for Navbar, Footer, and global components

```tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        <main>{children}</main>  {/* ← This is like <Outlet> */}
        <Footer />
      </body>
    </html>
  )
}
```

### 2. Page Components (`page.tsx`)
- Each `page.tsx` file becomes a route
- Content automatically renders in `{children}`
- No need to import or use `<Outlet>`

```tsx
// src/app/page.tsx → becomes "/"
export default function Home() {
  return <div>Home Page Content</div>
}

// src/app/about/page.tsx → becomes "/about"
export default function About() {
  return <div>About Page Content</div>
}
```

### 3. Nested Layouts (Optional)
You can have layouts within layouts!

```tsx
// src/app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <DashboardSidebar />
      <div>{children}</div>
    </div>
  )
}

// src/app/dashboard/page.tsx
export default function Dashboard() {
  return <div>Dashboard Content</div>
}
```

## 📊 Current Project Structure

### Root Layout (`src/app/layout.tsx`)
✅ Contains:
- Navbar (appears on all pages)
- Footer (appears on all pages)
- `{children}` prop (renders page content)
- Toast notifications

### Pages
- `/` → `src/app/page.tsx` (Home)
- `/login` → `src/app/login/page.tsx`
- `/register` → `src/app/register/page.tsx`

## 🚫 What NOT to do
❌ Don't use `react-router-dom` or `<Outlet>`
❌ Don't install `react-outlet` package
❌ Don't try to manually route with `<Routes>`

## ✅ What TO do
✅ Use `{children}` in layouts
✅ Create `page.tsx` files for routes
✅ Use `<Link>` from 'next/link' for navigation
✅ Use `useRouter()` from 'next/navigation' for programmatic routing

## 📝 Common Patterns

### Navigation
```tsx
import Link from 'next/link'

<Link href="/products">Products</Link>
<Link href="/about">About</Link>
```

### Programmatic Navigation
```tsx
'use client'
import { useRouter } from 'next/navigation'

function MyComponent() {
  const router = useRouter()
  
  const handleClick = () => {
    router.push('/dashboard')
  }
  
  return <button onClick={handleClick}>Go to Dashboard</button>
}
```

### Getting Route Params
```tsx
// src/app/products/[id]/page.tsx
export default function ProductPage({ params }) {
  return <div>Product ID: {params.id}</div>
}
```

## 🎨 Benefits of Next.js Routing
1. **Automatic code splitting** - Only load what you need
2. **File-based routing** - Folder structure = routes
3. **Nested layouts** - Share UI across routes
4. **Server components by default** - Better performance
5. **Built-in loading states** - Use `loading.tsx`

## 📚 More Resources
- [Next.js Routing Docs](https://nextjs.org/docs/app/building-your-application/routing)
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)

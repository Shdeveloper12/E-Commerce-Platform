# Category & Subcategory System Documentation

## Overview
The category system now supports hierarchical categories with main categories and subcategories, allowing for flexible product organization and filtering.

## How It Works

### 1. Main Category Behavior
When you click on a **main category** (e.g., "TV", "Desktop", "Laptop"):
- Shows ALL products from that main category
- Shows ALL products from ALL its subcategories
- Displays a filter bar showing all available subcategories
- Shows indicator: "Including all subcategories"

**Example:**
- Click "TV" → Shows products from: TV + Smart TV + Android TV + LED TV

### 2. Subcategory Behavior
When you click on a **subcategory** (e.g., "Smart TV", "Android TV"):
- Shows ONLY products specifically in that subcategory
- No subcategory filter bar (since it's already filtered)
- Shows exact product count for that subcategory

**Example:**
- Click "Smart TV" → Shows ONLY Smart TV products

### 3. Visual Features
- **Breadcrumb navigation**: Home / Category Name
- **Product count**: Shows total products found
- **Subcategory filter bar**: Quick links to filter by specific subcategory
- **Active filter highlight**: Orange button for current selection

## Database Structure

### Category Hierarchy
```
Main Category (parentId: null)
├── Subcategory 1 (parentId: MainCategory.id)
├── Subcategory 2 (parentId: MainCategory.id)
└── Subcategory 3 (parentId: MainCategory.id)
```

### Current Categories Setup

1. **Desktop**
   - Desktop Offer, Star PC, Gaming PC, Brand PC, All-in-One PC
   - Portable Mini PC, Apple Mac Mini, Apple iMac, Apple Mac Studio, Apple Mac Pro

2. **Laptop**
   - All Laptop, OLED Laptop, Gaming Laptop, Premium Ultrabook
   - Laptop Bag, External Graphics Enclosure, Laptop Accessories
   - Pentium/Celeron, Core i3, Core i5, Core i7, Core i9 Laptops

3. **Component**
   - Processor, CPU Cooler, Water/Liquid Cooling, Motherboard
   - Graphics Card, RAM (Desktop/Laptop), Power Supply
   - HDD, Portable HDD, SSD, Portable SSD
   - Casing, Casing Cooler, Optical Drive, Thermal Paste

4. **Monitor**
   - LCD Monitors, LED Monitors, Gaming Monitor
   - Curved Monitor, Touch Monitor, Ultra-wide Monitor

5. **TV**
   - Smart TV, Android TV, LED TV

6. **Appliance**
   - Air Conditioner, Refrigerator, Washing Machine, Microwave Oven

## URL Structure

- Main category: `/category/tv` (shows all TV products)
- Subcategory: `/category/smart-tv` (shows only Smart TV products)

## Adding New Categories

To add new categories or subcategories, run:

```bash
node setup-categories.js
```

Or manually add to the database:

```javascript
// Main Category
await prisma.category.create({
  data: {
    name: "Category Name",
    slug: "category-slug",
    description: "Category description",
    parentId: null, // null for main category
    isActive: true,
  }
})

// Subcategory
await prisma.category.create({
  data: {
    name: "Subcategory Name",
    slug: "subcategory-slug",
    parentId: mainCategoryId, // ID of parent category
    isActive: true,
  }
})
```

## Code Implementation

### Key Changes in `/src/app/category/[slug]/page.tsx`

1. **Fetch subcategories**: Added `children: true` to include query
2. **Check if main category**: `const isMainCategory = category.children && category.children.length > 0`
3. **Aggregate products**: Fetch products from all subcategories if main category
4. **Display filter bar**: Show subcategory links for easy navigation

## User Experience Flow

### Main Category Click (TV example)
```
User clicks "TV" in navbar
    ↓
Page shows all TV products (including Smart TV, Android TV, LED TV)
    ↓
Filter bar appears: [All TV] [Smart TV] [Android TV] [LED TV]
    ↓
User clicks "Smart TV"
    ↓
Page shows only Smart TV products
```

### Subcategory Click
```
User clicks "Smart TV" in dropdown
    ↓
Page shows only Smart TV products
    ↓
No filter bar (already filtered)
```

## Benefits

✅ **Flexible Navigation**: Users can view broad or specific product categories
✅ **Better SEO**: Each subcategory has its own URL and metadata
✅ **Easy Filtering**: Quick subcategory links for refined browsing
✅ **Scalable**: Easy to add new categories and subcategories
✅ **User-Friendly**: Clear indication of what's being displayed

## Testing

1. Click "TV" in navbar → Should show all TV products with filter bar
2. Click "Smart TV" in filter bar → Should show only Smart TV products
3. Click "Smart TV" in dropdown → Should go directly to Smart TV products
4. Verify product counts are accurate
5. Check breadcrumb navigation works correctly

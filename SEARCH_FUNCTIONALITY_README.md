# Search Functionality Documentation

## Overview
A comprehensive search system with live suggestions, search results page, and mobile-optimized interface.

## Features Implemented

### 1. **Live Search Suggestions (Desktop)**
- Type-ahead search with 300ms debounce
- Shows up to 10 product suggestions as you type
- Displays product image, name, brand, category, and price
- Click any suggestion to go directly to product page
- "View all results" link to see complete search results

### 2. **Search Results Page**
- Dedicated `/search?q=query` page
- Shows all matching products in grid layout
- Product count display
- Empty state for no results
- Loading spinner during search

### 3. **Mobile Search Modal**
- Full-screen search modal on mobile devices
- Click search icon to open
- Live search results in modal
- Swipe or tap X to close

### 4. **Search API Endpoint**
- `/api/search?q=query` endpoint
- Searches in: product name, brand, description, category
- Case-insensitive search
- Returns top 10 results for autocomplete
- Includes product images and pricing

## How to Use

### Desktop Search
1. Click search bar in navbar
2. Start typing product name
3. See live suggestions appear
4. Click a suggestion or press Enter
5. View results on search page

### Mobile Search
1. Tap search icon (magnifying glass)
2. Search modal opens
3. Type your query
4. See results below
5. Tap result or "View all"

## Search Behavior

### What Gets Searched
- Product names
- Brand names
- Product descriptions
- Category names

### Minimum Query Length
- 2 characters minimum
- Automatic debounce (300ms)
- Shows "No products found" if no matches

### Results Ordering
1. Featured products first
2. Then by newest (createdAt desc)

## API Usage

```javascript
// Search API endpoint
GET /api/search?q=laptop

// Response
{
  "results": [
    {
      "id": "uuid",
      "name": "Product Name",
      "slug": "product-slug",
      "price": 50000,
      "discountPrice": 45000,
      "brand": "Brand Name",
      "imageUrl": "/image.jpg",
      "category": "Laptop",
      "stockQuantity": 10
    }
  ]
}
```

## Files Modified

1. **src/components/ui/navber.tsx**
   - Added search state management
   - Implemented live suggestions dropdown
   - Added mobile search modal
   - Debounced search input

2. **src/app/api/search/route.ts**
   - Created search API endpoint
   - Prisma query with multiple filters
   - Returns formatted results

3. **src/app/search/page.tsx**
   - Search results page
   - Product grid display
   - Empty states and loading

## UI/UX Features

✅ **Debounced Input** - Prevents excessive API calls
✅ **Loading States** - Shows spinner during search
✅ **Empty States** - User-friendly "no results" message
✅ **Click Outside** - Closes dropdown when clicking elsewhere
✅ **Keyboard Navigation** - Submit with Enter key
✅ **Mobile Optimized** - Full-screen modal for mobile
✅ **Product Images** - Visual product previews
✅ **Price Display** - Shows discounted and original prices
✅ **Quick Navigation** - Direct links to products

## Search Optimization

- **Fast Response**: 300ms debounce prevents lag
- **Limited Results**: Top 10 for autocomplete
- **Database Indexed**: Searches on indexed fields
- **Case Insensitive**: Matches regardless of case
- **Multi-field Search**: Name, brand, description, category

## Future Enhancements

Possible improvements:
- Search history
- Popular searches
- Category filters in search
- Price range filters
- Sort options (price, name, date)
- Advanced search with multiple criteria

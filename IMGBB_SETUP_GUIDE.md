# ImgBB Image Upload Setup Guide

## Overview
The admin product management system uses **ImgBB** as the image hosting service for product images. ImgBB provides free, fast, and reliable image hosting with direct URLs.

## Why ImgBB?
- ✅ **Free** - No credit card required
- ✅ **Fast** - Global CDN delivery
- ✅ **Unlimited Storage** - No storage limits on free tier
- ✅ **Direct URLs** - Easy to store and retrieve
- ✅ **API Access** - Simple REST API for uploads
- ✅ **No Bandwidth Limits** - Serve images without restrictions

## Getting Your API Key

### Step 1: Create an Account
1. Visit [https://api.imgbb.com/](https://api.imgbb.com/)
2. Click on **"Get API Key"** or **"Sign Up"**
3. Register with your email or sign in with Google/Twitter

### Step 2: Generate API Key
1. After logging in, you'll be redirected to the API dashboard
2. Your API key will be displayed on the dashboard
3. Copy your API key (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### Step 3: Add to Environment Variables
1. Open your `.env.local` file (or create one if it doesn't exist)
2. Add the following line:
```env
NEXT_PUBLIC_IMGBB_API_KEY=your-api-key-here
```
3. Replace `your-api-key-here` with your actual API key
4. Save the file

### Step 4: Restart Development Server
```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

## Usage in Admin Panel

### Uploading Product Images
1. Log in as an admin user
2. Navigate to **Admin Dashboard → Products → New Product**
3. Scroll to the **Product Images** section
4. Click the **Upload** box
5. Select one or multiple images (JPG, PNG, GIF)
6. Wait for the upload to complete (spinner will show)
7. Images will appear as thumbnails
8. Click the ❌ button on any image to remove it

### Technical Details
- **Max File Size**: 32MB per image
- **Supported Formats**: JPG, PNG, GIF, BMP, TIFF
- **Upload Location**: `src/lib/imgbb.ts`
- **Form Handler**: `src/components/admin/product-form.tsx`
- **API Endpoint**: `https://api.imgbb.com/1/upload`

## Troubleshooting

### Error: "ImgBB API key not configured"
**Solution**: Make sure you've added `NEXT_PUBLIC_IMGBB_API_KEY` to your `.env.local` file and restarted the server.

### Error: "Failed to upload image"
**Possible Causes**:
1. Invalid API key - Check your key is correct
2. File too large - Max 32MB per image
3. Unsupported format - Use JPG, PNG, or GIF
4. Network issue - Check your internet connection
5. API rate limit - Free tier has rate limits

### Images Not Displaying
**Solution**: 
1. Check browser console for errors
2. Verify the image URL is saved in the database
3. Test the URL directly in a browser
4. Check if ImgBB service is up: [https://status.imgbb.com/](https://status.imgbb.com/)

### Upload Taking Too Long
**Tips**:
1. Compress images before upload (use tools like TinyPNG)
2. Resize large images to reasonable dimensions (1200x1200px max)
3. Convert to WebP format for better compression
4. Upload images one at a time if multiple fail

## API Limits (Free Tier)

| Limit | Value |
|-------|-------|
| Storage | Unlimited |
| Bandwidth | Unlimited |
| File Size | 32MB per file |
| Rate Limit | Reasonable use (not specified) |
| Expiration | Images never expire |

## Alternative Setup (Optional)

If you prefer a different image hosting service, you can modify the upload logic in `src/lib/imgbb.ts`:

### Using Cloudinary
```typescript
// Example: Modify to use Cloudinary
export async function uploadToCloudinary(file: File) {
  // Your Cloudinary upload logic
}
```

### Using AWS S3
```typescript
// Example: Modify to use AWS S3
export async function uploadToS3(file: File) {
  // Your S3 upload logic
}
```

### Using Supabase Storage
```typescript
// Example: Modify to use Supabase
export async function uploadToSupabase(file: File) {
  // Your Supabase storage logic
}
```

## Security Notes

⚠️ **Important Security Considerations**:

1. **Public API Key**: The ImgBB API key is prefixed with `NEXT_PUBLIC_` which means it's exposed to the browser. This is safe because:
   - ImgBB API keys are designed for client-side use
   - The key can only upload images, not delete or modify
   - Rate limits prevent abuse

2. **Validation**: Always validate uploaded images on the server side
3. **File Types**: The form restricts uploads to image formats only
4. **Size Limits**: ImgBB enforces a 32MB limit per file
5. **Admin Only**: Image upload is restricted to admin users via middleware

## Testing

To test the ImgBB integration:

```bash
# 1. Ensure API key is set
echo $NEXT_PUBLIC_IMGBB_API_KEY

# 2. Start dev server
npm run dev

# 3. Navigate to admin product form
# http://localhost:3000/admin/products/new

# 4. Upload a test image
# - Upload should show spinner
# - Image should appear as thumbnail
# - Check Network tab for successful API call
# - Verify URL starts with https://i.ibb.co/
```

## Support

- **ImgBB Documentation**: [https://api.imgbb.com/](https://api.imgbb.com/)
- **Status Page**: [https://status.imgbb.com/](https://status.imgbb.com/)
- **Support**: Contact via ImgBB website

## Quick Reference

```typescript
// Upload single image
import { uploadToImgBB } from '@/lib/imgbb';
const imageUrl = await uploadToImgBB(file);

// Upload multiple images
import { uploadMultipleToImgBB } from '@/lib/imgbb';
const imageUrls = await uploadMultipleToImgBB(filesArray);
```

---

**Next Steps**: 
1. Get your API key from [https://api.imgbb.com/](https://api.imgbb.com/)
2. Add it to `.env.local`
3. Restart your development server
4. Start uploading product images!

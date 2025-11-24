# Nagad Payment Integration Guide

## Overview
This guide explains how to integrate Nagad payment gateway into your Next.js e-commerce platform.

## Files Created

1. **`src/app/api/payment/nagad/initialize/route.ts`** - Initializes Nagad payment
2. **`src/app/api/payment/nagad/callback/route.ts`** - Handles payment callback
3. **`.env.nagad.example`** - Environment variable template

## Setup Steps

### Step 1: Get Nagad Merchant Account

1. Visit [Nagad Merchant Portal](https://merchantportal.mynagad.com/)
2. Register for a merchant account
3. Complete KYC verification
4. Get your credentials:
   - Merchant ID
   - Merchant Number
   - Public Key (Nagad will provide this)

### Step 2: Generate Private Key

Generate your RSA private key using OpenSSL:

```bash
# Generate private key
openssl genrsa -out private_key.pem 2048

# Generate public key from private key
openssl rsa -in private_key.pem -pubout -out public_key.pem

# View keys
cat private_key.pem
cat public_key.pem
```

**Important:** 
- Submit your public key to Nagad merchant portal
- Keep your private key secure and never commit it to git

### Step 3: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Nagad Configuration
NAGAD_MODE=sandbox
NAGAD_MERCHANT_ID=683002007104225
NAGAD_MERCHANT_NUMBER=01711428801

NAGAD_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiCWvxDJLGfJ4VR3eVKXs
[YOUR_NAGAD_PUBLIC_KEY_HERE]
-----END PUBLIC KEY-----"

NAGAD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDKkH
[YOUR_PRIVATE_KEY_HERE]
-----END PRIVATE KEY-----"

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 4: Update Database Schema (if needed)

Ensure your Order model has payment fields:

```prisma
model Order {
  id            String   @id @default(cuid())
  orderNumber   String   @unique
  paymentStatus String   @default("PENDING") // PENDING, PAID, FAILED
  paymentMethod String?  // NAGAD, BKASH, etc.
  paymentDetails Json?   // Store transaction details
  // ... other fields
}
```

Run migration:
```bash
npx prisma migrate dev --name add_payment_fields
```

### Step 5: Test the Integration

#### Sandbox Testing

1. Use Nagad sandbox credentials
2. Test phone numbers:
   - Success: `01711428801`
   - Failed: `01711428802`

3. Test flow:
   - Go to payment page with an order
   - Select "Nagad" as payment method
   - Click "Pay"
   - You'll be redirected to Nagad payment page
   - Complete payment
   - You'll be redirected back to order success page

## Payment Flow

### Frontend Flow

```
1. User selects "Nagad" payment method
2. Click "Pay" button
3. Frontend calls: POST /api/payment/nagad/initialize
4. Backend returns payment URL
5. User is redirected to Nagad payment page
6. User completes payment on Nagad
7. Nagad redirects back to: /api/payment/nagad/callback
8. Backend verifies payment
9. Database updated with payment status
10. User redirected to order success page
```

### API Endpoints

#### Initialize Payment
**Endpoint:** `POST /api/payment/nagad/initialize`

**Request:**
```json
{
  "orderId": "ORD123456",
  "amount": 5000,
  "customerName": "John Doe",
  "customerPhone": "01711428801"
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://sandbox.mynagad.com/pay/...",
  "paymentReferenceId": "REF123456",
  "orderId": "ORD123456"
}
```

#### Payment Callback
**Endpoint:** `GET /api/payment/nagad/callback`

**Query Parameters:**
- `payment_ref_id` - Nagad payment reference
- `status` - Payment status
- `order_id` - Your order ID

## Security Best Practices

1. **Never expose private keys**
   - Add to `.gitignore`
   - Use environment variables only
   - Rotate keys periodically

2. **Validate callback signatures**
   - Verify Nagad signatures
   - Check payment amounts
   - Validate order IDs

3. **Use HTTPS in production**
   - Nagad requires HTTPS for callbacks
   - Update `NEXT_PUBLIC_BASE_URL` to use HTTPS

4. **Log transactions**
   - Store payment reference IDs
   - Log all API calls
   - Monitor failed payments

## Common Issues & Solutions

### Issue 1: "Failed to generate signature"
**Solution:** Check your private key format. It should be in PEM format with proper line breaks.

### Issue 2: "Payment initialization failed"
**Solution:** 
- Verify merchant ID and number are correct
- Check if sandbox/production URL is correct
- Ensure public key is registered with Nagad

### Issue 3: Callback not received
**Solution:**
- Check callback URL is accessible
- Use ngrok for local testing: `ngrok http 3000`
- Update `NEXT_PUBLIC_BASE_URL` with ngrok URL

### Issue 4: Database not updating
**Solution:**
- Check Prisma schema has payment fields
- Verify order exists with correct orderNumber
- Check database connection

## Testing with ngrok (Local Development)

```bash
# Install ngrok
npm install -g ngrok

# Start your Next.js app
npm run dev

# In another terminal, start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Update .env.local:
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok.io
```

## Production Deployment

1. **Switch to production mode:**
   ```env
   NAGAD_MODE=production
   ```

2. **Update URLs:**
   ```env
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```

3. **Use production credentials:**
   - Get production merchant ID from Nagad
   - Use production public key
   - Update merchant number

4. **Enable HTTPS:**
   - Nagad requires HTTPS for production
   - Configure SSL certificate

5. **Test thoroughly:**
   - Test small amount first
   - Verify callback URLs work
   - Check database updates
   - Test refund process (if applicable)

## Additional Features (Optional)

### 1. Payment Status Checking
Add a status check endpoint:

```typescript
// src/app/api/payment/nagad/status/[refId]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { refId: string } }
) {
  // Check payment status with Nagad
  // Return current status
}
```

### 2. Refund Support
Implement refund functionality:

```typescript
// src/app/api/payment/nagad/refund/route.ts
export async function POST(request: NextRequest) {
  // Process refund through Nagad
}
```

### 3. Payment Retry
Add retry logic for failed payments:

```typescript
const maxRetries = 3
let retryCount = 0

while (retryCount < maxRetries) {
  try {
    // Attempt payment
    break
  } catch (error) {
    retryCount++
    await delay(1000 * retryCount)
  }
}
```

## Support & Resources

- **Nagad Merchant Support:** merchantsupport@nagad.com.bd
- **Documentation:** [Nagad Developer Portal](https://developer.nagad.com.bd/)
- **Sandbox Portal:** http://sandbox.mynagad.com:10080
- **Production Portal:** https://merchantportal.mynagad.com/

## Monitoring & Analytics

Track these metrics:
- Payment success rate
- Average payment time
- Failed payment reasons
- Callback response times

Consider integrating:
- Sentry for error tracking
- Google Analytics for conversion tracking
- Custom dashboard for payment analytics

---

## Quick Start Checklist

- [ ] Get Nagad merchant account
- [ ] Generate RSA key pair
- [ ] Configure environment variables
- [ ] Test in sandbox mode
- [ ] Implement error handling
- [ ] Add payment logging
- [ ] Test callback URL
- [ ] Deploy to production
- [ ] Monitor transactions
- [ ] Set up alerts for failures

---

**Need Help?** Contact Nagad merchant support or refer to their official documentation.

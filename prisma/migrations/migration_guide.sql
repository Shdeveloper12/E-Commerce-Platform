-- Migration Script for Checkout System
-- Run this after updating schema.prisma

-- Step 1: Generate Prisma Client
-- Run: npx prisma generate

-- Step 2: Push schema to database
-- Run: npx prisma db push

-- OR if you want to create a migration:
-- Run: npx prisma migrate dev --name add_checkout_fields

-- This will:
-- 1. Add new fields to Order table:
--    - orderId (unique identifier)
--    - customerFirstName, customerLastName
--    - customerEmail, customerMobile
--    - customerAddress, customerUpazilla, customerDistrict
--    - deliveryMethod, deliveryCharge
--    - giftVoucher, promoCoupon, starPoints
--    - comment
--
-- 2. Add new fields to OrderItem table:
--    - productName, productSlug
--    - price, total

-- Note: Existing data will be preserved
-- New fields allow NULL or have default values

-- After migration, verify with:
-- Run: npx prisma studio
-- This opens a GUI to view your database

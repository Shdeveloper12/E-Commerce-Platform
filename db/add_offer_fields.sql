-- Add offer fields to products table
-- CreateEnum
DO $$ BEGIN
 CREATE TYPE "OfferType" AS ENUM ('REGULAR_OFFER', 'HAPPY_HOUR', 'FLASH_SALE', 'SEASONAL_SALE', 'CLEARANCE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "products" 
ADD COLUMN IF NOT EXISTS "is_offer_product" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "offer_type" "OfferType",
ADD COLUMN IF NOT EXISTS "offer_start_date" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "offer_end_date" TIMESTAMP(3);

-- ====================================
-- Create Default Categories
-- Run this SQL to add initial categories to your database
-- ====================================

-- Insert Main Categories
INSERT INTO categories (id, name, slug, description, "parent_id", "sort_order", "is_active", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'Desktop', 'desktop', 'Desktop computers and PCs', NULL, 1, true, NOW(), NOW()),
  (gen_random_uuid(), 'Laptop', 'laptop', 'Laptops and notebooks', NULL, 2, true, NOW(), NOW()),
  (gen_random_uuid(), 'Component', 'component', 'Computer components and parts', NULL, 3, true, NOW(), NOW()),
  (gen_random_uuid(), 'Monitor', 'monitor', 'Computer monitors and displays', NULL, 4, true, NOW(), NOW()),
  (gen_random_uuid(), 'Phone', 'phone', 'Mobile phones and smartphones', NULL, 5, true, NOW(), NOW()),
  (gen_random_uuid(), 'Tablet', 'tablet', 'Tablets and iPads', NULL, 6, true, NOW(), NOW()),
  (gen_random_uuid(), 'Accessories', 'accessories', 'Computer and phone accessories', NULL, 7, true, NOW(), NOW()),
  (gen_random_uuid(), 'Gaming', 'gaming', 'Gaming peripherals and gear', NULL, 8, true, NOW(), NOW()),
  (gen_random_uuid(), 'Networking', 'networking', 'Networking equipment and routers', NULL, 9, true, NOW(), NOW()),
  (gen_random_uuid(), 'Storage', 'storage', 'Storage devices and external drives', NULL, 10, true, NOW(), NOW()),
  (gen_random_uuid(), 'Camera', 'camera', 'Cameras and photography equipment', NULL, 11, true, NOW(), NOW()),
  (gen_random_uuid(), 'Audio', 'audio', 'Headphones, speakers, and audio equipment', NULL, 12, true, NOW(), NOW()),
  (gen_random_uuid(), 'TV', 'tv', 'Televisions and smart TVs', NULL, 13, true, NOW(), NOW()),
  (gen_random_uuid(), 'Appliance', 'appliance', 'Home appliances', NULL, 14, true, NOW(), NOW()),
  (gen_random_uuid(), 'Software', 'software', 'Software and licenses', NULL, 15, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Verify insertion
SELECT id, name, slug, "is_active" FROM categories ORDER BY "sort_order";

-- Check how many categories exist
SELECT COUNT(*) as total_categories FROM categories;

-- Check active categories
SELECT COUNT(*) as active_categories FROM categories WHERE "is_active" = true;

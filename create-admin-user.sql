-- Script to create or update an admin user
-- Run this in your PostgreSQL database after registering a user normally

-- Option 1: Update an existing user to admin role
-- Replace 'admin@example.com' with your email
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'admin@example.com';

-- Option 2: Update by user ID
-- Replace 'user-uuid-here' with the actual user UUID
UPDATE users 
SET role = 'ADMIN' 
WHERE id = 'user-uuid-here';

-- Option 3: View all users to find the one you want to make admin
SELECT id, email, "first_name", "last_name", role, "is_active" 
FROM users 
ORDER BY "created_at" DESC;

-- Option 4: Make the first user an admin (useful for initial setup)
UPDATE users 
SET role = 'ADMIN' 
WHERE id = (
  SELECT id FROM users 
  ORDER BY "created_at" ASC 
  LIMIT 1
);

-- Verify the changes
SELECT id, email, role, "is_active" 
FROM users 
WHERE role IN ('ADMIN', 'MODERATOR');

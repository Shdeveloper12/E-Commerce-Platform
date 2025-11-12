-- ====================================
-- SQL Scripts to Manage User Roles
-- ====================================
-- After updating user role, the user MUST log out and log back in
-- The system will automatically fetch the latest role from database

-- 1. VIEW ALL USERS WITH THEIR ROLES
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    is_active,
    created_at
FROM users
ORDER BY created_at DESC;

-- ====================================
-- 2. MAKE A USER AN ADMIN BY EMAIL
-- ====================================
-- Replace 'user@example.com' with the actual email
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'user@example.com';

-- IMPORTANT: User must LOG OUT and LOG BACK IN for changes to take effect!

-- ====================================
-- 3. MAKE A USER AN ADMIN BY ID
-- ====================================
UPDATE users 
SET role = 'ADMIN' 
WHERE id = 'user-id-here';

-- ====================================
-- 4. MAKE A USER A MODERATOR
-- ====================================
UPDATE users 
SET role = 'MODERATOR' 
WHERE email = 'moderator@example.com';

-- ====================================
-- 5. CHANGE USER BACK TO CUSTOMER
-- ====================================
UPDATE users 
SET role = 'CUSTOMER' 
WHERE email = 'user@example.com';

-- ====================================
-- 6. VERIFY ROLE UPDATE
-- ====================================
SELECT email, role, is_active, updated_at 
FROM users 
WHERE email = 'user@example.com';

-- ====================================
-- 7. LIST ALL ADMINS
-- ====================================
SELECT id, email, first_name, last_name, role, created_at 
FROM users 
WHERE role = 'ADMIN' 
ORDER BY created_at DESC;

-- ====================================
-- 8. COUNT USERS BY ROLE
-- ====================================
SELECT 
    role,
    COUNT(*) as user_count
FROM users
GROUP BY role;

-- ====================================
-- QUICK SETUP STEPS:
-- ====================================
-- 1. Register user at /register
-- 2. Run: UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
-- 3. User must LOG OUT completely
-- 4. User must LOG BACK IN
-- 5. Navigate to /admin
-- ====================================

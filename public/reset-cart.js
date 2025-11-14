/**
 * CART RESET UTILITY
 * 
 * Run this in your browser console to clear all cart-related data
 * and start fresh with the new Zustand cart store.
 * 
 * HOW TO USE:
 * 1. Open browser DevTools (Press F12)
 * 2. Go to Console tab
 * 3. Copy and paste this entire script
 * 4. Press Enter to execute
 * 5. Refresh the page (Ctrl + R or F5)
 */

(function resetCart() {
  console.log('🧹 Starting cart cleanup...');
  
  // List all localStorage keys
  const allKeys = Object.keys(localStorage);
  console.log('📋 Found localStorage keys:', allKeys);
  
  // Remove old cart data (if exists from previous implementation)
  const keysToRemove = allKeys.filter(key => 
    key.includes('cart') && key !== 'cart-storage'
  );
  
  if (keysToRemove.length > 0) {
    console.log('🗑️  Removing old cart keys:', keysToRemove);
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
  
  // Clear Zustand cart store
  localStorage.removeItem('cart-storage');
  console.log('✅ Cleared cart-storage (Zustand store)');
  
  // Clear session storage as well
  sessionStorage.clear();
  console.log('✅ Cleared session storage');
  
  console.log('✨ Cart cleanup complete!');
  console.log('🔄 Please refresh the page now (Ctrl + R or F5)');
  console.log('');
  console.log('📝 After refresh:');
  console.log('  1. Try adding a product to cart');
  console.log('  2. Check if cart badge updates');
  console.log('  3. Navigate to /cart to see items');
  console.log('  4. Proceed to /checkout');
})();

// Alternative: If you want to inspect current cart data without clearing:
// console.log('Current cart data:', localStorage.getItem('cart-storage'));

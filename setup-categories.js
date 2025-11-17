 const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting category hierarchy setup...')

  // Define main categories with their subcategories
  const categoryHierarchy = [
    {
      name: 'Desktop',
      slug: 'desktop',
      description: 'Desktop computers and systems',
      subcategories: [
        { name: 'Desktop Offer', slug: 'desktop-offer' },
        { name: 'Star PC', slug: 'star-pc' },
        { name: 'Gaming PC', slug: 'gaming-pc' },
        { name: 'Brand PC', slug: 'brand-pc' },
        { name: 'All-in-One PC', slug: 'all-in-one-pc' },
        { name: 'Portable Mini PC', slug: 'portable-mini-pc' },
        { name: 'Apple Mac Mini', slug: 'apple-mac-mini' },
        { name: 'Apple iMac', slug: 'apple-imac' },
        { name: 'Apple Mac Studio', slug: 'apple-mac-studio' },
        { name: 'Apple Mac Pro', slug: 'apple-mac-pro' },
      ]
    },
    {
      name: 'Laptop',
      slug: 'laptop',
      description: 'Laptops and notebook computers',
      subcategories: [
        { name: 'All Laptop', slug: 'all-laptop' },
        { name: 'OLED Laptop', slug: 'oled-laptop' },
        { name: 'Gaming Laptop', slug: 'gaming-laptop' },
        { name: 'Premium Ultrabook', slug: 'premium-ultrabook' },
        { name: 'Laptop Bag', slug: 'laptop-bag' },
        { name: 'External Graphics Enclosure', slug: 'external-graphics-enclosure' },
        { name: 'Laptop Accessories', slug: 'laptop-accessories' },
        { name: 'Pentium and Celeron Laptop', slug: 'pentium-celeron-laptop' },
        { name: 'Intel Core i3 Laptop', slug: 'core-i3-laptop' },
        { name: 'Intel Core i5 Laptop', slug: 'core-i5-laptop' },
        { name: 'Intel Core i7 Laptop', slug: 'core-i7-laptop' },
        { name: 'Intel Core i9 Laptop', slug: 'core-i9-laptop' },
      ]
    },
    {
      name: 'Component',
      slug: 'component',
      description: 'Computer components and parts',
      subcategories: [
        { name: 'Processor', slug: 'processor' },
        { name: 'CPU Cooler', slug: 'cpu-cooler' },
        { name: 'Water/Liquid Cooling', slug: 'water-cooling' },
        { name: 'Motherboard', slug: 'motherboard' },
        { name: 'Graphics Card', slug: 'graphics-card' },
        { name: 'RAM (Desktop)', slug: 'ram-desktop' },
        { name: 'RAM (Laptop)', slug: 'ram-laptop' },
        { name: 'Power Supply', slug: 'power-supply' },
        { name: 'Hard Disk Drive', slug: 'hard-disk-drive' },
        { name: 'Portable Hard Disk Drive', slug: 'portable-hard-disk-drive' },
        { name: 'SSD', slug: 'ssd' },
        { name: 'Portable SSD', slug: 'portable-ssd' },
        { name: 'Casing', slug: 'casing' },
        { name: 'Casing Cooler', slug: 'casing-cooler' },
        { name: 'Optical Drive', slug: 'optical-drive' },
        { name: 'Thermal Paste', slug: 'thermal-paste' },
      ]
    },
    {
      name: 'Monitor',
      slug: 'monitor',
      description: 'Computer monitors and displays',
      subcategories: [
        { name: 'LCD Monitors', slug: 'lcd-monitors' },
        { name: 'LED Monitors', slug: 'led-monitors' },
        { name: 'Gaming Monitor', slug: 'gaming-monitor' },
        { name: 'Curved Monitor', slug: 'curved-monitor' },
        { name: 'Touch Monitor', slug: 'touch-monitor' },
        { name: 'Ultra-wide Monitor', slug: 'ultra-wide-monitor' },
      ]
    },
    {
      name: 'TV',
      slug: 'tv',
      description: 'Televisions',
      subcategories: [
        { name: 'Smart TV', slug: 'smart-tv' },
        { name: 'Android TV', slug: 'android-tv' },
        { name: 'LED TV', slug: 'led-tv' },
      ]
    },
    {
      name: 'Appliance',
      slug: 'appliance',
      description: 'Home appliances',
      subcategories: [
        { name: 'Air Conditioner', slug: 'air-conditioner' },
        { name: 'Refrigerator', slug: 'refrigerator' },
        { name: 'Washing Machine', slug: 'washing-machine' },
        { name: 'Microwave Oven', slug: 'microwave-oven' },
      ]
    },
  ]

  let mainCategoryCount = 0
  let subCategoryCount = 0

  for (const mainCat of categoryHierarchy) {
    // Create or update main category
    const mainCategory = await prisma.category.upsert({
      where: { slug: mainCat.slug },
      update: {
        name: mainCat.name,
        description: mainCat.description,
        parentId: null,
        isActive: true,
      },
      create: {
        name: mainCat.name,
        slug: mainCat.slug,
        description: mainCat.description,
        parentId: null,
        isActive: true,
        sortOrder: mainCategoryCount,
      },
    })

    console.log(`✓ Main category: ${mainCategory.name}`)
    mainCategoryCount++

    // Create or update subcategories
    for (const subCat of mainCat.subcategories) {
      const subCategory = await prisma.category.upsert({
        where: { slug: subCat.slug },
        update: {
          name: subCat.name,
          parentId: mainCategory.id,
          isActive: true,
        },
        create: {
          name: subCat.name,
          slug: subCat.slug,
          parentId: mainCategory.id,
          isActive: true,
          sortOrder: subCategoryCount,
        },
      })

      console.log(`  ✓ Subcategory: ${subCategory.name}`)
      subCategoryCount++
    }
  }

  console.log(`\n✅ Category hierarchy setup complete!`)
  console.log(`   Main categories: ${mainCategoryCount}`)
  console.log(`   Subcategories: ${subCategoryCount}`)
}

main()
  .catch((e) => {
    console.error('Error setting up category hierarchy:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

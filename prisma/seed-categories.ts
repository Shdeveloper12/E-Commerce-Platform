import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting category hierarchy setup...')

  // Define main categories with their subcategories (Based on Star Tech BD structure)
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
        { name: 'Water Cooling', slug: 'water-cooling' },
        { name: 'Motherboard', slug: 'motherboard' },
        { name: 'Graphics Card', slug: 'graphics-card' },
        { name: 'Desktop RAM', slug: 'ram-desktop' },
        { name: 'Laptop RAM', slug: 'ram-laptop' },
        { name: 'Power Supply', slug: 'power-supply' },
        { name: 'Hard Disk Drive', slug: 'hard-disk-drive' },
        { name: 'Portable HDD', slug: 'portable-hard-disk-drive' },
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
        { name: 'LCD Monitor', slug: 'lcd-monitors' },
        { name: 'LED Monitor', slug: 'led-monitors' },
        { name: 'Gaming Monitor', slug: 'gaming-monitor' },
        { name: 'Curved Monitor', slug: 'curved-monitor' },
        { name: 'Touch Monitor', slug: 'touch-monitor' },
        { name: 'Ultra-wide Monitor', slug: 'ultra-wide-monitor' },
        { name: 'Portable Monitor', slug: 'portable-monitor' },
      ]
    },
    {
      name: 'UPS',
      slug: 'ups',
      description: 'Uninterruptible Power Supply',
      subcategories: [
        { name: 'Online UPS', slug: 'online-ups' },
        { name: 'Offline UPS', slug: 'offline-ups' },
        { name: 'IPS', slug: 'ips' },
      ]
    },
    {
      name: 'Phone',
      slug: 'phone',
      description: 'Mobile phones and smartphones',
      subcategories: [
        { name: 'Samsung Phone', slug: 'samsung-phone' },
        { name: 'iPhone', slug: 'iphone' },
        { name: 'Xiaomi Phone', slug: 'xiaomi' },
        { name: 'Realme Phone', slug: 'realme' },
        { name: 'OPPO Phone', slug: 'oppo' },
        { name: 'Vivo Phone', slug: 'vivo' },
        { name: 'OnePlus Phone', slug: 'oneplus' },
        { name: 'Infinix Phone', slug: 'infinix' },
        { name: 'Feature Phone', slug: 'feature-phone' },
      ]
    },
    {
      name: 'Tablet',
      slug: 'tablet',
      description: 'Tablets and drawing tablets',
      subcategories: [
        { name: 'Graphics Tablet', slug: 'graphics-tablet' },
        { name: 'Kids Tablet', slug: 'kids-tablet' },
        { name: 'iPad', slug: 'ipad' },
        { name: 'Samsung Tab', slug: 'samsung-tab' },
        { name: 'Android Tablet', slug: 'android-tablet' },
      ]
    },
    {
      name: 'Office Equipment',
      slug: 'office-equipment',
      description: 'Office equipment and supplies',
      subcategories: [
        { name: 'Projector', slug: 'projector' },
        { name: 'Printer', slug: 'printer' },
        { name: 'Scanner', slug: 'scanner' },
        { name: 'Photocopier', slug: 'photocopier' },
        { name: 'Toner', slug: 'toner' },
        { name: 'Cartridge', slug: 'cartridge' },
        { name: 'Ink Bottle', slug: 'ink-bottle' },
        { name: 'Barcode Scanner', slug: 'barcode-scanner' },
        { name: 'Cash Drawer', slug: 'cash-drawer' },
        { name: 'Telephone', slug: 'telephone-set' },
        { name: 'PABX System', slug: 'pabx-system' },
        { name: 'Laminating Machine', slug: 'laminating-machine' },
        { name: 'Binding Machine', slug: 'binding-machine' },
      ]
    },
    {
      name: 'Camera',
      slug: 'camera',
      description: 'Cameras and camera accessories',
      subcategories: [
        { name: 'DSLR Camera', slug: 'dslr-camera' },
        { name: 'Mirrorless Camera', slug: 'mirrorless-camera' },
        { name: 'Digital Camera', slug: 'digital-camera' },
        { name: 'Action Camera', slug: 'action-camera' },
        { name: 'Handycam', slug: 'handycam' },
        { name: 'Camera Lenses', slug: 'camera-lenses' },
        { name: 'Camera Tripod', slug: 'camera-tripod' },
        { name: 'Camera Accessories', slug: 'camera-accessories' },
      ]
    },
    {
      name: 'Security',
      slug: 'security',
      description: 'Security and surveillance',
      subcategories: [
        { name: 'CC Camera', slug: 'cc-camera' },
        { name: 'CCTV Camera', slug: 'cctv-camera' },
        { name: 'IP Camera', slug: 'ip-camera' },
        { name: 'DVR', slug: 'dvr' },
        { name: 'NVR', slug: 'nvr' },
      ]
    },
    {
      name: 'Networking',
      slug: 'networking',
      description: 'Networking equipment',
      subcategories: [
        { name: 'Router', slug: 'router' },
        { name: 'Switch', slug: 'switch' },
        { name: 'Access Point', slug: 'access-point' },
        { name: 'Network Adapter', slug: 'network-adapter' },
        { name: 'Modem', slug: 'modem' },
      ]
    },
    {
      name: 'Software',
      slug: 'software',
      description: 'Software and licenses',
      subcategories: [
        { name: 'Antivirus', slug: 'antivirus' },
        { name: 'Operating System', slug: 'operating-system' },
        { name: 'Office Software', slug: 'office-software' },
        { name: 'Design Software', slug: 'design-software' },
      ]
    },
    {
      name: 'Server & Storage',
      slug: 'server-storage',
      description: 'Servers and storage solutions',
      subcategories: [
        { name: 'Server', slug: 'server' },
        { name: 'NAS', slug: 'nas' },
        { name: 'Storage', slug: 'storage' },
      ]
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Computer accessories',
      subcategories: [
        { name: 'Keyboard', slug: 'keyboard' },
        { name: 'Mouse', slug: 'mouse' },
        { name: 'Headphone', slug: 'headphone' },
        { name: 'Bluetooth Headphone', slug: 'bluetooth-headphone' },
        { name: 'Mouse Pad', slug: 'mouse-pad' },
        { name: 'Webcam', slug: 'webcam' },
        { name: 'Speaker', slug: 'speaker-home-theater' },
        { name: 'Bluetooth Speaker', slug: 'bluetooth-speakers' },
        { name: 'Soundbar', slug: 'soundbar' },
        { name: 'Cable', slug: 'cable' },
        { name: 'Converter', slug: 'converter' },
        { name: 'Card Reader', slug: 'card-reader' },
        { name: 'USB Hub', slug: 'hubs-docks' },
      ]
    },
    {
      name: 'Gadget',
      slug: 'gadget',
      description: 'Gadgets and wearables',
      subcategories: [
        { name: 'Smart Watch', slug: 'smart-watch' },
        { name: 'Smart Band', slug: 'smart-band' },
        { name: 'Earphone', slug: 'earphone' },
        { name: 'Earbuds', slug: 'earbuds' },
        { name: 'Neckband', slug: 'neckband' },
        { name: 'Power Bank', slug: 'power-bank' },
        { name: 'TV Box', slug: 'tv-box' },
        { name: 'Drones', slug: 'drones' },
        { name: 'Gimbal', slug: 'gimbal' },
        { name: 'Calculator', slug: 'calculator' },
      ]
    },
    {
      name: 'Gaming',
      slug: 'gaming',
      description: 'Gaming accessories and equipment',
      subcategories: [
        { name: 'Gaming Chair', slug: 'gaming-chair' },
        { name: 'Gaming Desk', slug: 'gaming-desk' },
        { name: 'Gaming Keyboard', slug: 'gaming-keyboard' },
        { name: 'Gaming Mouse', slug: 'gaming-mouse' },
        { name: 'Gaming Headphone', slug: 'gaming-headphone' },
        { name: 'Gaming Mouse Pad', slug: 'gaming-mouse-pad' },
        { name: 'Gamepad', slug: 'gamepad' },
        { name: 'Gaming Console', slug: 'gaming-console' },
        { name: 'VR Headset', slug: 'vr' },
        { name: 'Games', slug: 'games' },
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
        { name: 'Water Heater', slug: 'water-heater' },
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

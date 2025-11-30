import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupOldCategories() {
  console.log('Cleaning up old categories...')

  // List of valid category slugs from our seed
  const validSlugs = [
    'desktop', 'laptop', 'component', 'monitor', 'ups', 'phone', 'tablet',
    'office-equipment', 'camera', 'security', 'networking', 'software',
    'server-storage', 'accessories', 'gadget', 'gaming', 'tv', 'appliance',
    // Add all subcategory slugs...
    'desktop-offer', 'star-pc', 'gaming-pc', 'brand-pc', 'all-in-one-pc',
    'portable-mini-pc', 'apple-mac-mini', 'apple-imac', 'apple-mac-studio',
    'apple-mac-pro', 'all-laptop', 'oled-laptop', 'gaming-laptop',
    'premium-ultrabook', 'laptop-bag', 'external-graphics-enclosure',
    'laptop-accessories', 'pentium-celeron-laptop', 'core-i3-laptop',
    'core-i5-laptop', 'core-i7-laptop', 'core-i9-laptop', 'processor',
    'cpu-cooler', 'water-cooling', 'motherboard', 'graphics-card',
    'ram-desktop', 'ram-laptop', 'power-supply', 'hard-disk-drive',
    'portable-hard-disk-drive', 'ssd', 'portable-ssd', 'casing',
    'casing-cooler', 'optical-drive', 'thermal-paste', 'lcd-monitors',
    'led-monitors', 'gaming-monitor', 'curved-monitor', 'touch-monitor',
    'ultra-wide-monitor', 'portable-monitor', 'online-ups', 'offline-ups',
    'ips', 'samsung-phone', 'iphone', 'xiaomi', 'realme', 'oppo', 'vivo',
    'oneplus', 'infinix', 'feature-phone', 'graphics-tablet', 'kids-tablet',
    'ipad', 'samsung-tab', 'android-tablet', 'projector', 'printer',
    'scanner', 'photocopier', 'toner', 'cartridge', 'ink-bottle',
    'barcode-scanner', 'cash-drawer', 'telephone', 'pabx-system',
    'laminating-machine', 'binding-machine', 'dslr-camera',
    'mirrorless-camera', 'digital-camera', 'action-camera', 'handycam',
    'camera-lenses', 'camera-tripod', 'camera-accessories', 'cc-camera',
    'cctv-camera', 'ip-camera', 'dvr', 'nvr', 'router', 'switch',
    'access-point', 'network-adapter', 'modem', 'antivirus',
    'operating-system', 'office-software', 'design-software', 'server',
    'nas', 'storage', 'keyboard', 'mouse', 'headphone',
    'bluetooth-headphone', 'mouse-pad', 'webcam', 'speaker-home-theater',
    'bluetooth-speakers', 'soundbar', 'cable', 'converter', 'card-reader',
    'hubs-docks', 'smart-watch', 'smart-band', 'earphone', 'earbuds',
    'neckband', 'power-bank', 'tv-box', 'drones', 'gimbal', 'calculator',
    'gaming-chair', 'gaming-desk', 'gaming-keyboard', 'gaming-mouse',
    'gaming-headphone', 'gaming-mouse-pad', 'gamepad', 'gaming-console',
    'vr', 'games', 'smart-tv', 'android-tv', 'led-tv', 'air-conditioner',
    'refrigerator', 'washing-machine', 'microwave-oven', 'water-heater'
  ]

  // Deactivate categories not in our list
  const result = await prisma.category.updateMany({
    where: {
      slug: {
        notIn: validSlugs
      }
    },
    data: {
      isActive: false
    }
  })

  console.log(`✅ Deactivated ${result.count} old categories`)

  // List deactivated categories
  const deactivated = await prisma.category.findMany({
    where: {
      isActive: false
    },
    select: {
      name: true,
      slug: true
    }
  })

  if (deactivated.length > 0) {
    console.log('\nDeactivated categories:')
    deactivated.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`)
    })
  }
}

cleanupOldCategories()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

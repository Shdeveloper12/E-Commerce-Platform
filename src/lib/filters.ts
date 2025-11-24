// Filter configurations for different categories

export interface FilterSection {
  title: string
  type: 'checkbox' | 'range'
  options?: { label: string; value: string }[]
  min?: number
  max?: number
  defaultValue?: number[]
  apiField?: string // Field name in database/API
}

// Laptop Filters
export const laptopFilters: FilterSection[] = [
  {
    title: 'Price Range',
    type: 'range',
    min: 0,
    max: 500000,
    defaultValue: [0, 500000],
    apiField: 'price',
  },
  {
    title: 'Availability',
    type: 'checkbox',
    apiField: 'availability',
    options: [
      { label: 'In Stock', value: 'in_stock' },
      { label: 'Pre Order', value: 'pre_order' },
      { label: 'Up Coming', value: 'upcoming' },
    ],
  },
  {
    title: 'Processor',
    type: 'checkbox',
    apiField: 'processor',
    options: [
      { label: 'Intel Core i3', value: 'intel_i3' },
      { label: 'Intel Core i5', value: 'intel_i5' },
      { label: 'Intel Core i7', value: 'intel_i7' },
      { label: 'Intel Core i9', value: 'intel_i9' },
      { label: 'AMD Ryzen 3', value: 'amd_ryzen_3' },
      { label: 'AMD Ryzen 5', value: 'amd_ryzen_5' },
      { label: 'AMD Ryzen 7', value: 'amd_ryzen_7' },
      { label: 'AMD Ryzen 9', value: 'amd_ryzen_9' },
      { label: 'Apple M1', value: 'apple_m1' },
      { label: 'Apple M2', value: 'apple_m2' },
      { label: 'Apple M3', value: 'apple_m3' },
    ],
  },
  {
    title: 'RAM',
    type: 'checkbox',
    apiField: 'ram',
    options: [
      { label: '4 GB', value: '4gb' },
      { label: '8 GB', value: '8gb' },
      { label: '16 GB', value: '16gb' },
      { label: '32 GB', value: '32gb' },
      { label: '64 GB', value: '64gb' },
      { label: '128 GB', value: '128gb' },
    ],
  },
  {
    title: 'SSD',
    type: 'checkbox',
    apiField: 'ssd',
    options: [
      { label: '128GB SSD', value: '128gb' },
      { label: '256GB SSD', value: '256gb' },
      { label: '512GB SSD', value: '512gb' },
      { label: '1TB SSD', value: '1tb' },
      { label: '2TB SSD', value: '2tb' },
    ],
  },
  {
    title: 'Graphics',
    type: 'checkbox',
    apiField: 'graphics',
    options: [
      { label: 'Shared/Integrated', value: 'integrated' },
      { label: 'Dedicated 2GB', value: 'dedicated_2gb' },
      { label: 'Dedicated 4GB', value: 'dedicated_4gb' },
      { label: 'Dedicated 6GB', value: 'dedicated_6gb' },
      { label: 'Dedicated 8GB', value: 'dedicated_8gb' },
      { label: 'Dedicated 12GB', value: 'dedicated_12gb' },
      { label: 'Dedicated 16GB', value: 'dedicated_16gb' },
    ],
  },
]

// Desktop Filters
export const desktopFilters: FilterSection[] = [
  {
    title: 'Price Range',
    type: 'range',
    min: 0,
    max: 500000,
    defaultValue: [0, 500000],
    apiField: 'price',
  },
  {
    title: 'Availability',
    type: 'checkbox',
    apiField: 'availability',
    options: [
      { label: 'In Stock', value: 'in_stock' },
      { label: 'Pre Order', value: 'pre_order' },
      { label: 'Up Coming', value: 'upcoming' },
    ],
  },
  {
    title: 'Processor',
    type: 'checkbox',
    apiField: 'processor',
    options: [
      { label: 'Intel Core i3', value: 'intel_i3' },
      { label: 'Intel Core i5', value: 'intel_i5' },
      { label: 'Intel Core i7', value: 'intel_i7' },
      { label: 'Intel Core i9', value: 'intel_i9' },
      { label: 'AMD Ryzen 3', value: 'amd_ryzen_3' },
      { label: 'AMD Ryzen 5', value: 'amd_ryzen_5' },
      { label: 'AMD Ryzen 7', value: 'amd_ryzen_7' },
      { label: 'AMD Ryzen 9', value: 'amd_ryzen_9' },
    ],
  },
  {
    title: 'RAM',
    type: 'checkbox',
    apiField: 'ram',
    options: [
      { label: '8 GB', value: '8gb' },
      { label: '16 GB', value: '16gb' },
      { label: '32 GB', value: '32gb' },
      { label: '64 GB', value: '64gb' },
      { label: '128 GB', value: '128gb' },
    ],
  },
  {
    title: 'Storage',
    type: 'checkbox',
    apiField: 'ssd',
    options: [
      { label: '256GB SSD', value: '256gb' },
      { label: '512GB SSD', value: '512gb' },
      { label: '1TB SSD', value: '1tb' },
      { label: '2TB SSD', value: '2tb' },
      { label: '4TB SSD', value: '4tb' },
    ],
  },
  {
    title: 'Graphics',
    type: 'checkbox',
    apiField: 'graphics',
    options: [
      { label: 'Integrated', value: 'integrated' },
      { label: 'GTX 1650', value: 'gtx_1650' },
      { label: 'RTX 3050', value: 'rtx_3050' },
      { label: 'RTX 3060', value: 'rtx_3060' },
      { label: 'RTX 3070', value: 'rtx_3070' },
      { label: 'RTX 4060', value: 'rtx_4060' },
      { label: 'RTX 4070', value: 'rtx_4070' },
      { label: 'RTX 4080', value: 'rtx_4080' },
      { label: 'RTX 4090', value: 'rtx_4090' },
    ],
  },
]

// Monitor Filters
export const monitorFilters: FilterSection[] = [
  {
    title: 'Price Range',
    type: 'range',
    min: 0,
    max: 200000,
    defaultValue: [0, 200000],
    apiField: 'price',
  },
  {
    title: 'Availability',
    type: 'checkbox',
    apiField: 'availability',
    options: [
      { label: 'In Stock', value: 'in_stock' },
      { label: 'Pre Order', value: 'pre_order' },
      { label: 'Up Coming', value: 'upcoming' },
    ],
  },
  {
    title: 'Screen Size',
    type: 'checkbox',
    apiField: 'screenSize',
    options: [
      { label: '21.5 inch', value: '21.5' },
      { label: '24 inch', value: '24' },
      { label: '27 inch', value: '27' },
      { label: '32 inch', value: '32' },
      { label: '34 inch', value: '34' },
      { label: '49 inch', value: '49' },
    ],
  },
  {
    title: 'Resolution',
    type: 'checkbox',
    apiField: 'resolution',
    options: [
      { label: 'Full HD (1920x1080)', value: 'full_hd' },
      { label: '2K (2560x1440)', value: '2k' },
      { label: '4K (3840x2160)', value: '4k' },
      { label: 'Ultrawide', value: 'ultrawide' },
    ],
  },
  {
    title: 'Refresh Rate',
    type: 'checkbox',
    apiField: 'refreshRate',
    options: [
      { label: '60Hz', value: '60hz' },
      { label: '75Hz', value: '75hz' },
      { label: '144Hz', value: '144hz' },
      { label: '165Hz', value: '165hz' },
      { label: '240Hz', value: '240hz' },
    ],
  },
  {
    title: 'Panel Type',
    type: 'checkbox',
    apiField: 'panelType',
    options: [
      { label: 'IPS', value: 'ips' },
      { label: 'VA', value: 'va' },
      { label: 'TN', value: 'tn' },
      { label: 'OLED', value: 'oled' },
    ],
  },
]

// Component Filters
export const componentFilters: FilterSection[] = [
  {
    title: 'Price Range',
    type: 'range',
    min: 0,
    max: 300000,
    defaultValue: [0, 300000],
    apiField: 'price',
  },
  {
    title: 'Availability',
    type: 'checkbox',
    apiField: 'availability',
    options: [
      { label: 'In Stock', value: 'in_stock' },
      { label: 'Pre Order', value: 'pre_order' },
      { label: 'Up Coming', value: 'upcoming' },
    ],
  },
  {
    title: 'Component Type',
    type: 'checkbox',
    apiField: 'componentType',
    options: [
      { label: 'Processor', value: 'processor' },
      { label: 'Motherboard', value: 'motherboard' },
      { label: 'RAM', value: 'ram' },
      { label: 'Graphics Card', value: 'graphics_card' },
      { label: 'Storage (SSD)', value: 'ssd' },
      { label: 'Storage (HDD)', value: 'hdd' },
      { label: 'Power Supply', value: 'power_supply' },
      { label: 'Case', value: 'case' },
      { label: 'Cooling', value: 'cooling' },
    ],
  },
  {
    title: 'Brand',
    type: 'checkbox',
    apiField: 'brand',
    options: [
      { label: 'Intel', value: 'intel' },
      { label: 'AMD', value: 'amd' },
      { label: 'NVIDIA', value: 'nvidia' },
      { label: 'ASUS', value: 'asus' },
      { label: 'MSI', value: 'msi' },
      { label: 'Gigabyte', value: 'gigabyte' },
      { label: 'Corsair', value: 'corsair' },
      { label: 'Samsung', value: 'samsung' },
      { label: 'Western Digital', value: 'wd' },
    ],
  },
]

// Accessory Filters
export const accessoryFilters: FilterSection[] = [
  {
    title: 'Price Range',
    type: 'range',
    min: 0,
    max: 50000,
    defaultValue: [0, 50000],
    apiField: 'price',
  },
  {
    title: 'Availability',
    type: 'checkbox',
    apiField: 'availability',
    options: [
      { label: 'In Stock', value: 'in_stock' },
      { label: 'Pre Order', value: 'pre_order' },
      { label: 'Up Coming', value: 'upcoming' },
    ],
  },
  {
    title: 'Accessory Type',
    type: 'checkbox',
    apiField: 'accessoryType',
    options: [
      { label: 'Keyboard', value: 'keyboard' },
      { label: 'Mouse', value: 'mouse' },
      { label: 'Headset', value: 'headset' },
      { label: 'Webcam', value: 'webcam' },
      { label: 'Mouse Pad', value: 'mousepad' },
      { label: 'USB Hub', value: 'usb_hub' },
      { label: 'Cable', value: 'cable' },
      { label: 'Adapter', value: 'adapter' },
    ],
  },
  {
    title: 'Connectivity',
    type: 'checkbox',
    apiField: 'connectivity',
    options: [
      { label: 'Wired', value: 'wired' },
      { label: 'Wireless', value: 'wireless' },
      { label: 'Bluetooth', value: 'bluetooth' },
    ],
  },
]

// Helper function to get filters by category
export const getFiltersByCategory = (category: string): FilterSection[] => {
  const categoryLower = category.toLowerCase()

  if (categoryLower.includes('laptop')) return laptopFilters
  if (categoryLower.includes('desktop') || categoryLower.includes('pc')) return desktopFilters
  if (categoryLower.includes('monitor') || categoryLower.includes('display')) return monitorFilters
  if (categoryLower.includes('component')) return componentFilters
  if (categoryLower.includes('accessory') || categoryLower.includes('accessories')) return accessoryFilters

  // Default filters for other categories
  return [
    {
      title: 'Price Range',
      type: 'range',
      min: 0,
      max: 500000,
      defaultValue: [0, 500000],
      apiField: 'price',
    },
    {
      title: 'Availability',
      type: 'checkbox',
      apiField: 'availability',
      options: [
        { label: 'In Stock', value: 'in_stock' },
        { label: 'Pre Order', value: 'pre_order' },
        { label: 'Up Coming', value: 'upcoming' },
      ],
    },
  ]
}

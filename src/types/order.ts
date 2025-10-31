export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface Order {
  id: string
  userId?: string
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  discountAmount: number
  shippingAmount: number
  paymentMethod?: string
  paymentStatus: PaymentStatus
  shippingAddress?: Address
  billingAddress?: Address
  notes?: string
  createdAt: Date
  updatedAt: Date
  user?: User
  items?: OrderItem[]
  payments?: PaymentTransaction[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  createdAt: Date
  order?: Order
  product?: Product
}

export interface Address {
  firstName?: string
  lastName?: string
  phone?: string
  addressLine1: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface PaymentTransaction {
  id: string
  orderId: string
  transactionId?: string
  paymentMethod: string
  amount: number
  status: string
  responseData?: any
  createdAt: Date
  order?: Order
}

export interface CreateOrderData {
  items: {
    productId: string
    quantity: number
  }[]
  shippingAddress: Address
  billingAddress?: Address
  paymentMethod: string
  notes?: string
}

export interface UpdateOrderData {
  id: string
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  notes?: string
}

export interface OrderFilters {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  userId?: string
  dateFrom?: Date
  dateTo?: Date
}
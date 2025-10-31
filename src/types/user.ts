import { Address } from './order'

export enum AddressType {
  SHIPPING = 'SHIPPING',
  BILLING = 'BILLING',
}

export interface UserAddress {
  id: string
  userId: string
  addressType: AddressType
  firstName?: string
  lastName?: string
  phone?: string
  addressLine1: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  createdAt: Date
  user?: User
  product?: Product
}

export interface ProductReview {
  id: string
  productId: string
  userId: string
  rating: number
  reviewText?: string
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
  user?: User
  product?: Product
}

export interface PCBuild {
  id: string
  userId?: string
  name: string
  description?: string
  totalPrice?: number
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  user?: User
  components?: PCBuildComponent[]
}

export interface PCBuildComponent {
  id: string
  buildId: string
  componentType: string
  productId: string
  createdAt: Date
  build?: PCBuild
  product?: Product
}

export interface CreateAddressData {
  addressType: AddressType
  firstName?: string
  lastName?: string
  phone?: string
  addressLine1: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  isDefault?: boolean
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: string
}

export interface CreateReviewData {
  productId: string
  rating: number
  reviewText?: string
}

export interface CreatePCBuildData {
  name: string
  description?: string
  components: {
    componentType: string
    productId: string
  }[]
  isPublic?: boolean
}

export interface UpdatePCBuildData extends Partial<Omit<CreatePCBuildData, 'components'>> {
  id: string
  components?: {
    componentType: string
    productId: string
  }[]
}
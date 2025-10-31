export interface User {
  id: string
  email: string
  passwordHash: string
  firstName?: string
  lastName?: string
  phone?: string
  avatarUrl?: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface ResetPasswordData {
  email: string
}

export interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
}

export interface OAuthProvider {
  provider: 'google' | 'facebook' | 'github'
}
import { EntityStatus } from './common'

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  INACTIVE = 'INACTIVE',
}

export interface User {
  id: string
  openId: string | null
  unionId: string | null
  nickname: string | null
  avatarUrl: string | null
  phone: string | null
  role: UserRole
  status: UserStatus
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  nickname: string | null
  avatarUrl: string | null
  role: UserRole
  createdAt: string
}

export interface UpdateProfileInput {
  nickname?: string
  avatarUrl?: string
}

export interface LoginResponse {
  token: string
  user: UserProfile
}

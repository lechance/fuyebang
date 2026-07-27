// 通用类型

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  meta?: PaginationMeta
}

export interface ApiError {
  code: number
  message: string
  errors?: Record<string, string[]>
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum EntityStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  PENDING_REVIEW = 'PENDING_REVIEW',
}

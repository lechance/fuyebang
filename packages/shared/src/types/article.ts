import { EntityStatus } from './common'

export enum ArticleType {
  POLICY_UPDATE = 'POLICY_UPDATE',
  SEASONAL_ANALYSIS = 'SEASONAL_ANALYSIS',
  MARKET_TREND = 'MARKET_TREND',
  FAILURE_CASE = 'FAILURE_CASE',
  SUCCESS_STORY = 'SUCCESS_STORY',
  TOOL_REVIEW = 'TOOL_REVIEW',
  OTHER = 'OTHER',
}

export interface Article {
  id: string
  title: string
  summary: string
  content: string
  coverImage: string | null
  articleType: ArticleType
  authorName: string
  isFeatured: boolean
  viewCount: number
  likeCount: number
  favoriteCount: number
  status: EntityStatus
  publishedAt: string | null
  categories: CategoryInfo[]
  tags: TagInfo[]
  createdAt: string
  updatedAt: string
}

export interface ArticleCard {
  id: string
  title: string
  summary: string
  coverImage: string | null
  articleType: ArticleType
  authorName: string
  viewCount: number
  publishedAt: string | null
}

export interface ArticleListParams {
  type?: ArticleType
  category?: string
  keyword?: string
  sortBy?: 'newest' | 'views' | 'trending'
  page?: number
  pageSize?: number
}

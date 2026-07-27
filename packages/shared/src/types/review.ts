import { EntityStatus, SortOrder } from './common'

export enum ReviewDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT',
}

export interface ReviewScores {
  earnings: number       // 收益潜力 0-10
  risk: number           // 风险指数 0-10 (存储值，越高越危险)
  marketStability: number // 市场稳定性 0-10
  difficulty: number     // 上手难度 0-10 (存储值，越高越难)
  compliance: number     // 合规安全性 0-10
  overall: number        // 综合评分 (自动计算)
}

export interface Review {
  id: string
  title: string
  summary: string
  content: string
  coverImage: string | null
  slug: string
  scores: ReviewScores
  incomeMin: number | null
  incomeMax: number | null
  incomePeriod: string
  difficulty: ReviewDifficulty
  pros: string[]
  cons: string[]
  scamAlerts: string[]
  requirements: string[]
  timeCommitment: string | null
  startupCost: number | null
  isFeatured: boolean
  viewCount: number
  favoriteCount: number
  reviewCount: number
  status: EntityStatus
  authorId: string
  sideHustleId: string | null
  publishedAt: string | null
  steps: ReviewStep[]
  categories: CategoryInfo[]
  tags: TagInfo[]
  createdAt: string
  updatedAt: string
}

export interface ReviewStep {
  id: string
  stepNumber: number
  title: string
  content: string
  imageUrl: string | null
}

export interface ReviewCard {
  id: string
  title: string
  summary: string
  coverImage: string | null
  slug: string
  scores: Pick<ReviewScores, 'overall' | 'earnings' | 'risk' | 'difficulty'>
  incomeMin: number | null
  incomeMax: number | null
  difficulty: ReviewDifficulty
  startupCost: number | null
  isFeatured: boolean
  viewCount: number
  favoriteCount: number
  reviewCount: number
  publishedAt: string | null
}

export interface UserReview {
  id: string
  reviewId: string
  userId: string
  rating: number
  content: string
  income: string | null
  isVerified: boolean
  user: { nickname: string | null; avatarUrl: string | null }
  createdAt: string
}

export interface ReviewListParams {
  category?: string
  tag?: string
  keyword?: string
  sortBy?: 'overall' | 'earnings' | 'newest' | 'views' | 'difficulty'
  sortOrder?: SortOrder
  minScore?: number
  maxScore?: number
  difficulty?: ReviewDifficulty
  page?: number
  pageSize?: number
}

export interface ReviewRanking {
  dimension: 'overall' | 'earnings' | 'risk' | 'stability' | 'difficulty' | 'compliance'
  limit?: number
}

// 综合评分权重
export const SCORE_WEIGHTS = {
  earnings: 0.25,
  risk: 0.20,       // inverted: stored as-is, higher risk = lower overall
  marketStability: 0.20,
  difficulty: 0.15,  // inverted: stored as-is, higher difficulty = lower overall
  compliance: 0.20,
}

export function calculateOverall(scores: Omit<ReviewScores, 'overall'>): number {
  const raw =
    scores.earnings * SCORE_WEIGHTS.earnings +
    (10 - scores.risk) * SCORE_WEIGHTS.risk +
    scores.marketStability * SCORE_WEIGHTS.marketStability +
    (10 - scores.difficulty) * SCORE_WEIGHTS.difficulty +
    scores.compliance * SCORE_WEIGHTS.compliance
  return Math.round(raw * 10) / 10
}

import { EntityStatus } from './common'

export enum GuideCategory {
  BEGINNER = 'BEGINNER',
  TOOL_RECOMMENDATION = 'TOOL_RECOMMENDATION',
  FINANCIAL_PLANNING = 'FINANCIAL_PLANNING',
  COMPLIANCE = 'COMPLIANCE',
  SKILL_IMPROVEMENT = 'SKILL_IMPROVEMENT',
}

export const GuideCategoryLabels: Record<GuideCategory, string> = {
  [GuideCategory.BEGINNER]: '新手入门',
  [GuideCategory.TOOL_RECOMMENDATION]: '工具推荐',
  [GuideCategory.FINANCIAL_PLANNING]: '财务规划',
  [GuideCategory.COMPLIANCE]: '合规教育',
  [GuideCategory.SKILL_IMPROVEMENT]: '技能提升',
}

export interface Guide {
  id: string
  title: string
  summary: string
  content: string
  coverImage: string | null
  guideCategory: GuideCategory
  authorName: string
  isFeatured: boolean
  viewCount: number
  status: EntityStatus
  publishedAt: string | null
  categories: CategoryInfo[]
  tags: TagInfo[]
  createdAt: string
  updatedAt: string
}

export interface Tool {
  id: string
  name: string
  description: string
  logoUrl: string | null
  website: string | null
  category: string
  isFree: boolean
  price: string | null
  rating: number | null
  isRecommended: boolean
}

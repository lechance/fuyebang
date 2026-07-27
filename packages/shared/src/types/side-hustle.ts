import { EntityStatus } from './common'

export enum HustleCategory {
  SELF_MEDIA = 'SELF_MEDIA',
  E_COMMERCE = 'E_COMMERCE',
  LOCAL_SERVICES = 'LOCAL_SERVICES',
  SKILL_BASED = 'SKILL_BASED',
  RESOURCE_BASED = 'RESOURCE_BASED',
  INVESTMENT = 'INVESTMENT',
  OTHER = 'OTHER',
}

export const HustleCategoryLabels: Record<HustleCategory, string> = {
  [HustleCategory.SELF_MEDIA]: '自媒体',
  [HustleCategory.E_COMMERCE]: '电商',
  [HustleCategory.LOCAL_SERVICES]: '本地生活',
  [HustleCategory.SKILL_BASED]: '技能变现',
  [HustleCategory.RESOURCE_BASED]: '资源变现',
  [HustleCategory.INVESTMENT]: '投资类',
  [HustleCategory.OTHER]: '其他',
}

export interface SideHustle {
  id: string
  name: string
  slug: string
  description: string
  shortDesc: string
  icon: string | null
  category: HustleCategory
  avgScoreOverall: number | null
  totalReviews: number
  incomePotential: string | null
  entryBarrier: string | null
  timeRequired: string | null
  isHot: boolean
  viewCount: number
  status: EntityStatus
  categories: CategoryInfo[]
  tags: TagInfo[]
  createdAt: string
  updatedAt: string
}

export interface SideHustleCard {
  id: string
  name: string
  slug: string
  shortDesc: string
  icon: string | null
  category: HustleCategory
  avgScoreOverall: number | null
  totalReviews: number
  incomePotential: string | null
  entryBarrier: string | null
  isHot: boolean
}

export interface HustleListParams {
  category?: HustleCategory
  keyword?: string
  sortBy?: 'reviews' | 'score' | 'views' | 'name'
  page?: number
  pageSize?: number
}

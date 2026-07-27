export interface CategoryInfo {
  id: string
  name: string
  slug: string
  icon: string | null
  parentId: string | null
  children?: CategoryInfo[]
}

export interface TagInfo {
  id: string
  name: string
  slug: string
  color: string | null
}

export enum BannerPosition {
  HOME_TOP = 'HOME_TOP',
  HOME_MIDDLE = 'HOME_MIDDLE',
  REVIEW_TOP = 'REVIEW_TOP',
}

export enum BannerTargetType {
  REVIEW = 'REVIEW',
  ARTICLE = 'ARTICLE',
  GUIDE = 'GUIDE',
  HUSTLE = 'HUSTLE',
  URL = 'URL',
  NONE = 'NONE',
}

export interface Banner {
  id: string
  title: string
  imageUrl: string
  position: BannerPosition
  targetType: BannerTargetType
  targetId: string | null
  targetUrl: string | null
  sortOrder: number
  isActive: boolean
}

export interface HomePageData {
  banners: Banner[]
  categories: CategoryInfo[]
  recommendedHustles: import('./side-hustle').SideHustleCard[]
  trendingReviews: import('./review').ReviewCard[]
  latestNews: import('./article').ArticleCard[]
  scamAlerts: ScamAlertItem[]
  hotSearches: string[]
}

export interface ScamAlertItem {
  id: string
  title: string
  severity: import('./scam').ScamSeverity
}

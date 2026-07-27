export { HOME_CATEGORIES, HUSTLE_TAGS, TARGET_AUDIENCES, COST_TIERS, INCOME_PERIODS, INCOME_PERIOD_LABELS } from './constants/categories'
export { COMMON_STATUSES, HTTP_STATUS, BUSINESS_CODES } from './constants/status'
export { REVIEW_DIMENSIONS, REVIEW_DIFFICULTY_LABELS, INCOME_RANGE_LABELS } from './constants/review-dimensions'

export type { PaginationParams, PaginationMeta, ApiResponse, ApiError } from './types/common'
export { SortOrder, EntityStatus } from './types/common'

export type { User, UserProfile, UpdateProfileInput, LoginResponse } from './types/user'
export { UserRole, UserStatus } from './types/user'

export type { ReviewScores, Review, ReviewStep, ReviewCard, UserReview, ReviewListParams } from './types/review'
export { ReviewDifficulty, calculateOverall, SCORE_WEIGHTS } from './types/review'

export type { Article, ArticleCard, ArticleListParams } from './types/article'
export { ArticleType } from './types/article'

export type { SideHustle, SideHustleCard, HustleListParams } from './types/side-hustle'
export { HustleCategory, HustleCategoryLabels } from './types/side-hustle'

export type { Guide, Tool } from './types/guide'
export { GuideCategory, GuideCategoryLabels } from './types/guide'

export type { ScamReport, ScamReportCard, ScamSubmitInput, ScamStats } from './types/scam'
export { ScamSeverity, ScamStatus, ScamSeverityLabels, ScamSeverityColors } from './types/scam'

export type { CommunityPost, CommunityComment, CreatePostInput, CreateCommentInput } from './types/community'
export { PostType, PostStatus, PostTypeLabels } from './types/community'

export type { HomePageData, Banner, CategoryInfo, TagInfo, ScamAlertItem } from './types/home'
export { BannerPosition, BannerTargetType } from './types/home'

export type { Notification } from './types/notification'
export { NotificationType, FavoriteType } from './types/notification'

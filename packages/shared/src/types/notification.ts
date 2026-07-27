export enum NotificationType {
  SYSTEM = 'SYSTEM',
  COMMENT_REPLY = 'COMMENT_REPLY',
  POST_LIKE = 'POST_LIKE',
  POST_COMMENT = 'POST_COMMENT',
  REVIEW_UPDATE = 'REVIEW_UPDATE',
  SCAM_ALERT = 'SCAM_ALERT',
  NEW_FEATURE = 'NEW_FEATURE',
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string | null
  isRead: boolean
  entityType: string | null
  entityId: string | null
  createdAt: string
}

export enum FavoriteType {
  REVIEW = 'REVIEW',
  ARTICLE = 'ARTICLE',
  GUIDE = 'GUIDE',
  HUSTLE = 'HUSTLE',
  POST = 'POST',
}

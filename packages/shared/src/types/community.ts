export enum PostType {
  EXPERIENCE_SHARING = 'EXPERIENCE_SHARING',
  QUESTION = 'QUESTION',
  DISCUSSION = 'DISCUSSION',
  RESOURCE_SHARING = 'RESOURCE_SHARING',
  WARNING = 'WARNING',
}

export enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  HIDDEN = 'HIDDEN',
  DELETED = 'DELETED',
  REPORTED = 'REPORTED',
}

export const PostTypeLabels: Record<PostType, string> = {
  [PostType.EXPERIENCE_SHARING]: '经验分享',
  [PostType.QUESTION]: '求助问答',
  [PostType.DISCUSSION]: '讨论交流',
  [PostType.RESOURCE_SHARING]: '资源分享',
  [PostType.WARNING]: '避坑提醒',
}

export interface CommunityPost {
  id: string
  title: string
  content: string
  postType: PostType
  images: string[]
  tags: string[]
  viewCount: number
  likeCount: number
  commentCount: number
  favoriteCount: number
  isPinned: boolean
  status: PostStatus
  author: {
    id: string
    nickname: string | null
    avatarUrl: string | null
  }
  isLiked?: boolean
  isFavorited?: boolean
  createdAt: string
  updatedAt: string
}

export interface CommunityComment {
  id: string
  content: string
  images: string[]
  author: {
    id: string
    nickname: string | null
    avatarUrl: string | null
  }
  parentId: string | null
  replies?: CommunityComment[]
  createdAt: string
  updatedAt: string
}

export interface CreatePostInput {
  title: string
  content: string
  postType: PostType
  images?: string[]
  tags?: string[]
}

export interface CreateCommentInput {
  content: string
  images?: string[]
  parentId?: string
}

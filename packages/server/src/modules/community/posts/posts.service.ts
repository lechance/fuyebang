import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async list(query: any) {
    const where: any = { status: 'PUBLISHED' }
    if (query.type) where.postType = query.type
    if (query.tag) where.tags = { has: query.tag }
    if (query.authorId) where.authorId = query.authorId
    const page = query.page || 1
    const ps = query.pageSize || 20
    const orderBy: any = query.sortBy === 'hot' ? { likeCount: 'desc' } : { createdAt: 'desc' }
    const [data, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        where, orderBy: [{ isPinned: 'desc' }, orderBy], skip: (page - 1) * ps, take: ps,
        include: { author: { select: { id: true, nickname: true, avatarUrl: true } } },
      }),
      this.prisma.communityPost.count({ where }),
    ])
    return { data, meta: { page, pageSize: ps, total, totalPages: Math.ceil(total / ps) } }
  }

  async getById(id: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id },
      include: { author: { select: { id: true, nickname: true, avatarUrl: true } } },
    })
    if (!post) throw new NotFoundException('帖子不存在')
    this.prisma.communityPost.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {})
    return post
  }

  async create(userId: string, dto: any) {
    return this.prisma.communityPost.create({
      data: { ...dto, authorId: userId },
      include: { author: { select: { id: true, nickname: true, avatarUrl: true } } },
    })
  }

  async delete(id: string, userId: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id }, select: { authorId: true } })
    if (!post) throw new NotFoundException('帖子不存在')
    if (post.authorId !== userId) throw new ForbiddenException('只能删除自己的帖子')
    return this.prisma.communityPost.update({ where: { id }, data: { status: 'DELETED' } })
  }

  async hotTags() {
    return ['新手求助', '经验分享', '避坑', '闲鱼', '抖音', '自媒体', '兼职', '居家副业']
  }
}

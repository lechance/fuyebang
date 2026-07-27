import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async list(postId: string, query: any) {
    const page = query.page || 1
    const ps = query.pageSize || 20
    const [data, total] = await Promise.all([
      this.prisma.communityComment.findMany({
        where: { postId, parentId: null },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * ps, take: ps,
        include: {
          author: { select: { id: true, nickname: true, avatarUrl: true } },
          replies: { include: { author: { select: { id: true, nickname: true, avatarUrl: true } } }, orderBy: { createdAt: 'asc' } },
        },
      }),
      this.prisma.communityComment.count({ where: { postId } }),
    ])
    return { data, meta: { page, pageSize: ps, total, totalPages: Math.ceil(total / ps) } }
  }

  async create(postId: string, userId: string, dto: any) {
    const post = await this.prisma.communityPost.findUnique({ where: { id: postId } })
    if (!post) throw new NotFoundException('帖子不存在')
    const comment = await this.prisma.communityComment.create({
      data: { postId, authorId: userId, ...dto },
      include: { author: { select: { id: true, nickname: true, avatarUrl: true } } },
    })
    await this.prisma.communityPost.update({ where: { id: postId }, data: { commentCount: { increment: 1 } } })
    return comment
  }

  async delete(id: string, userId: string) {
    const comment = await this.prisma.communityComment.findUnique({ where: { id }, select: { authorId: true } })
    if (!comment) throw new NotFoundException('评论不存在')
    if (comment.authorId !== userId) throw new ForbiddenException('只能删除自己的评论')
    return this.prisma.communityComment.delete({ where: { id } })
  }
}

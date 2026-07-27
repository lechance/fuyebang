import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async toggle(postId: string, userId: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id: postId } })
    if (!post) throw new NotFoundException('帖子不存在')

    const existing = await this.prisma.userLike.findUnique({
      where: { userId_postId: { userId, postId } },
    })

    if (existing) {
      await this.prisma.userLike.delete({ where: { id: existing.id } })
      await this.prisma.communityPost.update({ where: { id: postId }, data: { likeCount: { decrement: 1 } } })
      return { liked: false }
    } else {
      await this.prisma.userLike.create({ data: { userId, postId } })
      await this.prisma.communityPost.update({ where: { id: postId }, data: { likeCount: { increment: 1 } } })
      return { liked: true }
    }
  }
}

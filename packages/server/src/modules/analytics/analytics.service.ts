import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async dashboard() {
    const [totalUsers, totalReviews, totalArticles, totalPosts, todayStat] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.review.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.article.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.communityPost.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.dailyStat.findFirst({ orderBy: { date: 'desc' } }),
    ])

    return {
      totalUsers,
      totalReviews,
      totalArticles,
      totalPosts,
      todayViews: todayStat?.totalViews || 0,
      todayNewUsers: todayStat?.newUsers || 0,
    }
  }
}

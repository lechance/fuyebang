import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getHomeFeed(page = 1, pageSize = 20) {
    const [banners, categories, recommended, latestNews, scamAlerts] = await Promise.all([
      this.getBanners('HOME_TOP'),
      this.prisma.category.findMany({
        where: { parentId: null, isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
      }),
      this.getRecommended(6),
      this.getNewsFeed(1, 10),
      this.prisma.scamReport.findMany({
        where: { status: 'VERIFIED', severity: { in: ['HIGH', 'CRITICAL'] } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, severity: true },
      }),
    ])
    return { banners, categories, recommended, latestNews, scamAlerts }
  }

  async getBanners(position?: string) {
    return this.prisma.banner.findMany({
      where: {
        isActive: true,
        ...(position ? { position: position as any } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    })
  }

  async getRecommended(limit = 6) {
    return this.prisma.review.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      orderBy: { scoreOverall: 'desc' },
      take: limit,
      select: {
        id: true, title: true, slug: true, coverImage: true,
        scoreOverall: true, incomeMin: true, incomeMax: true,
        difficulty: true, startupCost: true, viewCount: true,
      },
    })
  }

  async getNewsFeed(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize
    return this.prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: pageSize,
      select: {
        id: true, title: true, summary: true, coverImage: true,
        articleType: true, viewCount: true, publishedAt: true,
      },
    })
  }

  async getHotSearches() {
    return ['闲鱼无货源', '抖音带货', '地摊小吃', '线上客服', '短视频剪辑']
  }
}

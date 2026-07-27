import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../redis/redis.service'

@Injectable()
export class HomeService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getHomeFeed(page = 1, pageSize = 20) {
    const cacheKey = 'home:feed'

    return this.redis.getOrSet(cacheKey, async () => {
      const [banners, categories, recommended, latestNews, scamAlerts] = await Promise.all([
        this.getBanners('HOME_TOP'),
        this.prisma.category.findMany({
          where: { parentId: null, isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: { children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
        }),
        this.getRecommended(6),
        this.getNewsFeed(1, 10),
        this.getScamAlerts(),
      ])
      return { banners, categories, recommended, latestNews, scamAlerts, hotSearches: [] }
    }, 120) // 2 min cache
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
    return this.redis.getOrSet(`home:recommended:${limit}`, () =>
      this.prisma.review.findMany({
        where: { status: 'PUBLISHED', isFeatured: true },
        orderBy: { scoreOverall: 'desc' },
        take: limit,
        select: {
          id: true, title: true, slug: true, coverImage: true,
          scoreOverall: true, incomeMin: true, incomeMax: true,
          difficulty: true, startupCost: true, viewCount: true,
        },
      }),
    300)
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

  async getScamAlerts() {
    return this.prisma.scamReport.findMany({
      where: { status: 'VERIFIED', severity: { in: ['HIGH', 'CRITICAL'] } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, severity: true },
    })
  }

  async getHotSearches() {
    const redisHot = await this.redis.getHotSearches(10)
    if (redisHot.length > 0) return redisHot
    return ['闲鱼无货源', '抖音带货', '短视频剪辑', '地摊小吃', '线上客服', '自媒体', '写作投稿', '设计接单']
  }

  // Invalidate home cache when content changes
  async invalidateHomeCache() {
    await this.redis.del('home:feed')
    await this.redis.delPattern('home:recommended:*')
  }
}

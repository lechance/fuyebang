import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../redis/redis.service'

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async search(keyword: string, type = 'all', page = 1) {
    if (!keyword) return { results: [], meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 } }

    // Track hot search
    this.redis.incrementSearch(keyword).catch(() => {})

    const pageSize = 20
    const skip = (page - 1) * pageSize
    const results: any = { reviews: [], hustles: [], articles: [], guides: [] }

    // Try cache first for page 1
    if (page === 1) {
      const cacheKey = `search:${type}:${keyword}`
      const cached = await this.redis.get<any>(cacheKey)
      if (cached) return cached
    }

    // Build full-text search conditions
    // PostgreSQL: to_tsvector for Chinese, fallback ILIKE
    const tsQuery = keyword.split(/\s+/).filter(Boolean).map(w => `${w}:*`).join(' & ')

    if (type === 'all' || type === 'review') {
      const [data, total] = await Promise.all([
        this.prisma.review.findMany({
          where: {
            status: 'PUBLISHED',
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { summary: { contains: keyword, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true, title: true, slug: true, summary: true,
            scoreOverall: true, coverImage: true, incomeMin: true, incomeMax: true,
          },
          skip, take: pageSize,
          orderBy: { scoreOverall: 'desc' },
        }),
        this.prisma.review.count({
          where: {
            status: 'PUBLISHED',
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { summary: { contains: keyword, mode: 'insensitive' } },
            ],
          },
        }),
      ])
      results.reviews = { data, total }
    }

    if (type === 'all' || type === 'hustle') {
      const [data, total] = await Promise.all([
        this.prisma.sideHustle.findMany({
          where: {
            status: 'PUBLISHED',
            OR: [
              { name: { contains: keyword, mode: 'insensitive' } },
              { shortDesc: { contains: keyword, mode: 'insensitive' } },
            ],
          },
          skip, take: pageSize,
        }),
        this.prisma.sideHustle.count({
          where: {
            status: 'PUBLISHED',
            OR: [
              { name: { contains: keyword, mode: 'insensitive' } },
              { shortDesc: { contains: keyword, mode: 'insensitive' } },
            ],
          },
        }),
      ])
      results.hustles = { data, total }
    }

    if (type === 'all' || type === 'article') {
      const [data, total] = await Promise.all([
        this.prisma.article.findMany({
          where: {
            status: 'PUBLISHED',
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { summary: { contains: keyword, mode: 'insensitive' } },
            ],
          },
          skip, take: pageSize,
        }),
        this.prisma.article.count({
          where: {
            status: 'PUBLISHED',
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { summary: { contains: keyword, mode: 'insensitive' } },
            ],
          },
        }),
      ])
      results.articles = { data, total }
    }

    // Flatten results for response
    const response = {
      reviews: results.reviews?.data || [],
      hustles: results.hustles?.data || [],
      articles: results.articles?.data || [],
      meta: {
        page,
        pageSize: 20,
        total: (results.reviews?.total || 0) + (results.hustles?.total || 0) + (results.articles?.total || 0),
      },
    }

    // Cache page 1 for 60s
    if (page === 1) {
      await this.redis.set(`search:${type}:${keyword}`, response, 60)
    }

    return response
  }

  async suggest(keyword: string) {
    if (!keyword || keyword.length < 2) return []

    const cacheKey = `suggest:${keyword}`
    const cached = await this.redis.get<any[]>(cacheKey)
    if (cached) return cached

    const [reviews, hustles, articles] = await Promise.all([
      this.prisma.review.findMany({
        where: { status: 'PUBLISHED', title: { contains: keyword, mode: 'insensitive' } },
        take: 4,
        select: { title: true, slug: true },
      }),
      this.prisma.sideHustle.findMany({
        where: { status: 'PUBLISHED', name: { contains: keyword, mode: 'insensitive' } },
        take: 4,
        select: { name: true, slug: true },
      }),
      this.prisma.article.findMany({
        where: { status: 'PUBLISHED', title: { contains: keyword, mode: 'insensitive' } },
        take: 3,
        select: { id: true, title: true },
      }),
    ])

    const result = [
      ...reviews.map((r: any) => ({ text: r.title, type: 'review' as const, slug: r.slug })),
      ...hustles.map((h: any) => ({ text: h.name, type: 'hustle' as const, slug: h.slug })),
      ...articles.map((a: any) => ({ text: a.title, type: 'article' as const, id: a.id })),
    ]

    await this.redis.set(cacheKey, result, 60)
    return result
  }

  async getHotSearches(limit = 10): Promise<string[]> {
    const cached = await this.redis.getHotSearches(limit)
    if (cached.length > 0) return cached

    // Fallback defaults
    return ['闲鱼无货源', '抖音带货', '短视频剪辑', '地摊小吃', '线上客服', '自媒体', '写作投稿', '设计接单']
  }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { QueryReviewDto } from './dto/query-review.dto'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { paginate } from '../../common/dto/pagination.dto'
import { Prisma } from '@prisma/client'

// 5 维度评分权重
const SCORE_WEIGHTS = {
  earnings: 0.25,
  risk: 0.20,
  marketStability: 0.20,
  difficulty: 0.15,
  compliance: 0.20,
}

function calculateOverall(scores: { scoreEarnings: number; scoreRisk: number; scoreMarketStability: number; scoreDifficulty: number; scoreCompliance: number }): number {
  const raw =
    scores.scoreEarnings * SCORE_WEIGHTS.earnings +
    (10 - scores.scoreRisk) * SCORE_WEIGHTS.risk +
    scores.scoreMarketStability * SCORE_WEIGHTS.marketStability +
    (10 - scores.scoreDifficulty) * SCORE_WEIGHTS.difficulty +
    scores.scoreCompliance * SCORE_WEIGHTS.compliance
  return Math.round(raw * 10) / 10
}

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async list(query: QueryReviewDto) {
    const where: Prisma.ReviewWhereInput = {
      status: 'PUBLISHED',
    }

    if (query.keyword) {
      where.OR = [
        { title: { contains: query.keyword, mode: 'insensitive' } },
        { summary: { contains: query.keyword, mode: 'insensitive' } },
      ]
    }
    if (query.minScore) where.scoreOverall = { ...(where.scoreOverall as any), gte: query.minScore }
    if (query.maxScore) where.scoreOverall = { ...(where.scoreOverall as any), lte: query.maxScore }
    if (query.difficulty) where.difficulty = query.difficulty

    const orderBy: Prisma.ReviewOrderByWithRelationInput = {}
    switch (query.sortBy) {
      case 'earnings': orderBy.scoreEarnings = (query.sortOrder as Prisma.SortOrder) || Prisma.SortOrder.desc; break
      case 'newest': orderBy.publishedAt = Prisma.SortOrder.desc; break
      case 'views': orderBy.viewCount = Prisma.SortOrder.desc; break
      case 'difficulty': orderBy.scoreDifficulty = (query.sortOrder as Prisma.SortOrder) || Prisma.SortOrder.asc; break
      default: orderBy.scoreOverall = Prisma.SortOrder.desc
    }

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        orderBy,
        skip: query.skip,
        take: query.pageSize,
        select: {
          id: true, title: true, summary: true, coverImage: true, slug: true,
          scoreOverall: true, scoreEarnings: true, scoreRisk: true, scoreDifficulty: true,
          incomeMin: true, incomeMax: true, difficulty: true, startupCost: true,
          isFeatured: true, viewCount: true, favoriteCount: true, reviewCount: true,
          publishedAt: true,
          categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
        },
      }),
      this.prisma.review.count({ where }),
    ])

    return paginate(data, total, query)
  }

  async getBySlug(slug: string) {
    const review = await this.prisma.review.findUnique({
      where: { slug },
      include: {
        steps: { orderBy: { stepNumber: 'asc' } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        sideHustle: { select: { id: true, name: true, slug: true } },
      },
    })
    if (!review) throw new NotFoundException('评测不存在')

    // Increment view count (fire and forget)
    this.prisma.review.update({
      where: { id: review.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {})

    return review
  }

  async getSteps(slug: string) {
    const review = await this.prisma.review.findUnique({
      where: { slug },
      select: { id: true },
    })
    if (!review) throw new NotFoundException('评测不存在')

    return this.prisma.reviewStep.findMany({
      where: { reviewId: review.id },
      orderBy: { stepNumber: 'asc' },
    })
  }

  async ranking(dimension: string, limit = 20) {
    const orderBy: Prisma.ReviewOrderByWithRelationInput = {}
    const dimensionMap: Record<string, string> = {
      overall: 'scoreOverall', earnings: 'scoreEarnings', risk: 'scoreRisk',
      stability: 'scoreMarketStability', difficulty: 'scoreDifficulty', compliance: 'scoreCompliance',
    }
    const field = dimensionMap[dimension] || 'scoreOverall'
    ;(orderBy as any)[field] = 'desc'

    return this.prisma.review.findMany({
      where: { status: 'PUBLISHED' },
      orderBy,
      take: limit,
      select: {
        id: true, title: true, slug: true, scoreOverall: true,
        [dimensionMap[dimension] || 'scoreOverall']: true,
        viewCount: true, reviewCount: true, coverImage: true,
      },
    })
  }

  async featured(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { status: 'PUBLISHED', isFeatured: true },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true, title: true, summary: true, coverImage: true, slug: true,
          scoreOverall: true, scoreEarnings: true, scoreRisk: true, scoreDifficulty: true,
          incomeMin: true, incomeMax: true, difficulty: true, startupCost: true,
          isFeatured: true, viewCount: true, favoriteCount: true, reviewCount: true,
          publishedAt: true,
        },
      }),
      this.prisma.review.count({ where: { status: 'PUBLISHED', isFeatured: true } }),
    ])
    return paginate(data, total, { page, pageSize, skip } as any)
  }

  async create(userId: string, dto: CreateReviewDto) {
    const scoreOverall = calculateOverall(dto)
    return this.prisma.review.create({
      data: {
        ...dto,
        scoreOverall,
        authorId: userId,
      },
    })
  }

  async update(id: string, dto: UpdateReviewDto) {
    const existing = await this.prisma.review.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('评测不存在')

    const data: any = { ...dto }
    if (dto.scoreEarnings || dto.scoreRisk || dto.scoreMarketStability || dto.scoreDifficulty || dto.scoreCompliance) {
      const scores = {
        earnings: dto.scoreEarnings ?? Number(existing.scoreEarnings),
        risk: dto.scoreRisk ?? Number(existing.scoreRisk),
        marketStability: dto.scoreMarketStability ?? Number(existing.scoreMarketStability),
        difficulty: dto.scoreDifficulty ?? Number(existing.scoreDifficulty),
        compliance: dto.scoreCompliance ?? Number(existing.scoreCompliance),
      }
      data.scoreOverall = calculateOverall(scores as any)
    }

    return this.prisma.review.update({ where: { id }, data })
  }

  async delete(id: string) {
    const existing = await this.prisma.review.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('评测不存在')
    return this.prisma.review.delete({ where: { id } })
  }

  // Admin methods
  async adminList(query: any) {
    const where: any = {}
    if (query.status) where.status = query.status
    if (query.keyword) where.title = { contains: query.keyword, mode: 'insensitive' }
    const page = query.page || 1
    const ps = query.pageSize || 20
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * ps,
        take: ps,
        select: {
          id: true, title: true, slug: true, scoreOverall: true,
          viewCount: true, reviewCount: true, status: true,
          isFeatured: true, createdAt: true, updatedAt: true,
        },
      }),
      this.prisma.review.count({ where }),
    ])
    return { data, meta: { page, pageSize: ps, total, totalPages: Math.ceil(total / ps) } }
  }

  async getById(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        steps: { orderBy: { stepNumber: 'asc' } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    })
    if (!review) throw new NotFoundException('评测不存在')
    return review
  }

  async updateStatus(id: string, status: string) {
    const existing = await this.prisma.review.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('评测不存在')
    return this.prisma.review.update({
      where: { id },
      data: {
        status: status as any,
        publishedAt: status === 'PUBLISHED' ? new Date() : existing.publishedAt,
      },
    })
  }

  // Step management
  async createSteps(reviewId: string, steps: { stepNumber: number; title: string; content: string; imageUrl?: string }[]) {
    await this.prisma.reviewStep.deleteMany({ where: { reviewId } })
    if (steps.length > 0) {
      return this.prisma.reviewStep.createMany({
        data: steps.map(s => ({ ...s, reviewId })),
      })
    }
    return { count: 0 }
  }

  async getStepsByReviewId(reviewId: string) {
    return this.prisma.reviewStep.findMany({
      where: { reviewId },
      orderBy: { stepNumber: 'asc' },
    })
  }
}

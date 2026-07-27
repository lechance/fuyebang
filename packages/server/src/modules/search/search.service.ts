import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(keyword: string, type = 'all', page = 1) {
    if (!keyword) return { data: [], meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 } }

    const pageSize = 20
    const skip = (page - 1) * pageSize
    const results: any = { reviews: [], hustles: [], articles: [], guides: [], meta: { page, pageSize: 20, total: 0, totalPages: 0 } }

    if (type === 'all' || type === 'review') {
      const [data, total] = await Promise.all([
        this.prisma.review.findMany({
          where: { status: 'PUBLISHED', title: { contains: keyword, mode: 'insensitive' } },
          select: { id: true, title: true, slug: true, summary: true, scoreOverall: true, coverImage: true },
          skip, take: pageSize,
        }),
        this.prisma.review.count({ where: { status: 'PUBLISHED', title: { contains: keyword, mode: 'insensitive' } } }),
      ])
      results.reviews = data
      results.meta.total += total
    }

    if (type === 'all' || type === 'hustle') {
      const [data, total] = await Promise.all([
        this.prisma.sideHustle.findMany({
          where: { status: 'PUBLISHED', name: { contains: keyword, mode: 'insensitive' } },
          skip, take: pageSize,
        }),
        this.prisma.sideHustle.count({ where: { status: 'PUBLISHED', name: { contains: keyword, mode: 'insensitive' } } }),
      ])
      results.hustles = data
      results.meta.total += total
    }

    if (type === 'all' || type === 'article') {
      const [data, total] = await Promise.all([
        this.prisma.article.findMany({
          where: { status: 'PUBLISHED', title: { contains: keyword, mode: 'insensitive' } },
          skip, take: pageSize,
        }),
        this.prisma.article.count({ where: { status: 'PUBLISHED', title: { contains: keyword, mode: 'insensitive' } } }),
      ])
      results.articles = data
      results.meta.total += total
    }

    return results
  }

  async suggest(keyword: string) {
    if (!keyword) return []
    const [reviews, hustles, articles] = await Promise.all([
      this.prisma.review.findMany({ where: { status: 'PUBLISHED', title: { contains: keyword, mode: 'insensitive' } }, take: 5, select: { title: true, slug: true } }),
      this.prisma.sideHustle.findMany({ where: { status: 'PUBLISHED', name: { contains: keyword, mode: 'insensitive' } }, take: 5, select: { name: true, slug: true } }),
      this.prisma.article.findMany({ where: { status: 'PUBLISHED', title: { contains: keyword, mode: 'insensitive' } }, take: 5, select: { title: true } }),
    ])
    return [
      ...reviews.map(r => ({ text: r.title, type: 'review', slug: r.slug })),
      ...hustles.map(h => ({ text: h.name, type: 'hustle', slug: h.slug })),
      ...articles.map(a => ({ text: a.title, type: 'article' })),
    ]
  }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async list(query: any) {
    const where: any = { status: 'PUBLISHED' }
    if (query.type) where.articleType = query.type
    if (query.keyword) where.title = { contains: query.keyword, mode: 'insensitive' }
    const page = query.page || 1
    const pageSize = query.pageSize || 20
    const [data, total] = await Promise.all([
      this.prisma.article.findMany({ where, orderBy: { publishedAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.article.count({ where }),
    ])
    return { data, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } }
  }

  async getById(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } })
    if (!article) throw new NotFoundException('文章不存在')
    this.prisma.article.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {})
    return article
  }

  async featured(limit = 5) {
    return this.prisma.article.findMany({ where: { status: 'PUBLISHED', isFeatured: true }, orderBy: { publishedAt: 'desc' }, take: limit })
  }

  async related(articleId: string, limit = 4) {
    const article = await this.prisma.article.findUnique({ where: { id: articleId }, select: { articleType: true } })
    if (!article) return []
    return this.prisma.article.findMany({
      where: { status: 'PUBLISHED', articleType: article.articleType, id: { not: articleId } },
      take: limit,
    })
  }
}

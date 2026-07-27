import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class GuidesService {
  constructor(private prisma: PrismaService) {}

  async list(query: any) {
    const where: any = { status: 'PUBLISHED' }
    if (query.category) where.guideCategory = query.category
    const page = query.page || 1
    const ps = query.pageSize || 20
    const [data, total] = await Promise.all([
      this.prisma.guide.findMany({ where, orderBy: { publishedAt: 'desc' }, skip: (page - 1) * ps, take: ps }),
      this.prisma.guide.count({ where }),
    ])
    return { data, meta: { page, pageSize: ps, total, totalPages: Math.ceil(total / ps) } }
  }

  async getById(id: string) {
    const item = await this.prisma.guide.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('指南不存在')
    return item
  }

  async featured(limit = 4) {
    return this.prisma.guide.findMany({ where: { status: 'PUBLISHED', isFeatured: true }, take: limit })
  }

  async listTools(query: any) {
    const where: any = {}
    if (query.category) where.category = query.category
    if (query.isFree !== undefined) where.isFree = query.isFree === 'true'
    return this.prisma.tool.findMany({ where, orderBy: { isRecommended: 'desc' } })
  }
}

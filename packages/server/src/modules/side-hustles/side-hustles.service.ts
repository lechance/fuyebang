import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class SideHustlesService {
  constructor(private prisma: PrismaService) {}

  async list(query: any) {
    const where: any = { status: 'PUBLISHED' }
    if (query.category) where.category = query.category
    if (query.keyword) where.name = { contains: query.keyword, mode: 'insensitive' }
    const page = query.page || 1
    const pageSize = query.pageSize || 20
    const [data, total] = await Promise.all([
      this.prisma.sideHustle.findMany({ where, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.sideHustle.count({ where }),
    ])
    return { data, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } }
  }

  async hot(limit = 10) {
    return this.prisma.sideHustle.findMany({ where: { status: 'PUBLISHED', isHot: true }, take: limit })
  }

  async featured(limit = 6) {
    return this.prisma.sideHustle.findMany({ where: { status: 'PUBLISHED' }, orderBy: { viewCount: 'desc' }, take: limit })
  }

  async getBySlug(slug: string) {
    const item = await this.prisma.sideHustle.findUnique({
      where: { slug },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        reviews: { where: { status: 'PUBLISHED' }, orderBy: { scoreOverall: 'desc' }, take: 5 },
      },
    })
    if (!item) throw new NotFoundException('副业不存在')
    return item
  }
}

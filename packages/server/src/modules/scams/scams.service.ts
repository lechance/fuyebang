import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ScamsService {
  constructor(private prisma: PrismaService) {}

  async list(query: any) {
    const where: any = { status: 'VERIFIED' }
    if (query.severity) where.severity = query.severity
    if (query.keyword) where.title = { contains: query.keyword, mode: 'insensitive' }
    const page = query.page || 1
    const ps = query.pageSize || 20
    const [data, total] = await Promise.all([
      this.prisma.scamReport.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * ps, take: ps }),
      this.prisma.scamReport.count({ where }),
    ])
    return { data, meta: { page, pageSize: ps, total, totalPages: Math.ceil(total / ps) } }
  }

  async getById(id: string) {
    const item = await this.prisma.scamReport.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('骗局报告不存在')
    return item
  }

  async create(userId: string, dto: any) {
    return this.prisma.scamReport.create({ data: { ...dto, reporterId: userId, status: 'PENDING' } })
  }

  async stats() {
    const [verified, bySeverity] = await Promise.all([
      this.prisma.scamReport.count({ where: { status: 'VERIFIED' } }),
      this.prisma.scamReport.groupBy({ by: ['severity'], where: { status: 'VERIFIED' }, _count: true }),
    ])
    return { total: verified, bySeverity }
  }

  async tips() {
    return [
      { title: '凡是要先交钱的副业，90%是骗局', severity: 'CRITICAL' },
      { title: '刷单违法，任何刷单兼职都不要碰', severity: 'HIGH' },
      { title: '高回报零风险不存在，保持理性', severity: 'MEDIUM' },
      { title: '核实平台资质，避免个人信息泄露', severity: 'MEDIUM' },
    ]
  }
}

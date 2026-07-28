import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: { type?: string; title?: string; content: string; contactInfo?: string }) {
    return this.prisma.feedback.create({
      data: {
        userId,
        type: (dto.type?.toUpperCase() as any) || 'OTHER',
        title: dto.title || dto.content.slice(0, 50),
        content: dto.content,
        contactInfo: dto.contactInfo || null,
      },
    })
  }

  async list(userId: string) {
    return this.prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async adminList(page = 1, pageSize = 20) {
    const where = {}
    const [data, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: { select: { id: true, nickname: true } } },
      }),
      this.prisma.feedback.count({ where }),
    ])
    return { data, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } }
  }
}

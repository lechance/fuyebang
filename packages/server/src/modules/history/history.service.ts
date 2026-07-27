import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string, entityType?: string) {
    const where: any = { userId }
    if (entityType) where.entityType = entityType
    return this.prisma.browseHistory.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 })
  }

  async record(userId: string, entityType: string, entityId: string) {
    return this.prisma.browseHistory.create({ data: { userId, entityType, entityId } })
  }

  async clear(userId: string) {
    return this.prisma.browseHistory.deleteMany({ where: { userId } })
  }
}

import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string, entityType?: string) {
    const where: any = { userId }
    if (entityType) where.entityType = entityType
    return this.prisma.userFavorite.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  async add(userId: string, entityType: string, entityId: string) {
    const existing = await this.prisma.userFavorite.findUnique({
      where: { userId_entityId_entityType: { userId, entityId, entityType: entityType as any } },
    })
    if (existing) return existing
    return this.prisma.userFavorite.create({ data: { userId, entityId, entityType: entityType as any } })
  }

  async remove(userId: string, entityType: string, entityId: string) {
    return this.prisma.userFavorite.delete({
      where: { userId_entityId_entityType: { userId, entityId, entityType: entityType as any } },
    }).catch(() => null)
  }
}

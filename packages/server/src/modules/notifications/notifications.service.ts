import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }

  async unreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, isRead: false } })
  }

  async markRead(id: string, userId: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } })
    if (!notif || notif.userId !== userId) throw new NotFoundException('通知不存在')
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } })
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({ where: { userId }, data: { isRead: true } })
  }
}

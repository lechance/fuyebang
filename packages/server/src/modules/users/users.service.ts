import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            favorites: true,
            posts: true,
            scamReports: true,
          },
        },
      },
    })
    if (!user) throw new NotFoundException('用户不存在')
    return user
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, nickname: true, avatarUrl: true },
    })
  }
}

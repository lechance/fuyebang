import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } })
  }

  async create(dto: any) {
    return this.prisma.banner.create({ data: dto })
  }

  async update(id: string, dto: any) {
    const existing = await this.prisma.banner.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Banner not found')
    return this.prisma.banner.update({ where: { id }, data: dto })
  }

  async delete(id: string) {
    const existing = await this.prisma.banner.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Banner not found')
    return this.prisma.banner.delete({ where: { id } })
  }
}

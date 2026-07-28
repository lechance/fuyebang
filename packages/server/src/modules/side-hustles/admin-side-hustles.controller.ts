import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RolesGuard } from '../../common/guards/roles.guard'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/hustles')
export class AdminSideHustlesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Query() query: any) {
    const where: any = {}
    if (query.category) where.category = query.category
    if (query.keyword) where.name = { contains: query.keyword, mode: 'insensitive' }
    const page = query.page || 1; const ps = query.pageSize || 20
    const [data, total] = await Promise.all([
      this.prisma.sideHustle.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: (page - 1) * ps, take: ps }),
      this.prisma.sideHustle.count({ where }),
    ])
    return { data, meta: { page, pageSize: ps, total, totalPages: Math.ceil(total / ps) } }
  }

  @Get(':id')
  getById(@Param('id') id: string) { return this.prisma.sideHustle.findUnique({ where: { id } }) }

  @Post()
  create(@Body() dto: any) { return this.prisma.sideHustle.create({ data: dto }) }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) { return this.prisma.sideHustle.update({ where: { id }, data: dto }) }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: { status: string }) {
    return this.prisma.sideHustle.update({ where: { id }, data: { status: dto.status as any } })
  }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.prisma.sideHustle.delete({ where: { id } }) }
}

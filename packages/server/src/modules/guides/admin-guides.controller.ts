import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RolesGuard } from '../../common/guards/roles.guard'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/guides')
export class AdminGuidesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Query() query: any) {
    const where: any = {}
    if (query.category) where.guideCategory = query.category
    const page = query.page || 1; const ps = query.pageSize || 20
    const [data, total] = await Promise.all([
      this.prisma.guide.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: (page - 1) * ps, take: ps }),
      this.prisma.guide.count({ where }),
    ])
    return { data, meta: { page, pageSize: ps, total, totalPages: Math.ceil(total / ps) } }
  }

  @Get(':id')
  getById(@Param('id') id: string) { return this.prisma.guide.findUnique({ where: { id } }) }

  @Post()
  create(@Body() dto: any) { return this.prisma.guide.create({ data: dto }) }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) { return this.prisma.guide.update({ where: { id }, data: dto }) }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: { status: string }) {
    return this.prisma.guide.update({
      where: { id },
      data: { status: dto.status as any, publishedAt: dto.status === 'PUBLISHED' ? new Date() : undefined },
    })
  }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.prisma.guide.delete({ where: { id } }) }
}

@Controller('admin/tools')
export class AdminToolsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query() query: any) {
    const where: any = {}
    if (query.category) where.category = query.category
    return this.prisma.tool.findMany({ where, orderBy: { isRecommended: 'desc' } })
  }

  @Post()
  create(@Body() dto: any) { return this.prisma.tool.create({ data: dto }) }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) { return this.prisma.tool.update({ where: { id }, data: dto }) }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.prisma.tool.delete({ where: { id } }) }
}

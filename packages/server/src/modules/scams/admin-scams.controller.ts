import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RolesGuard } from '../../common/guards/roles.guard'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/scams')
export class AdminScamsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Query() query: any) {
    const where: any = {}
    if (query.status) where.status = query.status
    const page = query.page || 1
    const ps = query.pageSize || 20
    const [data, total] = await Promise.all([
      this.prisma.scamReport.findMany({
        where, orderBy: { createdAt: 'desc' },
        skip: (page - 1) * ps, take: ps,
      }),
      this.prisma.scamReport.count({ where }),
    ])
    return { data, meta: { page, pageSize: ps, total, totalPages: Math.ceil(total / ps) } }
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: { status: string; preventionTips?: string },
  ) {
    const data: any = { status: dto.status as any }
    if (dto.preventionTips !== undefined) data.preventionTips = dto.preventionTips
    return this.prisma.scamReport.update({ where: { id }, data })
  }
}

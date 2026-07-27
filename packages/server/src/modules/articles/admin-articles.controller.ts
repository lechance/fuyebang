import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ArticlesService } from './articles.service'
import { RolesGuard } from '../../common/guards/roles.guard'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { PrismaService } from '../../prisma/prisma.service'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/articles')
export class AdminArticlesController {
  constructor(
    private articlesService: ArticlesService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async list(@Query() query: any) {
    const where: any = {}
    if (query.status) where.status = query.status
    if (query.type) where.articleType = query.type
    const page = query.page || 1
    const ps = query.pageSize || 20
    const [data, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * ps, take: ps,
      }),
      this.prisma.article.count({ where }),
    ])
    return { data, meta: { page, pageSize: ps, total, totalPages: Math.ceil(total / ps) } }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.prisma.article.findUnique({ where: { id } })
  }

  @Post()
  async create(@Body() dto: any) {
    return this.prisma.article.create({
      data: { ...dto, authorName: dto.authorName || '管理员' },
    })
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.prisma.article.update({ where: { id }, data: dto })
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: { status: string }) {
    return this.prisma.article.update({
      where: { id },
      data: { status: dto.status as any, publishedAt: dto.status === 'PUBLISHED' ? new Date() : undefined },
    })
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.prisma.article.delete({ where: { id } })
  }
}

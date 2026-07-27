import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RolesGuard } from '../../common/guards/roles.guard'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { Public } from '../../common/decorators/public.decorator'

@Controller()
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get('categories')
  list() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
    })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('admin/categories')
  create(@Body() dto: { name: string; slug: string; icon?: string; parentId?: string; sortOrder?: number }) {
    return this.prisma.category.create({ data: dto })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Put('admin/categories/:id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.prisma.category.update({ where: { id }, data: dto })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete('admin/categories/:id')
  delete(@Param('id') id: string) {
    return this.prisma.category.update({ where: { id }, data: { isActive: false } })
  }
}

@Controller()
export class TagsController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get('tags')
  list() {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('admin/tags')
  create(@Body() dto: { name: string; slug: string; color?: string }) {
    return this.prisma.tag.create({ data: dto })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete('admin/tags/:id')
  delete(@Param('id') id: string) {
    return this.prisma.tag.delete({ where: { id } })
  }
}

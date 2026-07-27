import { Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common'
import { FavoritesService } from './favorites.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@UseGuards(JwtAuthGuard)
@Controller('users/favorites')
export class FavoritesController {
  constructor(private readonly service: FavoritesService) {}

  @Get()
  list(@CurrentUser('id') userId: string, @Query('type') type: string) {
    return this.service.list(userId, type)
  }

  @Post(':entityType/:entityId')
  add(@CurrentUser('id') userId: string, @Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.service.add(userId, entityType, entityId)
  }

  @Delete(':entityType/:entityId')
  remove(@CurrentUser('id') userId: string, @Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.service.remove(userId, entityType, entityId)
  }
}

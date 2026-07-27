import { Controller, Get, Post, Delete, Query, UseGuards } from '@nestjs/common'
import { HistoryService } from './history.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@UseGuards(JwtAuthGuard)
@Controller('users/history')
export class HistoryController {
  constructor(private readonly service: HistoryService) {}

  @Get()
  list(@CurrentUser('id') userId: string, @Query('entityType') entityType: string) {
    return this.service.list(userId, entityType)
  }

  @Post()
  record(@CurrentUser('id') userId: string, @Query('entityType') entityType: string, @Query('entityId') entityId: string) {
    return this.service.record(userId, entityType, entityId)
  }

  @Delete()
  clear(@CurrentUser('id') userId: string) {
    return this.service.clear(userId)
  }
}

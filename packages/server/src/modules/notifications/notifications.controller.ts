import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  list(@CurrentUser('id') userId: string) {
    return this.service.list(userId)
  }

  @Get('unread-count')
  unreadCount(@CurrentUser('id') userId: string) {
    return this.service.unreadCount(userId)
  }

  @Put(':id/read')
  markRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.markRead(id, userId)
  }

  @Put('read-all')
  markAllRead(@CurrentUser('id') userId: string) {
    return this.service.markAllRead(userId)
  }
}

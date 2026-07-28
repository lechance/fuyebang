import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { FeedbackService } from './feedback.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'

@Controller()
export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  @UseGuards(JwtAuthGuard)
  @Post('v1/feedback')
  create(@CurrentUser('id') userId: string, @Body() dto: { type?: string; title?: string; content: string; contactInfo?: string }) {
    return this.service.create(userId, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('v1/feedback')
  list(@CurrentUser('id') userId: string) {
    return this.service.list(userId)
  }
}

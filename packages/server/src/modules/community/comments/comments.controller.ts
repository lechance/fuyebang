import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'
import { Public } from '../../../common/decorators/public.decorator'

@Controller('community/posts/:postId/comments')
export class CommentsController {
  constructor(private readonly service: CommentsService) {}

  @Public() @Get() list(@Param('postId') postId: string, @Query() q: any) { return this.service.list(postId, q) }
  @UseGuards(JwtAuthGuard) @Post() create(@Param('postId') postId: string, @CurrentUser('id') uid: string, @Body() dto: any) { return this.service.create(postId, uid, dto) }
  @UseGuards(JwtAuthGuard) @Delete(':id') delete(@Param('id') id: string, @CurrentUser('id') uid: string) { return this.service.delete(id, uid) }
}

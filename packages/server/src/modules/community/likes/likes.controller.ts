import { Controller, Post, Param, UseGuards } from '@nestjs/common'
import { LikesService } from './likes.service'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'

@Controller('community/posts/:postId/like')
export class LikesController {
  constructor(private readonly service: LikesService) {}
  @UseGuards(JwtAuthGuard) @Post() toggle(@Param('postId') postId: string, @CurrentUser('id') uid: string) { return this.service.toggle(postId, uid) }
}

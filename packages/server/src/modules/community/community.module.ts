import { Module } from '@nestjs/common'
import { PostsController } from './posts/posts.controller'
import { PostsService } from './posts/posts.service'
import { CommentsController } from './comments/comments.controller'
import { CommentsService } from './comments/comments.service'
import { LikesController } from './likes/likes.controller'
import { LikesService } from './likes/likes.service'

@Module({
  controllers: [PostsController, CommentsController, LikesController],
  providers: [PostsService, CommentsService, LikesService],
})
export class CommunityModule {}

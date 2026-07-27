import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { PostsService } from './posts.service'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'
import { Public } from '../../../common/decorators/public.decorator'

@Controller('community/posts')
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Public() @Get() list(@Query() q: any) { return this.service.list(q) }
  @Public() @Get('hot-tags') hotTags() { return this.service.hotTags() }
  @Public() @Get(':id') getById(@Param('id') id: string) { return this.service.getById(id) }
  @UseGuards(JwtAuthGuard) @Post() create(@CurrentUser('id') uid: string, @Body() dto: any) { return this.service.create(uid, dto) }
  @UseGuards(JwtAuthGuard) @Delete(':id') delete(@Param('id') id: string, @CurrentUser('id') uid: string) { return this.service.delete(id, uid) }
}

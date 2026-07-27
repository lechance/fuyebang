import { Controller, Get, Param, Query } from '@nestjs/common'
import { ArticlesService } from './articles.service'
import { Public } from '../../common/decorators/public.decorator'

@Controller('articles')
export class ArticlesController {
  constructor(private readonly service: ArticlesService) {}

  @Public() @Get() list(@Query() query: any) { return this.service.list(query) }
  @Public() @Get('featured') featured(@Query('limit') limit?: number) { return this.service.featured(limit) }
  @Public() @Get('related') related(@Query('articleId') articleId: string, @Query('limit') limit?: number) { return this.service.related(articleId, limit) }
  @Public() @Get(':id') getById(@Param('id') id: string) { return this.service.getById(id) }
}

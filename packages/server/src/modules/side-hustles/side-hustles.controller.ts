import { Controller, Get, Param, Query } from '@nestjs/common'
import { SideHustlesService } from './side-hustles.service'
import { Public } from '../../common/decorators/public.decorator'

@Controller('hustles')
export class SideHustlesController {
  constructor(private readonly service: SideHustlesService) {}

  @Public() @Get() list(@Query() query: any) { return this.service.list(query) }
  @Public() @Get('hot') hot(@Query('limit') limit?: number) { return this.service.hot(limit) }
  @Public() @Get('featured') featured(@Query('limit') limit?: number) { return this.service.featured(limit) }
  @Public() @Get(':slug') getBySlug(@Param('slug') slug: string) { return this.service.getBySlug(slug) }
}

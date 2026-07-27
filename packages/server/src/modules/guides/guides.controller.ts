import { Controller, Get, Param, Query } from '@nestjs/common'
import { GuidesService } from './guides.service'
import { Public } from '../../common/decorators/public.decorator'

@Controller('guides')
export class GuidesController {
  constructor(private readonly service: GuidesService) {}
  @Public() @Get() list(@Query() q: any) { return this.service.list(q) }
  @Public() @Get('featured') featured(@Query('limit') l?: number) { return this.service.featured(l) }
  @Public() @Get(':id') getById(@Param('id') id: string) { return this.service.getById(id) }
}

@Controller('tools')
export class ToolsController {
  constructor(private readonly service: GuidesService) {}
  @Public() @Get() list(@Query() q: any) { return this.service.listTools(q) }
}

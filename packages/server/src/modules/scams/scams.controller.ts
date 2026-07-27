import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ScamsService } from './scams.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'

@Controller('scams')
export class ScamsController {
  constructor(private readonly service: ScamsService) {}

  @Public() @Get() list(@Query() q: any) { return this.service.list(q) }
  @Public() @Get('stats') stats() { return this.service.stats() }
  @Public() @Get('prevention-tips') tips() { return this.service.tips() }
  @Public() @Get(':id') getById(@Param('id') id: string) { return this.service.getById(id) }
  @UseGuards(JwtAuthGuard) @Post() create(@CurrentUser('id') uid: string, @Body() dto: any) { return this.service.create(uid, dto) }
}

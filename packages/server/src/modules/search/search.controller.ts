import { Controller, Get, Query } from '@nestjs/common'
import { SearchService } from './search.service'
import { Public } from '../../common/decorators/public.decorator'

@Public()
@Controller('search')
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @Get()
  search(@Query('keyword') keyword: string, @Query('type') type: string, @Query('page') page?: number) {
    return this.service.search(keyword, type, page)
  }

  @Get('suggest')
  suggest(@Query('keyword') keyword: string) {
    return this.service.suggest(keyword)
  }
}

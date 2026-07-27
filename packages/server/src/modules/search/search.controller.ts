import { Controller, Get, Query } from '@nestjs/common'
import { SearchService } from './search.service'
import { Public } from '../../common/decorators/public.decorator'

@Public()
@Controller()
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @Get('search')
  search(
    @Query('keyword') keyword: string,
    @Query('type') type: string,
    @Query('page') page?: number,
  ) {
    return this.service.search(keyword, type, page)
  }

  @Get('search/suggest')
  suggest(@Query('keyword') keyword: string) {
    return this.service.suggest(keyword)
  }

  @Get('home/hot-searches')
  hotSearches(@Query('limit') limit?: number) {
    return this.service.getHotSearches(limit)
  }
}

import { Controller, Get, Query } from '@nestjs/common'
import { HomeService } from './home.service'
import { Public } from '../../common/decorators/public.decorator'

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Public()
  @Get()
  getHome(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.homeService.getHomeFeed(page, pageSize)
  }

  @Public()
  @Get('banners')
  getBanners(@Query('position') position?: string) {
    return this.homeService.getBanners(position)
  }

  @Public()
  @Get('recommended')
  getRecommended(@Query('limit') limit?: number) {
    return this.homeService.getRecommended(limit)
  }

  @Public()
  @Get('news-feed')
  getNewsFeed(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.homeService.getNewsFeed(page, pageSize)
  }

  @Public()
  @Get('hot-searches')
  getHotSearches() {
    return this.homeService.getHotSearches()
  }
}

import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { QueryReviewDto } from './dto/query-review.dto'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get()
  list(@Query() query: QueryReviewDto) {
    return this.reviewsService.list(query)
  }

  @Public()
  @Get('ranking')
  ranking(@Query('dimension') dimension: string, @Query('limit') limit?: number) {
    return this.reviewsService.ranking(dimension, limit)
  }

  @Public()
  @Get('featured')
  featured(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.reviewsService.featured(page, pageSize)
  }

  @Public()
  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.reviewsService.getBySlug(slug)
  }

  @Public()
  @Get(':slug/steps')
  getSteps(@Param('slug') slug: string) {
    return this.reviewsService.getSteps(slug)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(userId, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.reviewsService.delete(id)
  }
}

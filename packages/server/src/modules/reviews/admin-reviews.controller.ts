import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { RolesGuard } from '../../common/guards/roles.guard'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/reviews')
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  list(@Query() query: any) {
    return this.reviewsService.adminList(query)
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.reviewsService.getById(id)
  }

  @Post()
  create(@Body() dto: CreateReviewDto) {
    // In admin, use first admin user as author
    return this.reviewsService.create('admin', dto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, dto)
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: { status: string }) {
    return this.reviewsService.updateStatus(id, dto.status)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.reviewsService.delete(id)
  }

  // Step management
  @Get(':id/steps')
  getSteps(@Param('id') id: string) {
    return this.reviewsService.getStepsByReviewId(id)
  }

  @Put(':id/steps')
  updateSteps(
    @Param('id') id: string,
    @Body() dto: { steps: { stepNumber: number; title: string; content: string; imageUrl?: string }[] },
  ) {
    return this.reviewsService.createSteps(id, dto.steps)
  }
}

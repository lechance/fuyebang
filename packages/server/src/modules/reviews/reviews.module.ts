import { Module } from '@nestjs/common'
import { ReviewsController } from './reviews.controller'
import { AdminReviewsController } from './admin-reviews.controller'
import { CategoriesController, TagsController } from './categories.controller'
import { ReviewsService } from './reviews.service'

@Module({
  controllers: [ReviewsController, AdminReviewsController, CategoriesController, TagsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}

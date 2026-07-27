import { PartialType } from '@nestjs/common'
import { CreateReviewDto } from './create-review.dto'

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}

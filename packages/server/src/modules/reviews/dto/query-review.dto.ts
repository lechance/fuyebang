import { IsOptional, IsString, IsEnum, Min, Max } from 'class-validator'
import { PaginationDto } from '../../../common/dto/pagination.dto'
import { ReviewDifficulty, SortOrder } from '@prisma/client'

export class QueryReviewDto extends PaginationDto {
  @IsOptional()
  @IsString()
  keyword?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  tag?: string

  @IsOptional()
  @IsString()
  sortBy?: 'overall' | 'earnings' | 'newest' | 'views' | 'difficulty'

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder

  @IsOptional()
  @Min(0) @Max(10)
  minScore?: number

  @IsOptional()
  @Min(0) @Max(10)
  maxScore?: number

  @IsOptional()
  @IsEnum(ReviewDifficulty)
  difficulty?: ReviewDifficulty
}

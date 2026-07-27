import { IsString, IsOptional, IsNumber, IsArray, Min, Max, IsEnum, IsDecimal } from 'class-validator'
import { ReviewDifficulty } from '@prisma/client'

export class CreateReviewDto {
  @IsString()
  title: string

  @IsString()
  summary: string

  @IsString()
  content: string

  @IsOptional()
  @IsString()
  coverImage?: string

  @IsString()
  slug: string

  @IsNumber()
  @Min(0) @Max(10)
  scoreEarnings: number

  @IsNumber()
  @Min(0) @Max(10)
  scoreRisk: number

  @IsNumber()
  @Min(0) @Max(10)
  scoreMarketStability: number

  @IsNumber()
  @Min(0) @Max(10)
  scoreDifficulty: number

  @IsNumber()
  @Min(0) @Max(10)
  scoreCompliance: number

  @IsOptional()
  @IsNumber()
  incomeMin?: number

  @IsOptional()
  @IsNumber()
  incomeMax?: number

  @IsOptional()
  @IsEnum(ReviewDifficulty)
  difficulty?: ReviewDifficulty

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pros?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cons?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scamAlerts?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[]

  @IsOptional()
  @IsString()
  timeCommitment?: string

  @IsOptional()
  @IsNumber()
  startupCost?: number

  @IsOptional()
  @IsString()
  sideHustleId?: string
}

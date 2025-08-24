import { IsString, IsNumber, IsDateString, IsEnum, IsArray, IsOptional, Min, Max, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// Requirements DTO
export class CampaignRequirementsDto {
  @ApiProperty({ description: 'Minimum followers required' })
  @IsNumber()
  @Min(0)
  minFollowers: number;

  @ApiProperty({ description: 'Minimum engagement rate required' })
  @IsNumber()
  @Min(0)
  @Max(100)
  minEngagement: number;

  @ApiProperty({ description: 'Content guidelines' })
  @IsArray()
  @IsString({ each: true })
  contentGuidelines: string[];

  @ApiProperty({ description: 'Required hashtags' })
  @IsArray()
  @IsString({ each: true })
  hashtags: string[];

  @ApiProperty({ description: 'Required mentions' })
  @IsArray()
  @IsString({ each: true })
  mentions: string[];
}

// Metadata DTO
export class CampaignMetadataDto {
  @ApiPropertyOptional({ description: 'Campaign tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Campaign category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Target audience' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetAudience?: string[];

  @ApiPropertyOptional({ description: 'Estimated reach' })
  @IsOptional()
  @IsNumber()
  estimatedReach?: number;
}

export class CreateCampaignDto {
  @ApiProperty({ description: 'Campaign title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Campaign description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Brand name' })
  @IsString()
  brandName: string;

  @ApiProperty({ description: 'Brand logo URL' })
  @IsString()
  brandLogo: string;

  @ApiProperty({ description: 'Social media platform', enum: ['twitter', 'instagram', 'youtube', 'tiktok', 'all'] })
  @IsEnum(['twitter', 'instagram', 'youtube', 'tiktok', 'all'])
  platform: 'twitter' | 'instagram' | 'youtube' | 'tiktok' | 'all';

  @ApiProperty({ description: 'Type of engagement required', enum: ['like', 'comment', 'share', 'follow', 'retweet', 'subscribe'] })
  @IsEnum(['like', 'comment', 'share', 'follow', 'retweet', 'subscribe'])
  engagementType: 'like' | 'comment' | 'share' | 'follow' | 'retweet' | 'subscribe';

  @ApiProperty({ description: 'Reward amount per engagement' })
  @IsNumber()
  @Min(0)
  rewardAmount: number;

  @ApiProperty({ description: 'Reward token (USDC, AVAX, etc.)' })
  @IsString()
  rewardToken: string;

  @ApiProperty({ description: 'Maximum number of participants' })
  @IsNumber()
  @Min(1)
  maxParticipants: number;

  @ApiProperty({ description: 'Campaign start date' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Campaign end date' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Campaign status', enum: ['draft', 'active', 'paused', 'completed', 'cancelled'] })
  @IsEnum(['draft', 'active', 'paused', 'completed', 'cancelled'])
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

  @ApiProperty({ description: 'Campaign requirements' })
  @ValidateNested()
  @Type(() => CampaignRequirementsDto)
  requirements: CampaignRequirementsDto;

  @ApiProperty({ description: 'Smart contract address' })
  @IsString()
  contractAddress: string;

  @ApiProperty({ description: 'Smart contract ID' })
  @IsString()
  contractId: string;

  @ApiProperty({ description: 'Total campaign budget' })
  @IsNumber()
  @Min(0)
  totalBudget: number;

  @ApiPropertyOptional({ description: 'Campaign metadata' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CampaignMetadataDto)
  metadata?: CampaignMetadataDto;
}

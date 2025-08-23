import { IsString, IsEnum, IsArray, IsOptional, IsUrl, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Metadata DTO for engagement
export class EngagementMetadataDto {
  @ApiPropertyOptional({ description: 'Number of followers' })
  @IsOptional()
  @IsNumber()
  followers?: number;

  @ApiPropertyOptional({ description: 'Engagement rate' })
  @IsOptional()
  @IsNumber()
  engagement?: number;

  @ApiPropertyOptional({ description: 'Content reach' })
  @IsOptional()
  @IsNumber()
  reach?: number;

  @ApiPropertyOptional({ description: 'Content impressions' })
  @IsOptional()
  @IsNumber()
  impressions?: number;

  @ApiPropertyOptional({ description: 'Number of likes' })
  @IsOptional()
  @IsNumber()
  likes?: number;

  @ApiPropertyOptional({ description: 'Number of comments' })
  @IsOptional()
  @IsNumber()
  comments?: number;

  @ApiPropertyOptional({ description: 'Number of shares' })
  @IsOptional()
  @IsNumber()
  shares?: number;
}

export class CreateEngagementDto {
  @ApiProperty({ description: 'Campaign ID' })
  @IsString()
  campaignId: string;

  @ApiProperty({ description: 'Social media platform', enum: ['twitter', 'instagram', 'youtube', 'tiktok'] })
  @IsEnum(['twitter', 'instagram', 'youtube', 'tiktok'])
  platform: 'twitter' | 'instagram' | 'youtube' | 'tiktok';

  @ApiProperty({ description: 'Type of engagement', enum: ['like', 'comment', 'share', 'follow', 'retweet', 'subscribe'] })
  @IsEnum(['like', 'comment', 'share', 'follow', 'retweet', 'subscribe'])
  engagementType: 'like' | 'comment' | 'share' | 'follow' | 'retweet' | 'subscribe';

  @ApiProperty({ description: 'Content URL' })
  @IsUrl()
  contentUrl: string;

  @ApiProperty({ description: 'Platform-specific content ID' })
  @IsString()
  contentId: string;

  @ApiProperty({ description: 'Content text' })
  @IsString()
  contentText: string;

  @ApiProperty({ description: 'Hashtags used' })
  @IsArray()
  @IsString({ each: true })
  hashtags: string[];

  @ApiProperty({ description: 'Mentions in content' })
  @IsArray()
  @IsString({ each: true })
  mentions: string[];

  @ApiPropertyOptional({ description: 'Engagement metadata' })
  @IsOptional()
  metadata?: EngagementMetadataDto;
}

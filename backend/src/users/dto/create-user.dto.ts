import { IsEmail, IsString, IsOptional, MinLength, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Username for the account' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'User first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: 'User avatar URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: 'User role', enum: ['clipper', 'brand', 'admin'] })
  @IsOptional()
  @IsEnum(['clipper', 'brand', 'admin'])
  role?: 'clipper' | 'brand' | 'admin';

  @ApiPropertyOptional({ description: 'User wallet address' })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  // Brand-specific fields
  @ApiPropertyOptional({ description: 'Company name (required for brand role)' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ description: 'Company website' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'Company description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Company industry' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ description: 'Team size' })
  @IsOptional()
  @IsString()
  teamSize?: string;

  // Content Creator-specific fields
  @ApiPropertyOptional({ description: 'Bio/description for content creators' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Content categories' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({ description: 'Social media links' })
  @IsOptional()
  socialLinks?: Array<{
    platform: string;
    username: string;
    url: string;
    verified?: boolean;
    followers?: number;
  }>;

  @ApiPropertyOptional({ description: 'Social media accounts' })
  @IsOptional()
  socialMediaAccounts?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
  };
}

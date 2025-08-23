import { IsEmail, IsString, IsOptional, MinLength, IsEnum } from 'class-validator';
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

  @ApiPropertyOptional({ description: 'User role', enum: ['user', 'admin', 'brand'] })
  @IsOptional()
  @IsEnum(['user', 'admin', 'brand'])
  role?: 'user' | 'admin' | 'brand';

  @ApiPropertyOptional({ description: 'User wallet address' })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @ApiPropertyOptional({ description: 'Social media accounts' })
  @IsOptional()
  socialMediaAccounts?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
}

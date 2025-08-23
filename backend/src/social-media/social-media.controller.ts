import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SocialMediaService } from './social-media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('social-media')
@Controller('social-media')
export class SocialMediaController {
  constructor(private readonly socialMediaService: SocialMediaService) {}

  @Post('verify-twitter')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Twitter engagement' })
  @ApiResponse({ status: 200, description: 'Twitter engagement verified' })
  async verifyTwitterEngagement(@Body() data: any, @Request() req) {
    return this.socialMediaService.verifyTwitterEngagement(data, req.user.id);
  }

  @Post('verify-instagram')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Instagram engagement' })
  @ApiResponse({ status: 200, description: 'Instagram engagement verified' })
  async verifyInstagramEngagement(@Body() data: any, @Request() req) {
    return this.socialMediaService.verifyInstagramEngagement(data, req.user.id);
  }

  @Post('verify-youtube')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify YouTube engagement' })
  @ApiResponse({ status: 200, description: 'YouTube engagement verified' })
  async verifyYouTubeEngagement(@Body() data: any, @Request() req) {
    return this.socialMediaService.verifyYouTubeEngagement(data, req.user.id);
  }

  @Post('verify-tiktok')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify TikTok engagement' })
  @ApiResponse({ status: 200, description: 'TikTok engagement verified' })
  async verifyTikTokEngagement(@Body() data: any, @Request() req) {
    return this.socialMediaService.verifyTikTokEngagement(data, req.user.id);
  }

  @Get('metrics/:platform/:contentId')
  @ApiOperation({ summary: 'Get social media metrics' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved' })
  async getMetrics(@Param('platform') platform: string, @Param('contentId') contentId: string) {
    return this.socialMediaService.getMetrics(platform, contentId);
  }
}

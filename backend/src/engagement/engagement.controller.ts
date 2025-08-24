import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EngagementService } from './engagement.service';
import { CreateEngagementDto, UpdateEngagementDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('engagements')
@Controller('engagements')
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a new engagement' })
  @ApiResponse({ status: 201, description: 'Engagement submitted successfully' })
  async submitEngagement(@Body() createEngagementDto: CreateEngagementDto, @Request() req) {
    return this.engagementService.create(createEngagementDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all engagements' })
  @ApiResponse({ status: 200, description: 'Engagements retrieved successfully' })
  async getAllEngagements(@Query() query: any) {
    return this.engagementService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get engagement by ID' })
  @ApiResponse({ status: 200, description: 'Engagement retrieved successfully' })
  async getEngagementById(@Param('id') id: string) {
    return this.engagementService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update engagement' })
  @ApiResponse({ status: 200, description: 'Engagement updated successfully' })
  async updateEngagement(@Param('id') id: string, @Body() updateEngagementDto: UpdateEngagementDto) {
    return this.engagementService.update(id, updateEngagementDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete engagement' })
  @ApiResponse({ status: 200, description: 'Engagement deleted successfully' })
  async deleteEngagement(@Param('id') id: string) {
    return this.engagementService.delete(id);
  }

  @Post(':id/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify engagement' })
  @ApiResponse({ status: 200, description: 'Engagement verified successfully' })
  async verifyEngagement(@Param('id') id: string, @Request() req) {
    return this.engagementService.verify(id, req.user.id);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject engagement' })
  @ApiResponse({ status: 200, description: 'Engagement rejected successfully' })
  async rejectEngagement(@Param('id') id: string, @Body() rejectionData: { reason: string }, @Request() req) {
    return this.engagementService.reject(id, rejectionData.reason, req.user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get engagements by user' })
  @ApiResponse({ status: 200, description: 'User engagements retrieved' })
  async getEngagementsByUser(@Param('userId') userId: string) {
    return this.engagementService.findByUser(userId);
  }

  @Get('campaign/:campaignId')
  @ApiOperation({ summary: 'Get engagements by campaign' })
  @ApiResponse({ status: 200, description: 'Campaign engagements retrieved' })
  async getEngagementsByCampaign(@Param('campaignId') campaignId: string) {
    return this.engagementService.findByCampaign(campaignId);
  }
}

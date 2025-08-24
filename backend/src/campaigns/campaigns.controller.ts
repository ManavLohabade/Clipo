import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully' })
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto, @Request() req) {
    return this.campaignsService.create(createCampaignDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({ status: 200, description: 'Campaigns retrieved successfully' })
  async getAllCampaigns(@Query() query: any) {
    return this.campaignsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  @ApiResponse({ status: 200, description: 'Campaign retrieved successfully' })
  async getCampaignById(@Param('id') id: string) {
    return this.campaignsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update campaign' })
  @ApiResponse({ status: 200, description: 'Campaign updated successfully' })
  async updateCampaign(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete campaign' })
  @ApiResponse({ status: 200, description: 'Campaign deleted successfully' })
  async deleteCampaign(@Param('id') id: string) {
    return this.campaignsService.delete(id);
  }

  @Get('brand/:brandId')
  @ApiOperation({ summary: 'Get campaigns by brand' })
  @ApiResponse({ status: 200, description: 'Brand campaigns retrieved' })
  async getCampaignsByBrand(@Param('brandId') brandId: string) {
    return this.campaignsService.findByBrand(brandId);
  }

  @Get('platform/:platform')
  @ApiOperation({ summary: 'Get campaigns by platform' })
  @ApiResponse({ status: 200, description: 'Platform campaigns retrieved' })
  async getCampaignsByPlatform(@Param('platform') platform: string) {
    return this.campaignsService.findByPlatform(platform);
  }
}

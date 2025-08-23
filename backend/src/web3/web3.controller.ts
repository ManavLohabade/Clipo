import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Web3Service } from './web3.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('web3')
@Controller('web3')
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  @Get('network')
  @ApiOperation({ summary: 'Get network information' })
  @ApiResponse({ status: 200, description: 'Network info retrieved' })
  async getNetworkInfo() {
    return this.web3Service.getNetworkInfo();
  }

  @Post('deploy-campaign')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deploy campaign contract' })
  @ApiResponse({ status: 201, description: 'Campaign deployed successfully' })
  async deployCampaign(@Body() campaignData: any, @Request() req) {
    return this.web3Service.deployCampaign(campaignData, req.user.id);
  }

  @Post('distribute-reward')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Distribute reward to user' })
  @ApiResponse({ status: 200, description: 'Reward distributed successfully' })
  async distributeReward(@Body() rewardData: any, @Request() req) {
    return this.web3Service.distributeReward(rewardData, req.user.id);
  }

  @Get('balance/:address')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved' })
  async getBalance(@Param('address') address: string) {
    return this.web3Service.getBalance(address);
  }

  @Get('campaign/:address')
  @ApiOperation({ summary: 'Get campaign contract info' })
  @ApiResponse({ status: 200, description: 'Campaign info retrieved' })
  async getCampaignInfo(@Param('address') address: string) {
    return this.web3Service.getCampaignInfo(address);
  }
}

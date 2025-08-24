import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { CreateCampaignDto, UpdateCampaignDto } from './dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto, brandId: string): Promise<Campaign> {
    const campaign = new this.campaignModel({
      ...createCampaignDto,
      brandId: new Types.ObjectId(brandId),
      currentParticipants: 0,
      totalEngagements: 0,
      totalRewardsDistributed: 0,
      engagements: [],
    });
    return campaign.save();
  }

  async findAll(query: any = {}): Promise<Campaign[]> {
    const filter: any = {};
    
    if (query.platform) filter.platform = query.platform;
    if (query.status) filter.status = query.status;
    if (query.brandId) filter.brandId = new Types.ObjectId(query.brandId);
    
    return this.campaignModel.find(filter)
      .populate('brandId', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(id)
      .populate('brandId', 'username firstName lastName')
      .populate('engagements')
      .exec();
    
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }
    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.campaignModel.findByIdAndUpdate(
      id, 
      updateCampaignDto, 
      { new: true }
    ).exec();
    
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }
    return campaign;
  }

  async delete(id: string): Promise<void> {
    const result = await this.campaignModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Campaign not found');
    }
  }

  async findByBrand(brandId: string): Promise<Campaign[]> {
    return this.campaignModel.find({ brandId: new Types.ObjectId(brandId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByPlatform(platform: string): Promise<Campaign[]> {
    return this.campaignModel.find({ platform })
      .populate('brandId', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateParticipantCount(id: string, increment: boolean = true): Promise<void> {
    const update = increment 
      ? { $inc: { currentParticipants: 1 } }
      : { $inc: { currentParticipants: -1 } };
    
    await this.campaignModel.findByIdAndUpdate(id, update).exec();
  }

  async updateEngagementCount(id: string, increment: boolean = true): Promise<void> {
    const update = increment 
      ? { $inc: { totalEngagements: 1 } }
      : { $inc: { totalEngagements: -1 } };
    
    await this.campaignModel.findByIdAndUpdate(id, update).exec();
  }
}

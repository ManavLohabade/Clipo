import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Engagement, EngagementDocument } from './schemas/engagement.schema';
import { CreateEngagementDto, UpdateEngagementDto } from './dto';

@Injectable()
export class EngagementService {
  constructor(
    @InjectModel(Engagement.name) private engagementModel: Model<EngagementDocument>,
  ) {}

  async create(createEngagementDto: CreateEngagementDto, userId: string): Promise<Engagement> {
    const engagement = new this.engagementModel({
      ...createEngagementDto,
      userId: new Types.ObjectId(userId),
      status: 'pending',
      rewardAmount: 0, // Will be set based on campaign
      rewardToken: 'USDC', // Default token
    });
    return engagement.save();
  }

  async findAll(query: any = {}): Promise<Engagement[]> {
    const filter: any = {};
    
    if (query.platform) filter.platform = query.platform;
    if (query.status) filter.status = query.status;
    if (query.userId) filter.userId = new Types.ObjectId(query.userId);
    if (query.campaignId) filter.campaignId = new Types.ObjectId(query.campaignId);
    
    return this.engagementModel.find(filter)
      .populate('userId', 'username firstName lastName')
      .populate('campaignId', 'title brandName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Engagement> {
    const engagement = await this.engagementModel.findById(id)
      .populate('userId', 'username firstName lastName')
      .populate('campaignId', 'title brandName')
      .exec();
    
    if (!engagement) {
      throw new NotFoundException('Engagement not found');
    }
    return engagement;
  }

  async update(id: string, updateEngagementDto: UpdateEngagementDto): Promise<Engagement> {
    const engagement = await this.engagementModel.findByIdAndUpdate(
      id, 
      updateEngagementDto, 
      { new: true }
    ).exec();
    
    if (!engagement) {
      throw new NotFoundException('Engagement not found');
    }
    return engagement;
  }

  async delete(id: string): Promise<void> {
    const result = await this.engagementModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Engagement not found');
    }
  }

  async verify(id: string, verifiedBy: string): Promise<Engagement> {
    const engagement = await this.engagementModel.findByIdAndUpdate(
      id,
      {
        status: 'verified',
        verificationDate: new Date(),
        verifiedBy: new Types.ObjectId(verifiedBy),
      },
      { new: true }
    ).exec();

    if (!engagement) {
      throw new NotFoundException('Engagement not found');
    }
    return engagement;
  }

  async reject(id: string, reason: string, rejectedBy: string): Promise<Engagement> {
    const engagement = await this.engagementModel.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        rejectionReason: reason,
        verifiedBy: new Types.ObjectId(rejectedBy),
      },
      { new: true }
    ).exec();

    if (!engagement) {
      throw new NotFoundException('Engagement not found');
    }
    return engagement;
  }

  async findByUser(userId: string): Promise<Engagement[]> {
    return this.engagementModel.find({ userId: new Types.ObjectId(userId) })
      .populate('campaignId', 'title brandName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCampaign(campaignId: string): Promise<Engagement[]> {
    return this.engagementModel.find({ campaignId: new Types.ObjectId(campaignId) })
      .populate('userId', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateReward(id: string, rewardAmount: number, rewardToken: string, transactionHash?: string): Promise<Engagement> {
    const update: any = {
      rewardAmount,
      rewardToken,
      status: 'rewarded',
      rewardDate: new Date(),
    };

    if (transactionHash) {
      update.rewardTransactionHash = transactionHash;
    }

    const engagement = await this.engagementModel.findByIdAndUpdate(
      id,
      update,
      { new: true }
    ).exec();

    if (!engagement) {
      throw new NotFoundException('Engagement not found');
    }
    return engagement;
  }
}

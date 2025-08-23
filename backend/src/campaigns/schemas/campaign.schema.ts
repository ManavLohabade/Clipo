import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  brandId: Types.ObjectId;

  @Prop({ required: true, enum: ['twitter', 'instagram', 'youtube', 'tiktok'] })
  platform: 'twitter' | 'instagram' | 'youtube' | 'tiktok';

  @Prop({ required: true, enum: ['like', 'comment', 'share', 'follow', 'retweet', 'subscribe'] })
  engagementType: 'like' | 'comment' | 'share' | 'follow' | 'retweet' | 'subscribe';

  @Prop({ required: true, min: 0 })
  rewardAmount: number;

  @Prop({ required: true, min: 1 })
  maxParticipants: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: 'active', enum: ['active', 'paused', 'completed', 'cancelled'] })
  status: 'active' | 'paused' | 'completed' | 'cancelled';

  @Prop({
    type: {
      minFollowers: { type: Number, min: 0 },
      minEngagement: { type: Number, min: 0, max: 100 },
      contentGuidelines: [{ type: String }],
      hashtags: [{ type: String }],
      mentions: [{ type: String }]
    }
  })
  requirements: {
    minFollowers: number;
    minEngagement: number;
    contentGuidelines: string[];
    hashtags: string[];
    mentions: string[];
  };

  @Prop()
  contractAddress?: string;

  @Prop({ required: true, min: 0 })
  totalBudget: number;

  @Prop({ type: [Types.ObjectId], ref: 'Engagement' })
  engagements: Types.ObjectId[];

  @Prop({
    type: {
      tags: [{ type: String }],
      category: { type: String },
      targetAudience: [{ type: String }],
      estimatedReach: { type: Number, min: 0 }
    }
  })
  metadata?: {
    tags?: string[];
    category?: string;
    targetAudience?: string[];
    estimatedReach?: number;
  };

  @Prop({ default: 0 })
  currentParticipants: number;

  @Prop({ default: 0 })
  totalEngagements: number;

  @Prop({ default: 0 })
  totalRewardsDistributed: number;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

// Indexes
CampaignSchema.index({ brandId: 1 });
CampaignSchema.index({ platform: 1 });
CampaignSchema.index({ status: 1 });
CampaignSchema.index({ startDate: 1 });
CampaignSchema.index({ endDate: 1 });
CampaignSchema.index({ 'requirements.minFollowers': 1 });
CampaignSchema.index({ 'metadata.category': 1 });

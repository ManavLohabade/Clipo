import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EngagementDocument = Engagement & Document;

@Schema({ timestamps: true })
export class Engagement {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true })
  campaignId: Types.ObjectId;

  @Prop({ required: true, enum: ['twitter', 'instagram', 'youtube', 'tiktok'] })
  platform: 'twitter' | 'instagram' | 'youtube' | 'tiktok';

  @Prop({ required: true, enum: ['like', 'comment', 'share', 'follow', 'retweet', 'subscribe'] })
  engagementType: 'like' | 'comment' | 'share' | 'follow' | 'retweet' | 'subscribe';

  @Prop({ required: true })
  contentUrl: string;

  @Prop({ required: true })
  contentId: string;

  @Prop({ required: true })
  contentText: string;

  @Prop({ type: [String], required: true })
  hashtags: string[];

  @Prop({ type: [String], required: true })
  mentions: string[];

  @Prop({ default: 'pending', enum: ['pending', 'verified', 'rejected', 'rewarded'] })
  status: 'pending' | 'verified' | 'rejected' | 'rewarded';

  @Prop({ default: 0 })
  rewardAmount: number;

  @Prop({ default: 'USDC' })
  rewardToken: string;

  @Prop()
  rewardTransactionHash?: string;

  @Prop()
  verificationDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  verifiedBy?: Types.ObjectId;

  @Prop()
  rejectionReason?: string;

  @Prop({
    type: {
      followers: { type: Number, min: 0 },
      engagement: { type: Number, min: 0, max: 100 },
      reach: { type: Number, min: 0 },
      impressions: { type: Number, min: 0 },
      likes: { type: Number, min: 0 },
      comments: { type: Number, min: 0 },
      shares: { type: Number, min: 0 }
    }
  })
  metadata?: {
    followers?: number;
    engagement?: number;
    reach?: number;
    impressions?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };

  @Prop()
  rewardDate?: Date;
}

export const EngagementSchema = SchemaFactory.createForClass(Engagement);

// Indexes
EngagementSchema.index({ userId: 1 });
EngagementSchema.index({ campaignId: 1 });
EngagementSchema.index({ platform: 1 });
EngagementSchema.index({ status: 1 });
EngagementSchema.index({ createdAt: -1 });
EngagementSchema.index({ 'metadata.followers': 1 });
EngagementSchema.index({ 'metadata.engagement': 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  avatar?: string;

  @Prop({ default: 'clipper' })
  role: 'clipper' | 'brand' | 'admin';

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  walletAddress?: string;

  // Brand-specific fields
  @Prop()
  companyName?: string;

  @Prop()
  website?: string;

  @Prop()
  description?: string;

  @Prop()
  industry?: string;

  @Prop()
  teamSize?: string;

  // Content Creator-specific fields
  @Prop()
  bio?: string;

  @Prop([String])
  categories?: string[];

  @Prop({
    type: [{
      platform: { type: String, enum: ['twitter', 'instagram', 'youtube', 'tiktok', 'linkedin'] },
      username: String,
      url: String,
      verified: { type: Boolean, default: false },
      followers: Number
    }]
  })
  socialLinks?: Array<{
    platform: string;
    username: string;
    url: string;
    verified: boolean;
    followers?: number;
  }>;

  @Prop({
    type: {
      twitter: { type: String },
      instagram: { type: String },
      youtube: { type: String },
      tiktok: { type: String },
      linkedin: { type: String }
    }
  })
  socialMediaAccounts?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
  };

  @Prop({ type: [Types.ObjectId], ref: 'Campaign' })
  campaigns: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Engagement' })
  engagements: Types.ObjectId[];

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  emailVerifiedAt?: Date;

  // Additional fields for enhanced functionality
  @Prop({ default: 0 })
  totalEarnings?: number;

  @Prop({ default: 0 })
  totalCampaigns?: number;

  @Prop({ default: 0 })
  totalSubmissions?: number;

  @Prop({ default: 0 })
  approvalRate?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes - only define them here, not in the schema properties
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ walletAddress: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'socialMediaAccounts.twitter': 1 });
UserSchema.index({ 'socialMediaAccounts.instagram': 1 });
UserSchema.index({ 'socialMediaAccounts.youtube': 1 });
UserSchema.index({ 'socialMediaAccounts.tiktok': 1 });
UserSchema.index({ 'socialMediaAccounts.linkedin': 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
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

  @Prop({ default: 'user' })
  role: 'user' | 'admin' | 'brand';

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  walletAddress?: string;

  @Prop({
    type: {
      twitter: { type: String },
      instagram: { type: String },
      youtube: { type: String },
      tiktok: { type: String }
    }
  })
  socialMediaAccounts?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };

  @Prop({ type: [Types.ObjectId], ref: 'Campaign' })
  campaigns: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Engagement' })
  engagements: Types.ObjectId[];

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  emailVerifiedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ walletAddress: 1 });
UserSchema.index({ 'socialMediaAccounts.twitter': 1 });
UserSchema.index({ 'socialMediaAccounts.instagram': 1 });
UserSchema.index({ 'socialMediaAccounts.youtube': 1 });
UserSchema.index({ 'socialMediaAccounts.tiktok': 1 });

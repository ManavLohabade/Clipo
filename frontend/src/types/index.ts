import { z } from 'zod';

// Enums
export type UserRole = 'guest' | 'clipper' | 'brand' | 'admin';
export type CampaignStatus = 'draft' | 'pending' | 'live' | 'paused' | 'completed' | 'rejected';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type PayoutType = 'crypto' | 'fiat';
export type CampaignTier = 'basic' | 'premium' | 'elite';
export type Platform = 'x' | 'instagram' | 'youtube' | 'facebook' | 'tiktok';
export type CurrencyType = 'USDC' | 'FIAT';
export type ChainType = 'base' | 'polygon';

// Base User Schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  role: z.enum(['guest', 'clipper', 'brand', 'admin']),
  isKycVerified: z.boolean().default(false),
  // Brand-specific fields
  companyName: z.string().optional(),
  industry: z.string().optional(),
  teamSize: z.string().optional(),
  // Clipper-specific fields
  categories: z.array(z.string()).default([]),
  socialLinks: z.array(z.object({
    platform: z.enum(['x', 'instagram', 'youtube', 'facebook', 'tiktok']),
    username: z.string(),
    url: z.string(),
    verified: z.boolean().default(false),
    followers: z.number().optional(),
  })).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Brand Profile Schema
export const BrandProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  companyName: z.string(),
  website: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  industry: z.string().optional(),
  teamSize: z.string().optional(),
  stripeAccountId: z.string().optional(),
  walletAddress: z.string().optional(),
  preferredCurrency: z.enum(['USDC', 'FIAT']).default('USDC'),
  preferredChains: z.array(z.enum(['base', 'polygon'])).default(['base']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BrandProfile = z.infer<typeof BrandProfileSchema>;

// Clipper Profile Schema
export const ClipperProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bio: z.string().optional(),
  categories: z.array(z.string()).default([]),
  socialLinks: z.array(z.object({
    platform: z.enum(['x', 'instagram', 'youtube', 'facebook', 'tiktok']),
    username: z.string(),
    url: z.string(),
    verified: z.boolean().default(false),
    followers: z.number().optional(),
  })).default([]),
  walletAddress: z.string().optional(),
  stripeAccountId: z.string().optional(),
  payoutPreference: z.enum(['crypto', 'fiat']).default('crypto'),
  referralCode: z.string().optional(),
  totalEarnings: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ClipperProfile = z.infer<typeof ClipperProfileSchema>;

// Payout Rule Schema
export const PayoutRuleSchema = z.object({
  basePerKViews: z.number(),
  engagementBonusRule: z.object({
    threshold: z.number(), // Engagement rate threshold (e.g., 0.1 for 10%)
    multiplier: z.number(), // Bonus multiplier (e.g., 1.5 for 50% bonus)
  }).optional(),
  geoMultipliers: z.record(z.string(), z.number()).optional(), // Country code to multiplier
  minViews: z.number().default(1000),
  maxPayout: z.number().optional(),
});

export type PayoutRule = z.infer<typeof PayoutRuleSchema>;

// Campaign Schema
export const CampaignSchema = z.object({
  id: z.string(),
  brandId: z.string(),
  title: z.string(),
  description: z.string(),
  hashtags: z.array(z.string()).default([]),
  platforms: z.array(z.enum(['x', 'instagram', 'youtube', 'facebook', 'tiktok'])),
  tier: z.enum(['basic', 'premium', 'elite']),
  budgetTotal: z.number(),
  budgetRemaining: z.number(),
  payoutRule: PayoutRuleSchema,
  duration: z.object({
    start: z.date(),
    end: z.date(),
  }),
  status: z.enum(['draft', 'pending', 'live', 'paused', 'completed', 'rejected']),
  funding: z.object({
    currency: z.enum(['USDC', 'FIAT']),
    chains: z.array(z.enum(['base', 'polygon'])).optional(),
    escrowTxHash: z.string().optional(),
    stripeEscrowId: z.string().optional(),
  }),
  aiHints: z.object({
    recommendedHashtags: z.array(z.string()).default([]),
    budgetSuggest: z.number().optional(),
    riskScore: z.number().optional(),
  }).optional(),
  requirements: z.object({
    minFollowers: z.number().optional(),
    minEngagementRate: z.number().optional(),
    allowedCountries: z.array(z.string()).optional(),
    contentGuidelines: z.string().optional(),
  }).optional(),
  metrics: z.object({
    totalSubmissions: z.number().default(0),
    approvedSubmissions: z.number().default(0),
    totalViews: z.number().default(0),
    totalEngagement: z.number().default(0),
    totalSpent: z.number().default(0),
  }).default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Campaign = z.infer<typeof CampaignSchema>;

// Submission Schema
export const SubmissionSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  clipperId: z.string(),
  urls: z.array(z.string()),
  platform: z.enum(['x', 'instagram', 'youtube', 'facebook', 'tiktok']),
  status: z.enum(['pending', 'approved', 'rejected', 'flagged']),
  complianceReport: z.object({
    hashtagsUsed: z.array(z.string()).default([]),
    guidelinesFollowed: z.boolean().default(false),
    contentAppropriate: z.boolean().default(false),
    aiScore: z.number().optional(),
  }).optional(),
  metrics: z.object({
    views: z.number().default(0),
    likes: z.number().default(0),
    comments: z.number().default(0),
    shares: z.number().default(0),
    engagementRate: z.number().default(0),
    lastUpdated: z.date().optional(),
  }).default({}),
  dedupeGroupId: z.string().optional(),
  fraudSignals: z.object({
    botScore: z.number().optional(),
    anomalies: z.array(z.string()).default([]),
    riskLevel: z.enum(['low', 'medium', 'high']).optional(),
  }).optional(),
  reviewNotes: z.string().optional(),
  reviewedAt: z.date().optional(),
  reviewedBy: z.string().optional(),
  payoutAmount: z.number().optional(),
  payoutStatus: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Submission = z.infer<typeof SubmissionSchema>;

// Payout Schema
export const PayoutSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['crypto', 'fiat']),
  amount: z.number(),
  currency: z.string(), // USDC, USD, etc.
  network: z.enum(['base', 'polygon']).optional(),
  txHash: z.string().optional(),
  stripeTransferId: z.string().optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  breakdown: z.object({
    baseViews: z.number().default(0),
    engagementBonus: z.number().default(0),
    referralBonus: z.number().default(0),
    platformFee: z.number().default(0),
  }).default({}),
  submissionIds: z.array(z.string()).default([]),
  scheduledFor: z.date().optional(),
  processedAt: z.date().optional(),
  failureReason: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Payout = z.infer<typeof PayoutSchema>;

// Referral Schema
export const ReferralSchema = z.object({
  id: z.string(),
  referrerId: z.string(),
  refereeId: z.string(),
  code: z.string(),
  status: z.enum(['pending', 'completed', 'expired']),
  bonusAmount: z.number().default(0),
  bonusPaid: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Referral = z.infer<typeof ReferralSchema>;

// Dispute Schema
export const DisputeSchema = z.object({
  id: z.string(),
  submissionId: z.string(),
  complainantId: z.string(),
  defendantId: z.string(),
  type: z.enum(['fraud', 'quality', 'payment', 'content', 'other']),
  status: z.enum(['open', 'investigating', 'resolved', 'closed']),
  description: z.string(),
  evidence: z.array(z.string()).default([]), // URLs to evidence files
  resolution: z.string().optional(),
  resolvedBy: z.string().optional(),
  resolvedAt: z.date().optional(),
  payoutAdjustment: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Dispute = z.infer<typeof DisputeSchema>;

// Audit Log Schema
export const AuditLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  changes: z.record(z.string(), z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  createdAt: z.date(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;

// Feature Flag Schema
export const FeatureFlagSchema = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string(),
  enabled: z.boolean(),
  description: z.string().optional(),
  rolloutPercentage: z.number().default(100),
  targetRoles: z.array(z.enum(['guest', 'clipper', 'brand', 'admin'])).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    code: string;
    message: string;
    hint?: string;
    retryAfter?: number;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

// Dashboard Stats
export interface DashboardStats {
  totalCampaigns?: number;
  activeCampaigns?: number;
  totalSpent?: number;
  totalEarnings?: number;
  totalSubmissions?: number;
  approvalRate?: number;
  avgEngagementRate?: number;
  topPerformingCampaign?: string;
}

// Chart Data
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'campaign_approved' | 'submission_approved' | 'submission_rejected' | 'payout_completed' | 'fraud_alert' | 'dispute_created' | 'system_announcement';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// Social Auth Types
export interface SocialAuthToken {
  platform: Platform;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scope: string[];
}

// Wallet Connection Types
export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  balance?: {
    native: string;
    usdc: string;
  };
}

// Content Creation Tools
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: 'image' | 'video' | 'text';
  url: string;
  brandId?: string;
  isPublic: boolean;
  usageCount: number;
  createdAt: Date;
}

// All schemas are already exported above when declared
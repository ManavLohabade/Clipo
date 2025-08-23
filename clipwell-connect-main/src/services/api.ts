// Mock API service layer for Clipper DAO
import { 
  User, 
  Campaign, 
  Submission, 
  Payout, 
  BrandProfile, 
  ClipperProfile, 
  ApiResponse,
  DashboardStats,
  ChartDataPoint,
  Notification,
  UserRole,
  CampaignStatus,
  SubmissionStatus
} from '@/types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    brandId: 'brand-1',
    title: 'Nike Air Max Campaign',
    description: 'Showcase the new Air Max collection with authentic lifestyle content',
    hashtags: ['#NikeAirMax', '#JustDoIt', '#Lifestyle'],
    platforms: ['instagram', 'x', 'youtube'],
    tier: 'premium',
    budgetTotal: 50000,
    budgetRemaining: 32000,
    payoutRule: {
      basePerKViews: 5,
      engagementBonusRule: {
        threshold: 0.1,
        multiplier: 1.5
      },
      minViews: 1000
    },
    duration: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31')
    },
    status: 'live',
    funding: {
      currency: 'USDC',
      chains: ['base'],
      escrowTxHash: '0x1234567890abcdef'
    },
    metrics: {
      totalSubmissions: 45,
      approvedSubmissions: 32,
      totalViews: 250000,
      totalEngagement: 15000,
      totalSpent: 18000
    },
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'camp-2',
    brandId: 'brand-1',
    title: 'Holiday Season Content',
    description: 'Create festive content showcasing holiday collections',
    hashtags: ['#HolidayStyle', '#WinterFashion', '#SeasonCollection'],
    platforms: ['instagram', 'tiktok'],
    tier: 'basic',
    budgetTotal: 25000,
    budgetRemaining: 8000,
    payoutRule: {
      basePerKViews: 3,
      minViews: 500
    },
    duration: {
      start: new Date('2023-12-01'),
      end: new Date('2023-12-31')
    },
    status: 'completed',
    funding: {
      currency: 'FIAT',
      stripeEscrowId: 'se_1234567890'
    },
    metrics: {
      totalSubmissions: 128,
      approvedSubmissions: 96,
      totalViews: 450000,
      totalEngagement: 32000,
      totalSpent: 17000
    },
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-01')
  }
];

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    campaignId: 'camp-1',
    clipperId: 'clipper-1',
    urls: ['https://instagram.com/p/abc123'],
    platform: 'instagram',
    status: 'approved',
    metrics: {
      views: 15000,
      likes: 800,
      comments: 45,
      shares: 23,
      engagementRate: 0.058
    },
    payoutAmount: 75,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 'sub-2',
    campaignId: 'camp-1',
    clipperId: 'clipper-1',
    urls: ['https://x.com/user/status/123'],
    platform: 'x',
    status: 'pending',
    metrics: {
      views: 8500,
      likes: 120,
      comments: 8,
      shares: 45,
      engagementRate: 0.02
    },
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  }
];

const MOCK_PAYOUTS: Payout[] = [
  {
    id: 'payout-1',
    userId: 'clipper-1',
    type: 'crypto',
    amount: 150,
    currency: 'USDC',
    network: 'base',
    txHash: '0xabcdef1234567890',
    status: 'completed',
    breakdown: {
      baseViews: 120,
      engagementBonus: 30,
      referralBonus: 0,
      platformFee: 0
    },
    submissionIds: ['sub-1'],
    processedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-15')
  }
];

// API Classes
export class CampaignService {
  static async create(data: Partial<Campaign>): Promise<ApiResponse<Campaign>> {
    await delay(1000);
    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      brandId: data.brandId || 'brand-1',
      title: data.title || 'New Campaign',
      description: data.description || '',
      hashtags: data.hashtags || [],
      platforms: data.platforms || [],
      tier: data.tier || 'basic',
      budgetTotal: data.budgetTotal || 0,
      budgetRemaining: data.budgetTotal || 0,
      payoutRule: data.payoutRule || { basePerKViews: 1, minViews: 1000 },
      duration: data.duration || { start: new Date(), end: new Date() },
      status: 'draft',
      funding: data.funding || { currency: 'USDC' },
      metrics: {
        totalSubmissions: 0,
        approvedSubmissions: 0,
        totalViews: 0,
        totalEngagement: 0,
        totalSpent: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    MOCK_CAMPAIGNS.unshift(newCampaign);
    return { data: newCampaign };
  }

  static async list(brandId?: string): Promise<ApiResponse<Campaign[]>> {
    await delay(500);
    const campaigns = brandId 
      ? MOCK_CAMPAIGNS.filter(c => c.brandId === brandId)
      : MOCK_CAMPAIGNS;
    return { data: campaigns };
  }

  static async getById(id: string): Promise<ApiResponse<Campaign>> {
    await delay(300);
    const campaign = MOCK_CAMPAIGNS.find(c => c.id === id);
    if (!campaign) {
      return { error: { code: 'NOT_FOUND', message: 'Campaign not found' } };
    }
    return { data: campaign };
  }

  static async update(id: string, data: Partial<Campaign>): Promise<ApiResponse<Campaign>> {
    await delay(800);
    const index = MOCK_CAMPAIGNS.findIndex(c => c.id === id);
    if (index === -1) {
      return { error: { code: 'NOT_FOUND', message: 'Campaign not found' } };
    }
    
    MOCK_CAMPAIGNS[index] = { 
      ...MOCK_CAMPAIGNS[index], 
      ...data, 
      updatedAt: new Date() 
    };
    return { data: MOCK_CAMPAIGNS[index] };
  }

  static async submitForReview(id: string): Promise<ApiResponse<Campaign>> {
    await delay(500);
    return this.update(id, { status: 'pending' });
  }

  static async pause(id: string): Promise<ApiResponse<Campaign>> {
    await delay(300);
    return this.update(id, { status: 'paused' });
  }

  static async resume(id: string): Promise<ApiResponse<Campaign>> {
    await delay(300);
    return this.update(id, { status: 'live' });
  }
}

export class SubmissionService {
  static async create(data: Partial<Submission>): Promise<ApiResponse<Submission>> {
    await delay(800);
    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      campaignId: data.campaignId || '',
      clipperId: data.clipperId || '',
      urls: data.urls || [],
      platform: data.platform || 'instagram',
      status: 'pending',
      metrics: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        engagementRate: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    MOCK_SUBMISSIONS.unshift(newSubmission);
    return { data: newSubmission };
  }

  static async listByCampaign(campaignId: string): Promise<ApiResponse<Submission[]>> {
    await delay(400);
    const submissions = MOCK_SUBMISSIONS.filter(s => s.campaignId === campaignId);
    return { data: submissions };
  }

  static async listByClipper(clipperId: string): Promise<ApiResponse<Submission[]>> {
    await delay(400);
    const submissions = MOCK_SUBMISSIONS.filter(s => s.clipperId === clipperId);
    return { data: submissions };
  }

  static async approve(id: string, payoutAmount?: number): Promise<ApiResponse<Submission>> {
    await delay(600);
    const index = MOCK_SUBMISSIONS.findIndex(s => s.id === id);
    if (index === -1) {
      return { error: { code: 'NOT_FOUND', message: 'Submission not found' } };
    }
    
    MOCK_SUBMISSIONS[index] = {
      ...MOCK_SUBMISSIONS[index],
      status: 'approved',
      payoutAmount,
      reviewedAt: new Date(),
      updatedAt: new Date()
    };
    
    return { data: MOCK_SUBMISSIONS[index] };
  }

  static async reject(id: string, reason?: string): Promise<ApiResponse<Submission>> {
    await delay(600);
    const index = MOCK_SUBMISSIONS.findIndex(s => s.id === id);
    if (index === -1) {
      return { error: { code: 'NOT_FOUND', message: 'Submission not found' } };
    }
    
    MOCK_SUBMISSIONS[index] = {
      ...MOCK_SUBMISSIONS[index],
      status: 'rejected',
      reviewNotes: reason,
      reviewedAt: new Date(),
      updatedAt: new Date()
    };
    
    return { data: MOCK_SUBMISSIONS[index] };
  }
}

export class PayoutService {
  static async getEarnings(userId: string): Promise<ApiResponse<{
    accrued: number;
    pending: number;
    paid: number;
    history: Payout[];
  }>> {
    await delay(500);
    const userPayouts = MOCK_PAYOUTS.filter(p => p.userId === userId);
    
    const paid = userPayouts
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pending = userPayouts
      .filter(p => p.status === 'pending' || p.status === 'processing')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return {
      data: {
        accrued: 450, // Mock accrued amount
        pending,
        paid,
        history: userPayouts
      }
    };
  }

  static async requestWithdrawal(userId: string, amount: number, method: 'crypto' | 'fiat'): Promise<ApiResponse<Payout>> {
    await delay(1000);
    const newPayout: Payout = {
      id: `payout-${Date.now()}`,
      userId,
      type: method,
      amount,
      currency: method === 'crypto' ? 'USDC' : 'USD',
      network: method === 'crypto' ? 'base' : undefined,
      status: 'pending',
      breakdown: {
        baseViews: amount,
        engagementBonus: 0,
        referralBonus: 0,
        platformFee: 0
      },
      submissionIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    MOCK_PAYOUTS.unshift(newPayout);
    return { data: newPayout };
  }
}

export class UserService {
  static async getProfile(userId: string): Promise<ApiResponse<BrandProfile | ClipperProfile>> {
    await delay(300);
    
    // Mock profile based on user role
    const mockBrandProfile: BrandProfile = {
      id: 'brand-profile-1',
      userId,
      companyName: 'Nike Inc.',
      website: 'https://nike.com',
      description: 'Just Do It - Leading athletic brand',
      logo: '/api/placeholder/128/128',
      industry: 'Athletic Apparel',
      teamSize: '10000+',
      preferredCurrency: 'USDC',
      preferredChains: ['base'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const mockClipperProfile: ClipperProfile = {
      id: 'clipper-profile-1',
      userId,
      bio: 'Creative content creator passionate about lifestyle and fashion',
      categories: ['Lifestyle', 'Fashion', 'Tech'],
      socialLinks: [
        {
          platform: 'instagram',
          username: '@creative_clipper',
          url: 'https://instagram.com/creative_clipper',
          verified: true,
          followers: 25000
        },
        {
          platform: 'x',
          username: '@creative_clipper',
          url: 'https://x.com/creative_clipper',
          verified: true,
          followers: 15000
        }
      ],
      payoutPreference: 'crypto',
      referralCode: 'CREATIVE123',
      totalEarnings: 2450,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Return based on mock user type
    return { data: userId.includes('brand') ? mockBrandProfile : mockClipperProfile };
  }

  static async updateProfile(userId: string, data: Partial<BrandProfile | ClipperProfile>): Promise<ApiResponse<BrandProfile | ClipperProfile>> {
    await delay(800);
    const profile = await this.getProfile(userId);
    if (profile.data) {
      const updated = { ...profile.data, ...data, updatedAt: new Date() };
      return { data: updated };
    }
    return { error: { code: 'NOT_FOUND', message: 'Profile not found' } };
  }
}

export class AdminService {
  static async getCampaignReviewQueue(): Promise<ApiResponse<Campaign[]>> {
    await delay(500);
    const pendingCampaigns = MOCK_CAMPAIGNS.filter(c => c.status === 'pending');
    return { data: pendingCampaigns };
  }

  static async approveCampaign(id: string): Promise<ApiResponse<Campaign>> {
    await delay(600);
    return CampaignService.update(id, { status: 'live' });
  }

  static async rejectCampaign(id: string, reason?: string): Promise<ApiResponse<Campaign>> {
    await delay(600);
    return CampaignService.update(id, { status: 'rejected' });
  }

  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await delay(400);
    return {
      data: {
        totalCampaigns: MOCK_CAMPAIGNS.length,
        activeCampaigns: MOCK_CAMPAIGNS.filter(c => c.status === 'live').length,
        totalSpent: MOCK_CAMPAIGNS.reduce((sum, c) => sum + (c.metrics?.totalSpent || 0), 0),
        totalSubmissions: MOCK_SUBMISSIONS.length,
        approvalRate: 0.73,
        avgEngagementRate: 0.045
      }
    };
  }
}

export class NotificationService {
  static async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    await delay(300);
    
    const mockNotifications: Notification[] = [
      {
        id: 'notif-1',
        userId,
        type: 'campaign_approved',
        title: 'Campaign Approved',
        message: 'Your Nike Air Max campaign has been approved and is now live!',
        read: false,
        actionUrl: '/brand/campaigns/camp-1',
        createdAt: new Date()
      },
      {
        id: 'notif-2',
        userId,
        type: 'submission_approved',
        title: 'Submission Approved',
        message: 'Your Instagram post has been approved. Payout of $75 is being processed.',
        read: false,
        createdAt: new Date()
      }
    ];
    
    return { data: mockNotifications };
  }

  static async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    await delay(200);
    return { data: undefined };
  }
}

// Analytics and Chart Data
export class AnalyticsService {
  static async getCampaignMetrics(campaignId: string, timeRange: string = '30d'): Promise<ApiResponse<ChartDataPoint[]>> {
    await delay(400);
    
    // Mock time series data
    const mockData: ChartDataPoint[] = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 1000) + 500,
        label: `Day ${30 - i}`
      });
    }
    
    return { data: mockData };
  }

  static async getBrandROI(brandId: string): Promise<ApiResponse<{
    roi: number;
    totalSpent: number;
    totalViews: number;
    costPerView: number;
  }>> {
    await delay(500);
    
    const brandCampaigns = MOCK_CAMPAIGNS.filter(c => c.brandId === brandId);
    const totalSpent = brandCampaigns.reduce((sum, c) => sum + (c.metrics?.totalSpent || 0), 0);
    const totalViews = brandCampaigns.reduce((sum, c) => sum + (c.metrics?.totalViews || 0), 0);
    
    return {
      data: {
        roi: 3.2,
        totalSpent,
        totalViews,
        costPerView: totalViews > 0 ? totalSpent / totalViews : 0
      }
    };
  }
}
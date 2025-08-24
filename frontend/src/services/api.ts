// Mock API service layer for Clipper DAO
import { 
  User, 
  Campaign, 
  Submission, 
  Payout, 
  BrandProfile, 
  ClipperProfile, 
  DashboardStats, 
  ChartDataPoint, 
  Notification,
  UserRole,
  ApiResponse 
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('accessToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: {
          code: `HTTP_${response.status}`,
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        }
      };
    }

    return await response.json();
  } catch (error) {
    return {
      error: {
        code: 'NETWORK_ERROR',
        message: 'Failed to connect to server',
      }
    };
  }
}

// Auth Service
export class AuthService {
  static async login(email: string, password: string): Promise<ApiResponse<{ user: User; accessToken: string }>> {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(email: string, password: string, role: UserRole, profile: Partial<BrandProfile | ClipperProfile>): Promise<ApiResponse<User>> {
    // Prepare registration data based on role
    const registrationData: any = {
      email,
      password,
      role,
      username: email.split('@')[0], // Generate username from email
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
    };

    // Add role-specific fields
    if (role === 'brand') {
      registrationData.companyName = profile.companyName || '';
      registrationData.website = profile.website || '';
      registrationData.description = profile.description || '';
    } else if (role === 'clipper') {
      registrationData.bio = profile.bio || 'Content creator on Clipper';
      registrationData.categories = profile.categories || [];
      registrationData.socialLinks = profile.socialLinks || [];
    }

    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  }

  static async getProfile(): Promise<ApiResponse<User>> {
    return apiCall('/auth/profile');
  }

  static async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    return apiCall('/auth/refresh', {
      method: 'POST',
    });
  }
}

// Campaign Service
export class CampaignService {
  static async create(data: Partial<Campaign>): Promise<ApiResponse<Campaign>> {
    return apiCall('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async list(brandId?: string): Promise<ApiResponse<Campaign[]>> {
    const params = brandId ? `?brandId=${brandId}` : '';
    return apiCall(`/campaigns${params}`);
  }

  static async getById(id: string): Promise<ApiResponse<Campaign>> {
    return apiCall(`/campaigns/${id}`);
  }

  static async update(id: string, data: Partial<Campaign>): Promise<ApiResponse<Campaign>> {
    return apiCall(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete(id: string): Promise<ApiResponse<void>> {
    return apiCall(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  static async submitForReview(id: string): Promise<ApiResponse<Campaign>> {
    return apiCall(`/campaigns/${id}/submit`, {
      method: 'POST',
    });
  }

  static async pause(id: string): Promise<ApiResponse<Campaign>> {
    return apiCall(`/campaigns/${id}/pause`, {
      method: 'POST',
    });
  }

  static async resume(id: string): Promise<ApiResponse<Campaign>> {
    return apiCall(`/campaigns/${id}/resume`, {
      method: 'POST',
    });
  }
}

// Submission Service
export class SubmissionService {
  static async create(data: Partial<Submission>): Promise<ApiResponse<Submission>> {
    return apiCall('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async listByCampaign(campaignId: string): Promise<ApiResponse<Submission[]>> {
    return apiCall(`/submissions?campaignId=${campaignId}`);
  }

  static async listByClipper(clipperId: string): Promise<ApiResponse<Submission[]>> {
    return apiCall(`/submissions?clipperId=${clipperId}`);
  }

  static async getById(id: string): Promise<ApiResponse<Submission>> {
    return apiCall(`/submissions/${id}`);
  }

  static async approve(id: string, payoutAmount?: number): Promise<ApiResponse<Submission>> {
    return apiCall(`/submissions/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ payoutAmount }),
    });
  }

  static async reject(id: string, reason?: string): Promise<ApiResponse<Submission>> {
    return apiCall(`/submissions/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  static async flag(id: string, reason: string): Promise<ApiResponse<Submission>> {
    return apiCall(`/submissions/${id}/flag`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }
}

// Payout Service
export class PayoutService {
  static async getEarnings(userId: string): Promise<ApiResponse<{
    accrued: number;
    pending: number;
    paid: number;
    history: Payout[];
  }>> {
    return apiCall(`/payouts/earnings/${userId}`);
  }

  static async requestWithdrawal(userId: string, amount: number, method: 'crypto' | 'fiat'): Promise<ApiResponse<Payout>> {
    return apiCall('/payouts/withdraw', {
      method: 'POST',
      body: JSON.stringify({ userId, amount, method }),
    });
  }

  static async getPayoutHistory(userId: string): Promise<ApiResponse<Payout[]>> {
    return apiCall(`/payouts/history/${userId}`);
  }

  static async getPayoutStatus(payoutId: string): Promise<ApiResponse<Payout>> {
    return apiCall(`/payouts/${payoutId}`);
  }
}

// User Service
export class UserService {
  static async getProfile(userId: string): Promise<ApiResponse<BrandProfile | ClipperProfile>> {
    return apiCall(`/users/${userId}/profile`);
  }

  static async updateProfile(userId: string, data: Partial<BrandProfile | ClipperProfile>): Promise<ApiResponse<BrandProfile | ClipperProfile>> {
    return apiCall(`/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async updateAvatar(userId: string, avatarFile: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    return apiCall(`/users/${userId}/avatar`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }
}

// Admin Service
export class AdminService {
  static async getCampaignReviewQueue(): Promise<ApiResponse<Campaign[]>> {
    return apiCall('/admin/campaigns/review-queue');
  }

  static async approveCampaign(id: string): Promise<ApiResponse<Campaign>> {
    return apiCall(`/admin/campaigns/${id}/approve`, {
      method: 'POST',
    });
  }

  static async rejectCampaign(id: string, reason: string): Promise<ApiResponse<Campaign>> {
    return apiCall(`/admin/campaigns/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return apiCall('/admin/dashboard/stats');
  }

  static async getModerationQueue(): Promise<ApiResponse<Submission[]>> {
    return apiCall('/admin/moderation/queue');
  }
}

// Notification Service
export class NotificationService {
  static async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    return apiCall(`/notifications/${userId}`);
  }

  static async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return apiCall(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }

  static async markAllAsRead(userId: string): Promise<ApiResponse<void>> {
    return apiCall(`/notifications/${userId}/read-all`, {
      method: 'POST',
    });
  }

  static async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    return apiCall(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }
}

// Analytics Service
export class AnalyticsService {
  static async getCampaignMetrics(campaignId: string, timeRange: string = '30d'): Promise<ApiResponse<ChartDataPoint[]>> {
    return apiCall(`/analytics/campaigns/${campaignId}/metrics?timeRange=${timeRange}`);
  }

  static async getBrandROI(brandId: string): Promise<ApiResponse<{
    roi: number;
    totalSpent: number;
    totalViews: number;
    costPerView: number;
  }>> {
    return apiCall(`/analytics/brands/${brandId}/roi`);
  }

  static async getCreatorPerformance(clipperId: string): Promise<ApiResponse<{
    totalEarnings: number;
    totalSubmissions: number;
    approvalRate: number;
    avgEngagement: number;
  }>> {
    return apiCall(`/analytics/creators/${clipperId}/performance`);
  }
}

// Web3 Service
export class Web3Service {
  static async deployCampaign(campaignData: any): Promise<ApiResponse<any>> {
    return apiCall('/web3/deploy-campaign', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  static async distributeReward(rewardData: any): Promise<ApiResponse<any>> {
    return apiCall('/web3/distribute-reward', {
      method: 'POST',
      body: JSON.stringify(rewardData),
    });
  }

  static async getBalance(address: string): Promise<ApiResponse<any>> {
    return apiCall(`/web3/balance/${address}`);
  }

  static async getTransactionStatus(txHash: string): Promise<ApiResponse<any>> {
    return apiCall(`/web3/transaction/${txHash}`);
  }
}
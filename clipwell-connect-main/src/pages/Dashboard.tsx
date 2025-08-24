'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye, 
  Plus,
  ArrowUpRight,
  Calendar,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_STATS = {
  brand: {
    totalCampaigns: 12,
    activeCampaigns: 5,
    totalSpent: 45000,
    totalViews: 2100000,
    avgROI: 3.2
  },
  clipper: {
    totalEarnings: 2450,
    pendingEarnings: 340,
    completedSubmissions: 23,
    totalViews: 145000,
    engagementRate: 4.2
  },
  admin: {
    totalUsers: 5847,
    activeCampaigns: 156,
    pendingReviews: 23,
    fraudAlerts: 3
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const renderBrandDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.firstName || 'Brand'}!</h1>
        <p className="text-muted-foreground">Manage your campaigns and track performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.brand.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {MOCK_STATS.brand.activeCampaigns} active
            </p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${MOCK_STATS.brand.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ROI: {MOCK_STATS.brand.avgROI}x
            </p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(MOCK_STATS.brand.totalViews / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.brand.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              Running now
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your next campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full btn-hero" onClick={() => navigate('/brand/campaigns/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Campaign
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/brand/submissions')}>
              <Users className="h-4 w-4 mr-2" />
              Review Submissions
            </Button>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates on your campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Nike Air Max Campaign</span>
                <Badge variant="secondary">Live</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Holiday Collection</span>
                <Badge>Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderClipperDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.firstName || 'Creator'}!</h1>
        <p className="text-muted-foreground">Track your earnings and find new opportunities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${MOCK_STATS.clipper.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">
              ${MOCK_STATS.clipper.pendingEarnings} pending
            </p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.clipper.completedSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Approved content
            </p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(MOCK_STATS.clipper.totalViews / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Across all content
            </p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.clipper.engagementRate}%</div>
            <p className="text-xs text-muted-foreground">
              Average rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Find Opportunities</CardTitle>
            <CardDescription>Discover campaigns that match your audience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full btn-hero" onClick={() => navigate('/clipper/campaigns')}>
              <Plus className="h-4 w-4 mr-2" />
              Browse Campaigns
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/clipper/earnings')}>
              <DollarSign className="h-4 w-4 mr-2" />
              View Earnings
            </Button>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Your Performance</CardTitle>
            <CardDescription>Recent submission activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Nike Campaign Post</span>
                <Badge>Approved</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Holiday Content</span>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform oversight and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.admin.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.admin.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.admin.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Alerts</CardTitle>
            <Target className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{MOCK_STATS.admin.fraudAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Require review
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Platform management tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full btn-hero" onClick={() => navigate('/admin/review/campaigns')}>
              <Target className="h-4 w-4 mr-2" />
              Review Campaigns
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/admin/moderation')}>
              <Users className="h-4 w-4 mr-2" />
              Moderation Queue
            </Button>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Campaign System</span>
                <Badge>Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Processing</span>
                <Badge>Operational</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  switch (user.role) {
    case 'brand':
      return renderBrandDashboard();
    case 'clipper':
      return renderClipperDashboard();
    case 'admin':
      return renderAdminDashboard();
    default:
      return (
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Welcome to Clipper DAO</h1>
          <p className="text-muted-foreground">Your dashboard will appear here based on your role.</p>
        </div>
      );
  }
}
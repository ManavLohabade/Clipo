'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  Eye,
  Play,
  Pause,
  Edit,
  MoreHorizontal,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const MOCK_CAMPAIGNS = [
  {
    id: '1',
    title: 'Nike Air Max Summer Collection',
    description: 'Showcase the new Air Max collection for summer 2024',
    status: 'live',
    budget: 15000,
    spent: 8750,
    submissions: 24,
    approvals: 18,
    views: 420000,
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    platforms: ['instagram', 'tiktok'],
    hashtags: ['#NikeAirMax', '#Summer2024', '#JustDoIt'],
  },
  {
    id: '2',
    title: 'Holiday Collection Launch',
    description: 'Feature our exclusive holiday collection items',
    status: 'completed',
    budget: 25000,
    spent: 23500,
    submissions: 45,
    approvals: 42,
    views: 850000,
    startDate: '2024-01-10',
    endDate: '2024-02-10',
    platforms: ['instagram', 'youtube', 'tiktok'],
    hashtags: ['#HolidayCollection', '#WinterStyle'],
  },
  {
    id: '3',
    title: 'Spring Fitness Campaign',
    description: 'Promote fitness and wellness products for spring season',
    status: 'draft',
    budget: 20000,
    spent: 0,
    submissions: 0,
    approvals: 0,
    views: 0,
    startDate: '2024-04-01',
    endDate: '2024-05-01',
    platforms: ['instagram', 'youtube'],
    hashtags: ['#SpringFitness', '#Wellness', '#HealthyLiving'],
  },
  {
    id: '4',
    title: 'Back to School Essentials',
    description: 'Target students with back-to-school products',
    status: 'paused',
    budget: 18000,
    spent: 4200,
    submissions: 12,
    approvals: 8,
    views: 125000,
    startDate: '2024-02-20',
    endDate: '2024-03-20',
    platforms: ['tiktok', 'youtube'],
    hashtags: ['#BackToSchool', '#StudentLife', '#Essentials'],
  },
];

const STATUS_COLORS = {
  live: 'bg-green-500/20 text-green-600 border-green-500/20',
  completed: 'bg-blue-500/20 text-blue-600 border-blue-500/20',
  draft: 'bg-gray-500/20 text-gray-600 border-gray-500/20',
  paused: 'bg-amber-500/20 text-amber-600 border-amber-500/20',
  pending: 'bg-purple-500/20 text-purple-600 border-purple-500/20',
};

export default function BrandCampaigns() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');

  const filteredCampaigns = MOCK_CAMPAIGNS.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play className="h-3 w-3" />;
      case 'paused': return <Pause className="h-3 w-3" />;
      case 'completed': return <TrendingUp className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  const renderCampaignCard = (campaign: any) => (
    <Card key={campaign.id} className="card-glass hover:shadow-glow transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {campaign.title}
              </CardTitle>
              <Badge className={STATUS_COLORS[campaign.status as keyof typeof STATUS_COLORS]}>
                {getStatusIcon(campaign.status)}
                {campaign.status}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {campaign.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/brand/campaigns/${campaign.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/brand/campaigns/${campaign.id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Campaign
              </DropdownMenuItem>
              {campaign.status === 'live' && (
                <DropdownMenuItem>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Campaign
                </DropdownMenuItem>
              )}
              {campaign.status === 'paused' && (
                <DropdownMenuItem>
                  <Play className="h-4 w-4 mr-2" />
                  Resume Campaign
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campaign Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">
              ${(campaign.spent / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-muted-foreground">Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {campaign.submissions}
            </div>
            <div className="text-xs text-muted-foreground">Submissions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {campaign.approvals}
            </div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {(campaign.views / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-muted-foreground">Views</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Budget Progress</span>
            <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1">
          {campaign.hashtags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="btn-hero flex-1"
            onClick={() => navigate(`/brand/campaigns/${campaign.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigate(`/brand/campaigns/${campaign.id}/submissions`)}
          >
            <Users className="h-4 w-4 mr-2" />
            {campaign.submissions}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Manage your brand campaigns and track performance</p>
        </div>
        <Button className="btn-hero" onClick={() => navigate('/brand/campaigns/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="card-glass">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="submissions">Submissions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{MOCK_CAMPAIGNS.length}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold text-primary">
                  {MOCK_CAMPAIGNS.filter(c => c.status === 'live').length}
                </p>
              </div>
              <Play className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">
                  ${(MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.spent, 0) / 1000).toFixed(1)}K
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">
                  {(MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.views, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map(renderCampaignCard)}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card className="card-glass">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredCampaigns.map((campaign) => (
                  <div key={campaign.id} className="p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{campaign.title}</h3>
                          <Badge className={STATUS_COLORS[campaign.status as keyof typeof STATUS_COLORS]}>
                            {getStatusIcon(campaign.status)}
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                        <div className="flex items-center gap-6 text-sm">
                          <span>Budget: ${campaign.budget.toLocaleString()}</span>
                          <span>Spent: ${campaign.spent.toLocaleString()}</span>
                          <span>Submissions: {campaign.submissions}</span>
                          <span>Views: {campaign.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/brand/campaigns/${campaign.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/brand/campaigns/${campaign.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {campaign.status === 'live' && (
                              <DropdownMenuItem>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {filteredCampaigns.length === 0 && (
        <Card className="card-glass">
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria or filters'
                : 'Create your first campaign to get started'
              }
            </p>
            <Button className="btn-hero" onClick={() => navigate('/brand/campaigns/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
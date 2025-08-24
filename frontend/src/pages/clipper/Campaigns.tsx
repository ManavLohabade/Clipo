'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  Eye,
  Star,
  Sparkles,
  Target,
  Clock,
  Globe,
  Heart,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_AVAILABLE_CAMPAIGNS = [
  {
    id: '1',
    title: 'Nike Air Max Summer Collection',
    brand: 'Nike',
    description: 'Showcase the new Air Max collection for summer 2024. Looking for fashion-forward creators who can style these sneakers in creative ways.',
    payoutPerPost: 150,
    bonusRate: 0.05,
    requirements: {
      minFollowers: 1000,
      platforms: ['instagram', 'tiktok'],
      demographics: ['18-35', 'fashion'],
    },
    budget: 15000,
    spotsRemaining: 12,
    totalSpots: 20,
    endDate: '2024-04-15',
    hashtags: ['#NikeAirMax', '#Summer2024', '#JustDoIt'],
    difficulty: 'easy',
    isRecommended: true,
    estimatedViews: '10K-50K',
    brandRating: 4.8,
  },
  {
    id: '2',
    title: 'Tech Product Review - Wireless Earbuds',
    brand: 'AudioTech',
    description: 'Create honest reviews of our new wireless earbuds. Must include unboxing, sound test, and daily usage scenarios.',
    payoutPerPost: 200,
    bonusRate: 0.08,
    requirements: {
      minFollowers: 5000,
      platforms: ['youtube', 'instagram'],
      demographics: ['tech', 'gadgets'],
    },
    budget: 12000,
    spotsRemaining: 8,
    totalSpots: 15,
    endDate: '2024-04-20',
    hashtags: ['#AudioTech', '#WirelessEarbuds', '#TechReview'],
    difficulty: 'medium',
    isRecommended: false,
    estimatedViews: '25K-100K',
    brandRating: 4.5,
  },
  {
    id: '3',
    title: 'Sustainable Fashion Challenge',
    brand: 'EcoWear',
    description: 'Promote sustainable fashion choices. Create content showing how to style our eco-friendly clothing line.',
    payoutPerPost: 120,
    bonusRate: 0.06,
    requirements: {
      minFollowers: 2000,
      platforms: ['instagram', 'tiktok', 'youtube'],
      demographics: ['sustainability', 'fashion'],
    },
    budget: 8000,
    spotsRemaining: 15,
    totalSpots: 25,
    endDate: '2024-05-01',
    hashtags: ['#SustainableFashion', '#EcoWear', '#GoGreen'],
    difficulty: 'easy',
    isRecommended: true,
    estimatedViews: '5K-30K',
    brandRating: 4.7,
  },
  {
    id: '4',
    title: 'Gaming Gear Showcase',
    brand: 'GameMax',
    description: 'Showcase our gaming peripherals in action. Must include gameplay footage and gear setup tutorials.',
    payoutPerPost: 300,
    bonusRate: 0.10,
    requirements: {
      minFollowers: 10000,
      platforms: ['youtube', 'twitch'],
      demographics: ['gaming', 'tech'],
    },
    budget: 18000,
    spotsRemaining: 5,
    totalSpots: 12,
    endDate: '2024-04-25',
    hashtags: ['#GameMax', '#GamingGear', '#ProGamer'],
    difficulty: 'hard',
    isRecommended: false,
    estimatedViews: '50K-200K',
    brandRating: 4.6,
  },
];

const DIFFICULTY_COLORS = {
  easy: 'bg-green-500/20 text-green-600 border-green-500/20',
  medium: 'bg-amber-500/20 text-amber-600 border-amber-500/20',
  hard: 'bg-red-500/20 text-red-600 border-red-500/20',
};

export default function ClipperCampaigns() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  const filteredCampaigns = MOCK_AVAILABLE_CAMPAIGNS.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || 
                           campaign.requirements.platforms.includes(platformFilter);
    const matchesDifficulty = difficultyFilter === 'all' || campaign.difficulty === difficultyFilter;
    return matchesSearch && matchesPlatform && matchesDifficulty;
  });

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Target className="h-3 w-3" />;
      case 'medium': return <Zap className="h-3 w-3" />;
      case 'hard': return <Star className="h-3 w-3" />;
      default: return <Target className="h-3 w-3" />;
    }
  };

  const renderCampaignCard = (campaign: any) => (
    <Card key={campaign.id} className={`card-glass hover:shadow-glow transition-all duration-300 group relative ${
      campaign.isRecommended ? 'ring-2 ring-primary/20' : ''
    }`}>
      {campaign.isRecommended && (
        <div className="absolute -top-3 left-4">
          <Badge className="bg-primary text-primary-foreground">
            <Sparkles className="h-3 w-3 mr-1" />
            Recommended
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {campaign.title}
              </CardTitle>
              <Badge className={DIFFICULTY_COLORS[campaign.difficulty as keyof typeof DIFFICULTY_COLORS]}>
                {getDifficultyIcon(campaign.difficulty)}
                {campaign.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{campaign.brand}</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500 fill-current" />
                <span className="text-xs text-muted-foreground">{campaign.brandRating}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gradient">
              ${campaign.payoutPerPost}
            </div>
            <div className="text-xs text-muted-foreground">per post</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-3">
          {campaign.description}
        </CardDescription>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="text-sm font-medium">{campaign.estimatedViews}</div>
            <div className="text-xs text-muted-foreground">Est. Views</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-primary">
              {campaign.spotsRemaining}/{campaign.totalSpots}
            </div>
            <div className="text-xs text-muted-foreground">Spots Left</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">
              +{(campaign.bonusRate * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Bonus Rate</div>
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Requirements:</div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {campaign.requirements.minFollowers.toLocaleString()}+ followers
            </Badge>
            {campaign.requirements.platforms.map((platform: string) => (
              <Badge key={platform} variant="outline" className="text-xs">
                {platform}
              </Badge>
            ))}
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

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Campaign Progress</span>
            <span>{Math.round(((campaign.totalSpots - campaign.spotsRemaining) / campaign.totalSpots) * 100)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-1.5">
            <div 
              className="bg-gradient-primary h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${((campaign.totalSpots - campaign.spotsRemaining) / campaign.totalSpots) * 100}%` }}
            />
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Ends {new Date(campaign.endDate).toLocaleDateString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="btn-hero flex-1"
            onClick={() => navigate(`/clipper/campaigns/${campaign.id}`)}
          >
            View Details
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              // Add to favorites/wishlist
            }}
          >
            <Heart className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold">Available Campaigns</h1>
          <p className="text-muted-foreground">Discover campaigns that match your audience and expertise</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/clipper/campaigns/my-campaigns')}>
          <Users className="h-4 w-4 mr-2" />
          My Campaigns
        </Button>
      </div>

      {/* AI Recommendations Banner */}
      <Card className="card-glass border-primary/20 bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">AI-Powered Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                We found {filteredCampaigns.filter(c => c.isRecommended).length} campaigns that perfectly match your profile and audience!
              </p>
            </div>
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="card-glass">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns by title, brand, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="twitch">Twitch</SelectItem>
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="payout">Highest Payout</SelectItem>
                <SelectItem value="deadline">Ending Soon</SelectItem>
                <SelectItem value="spots">Most Spots</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{filteredCampaigns.length}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recommended</p>
                <p className="text-2xl font-bold text-primary">
                  {filteredCampaigns.filter(c => c.isRecommended).length}
                </p>
              </div>
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Payout</p>
                <p className="text-2xl font-bold">
                  ${Math.round(filteredCampaigns.reduce((sum, c) => sum + c.payoutPerPost, 0) / filteredCampaigns.length)}
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
                <p className="text-sm text-muted-foreground">Total Spots</p>
                <p className="text-2xl font-bold">
                  {filteredCampaigns.reduce((sum, c) => sum + c.spotsRemaining, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map(renderCampaignCard)}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card className="card-glass">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find more campaigns
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setPlatformFilter('all');
              setDifficultyFilter('all');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
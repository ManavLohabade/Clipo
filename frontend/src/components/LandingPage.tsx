'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCampaigns } from '@/contexts/CampaignContext';
import { useAuth } from '@/contexts/AuthContext';
import ProfileButton from '@/components/ui/ProfileButton';

const LandingPage: React.FC = () => {
  const { campaigns } = useCampaigns();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Social media icon components with exact colors and styling
  const SocialMediaIcon = ({ platform, className = "" }: { platform: string; className?: string }) => {
    const getIconAndColor = (platform: string) => {
      switch (platform.toLowerCase()) {
        case 'instagram':
          return { icon: '📷', color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500' };
        case 'tiktok':
          return { icon: '🎵', color: 'bg-black' };
        case 'youtube':
          return { icon: '▶', color: 'bg-red-600' };
        case 'x':
        case 'twitter':
          return { icon: '𝕏', color: 'bg-black' };
        case 'linkedin':
          return { icon: '💼', color: 'bg-blue-600' };
        default:
          return { icon: '🌐', color: 'bg-gray-600' };
      }
    };

    const { icon, color } = getIconAndColor(platform);
    return (
      <div className={`w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs font-semibold ${color} ${className}`}>
        {icon}
      </div>
    );
  };

  const handleCampaignClick = (campaignId: number) => {
    navigate(`/campaign/${campaignId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-orange-500 font-bold text-xl">Clipo</span>
            </div>

            {/* Center Navigation - Focused on Content Rewards */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/discover" className="text-gray-300 hover:text-white transition-colors">Discover</Link>
              <Link to="/content-rewards" className="text-white font-medium border-b-2 border-purple-500 pb-1">Content Rewards</Link>
              <Link to="/create-campaign" className="text-gray-300 hover:text-white transition-colors">Create Campaign</Link>
            </nav>

            {/* Right Side - Auth & Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <ProfileButton 
                  user={user}
                  onLogout={logout}
                  onClick={() => navigate('/profile')}
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/register">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 font-medium">
                      Sign up
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 font-medium">
                      Sign in
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-8">
              <div className="max-w-3xl">
                <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                  Content Rewards
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  Post content on social media and get paid for the views you generate.{' '}
                  <Link to="/create-campaign" className="text-blue-400 hover:underline font-medium">
                    If you want to launch a campaign click here
                  </Link>
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-400">{campaigns.length} live Content Rewards</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <span>•</span>
                    <span>Join thousands of creators</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Learn</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-8">
            <Badge variant="secondary" className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              All Campaigns
            </Badge>
            <Badge variant="secondary" className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700 cursor-pointer">
              Clipping
            </Badge>
            <Badge variant="secondary" className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700 cursor-pointer">
              UGC
            </Badge>
            <Badge variant="secondary" className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700 cursor-pointer">
              Live Content
            </Badge>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/20 group"
                onClick={() => handleCampaignClick(campaign.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-xl">{campaign.icon}</span>
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg font-semibold group-hover:text-orange-400 transition-colors">
                          {campaign.brand}
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-sm">{campaign.type}</CardDescription>
                      </div>
                    </div>
                    {campaign.verified && (
                      <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-white text-xl font-semibold leading-tight group-hover:text-orange-300 transition-colors">
                    {campaign.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-gray-300 text-sm">
                    <span className="font-medium">{campaign.rate}</span>
                    <span className="text-gray-400">Budget: {campaign.budget}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(campaign.percentage, 5)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-gray-400 text-sm">
                      <span>Paid out: {campaign.paidOut}</span>
                      <span className="font-medium">{campaign.percentage}%</span>
                    </div>
                  </div>
                  
                  {/* Social Media Platforms */}
                  <div className="flex space-x-2">
                    {campaign.platforms.map((platform, index) => (
                      <SocialMediaIcon key={index} platform={platform} />
                    ))}
                  </div>
                  
                  {/* Views & Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Views: {campaign.views}</span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      Active now
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to start earning?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of creators who are already making money with Content Rewards. 
              Create your first campaign today and start building your income.
            </p>
            <div className="flex items-center justify-center space-x-4">
              {user ? (
                <Link to="/create-campaign">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                    Create Campaign
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-8 py-3 text-lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
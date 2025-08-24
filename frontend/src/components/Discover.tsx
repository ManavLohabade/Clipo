import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, Flame, Star, Users, Eye, DollarSign, Clock, Filter, Grid3X3, List, ArrowRight, Play, CheckCircle, Zap, Target, Globe, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCampaigns } from '@/contexts/CampaignContext';
import { useAuth } from '@/contexts/AuthContext';
import ProfileButton from '@/components/ui/ProfileButton';

const Discover: React.FC = () => {
  const { campaigns } = useCampaigns();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories for discovery
  const categories = [
    { id: 'all', name: 'All', icon: '🌟', count: campaigns.length },
    { id: 'clipping', name: 'Clipping', icon: '✂️', count: campaigns.filter(c => c.type === 'Clipping').length },
    { id: 'ugc', name: 'UGC', icon: '📱', count: campaigns.filter(c => c.type === 'UGC').length },
    { id: 'trending', name: 'Trending', icon: '🔥', count: 3 },
    { id: 'new', name: 'New', icon: '🆕', count: 2 },
    { id: 'verified', name: 'Verified', icon: '✅', count: campaigns.filter(c => c.verified).length },
  ];

  // Trending campaigns (mock data)
  const trendingCampaigns = [
    {
      id: 'trending-1',
      brand: 'Stake',
      title: 'Viral Sports Clips',
      type: 'Clipping',
      rate: '$3.50 / 1K',
      views: '2.1M',
      growth: '+45%',
      trending: true,
      icon: '🎯'
    },
    {
      id: 'trending-2',
      brand: 'OddsJam',
      title: 'Betting Analysis',
      type: 'UGC',
      rate: '$2.80 / 1K',
      views: '1.8M',
      growth: '+32%',
      trending: true,
      icon: '📊'
    },
    {
      id: 'trending-3',
      brand: 'Timothy Sykes',
      title: 'Trading Tips',
      type: 'Clipping',
      rate: '$4.20 / 1K',
      views: '3.2M',
      growth: '+67%',
      trending: true,
      icon: '💹'
    }
  ];

  const handleCampaignClick = (campaignId: number) => {
    navigate(`/campaign/${campaignId}`);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                          campaign.type.toLowerCase() === selectedCategory ||
                          (selectedCategory === 'verified' && campaign.verified) ||
                          (selectedCategory === 'trending' && trendingCampaigns.some(t => t.brand === campaign.brand)) ||
                          (selectedCategory === 'new' && campaign.id > 3);
    return matchesSearch && matchesCategory;
  });

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
               <span className="text-orange-500 font-bold text-xl">Clipper</span>
             </div>

            {/* Center Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/discover" className="text-white font-medium border-b-2 border-purple-500 pb-1">Discover</Link>
              <Link to="/content-rewards" className="text-gray-300 hover:text-white transition-colors">Content Rewards</Link>
              <Link to="/create-campaign" className="text-gray-300 hover:text-white transition-colors">Create Campaign</Link>
            </nav>

                         {/* Right Side - Auth */}
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">
                 <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10"></div>
         <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-4 py-2 text-sm mb-6">
              🚀 The Future of Content Monetization
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Get Paid for Your
              <span className="bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent"> Creativity</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8">
              Join thousands of creators who are already earning money by creating viral content. 
              From sports clips to trading tips, monetize your passion with Clipper.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <Link to="/content-rewards">
                <Button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl shadow-orange-500/25">
                  Explore Campaigns
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/create-campaign">
                <Button variant="outline" className="border-2 border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 px-8 py-4 text-lg font-semibold bg-transparent">
                  Create Campaign
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">{campaigns.length}+</div>
                <div className="text-gray-400 text-sm">Active Campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">$2.5M+</div>
                <div className="text-gray-400 text-sm">Total Payouts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">15K+</div>
                <div className="text-gray-400 text-sm">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-2">98%</div>
                <div className="text-gray-400 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Clipper?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We've built the most creator-friendly platform for monetizing your content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Instant Payouts</h3>
              <p className="text-gray-400">Get paid immediately when your content reaches view milestones. No waiting, no delays.</p>
            </div>

            <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Smart Matching</h3>
              <p className="text-gray-400">Our AI matches you with campaigns that fit your content style and audience perfectly.</p>
            </div>

            <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Creator Protection</h3>
              <p className="text-gray-400">Your content is protected. We ensure fair compensation and transparent terms.</p>
            </div>

            <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Global Reach</h3>
              <p className="text-gray-400">Access campaigns from brands worldwide. Your content can reach millions of viewers.</p>
            </div>

            <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Growth Analytics</h3>
              <p className="text-gray-400">Track your performance with detailed analytics and insights to optimize your content.</p>
            </div>

            <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Community Support</h3>
              <p className="text-gray-400">Join our creator community for tips, collaboration opportunities, and exclusive deals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Campaigns Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Trending Campaigns</h2>
              <p className="text-xl text-gray-300">Hot opportunities that creators are loving right now</p>
            </div>
            <Link to="/content-rewards">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 px-6 py-3">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingCampaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-gradient-to-br from-gray-900 to-gray-800 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">{campaign.icon}</span>
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{campaign.brand}</CardTitle>
                        <CardDescription className="text-orange-400 text-sm">{campaign.type}</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-orange-500 text-white text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {campaign.growth}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-white text-lg font-semibold">{campaign.title}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-orange-400 font-medium">{campaign.rate}</span>
                    <span className="text-gray-400">{campaign.views} views</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white">
                    Join Campaign
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Browse Campaigns</h3>
              <p className="text-gray-400">Explore thousands of campaigns from top brands. Filter by category, payout rate, and requirements.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Create Content</h3>
              <p className="text-gray-400">Use your creativity to make engaging content that matches the campaign requirements.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Get Paid</h3>
              <p className="text-gray-400">Earn money based on views and engagement. Payouts are automatic and instant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators who are already making money with Clipper. 
            Your next viral hit could be just one campaign away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {user ? (
              <Link to="/content-rewards">
                <Button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl shadow-orange-500/25">
                  Explore Campaigns
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/content-rewards">
                  <Button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl shadow-orange-500/25">
                    Explore Campaigns
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="border-2 border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 px-8 py-4 text-lg font-semibold bg-transparent">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Discover;

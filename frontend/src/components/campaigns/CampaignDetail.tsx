import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, MessageCircle, MoreHorizontal, Star } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCampaigns } from '@/contexts/CampaignContext';
import { Campaign } from '@/contexts/CampaignContext';

const CampaignDetail: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { campaigns } = useCampaigns();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [message, setMessage] = useState('');

  const campaign = campaigns.find(c => c.id === Number(campaignId));

  if (!campaign) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
          <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const creator = {
    name: 'Alex G',
    username: '@coyprivacy',
    joinedDate: 'Apr 2025',
    earnings: '$1.00',
    rating: '0%',
    totalReviews: 1,
    avatar: '🐷',
    description: 'Creator of amazing content and viral clips'
  };

  const handleJoinCampaign = () => {
    // Handle joining campaign logic
    console.log('Joining campaign:', campaign.id);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleViewProfile = () => {
    setShowProfileModal(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-orange-500 font-bold text-xl">Clipper</span>
            </div>
            <div className="w-8"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Banner */}
            <div className="relative h-64 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <div className="text-3xl font-bold text-white">{campaign.brand}</div>
                  <div className="text-xl text-blue-200">API</div>
                </div>
              </div>
              {/* Digital interface elements overlay */}
              <div className="absolute top-4 left-4 text-blue-300 text-sm">⚙️</div>
              <div className="absolute top-4 right-4 text-blue-300 text-sm">🔗</div>
              <div className="absolute bottom-4 left-4 text-blue-300 text-sm">💻</div>
              <div className="absolute bottom-4 right-4 text-blue-300 text-sm">📡</div>
            </div>

            {/* Campaign Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">O</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Clip for {campaign.brand}!</h1>
                  <p className="text-gray-400">Social Media</p>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">
                Get paid to create viral clips! Join {campaign.brand}'s Clipping Program: clip our content, rack up views, and earn real money. Perfect for creators who want fast growth and cash.
              </p>
            </div>

            {/* About the Creator */}
            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-xl font-semibold text-white mb-4">About the creator</h2>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                    {creator.avatar}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{creator.name}</h3>
                  <p className="text-gray-400">{creator.username}</p>
                  <p className="text-gray-400">Joined {creator.joinedDate}</p>
                  
                  <div className="mt-4">
                    <Input
                      placeholder="Send creator a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mb-3"
                    />
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleSendMessage}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={!message.trim()}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                      <Button
                        onClick={handleViewProfile}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        View profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Join Section */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-700 sticky top-24">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold text-white">Free one-time purchase</h3>
                  <Button 
                    onClick={handleJoinCampaign}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg"
                  >
                    Join
                  </Button>
                  <div className="flex items-center justify-center space-x-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>Join 16,757 members</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Profile</h2>
              <Button
                variant="ghost"
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                  {creator.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{creator.name}</h3>
                  <p className="text-gray-400">{creator.username}</p>
                  <p className="text-gray-400">Joined {creator.joinedDate}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-white">{creator.earnings} Earnings</p>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400">{creator.rating} rating from {creator.totalReviews} total review</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                  <span className="mr-2">$</span>
                  Pay
                </Button>
                <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-center text-gray-400 mb-2">Reviews</h4>
                <div className="text-center text-gray-500 text-sm">
                  No reviews yet
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;

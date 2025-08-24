import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, DollarSign, Target, Calendar, Users, Globe, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCampaigns } from '@/contexts/CampaignContext';
import { useAuth } from '@/contexts/AuthContext';

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const { addCampaign } = useCampaigns();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    paymentRate: '',
    duration: '',
    targetAudience: '',
    platforms: [] as string[],
    requirements: '',
    tags: '',
  });

  const [platforms] = useState([
    { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black' },
    { id: 'youtube', name: 'YouTube', icon: '▶', color: 'bg-red-600' },
    { id: 'twitter', name: 'X (Twitter)', icon: '𝕏', color: 'bg-black' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-600' },
  ]);

  const [categories] = useState([
    'Gaming',
    'Finance',
    'Technology',
    'Fashion',
    'Health & Fitness',
    'Education',
    'Entertainment',
    'Sports',
    'Food & Lifestyle',
    'Business',
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Create campaign data
    const campaignData = {
      brand: user.companyName || user.firstName + ' ' + user.lastName,
      title: formData.title,
      rate: `$${formData.paymentRate} / 1K`,
      type: 'Clipping', // Default type, can be made configurable
      platforms: formData.platforms.map(platformId => {
        const platform = platforms.find(p => p.id === platformId);
        return platform ? platform.name : platformId;
      }),
      budget: `$${parseFloat(formData.budget).toLocaleString()}`,
      icon: '🚀', // Default icon, can be made configurable
      description: formData.description,
      category: formData.category,
      paymentRate: formData.paymentRate,
      duration: formData.duration,
      targetAudience: formData.targetAudience,
      requirements: formData.requirements,
      tags: formData.tags,
      verified: false, // New campaigns start as unverified
      views: '0',
      paidOut: '$0',
      percentage: 0,
    };

    // Add campaign to context
    addCampaign(campaignData);
    
    // Log for debugging
    console.log('Campaign creation:', formData);
    console.log('Processed campaign data:', campaignData);
    
    // Navigate back to home page to see the new campaign
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlatformToggle = (platformId: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(id => id !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-orange-500 font-bold text-xl">Clipper</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">Create Campaign</h1>
              {user && (
                <div className="text-sm text-gray-400">
                  Creating as: <span className="text-white font-medium">{user.companyName || `${user.firstName} ${user.lastName}`}</span>
                </div>
              )}
            </div>
            <div className="w-8"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <span className="text-white font-medium">Campaign Details</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-700"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-sm font-bold">2</span>
              </div>
              <span className="text-gray-400 font-medium">Review & Launch</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Target className="w-5 h-5 text-orange-500" />
                <span>Campaign Information</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Tell us about your campaign and what you want to achieve
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Campaign Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter campaign title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your campaign, goals, and what content creators should focus on"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-white">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="Enter tags separated by commas (e.g., gaming, esports, streaming)"
                  value={formData.tags}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Budget & Payment */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-orange-500" />
                <span>Budget & Payment</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Set your campaign budget and payment rates for content creators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-white">Total Budget *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      placeholder="0.00"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      className="pl-8 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentRate" className="text-white">Payment Rate *</Label>
                  <div className="relative">
                    <Input
                      id="paymentRate"
                      name="paymentRate"
                      placeholder="e.g., 2.00 per 1K views"
                      value={formData.paymentRate}
                      onChange={handleChange}
                      required
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-white">Campaign Duration</Label>
                  <Select value={formData.duration} onValueChange={(value) => handleSelectChange('duration', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="1-week" className="text-white hover:bg-gray-700">1 Week</SelectItem>
                      <SelectItem value="2-weeks" className="text-white hover:bg-gray-700">2 Weeks</SelectItem>
                      <SelectItem value="1-month" className="text-white hover:bg-gray-700">1 Month</SelectItem>
                      <SelectItem value="3-months" className="text-white hover:bg-gray-700">3 Months</SelectItem>
                      <SelectItem value="ongoing" className="text-white hover:bg-gray-700">Ongoing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="text-white">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    name="targetAudience"
                    placeholder="e.g., Gaming enthusiasts, 18-35"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platforms & Requirements */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Globe className="w-5 h-5 text-orange-500" />
                <span>Platforms & Requirements</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Choose where your campaign will be promoted and set content requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-white">Social Media Platforms *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform.id}
                        checked={formData.platforms.includes(platform.id)}
                        onCheckedChange={() => handlePlatformToggle(platform.id)}
                        className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <div className="flex items-center space-x-2">
                        <div className={`w-5 h-5 rounded-sm flex items-center justify-center text-white text-xs font-semibold ${platform.color}`}>
                          {platform.icon}
                        </div>
                        <Label htmlFor={platform.id} className="text-white text-sm cursor-pointer">
                          {platform.name}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-white">Content Requirements</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  placeholder="Specify what type of content you want, any guidelines, or specific requirements for creators"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Save Draft
            </Button>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Preview
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                Create Campaign
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;

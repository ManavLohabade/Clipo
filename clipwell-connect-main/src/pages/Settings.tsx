'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Lock, 
  Bell, 
  Link, 
  CreditCard, 
  Shield,
  Save,
  Camera,
  X,
  Check,
  AlertCircle,
  Wallet,
  Globe,
  Key
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SOCIAL_PLATFORMS = [
  { id: 'twitter', name: 'X (Twitter)', connected: true, followers: '12.5K' },
  { id: 'instagram', name: 'Instagram', connected: false, followers: null },
  { id: 'youtube', name: 'YouTube', connected: true, followers: '3.2K' },
  { id: 'tiktok', name: 'TikTok', connected: false, followers: null },
  { id: 'facebook', name: 'Facebook', connected: false, followers: null },
];

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || '',
  });

  const [notifications, setNotifications] = useState({
    campaignUpdates: true,
    submissionApprovals: true,
    paymentNotifications: true,
    weeklyDigest: false,
    emailMarketing: false,
  });

  const [walletSettings, setWalletSettings] = useState({
    walletAddress: '0x742d35Cc6Bf0532A9F8b9fB6C9A5b15e',
    preferredNetwork: 'base',
    autoWithdraw: false,
    minimumThreshold: '100',
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'There was an error updating your profile.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialConnect = (platform: string) => {
    toast({
      title: 'Social connection',
      description: `${platform} connection feature coming soon!`,
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.firstName || user.username} />
                  <AvatarFallback className="text-lg">
                    {(user.firstName?.[0] || user.username?.[0] || user.email[0]).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. Max size of 800KB.
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {user.role}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  placeholder={user.role === 'brand' ? 'Tell us about your brand...' : 'Tell us about yourself...'}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={isLoading} className="btn-hero">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Social Media Accounts
              </CardTitle>
              <CardDescription>
                {user.role === 'clipper' 
                  ? 'Connect your social media accounts to participate in campaigns'
                  : 'Link your social accounts for verification and analytics'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {SOCIAL_PLATFORMS.map((platform) => (
                <div key={platform.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{platform.name}</p>
                      {platform.connected && platform.followers && (
                        <p className="text-sm text-muted-foreground">{platform.followers} followers</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {platform.connected ? (
                      <>
                        <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/20">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                        <Button variant="outline" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSocialConnect(platform.name)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {key === 'campaignUpdates' && 'Campaign Updates'}
                      {key === 'submissionApprovals' && 'Submission Approvals'}
                      {key === 'paymentNotifications' && 'Payment Notifications'}
                      {key === 'weeklyDigest' && 'Weekly Digest'}
                      {key === 'emailMarketing' && 'Marketing Emails'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {key === 'campaignUpdates' && 'Get notified when campaigns you\'re involved in are updated'}
                      {key === 'submissionApprovals' && 'Notifications for submission approvals and rejections'}
                      {key === 'paymentNotifications' && 'Payment confirmations and payout notifications'}
                      {key === 'weeklyDigest' && 'Weekly summary of your activity and earnings'}
                      {key === 'emailMarketing' && 'Product updates and promotional content'}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, [key]: checked })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet & Payments
              </CardTitle>
              <CardDescription>
                Manage your crypto wallet and payment preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="walletAddress"
                    value={walletSettings.walletAddress}
                    onChange={(e) => setWalletSettings({ ...walletSettings, walletAddress: e.target.value })}
                    placeholder="0x..."
                  />
                  <Button variant="outline">Verify</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Network</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={walletSettings.preferredNetwork === 'base' ? 'default' : 'outline'}
                    onClick={() => setWalletSettings({ ...walletSettings, preferredNetwork: 'base' })}
                  >
                    Base
                  </Button>
                  <Button 
                    variant={walletSettings.preferredNetwork === 'polygon' ? 'default' : 'outline'}
                    onClick={() => setWalletSettings({ ...walletSettings, preferredNetwork: 'polygon' })}
                  >
                    Polygon
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-withdraw</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically withdraw earnings above threshold
                  </p>
                </div>
                <Switch
                  checked={walletSettings.autoWithdraw}
                  onCheckedChange={(checked) => 
                    setWalletSettings({ ...walletSettings, autoWithdraw: checked })
                  }
                />
              </div>

              {walletSettings.autoWithdraw && (
                <div className="space-y-2">
                  <Label htmlFor="threshold">Minimum Threshold (USDC)</Label>
                  <Input
                    id="threshold"
                    value={walletSettings.minimumThreshold}
                    onChange={(e) => setWalletSettings({ ...walletSettings, minimumThreshold: e.target.value })}
                    placeholder="100"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-amber-600 border-amber-600/20">
                      Not Enabled
                    </Badge>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">KYC Verification</p>
                      <p className="text-sm text-muted-foreground">Identity verification status</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/20">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Danger Zone</h4>
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div>
                    <p className="font-medium text-destructive">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
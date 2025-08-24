'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Users, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';

const BRAND_LOGOS = [
  { name: 'Spotify', width: 120 },
  { name: 'Allianz', width: 100 },
  { name: 'Coca-Cola', width: 140 },
  { name: 'Gillette', width: 110 },
  { name: 'Netflix', width: 100 },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'AI-Powered Matching',
    description: 'Our AI connects brands with the perfect creators based on audience, engagement, and brand alignment.',
  },
  {
    icon: Shield,
    title: 'Fraud Protection',
    description: 'Advanced fraud detection ensures authentic engagement and protects both brands and creators.',
  },
  {
    icon: DollarSign,
    title: 'Crypto & Fiat Payouts',
    description: 'Flexible payment options with USDC on Base/Polygon or traditional fiat via Stripe.',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Analytics',
    description: 'Track campaign performance with comprehensive analytics and ROI insights.',
  },
  {
    icon: Users,
    title: 'Global Creator Network',
    description: 'Access thousands of verified micro-creators across all major social platforms.',
  },
  {
    icon: Globe,
    title: 'Multi-Platform Support',
    description: 'Run campaigns across X, Instagram, YouTube, TikTok, and Facebook seamlessly.',
  },
];

const STATS = [
  { value: '10M+', label: 'Content Views Generated' },
  { value: '5K+', label: 'Active Creators' },
  { value: '500+', label: 'Brand Partners' },
  { value: '$2M+', label: 'Creator Earnings Paid' },
];

export default function LandingPage() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<UserRole | null>(null);

  const handleRoleSelection = async (role: UserRole) => {
    if (role === 'guest') {
      navigate('/auth/login');
      return;
    }

    setIsLoading(role);
    try {
      await loginAs(role);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
            <span className="text-xl font-bold text-gradient">Clipper Dapp</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <Button variant="outline" onClick={() => navigate('/auth/login')}>Sign In</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-mesh overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 -right-10 w-60 h-60 bg-primary-glow/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 left-1/3 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 animate-fade-in">
              🚀 Phase 2 AI Features Now Live
            </Badge>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Start crafting your{' '}
              <span className="text-gradient animate-pulse-glow">brand story</span>
            </h1>
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              PARTNER WITH US TO CREATE A{' '}
              <span className="relative inline-block">
                <span className="bg-primary text-primary-foreground px-4 py-2 rounded-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300 hover:scale-105">
                  COMPELLING
                </span>
              </span>{' '}
              NARRATIVE FOR YOUR BRAND!
            </h2>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
              Let's bring your ideas to life, start collaborating with our creative 
              agency and turn your vision into reality.
            </p>

            {/* Main Role Selection Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <Card className="card-glass hover:shadow-glow transition-all duration-500 group cursor-pointer border-2 hover:border-primary/50 hover:scale-105 hover:-translate-y-2"
                    onClick={() => handleRoleSelection('brand')}>
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-glow group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Join as Brand</CardTitle>
                  <CardDescription>Launch campaigns and connect with creators</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Create campaigns
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      AI-powered matching
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Real-time analytics
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full btn-hero" 
                    disabled={isLoading === 'brand'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelection('brand');
                    }}
                  >
                    {isLoading === 'brand' ? 'Loading...' : 'Get Started'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="card-glass hover:shadow-glow transition-all duration-500 group cursor-pointer border-2 hover:border-primary/50 hover:scale-105 hover:-translate-y-2"
                    onClick={() => handleRoleSelection('clipper')}>
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-glow group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Join as Creator</CardTitle>
                  <CardDescription>Monetize your content and build your brand</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Earn from content
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Flexible payouts
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Creative tools
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full btn-hero" 
                    disabled={isLoading === 'clipper'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelection('clipper');
                    }}
                  >
                    {isLoading === 'clipper' ? 'Loading...' : 'Start Creating'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Admin Access - Separate Section */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">Platform Administration</p>
              </div>
              <div className="max-w-sm mx-auto">
                <Card className="card-glass hover:shadow-glow transition-all duration-300 group cursor-pointer border-2 hover:border-primary/50"
                      onClick={() => handleRoleSelection('admin')}>
                  <CardHeader className="text-center pb-2">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:animate-pulse-glow">
                      <Shield className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-base">Admin Access</CardTitle>
                    <CardDescription className="text-sm">Platform management and oversight</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full" 
                      disabled={isLoading === 'admin'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleSelection('admin');
                      }}
                    >
                      {isLoading === 'admin' ? 'Loading...' : 'Admin Panel'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-hero-outline"
                onClick={() => navigate('/auth/login')}
              >
                Already have an account? Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Trusted by brands */}
        <div className="mt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground mb-8">Trusted by leading brands worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
              {BRAND_LOGOS.map((brand) => (
                <div key={brand.name} className="text-2xl font-bold text-muted-foreground">
                  {brand.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Clipper Dapp?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The most advanced platform for brand-creator collaboration, powered by cutting-edge technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <Card key={index} className="card-glass hover:shadow-glow transition-all duration-500 group hover:scale-105 hover:-translate-y-1" 
                    style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse-glow group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary-glow/10 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Transform Your Brand Story?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of brands and creators already using Clipper Dapp to create compelling narratives and drive engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hero" onClick={() => handleRoleSelection('brand')}>
              Start as Brand
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="btn-hero-outline" onClick={() => handleRoleSelection('clipper')}>
              Join as Creator
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">Clipper Dapp</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>35 N Dearborn ST, Chicago, IL 60601, USA</span>
              <span>+1-202-555-0156</span>
              <span>info@clipper.dao</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2023 Clipper Dapp. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
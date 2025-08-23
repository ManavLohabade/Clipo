'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  TrendingUp, 
  Users, 
  Shield,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserRole } from '@/types';

export default function Login() {
  const { login, loginAs, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState<UserRole | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setIsDemoLoading(role);
    try {
      await loginAs(role);
      toast({
        title: `Welcome ${role}!`,
        description: `You are now logged in as a ${role}.`,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Demo login failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 bg-mesh">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient">Clipper DAO</span>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full btn-hero" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <div className="text-center text-sm">
                <Link 
                  to="/auth/register" 
                  className="text-primary hover:underline"
                >
                  Don't have an account? Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Demo Access */}
        <Card className="card-glass mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Demo
              </Badge>
              Quick Access
            </CardTitle>
            <CardDescription>
              Try the platform instantly with demo accounts
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDemoLogin('brand')}
              disabled={isDemoLoading === 'brand'}
            >
              <TrendingUp className="h-4 w-4 mr-3" />
              {isDemoLoading === 'brand' ? 'Loading...' : 'Continue as Brand'}
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDemoLogin('clipper')}
              disabled={isDemoLoading === 'clipper'}
            >
              <Users className="h-4 w-4 mr-3" />
              {isDemoLoading === 'clipper' ? 'Loading...' : 'Continue as Creator'}
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDemoLogin('admin')}
              disabled={isDemoLoading === 'admin'}
            >
              <Shield className="h-4 w-4 mr-3" />
              {isDemoLoading === 'admin' ? 'Loading...' : 'Continue as Admin'}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
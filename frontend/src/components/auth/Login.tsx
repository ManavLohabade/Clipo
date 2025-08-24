import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Mail, Lock, Users, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
      
      // Redirect to appropriate page based on user role
      navigate('/discover');
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-black border-r border-gray-800 p-6">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-orange-500 font-bold text-xl">Clipo</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link to="/discover" className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
              <span>Discover</span>
            </Link>
            <Link to="/create-campaign" className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-colors">
              <Building className="w-5 h-5" />
              <span>Create a campaign</span>
            </Link>
            <Link to="/login" className="flex items-center space-x-3 p-3 bg-gray-900 rounded-lg text-white">
              <Mail className="w-5 h-5" />
              <span>Login</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>

          {/* Login Form Card */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4">
                  <span className="text-white font-bold text-3xl">C</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Sign in to Clipo</h1>
                <p className="text-gray-400 mt-2">Welcome back! Please sign in to your account</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              {/* Demo Login Options */}
              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center text-sm text-gray-400 mb-4">Or continue with demo accounts</div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/discover')} 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isLoading}
                  >
                    Continue as Content Creator (Demo)
                  </Button>
                  <Button 
                    onClick={() => navigate('/discover')} 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isLoading}
                  >
                    Continue as Brand (Demo)
                  </Button>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-400 hover:underline font-medium">
                    Create one
                  </Link>
                </p>
              </div>

              {/* Terms */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-400">
                  By signing in you agree to our{' '}
                  <a href="#" className="text-blue-400 hover:underline">terms of service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-400 hover:underline">privacy policy</a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
          <div className="w-full h-full bg-gradient-to-tl from-orange-500 to-red-500 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;

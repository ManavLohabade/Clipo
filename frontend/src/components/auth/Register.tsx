import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Mail, Lock, User, Building, Users, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: '' as UserRole,
    companyName: '',
    bio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      
      const profile = formData.role === 'brand' 
        ? { companyName: formData.companyName, website: '', description: '' }
        : { bio: formData.bio, categories: [], socialLinks: [] };

      await register(formData.email, formData.password, formData.role, profile);
      
      // Redirect based on role
      if (formData.role === 'brand') {
        navigate('/create-campaign');
      } else {
        navigate('/discover');
      }
    } catch (error: any) {
      setError(error.message || 'Registration failed');
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
            <Link to="/login" className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-colors">
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

          {/* Register Form Card */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4">
                  <span className="text-white font-bold text-3xl">C</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Create your account</h1>
                <p className="text-gray-400 mt-2">Join Clipper and start your journey</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">I want to join as *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="clipper" className="text-white hover:bg-gray-700">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Content Creator (Clipper)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="brand" className="text-white hover:bg-gray-700">
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4" />
                          <span>Brand/Company</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">First Name *</Label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 h-12 text-base pl-10"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                    <div className="relative">
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 h-12 text-base pl-10"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role-specific fields */}
                {formData.role === 'brand' && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-white">Company Name *</Label>
                    <div className="relative">
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        placeholder="Your company name"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 h-12 text-base pl-10"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Building className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

                {formData.role === 'clipper' && (
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <div className="relative">
                      <Input
                        id="bio"
                        name="bio"
                        type="text"
                        placeholder="Tell us about yourself"
                        value={formData.bio}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 h-12 text-base pl-10"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 h-12 text-base pl-10"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 h-12 text-base pl-10"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 h-12 text-base pl-10"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading || !formData.role}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 text-base font-medium"
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>

              {/* Separator */}
              <div className="relative my-6">
                <Separator className="bg-gray-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-gray-900 px-4 text-gray-400 text-sm">OR</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-400 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Terms */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-400">
                  By creating an account you agree to our{' '}
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

export default Register;

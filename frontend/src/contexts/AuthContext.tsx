'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { AuthService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAs: (role: UserRole) => Promise<void>; // Demo mode
  logout: () => Promise<void>;
  register: (email: string, password: string, role: UserRole, profile: any) => Promise<void>;
  connectWallet: (address: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  walletAddress: string | null;
  isWalletConnected: boolean;
  getProfileData: () => { name?: string; email?: string; avatar?: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const DEMO_USERS: Record<UserRole, User> = {
  brand: {
    id: 'demo-brand-1',
    email: 'brand@demo.com',
    username: 'demo_brand',
    role: 'brand',
    firstName: 'Demo',
    lastName: 'Brand',
    avatar: '/api/placeholder/128/128',
    isKycVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  clipper: {
    id: 'demo-clipper-1',
    email: 'clipper@demo.com',
    username: 'demo_clipper',
    role: 'clipper',
    firstName: 'Demo',
    lastName: 'Creator',
    avatar: '/api/placeholder/128/128',
    isKycVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  admin: {
    id: 'demo-admin-1',
    email: 'admin@demo.com',
    username: 'demo_admin',
    role: 'admin',
    firstName: 'Demo',
    lastName: 'Admin',
    avatar: '/api/placeholder/128/128',
    isKycVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  guest: {
    id: 'guest',
    email: 'guest@example.com',
    username: 'guest',
    role: 'guest',
    firstName: 'Guest',
    lastName: 'User',
    avatar: '/api/placeholder/128/128',
    isKycVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const response = await AuthService.getProfile();
          if (response.data) {
            setUser(response.data);
          } else {
            localStorage.removeItem('accessToken');
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      if (response.data) {
        const { user: userData, accessToken } = response.data;
        setUser(userData);
        localStorage.setItem('accessToken', accessToken);
      } else {
        throw new Error(response.error?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginAs = async (role: UserRole) => {
    // Demo mode - use mock data
    const demoUser = DEMO_USERS[role];
    if (demoUser) {
      setUser(demoUser);
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
    }
  };

  const register = async (email: string, password: string, role: UserRole, profile: any) => {
    try {
      const response = await AuthService.register(email, password, role, profile);
      if (response.data) {
        // After successful registration, automatically log in
        await login(email, password);
      } else {
        throw new Error(response.error?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setWalletAddress(null);
    setIsWalletConnected(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('demoUser');
  };

  const connectWallet = async (address: string) => {
    setWalletAddress(address);
    setIsWalletConnected(true);
  };

  const disconnectWallet = async () => {
    setWalletAddress(null);
    setIsWalletConnected(false);
  };

  const getProfileData = () => {
    if (!user) return null;
    return {
      name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined,
      email: user.email,
      avatar: user.avatar
    };
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginAs,
    logout,
    register,
    connectWallet,
    disconnectWallet,
    walletAddress,
    isWalletConnected,
    getProfileData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
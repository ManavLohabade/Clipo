'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAs: (role: UserRole) => Promise<void>; // Demo mode
  logout: () => Promise<void>;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  connectWallet: (address: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  walletAddress: string | null;
  isWalletConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: Record<UserRole, User> = {
  guest: {
    id: 'guest-1',
    email: 'guest@clipper.dao',
    username: 'guest',
    firstName: 'Guest',
    lastName: 'User',
    role: 'guest',
    isKycVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  brand: {
    id: 'brand-1',
    email: 'brand@nike.com',
    username: 'nike_official',
    firstName: 'Nike',
    lastName: 'Brand',
    avatar: '/api/placeholder/64/64',
    role: 'brand',
    isKycVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  clipper: {
    id: 'clipper-1',
    email: 'creator@example.com',
    username: 'creative_clipper',
    firstName: 'Alex',
    lastName: 'Creator',
    avatar: '/api/placeholder/64/64',
    role: 'clipper',
    isKycVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  admin: {
    id: 'admin-1',
    email: 'admin@clipper.dao',
    username: 'admin',
    firstName: 'System',
    lastName: 'Admin',
    avatar: '/api/placeholder/64/64',
    role: 'admin',
    isKycVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Simulate loading user from localStorage or API
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('clipper_user');
        const savedWallet = localStorage.getItem('clipper_wallet');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedWallet) {
          setWalletAddress(savedWallet);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find mock user by email
      const mockUser = Object.values(MOCK_USERS).find(u => u.email === email);
      if (!mockUser) {
        throw new Error('Invalid credentials');
      }

      setUser(mockUser);
      localStorage.setItem('clipper_user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAs = async (role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser = MOCK_USERS[role];
      setUser(mockUser);
      localStorage.setItem('clipper_user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `${role}-${Date.now()}`,
        email,
        username: email.split('@')[0],
        firstName: '',
        lastName: '',
        role,
        isKycVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(newUser);
      localStorage.setItem('clipper_user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setWalletAddress(null);
    localStorage.removeItem('clipper_user');
    localStorage.removeItem('clipper_wallet');
  };

  const connectWallet = async (address: string) => {
    setWalletAddress(address);
    localStorage.setItem('clipper_wallet', address);
  };

  const disconnectWallet = async () => {
    setWalletAddress(null);
    localStorage.removeItem('clipper_wallet');
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
    isWalletConnected: !!walletAddress,
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
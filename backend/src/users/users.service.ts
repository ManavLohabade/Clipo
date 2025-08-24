import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';

// Simple interface for in-memory storage
interface SimpleUser {
  id: string;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'clipper' | 'brand' | 'admin';
  isVerified: boolean;
  isActive: boolean;
  walletAddress?: string;
  companyName?: string;
  website?: string;
  description?: string;
  industry?: string;
  teamSize?: string;
  bio?: string;
  categories: string[];
  socialLinks: Array<{
    platform: string;
    username: string;
    url: string;
    verified: boolean;
    followers?: number;
  }>;
  socialMediaAccounts?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
  };
  campaigns: any[];
  engagements: any[];
  totalEarnings: number;
  totalCampaigns: number;
  totalSubmissions: number;
  approvalRate: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  private users: SimpleUser[] = [];
  private nextId = 1;

  async create(createUserDto: CreateUserDto): Promise<SimpleUser> {
    const user: SimpleUser = {
      id: (this.nextId++).toString(),
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password, // In production, this should be hashed
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      avatar: createUserDto.avatar,
      role: createUserDto.role || 'clipper',
      isVerified: false,
      isActive: true,
      walletAddress: createUserDto.walletAddress,
      companyName: createUserDto.companyName,
      website: createUserDto.website,
      description: createUserDto.description,
      industry: createUserDto.industry,
      teamSize: createUserDto.teamSize,
      bio: createUserDto.bio,
      categories: createUserDto.categories || [],
      socialLinks: createUserDto.socialLinks?.map(link => ({
        ...link,
        verified: link.verified || false
      })) || [],
      socialMediaAccounts: createUserDto.socialMediaAccounts,
      campaigns: [],
      engagements: [],
      totalEarnings: 0,
      totalCampaigns: 0,
      totalSubmissions: 0,
      approvalRate: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<SimpleUser | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findById(id: string): Promise<SimpleUser | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findAll(): Promise<SimpleUser[]> {
    return this.users;
  }
}

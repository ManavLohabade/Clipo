import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      // Return user without password
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      id: user.id, 
      email: user.email, 
      username: user.username, 
      role: user.role 
    };
    
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        walletAddress: user.walletAddress,
        companyName: user.companyName,
        bio: user.bio,
        categories: user.categories,
        socialLinks: user.socialLinks,
        socialMediaAccounts: user.socialMediaAccounts,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    try {
      // Check if user already exists
      const existingUser = await this.usersService.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Validate role-specific requirements
      if (createUserDto.role === 'brand') {
        if (!createUserDto.companyName) {
          throw new BadRequestException('Company name is required for brand accounts');
        }
      }

      if (createUserDto.role === 'clipper') {
        if (!createUserDto.bio) {
          // Set a default bio if none provided
          createUserDto.bio = 'Content creator on Clipper';
        }
      }

      // Set default role if not specified
      if (!createUserDto.role) {
        createUserDto.role = 'clipper';
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const userData = { ...createUserDto, password: hashedPassword };

      const user = await this.usersService.create(userData);
      return this.login(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  }

  async refreshToken(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { 
      id: user.id, 
      email: user.email, 
      username: user.username, 
      role: user.role 
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

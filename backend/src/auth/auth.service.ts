import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto';
import { User, UserDocument } from '../users/schemas/user.schema';
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
      // Convert to plain object and remove password
      const userObj = (user as any).toObject ? (user as any).toObject() : user;
      const { password: _, ...result } = userObj;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const userId = (user as any)._id?.toString() || user.id;
    const payload = { 
      id: userId, 
      email: user.email, 
      username: user.username, 
      role: user.role 
    };
    
    return {
      user: {
        id: userId,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        walletAddress: user.walletAddress,
        socialMediaAccounts: user.socialMediaAccounts,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return this.login(user);
    } catch (error) {
      if (error instanceof ConflictException) {
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
      id: (user as any)._id?.toString() || userId, 
      email: user.email, 
      username: user.username, 
      role: user.role 
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

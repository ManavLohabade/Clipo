import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtUtils {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate JWT token for user
   */
  generateToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '24h',
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Decode JWT token without verification
   */
  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  /**
   * Generate access and refresh tokens
   */
  generateTokenPair(payload: any): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m', // Short lived access token
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '7d', // Long lived refresh token
    });

    return { accessToken, refreshToken };
  }

  /**
   * Generate admin token with extended expiry
   */
  generateAdminToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '24h', // Extended expiry for admin
    });
  }

  /**
   * Generate temporary token for password reset
   */
  generatePasswordResetToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1h', // Short lived for security
    });
  }
}

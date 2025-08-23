import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { EngagementModule } from './engagement/engagement.module';
import { Web3Module } from './web3/web3.module';
import { SocialMediaModule } from './social-media/social-media.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'env.local', 'env.example'],
    }),

    // Database - MongoDB (compatible configuration for NestJS v10 + Mongoose v7)
    MongooseModule.forRoot('mongodb://localhost:27017/Clipper_DApp'),

    // JWT Configuration
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),

    // Authentication
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Feature modules
    AuthModule,
    UsersModule,
    CampaignsModule,
    EngagementModule,
    Web3Module,
    SocialMediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

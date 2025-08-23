import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EngagementController } from './engagement.controller';
import { EngagementService } from './engagement.service';
import { Engagement, EngagementSchema } from './schemas/engagement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Engagement.name, schema: EngagementSchema }
    ])
  ],
  controllers: [EngagementController],
  providers: [EngagementService],
  exports: [EngagementService, MongooseModule],
})
export class EngagementModule {}

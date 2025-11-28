import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhcCenter } from './entities/phc-center.entity';
import { FacilitiesService } from './facilities.service';
import {
  FacilitiesController,
  PublicFacilitiesController,
  NotificationTypesController,
} from './facilities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PhcCenter])],
  providers: [FacilitiesService],
  controllers: [PublicFacilitiesController, FacilitiesController, NotificationTypesController],
  exports: [FacilitiesService],
})
export class FacilitiesModule {}

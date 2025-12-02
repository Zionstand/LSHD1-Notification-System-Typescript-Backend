import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalsController } from './vitals.controller';
import { VitalsService } from './vitals.service';
import { VitalRecord } from './entities/vital-record.entity';
import { Screening } from '../screenings/entities/screening.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VitalRecord, Screening])],
  controllers: [VitalsController],
  providers: [VitalsService],
  exports: [VitalsService],
})
export class VitalsModule {}

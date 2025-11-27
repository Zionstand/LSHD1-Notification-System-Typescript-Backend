import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Screening } from '../screenings/entities/screening.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Screening])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}

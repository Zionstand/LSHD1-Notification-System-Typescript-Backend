import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Screening } from '../screenings/entities/screening.entity';
import { Patient } from '../patients/entities/patient.entity';
import { HypertensionScreening } from '../screenings/entities/hypertension-screening.entity';
import { DiabetesScreening } from '../screenings/entities/diabetes-screening.entity';
import { CervicalScreening } from '../screenings/entities/cervical-screening.entity';
import { BreastScreening } from '../screenings/entities/breast-screening.entity';
import { PsaScreening } from '../screenings/entities/psa-screening.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Screening,
      Patient,
      HypertensionScreening,
      DiabetesScreening,
      CervicalScreening,
      BreastScreening,
      PsaScreening,
    ]),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}

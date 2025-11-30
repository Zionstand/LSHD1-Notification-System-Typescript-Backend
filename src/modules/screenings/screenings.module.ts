import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Screening } from "./entities/screening.entity";
import { HypertensionScreening } from "./entities/hypertension-screening.entity";
import { DiabetesScreening } from "./entities/diabetes-screening.entity";
import { CervicalScreening } from "./entities/cervical-screening.entity";
import { BreastScreening } from "./entities/breast-screening.entity";
import { PsaScreening } from "./entities/psa-screening.entity";
import { ScreeningsService } from "./screenings.service";
import { PathwayScreeningsService } from "./pathway-screenings.service";
import { ScreeningsController } from "./screenings.controller";
import { PathwayScreeningsController } from "./pathway-screenings.controller";
// import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Screening,
      HypertensionScreening,
      DiabetesScreening,
      CervicalScreening,
      BreastScreening,
      PsaScreening,
    ]),
    // forwardRef(() => NotificationsModule),
  ],
  providers: [ScreeningsService, PathwayScreeningsService],
  controllers: [ScreeningsController, PathwayScreeningsController],
  exports: [ScreeningsService, PathwayScreeningsService],
})
export class ScreeningsModule {}

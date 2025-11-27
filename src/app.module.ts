import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { ScreeningsModule } from './modules/screenings/screenings.module';
import { FacilitiesModule } from './modules/facilities/facilities.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT') || 3306,
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // Don't auto-sync - use existing schema
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PatientsModule,
    ScreeningsModule,
    FacilitiesModule,
    DashboardModule,
    AppointmentsModule,
  ],
})
export class AppModule {}

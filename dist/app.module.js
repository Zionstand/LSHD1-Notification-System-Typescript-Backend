"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const patients_module_1 = require("./modules/patients/patients.module");
const screenings_module_1 = require("./modules/screenings/screenings.module");
const facilities_module_1 = require("./modules/facilities/facilities.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const appointments_module_1 = require("./modules/appointments/appointments.module");
const audit_module_1 = require("./modules/audit/audit.module");
const reports_module_1 = require("./modules/reports/reports.module");
const sms_module_1 = require("./modules/sms/sms.module");
const vitals_module_1 = require("./modules/vitals/vitals.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: "mysql",
                    host: configService.get("DB_HOST"),
                    port: configService.get("DB_PORT") || 3306,
                    username: configService.get("DB_USER"),
                    password: configService.get("DB_PASSWORD"),
                    database: configService.get("DB_NAME"),
                    entities: [__dirname + "/**/*.entity{.ts,.js}"],
                    synchronize: false,
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            patients_module_1.PatientsModule,
            screenings_module_1.ScreeningsModule,
            facilities_module_1.FacilitiesModule,
            dashboard_module_1.DashboardModule,
            appointments_module_1.AppointmentsModule,
            audit_module_1.AuditModule,
            reports_module_1.ReportsModule,
            sms_module_1.SmsModule,
            vitals_module_1.VitalsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
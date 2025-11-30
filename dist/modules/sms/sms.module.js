"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const sms_service_1 = require("./sms.service");
const sms_controller_1 = require("./sms.controller");
const sms_log_entity_1 = require("./entities/sms-log.entity");
const patient_entity_1 = require("../patients/entities/patient.entity");
const appointment_entity_1 = require("../appointments/entities/appointment.entity");
const screening_entity_1 = require("../screenings/entities/screening.entity");
const audit_module_1 = require("../audit/audit.module");
let SmsModule = class SmsModule {
};
exports.SmsModule = SmsModule;
exports.SmsModule = SmsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([sms_log_entity_1.SmsLog, patient_entity_1.Patient, appointment_entity_1.Appointment, screening_entity_1.Screening]),
            config_1.ConfigModule,
            audit_module_1.AuditModule,
        ],
        controllers: [sms_controller_1.SmsController],
        providers: [sms_service_1.SmsService],
        exports: [sms_service_1.SmsService],
    })
], SmsModule);
//# sourceMappingURL=sms.module.js.map
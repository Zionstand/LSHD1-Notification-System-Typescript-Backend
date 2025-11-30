"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reports_service_1 = require("./reports.service");
const reports_controller_1 = require("./reports.controller");
const screening_entity_1 = require("../screenings/entities/screening.entity");
const patient_entity_1 = require("../patients/entities/patient.entity");
const hypertension_screening_entity_1 = require("../screenings/entities/hypertension-screening.entity");
const diabetes_screening_entity_1 = require("../screenings/entities/diabetes-screening.entity");
const cervical_screening_entity_1 = require("../screenings/entities/cervical-screening.entity");
const breast_screening_entity_1 = require("../screenings/entities/breast-screening.entity");
const psa_screening_entity_1 = require("../screenings/entities/psa-screening.entity");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                screening_entity_1.Screening,
                patient_entity_1.Patient,
                hypertension_screening_entity_1.HypertensionScreening,
                diabetes_screening_entity_1.DiabetesScreening,
                cervical_screening_entity_1.CervicalScreening,
                breast_screening_entity_1.BreastScreening,
                psa_screening_entity_1.PsaScreening,
            ]),
        ],
        providers: [reports_service_1.ReportsService],
        controllers: [reports_controller_1.ReportsController],
        exports: [reports_service_1.ReportsService],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map
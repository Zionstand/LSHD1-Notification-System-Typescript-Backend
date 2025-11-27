"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const screening_entity_1 = require("./entities/screening.entity");
const hypertension_screening_entity_1 = require("./entities/hypertension-screening.entity");
const diabetes_screening_entity_1 = require("./entities/diabetes-screening.entity");
const cervical_screening_entity_1 = require("./entities/cervical-screening.entity");
const breast_screening_entity_1 = require("./entities/breast-screening.entity");
const psa_screening_entity_1 = require("./entities/psa-screening.entity");
const screenings_service_1 = require("./screenings.service");
const pathway_screenings_service_1 = require("./pathway-screenings.service");
const screenings_controller_1 = require("./screenings.controller");
const pathway_screenings_controller_1 = require("./pathway-screenings.controller");
let ScreeningsModule = class ScreeningsModule {
};
exports.ScreeningsModule = ScreeningsModule;
exports.ScreeningsModule = ScreeningsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                screening_entity_1.Screening,
                hypertension_screening_entity_1.HypertensionScreening,
                diabetes_screening_entity_1.DiabetesScreening,
                cervical_screening_entity_1.CervicalScreening,
                breast_screening_entity_1.BreastScreening,
                psa_screening_entity_1.PsaScreening,
            ]),
        ],
        providers: [screenings_service_1.ScreeningsService, pathway_screenings_service_1.PathwayScreeningsService],
        controllers: [screenings_controller_1.ScreeningsController, pathway_screenings_controller_1.PathwayScreeningsController],
        exports: [screenings_service_1.ScreeningsService, pathway_screenings_service_1.PathwayScreeningsService],
    })
], ScreeningsModule);
//# sourceMappingURL=screenings.module.js.map
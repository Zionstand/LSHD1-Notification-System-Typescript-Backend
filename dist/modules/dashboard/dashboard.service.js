"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("../patients/entities/patient.entity");
const screening_entity_1 = require("../screenings/entities/screening.entity");
let DashboardService = class DashboardService {
    constructor(patientsRepository, screeningsRepository) {
        this.patientsRepository = patientsRepository;
        this.screeningsRepository = screeningsRepository;
    }
    async getStats(facilityId) {
        const shouldFilterByFacility = facilityId && facilityId > 0;
        const totalClientsQuery = this.patientsRepository.createQueryBuilder('p');
        if (shouldFilterByFacility) {
            totalClientsQuery.where('p.phcCenterId = :facilityId', { facilityId });
        }
        const totalClients = await totalClientsQuery.getCount();
        const todayScreeningsQuery = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoin('s.patient', 'p')
            .where('DATE(s.createdAt) = CURDATE()');
        if (shouldFilterByFacility) {
            todayScreeningsQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        const todayScreenings = await todayScreeningsQuery.getCount();
        const pendingScreeningsQuery = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoin('s.patient', 'p')
            .where('s.status IN (:...statuses)', { statuses: ['pending', 'in_progress'] });
        if (shouldFilterByFacility) {
            pendingScreeningsQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        const pendingScreenings = await pendingScreeningsQuery.getCount();
        const completedTodayQuery = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoin('s.patient', 'p')
            .where('s.status = :status', { status: 'completed' })
            .andWhere('DATE(s.createdAt) = CURDATE()');
        if (shouldFilterByFacility) {
            completedTodayQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        const completedToday = await completedTodayQuery.getCount();
        return {
            totalClients,
            todayScreenings,
            pendingScreenings,
            completedToday,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(1, (0, typeorm_1.InjectRepository)(screening_entity_1.Screening)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map
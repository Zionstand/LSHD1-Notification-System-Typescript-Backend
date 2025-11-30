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
const appointment_entity_1 = require("../appointments/entities/appointment.entity");
let DashboardService = class DashboardService {
    constructor(patientsRepository, screeningsRepository, appointmentsRepository) {
        this.patientsRepository = patientsRepository;
        this.screeningsRepository = screeningsRepository;
        this.appointmentsRepository = appointmentsRepository;
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
    async getExtendedStats(facilityId) {
        const basicStats = await this.getStats(facilityId);
        const shouldFilterByFacility = facilityId && facilityId > 0;
        const screeningsByTypeQuery = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoin('s.patient', 'p')
            .select('s.screeningType', 'type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('s.screeningType');
        if (shouldFilterByFacility) {
            screeningsByTypeQuery.where('p.phcCenterId = :facilityId', { facilityId });
        }
        const screeningsByType = await screeningsByTypeQuery.getRawMany();
        const totalScreeningsQuery = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoin('s.patient', 'p');
        if (shouldFilterByFacility) {
            totalScreeningsQuery.where('p.phcCenterId = :facilityId', { facilityId });
        }
        const totalScreenings = await totalScreeningsQuery.getCount();
        const completedScreeningsQuery = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoin('s.patient', 'p')
            .where('s.status = :status', { status: 'completed' });
        if (shouldFilterByFacility) {
            completedScreeningsQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        const completedScreenings = await completedScreeningsQuery.getCount();
        const completionRate = totalScreenings > 0
            ? Math.round((completedScreenings / totalScreenings) * 100 * 100) / 100
            : 0;
        const referralsQuery = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoin('s.patient', 'p')
            .where('s.referralFacility IS NOT NULL')
            .andWhere('s.referralFacility != ""');
        if (shouldFilterByFacility) {
            referralsQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        const referrals = await referralsQuery.getCount();
        const referralRate = totalScreenings > 0
            ? Math.round((referrals / totalScreenings) * 100 * 100) / 100
            : 0;
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const thisWeekQuery = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoin('s.patient', 'p')
            .where('s.createdAt >= :weekStart', { weekStart });
        if (shouldFilterByFacility) {
            thisWeekQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        const thisWeekScreenings = await thisWeekQuery.getCount();
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        const thisMonthQuery = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoin('s.patient', 'p')
            .where('s.createdAt >= :monthStart', { monthStart });
        if (shouldFilterByFacility) {
            thisMonthQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        const thisMonthScreenings = await thisMonthQuery.getCount();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const upcomingAppointmentsQuery = this.appointmentsRepository
            .createQueryBuilder('a')
            .leftJoin('a.patient', 'p')
            .where('a.appointmentDate >= :today', { today })
            .andWhere('a.appointmentDate < :nextWeek', { nextWeek })
            .andWhere('a.status = :status', { status: 'scheduled' });
        if (shouldFilterByFacility) {
            upcomingAppointmentsQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        const upcomingAppointments = await upcomingAppointmentsQuery.getCount();
        const newClientsQuery = this.patientsRepository
            .createQueryBuilder('p')
            .where('p.createdAt >= :monthStart', { monthStart });
        if (shouldFilterByFacility) {
            newClientsQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        const newClientsThisMonth = await newClientsQuery.getCount();
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayQuery = this.screeningsRepository
                .createQueryBuilder('s')
                .leftJoin('s.patient', 'p')
                .where('DATE(s.createdAt) = :date', { date: dateStr });
            if (shouldFilterByFacility) {
                dayQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
            }
            const count = await dayQuery.getCount();
            last7Days.push({ date: dateStr, count });
        }
        return {
            ...basicStats,
            totalScreenings,
            completedScreenings,
            completionRate,
            referrals,
            referralRate,
            thisWeekScreenings,
            thisMonthScreenings,
            upcomingAppointments,
            newClientsThisMonth,
            screeningsByType: screeningsByType.reduce((acc, item) => {
                acc[item.type] = parseInt(item.count);
                return acc;
            }, {}),
            last7DaysTrend: last7Days,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(1, (0, typeorm_1.InjectRepository)(screening_entity_1.Screening)),
    __param(2, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map
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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const screening_entity_1 = require("../screenings/entities/screening.entity");
const patient_entity_1 = require("../patients/entities/patient.entity");
const hypertension_screening_entity_1 = require("../screenings/entities/hypertension-screening.entity");
const diabetes_screening_entity_1 = require("../screenings/entities/diabetes-screening.entity");
const cervical_screening_entity_1 = require("../screenings/entities/cervical-screening.entity");
const breast_screening_entity_1 = require("../screenings/entities/breast-screening.entity");
const psa_screening_entity_1 = require("../screenings/entities/psa-screening.entity");
let ReportsService = class ReportsService {
    constructor(screeningsRepository, patientsRepository, hypertensionRepository, diabetesRepository, cervicalRepository, breastRepository, psaRepository) {
        this.screeningsRepository = screeningsRepository;
        this.patientsRepository = patientsRepository;
        this.hypertensionRepository = hypertensionRepository;
        this.diabetesRepository = diabetesRepository;
        this.cervicalRepository = cervicalRepository;
        this.breastRepository = breastRepository;
        this.psaRepository = psaRepository;
    }
    async getScreeningSummary(filters = {}) {
        const { facilityId, screeningType, startDate, endDate, status } = filters;
        const query = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoin('s.patient', 'p');
        if (facilityId) {
            query.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        if (screeningType) {
            query.andWhere('s.screeningType = :screeningType', { screeningType });
        }
        if (startDate && endDate) {
            query.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        else if (startDate) {
            query.andWhere('s.screeningDate >= :startDate', { startDate });
        }
        else if (endDate) {
            query.andWhere('s.screeningDate <= :endDate', { endDate });
        }
        if (status) {
            query.andWhere('s.status = :status', { status });
        }
        const screenings = await query.getMany();
        const totalScreenings = screenings.length;
        const completedScreenings = screenings.filter(s => s.status === 'completed').length;
        const pendingScreenings = screenings.filter(s => s.status === 'pending').length;
        const inProgressScreenings = screenings.filter(s => s.status === 'in_progress').length;
        const byType = {};
        screenings.forEach(s => {
            byType[s.screeningType] = (byType[s.screeningType] || 0) + 1;
        });
        const byStatus = {};
        screenings.forEach(s => {
            byStatus[s.status] = (byStatus[s.status] || 0) + 1;
        });
        const referrals = screenings.filter(s => s.referralFacility).length;
        const referralRate = totalScreenings > 0 ? (referrals / totalScreenings) * 100 : 0;
        const completionRate = totalScreenings > 0 ? (completedScreenings / totalScreenings) * 100 : 0;
        return {
            totalScreenings,
            completedScreenings,
            pendingScreenings,
            inProgressScreenings,
            byType,
            byStatus,
            referralRate: Math.round(referralRate * 100) / 100,
            completionRate: Math.round(completionRate * 100) / 100,
        };
    }
    async getScreeningDetails(filters = {}) {
        const { facilityId, screeningType, startDate, endDate, status } = filters;
        const query = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.patient', 'p')
            .leftJoinAndSelect('s.conductedByUser', 'u')
            .leftJoinAndSelect('p.phcCenter', 'f');
        if (facilityId) {
            query.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        if (screeningType) {
            query.andWhere('s.screeningType = :screeningType', { screeningType });
        }
        if (startDate && endDate) {
            query.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        else if (startDate) {
            query.andWhere('s.screeningDate >= :startDate', { startDate });
        }
        else if (endDate) {
            query.andWhere('s.screeningDate <= :endDate', { endDate });
        }
        if (status) {
            query.andWhere('s.status = :status', { status });
        }
        query.orderBy('s.screeningDate', 'DESC');
        const screenings = await query.getMany();
        return screenings.map(s => ({
            id: s.id,
            date: s.screeningDate,
            time: s.screeningTime,
            patientName: `${s.patient?.firstName || ''} ${s.patient?.lastName || ''}`.trim(),
            patientId: s.patientId,
            screeningType: s.screeningType,
            status: s.status,
            conductedBy: s.conductedByUser?.fullName || 'N/A',
            facility: s.patient?.phcCenter?.centerName || 'N/A',
            vitals: {
                bp: s.bloodPressureSystolic && s.bloodPressureDiastolic
                    ? `${s.bloodPressureSystolic}/${s.bloodPressureDiastolic}`
                    : null,
                temperature: s.temperature,
                pulseRate: s.pulseRate,
                weight: s.weight,
            },
            result: s.patientStatus || s.diagnosis,
            referral: s.referralFacility,
        }));
    }
    async getFacilityComparison(startDate, endDate) {
        const query = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoin('s.patient', 'p')
            .leftJoin('p.phcCenter', 'f')
            .select('p.phcCenterId', 'facilityId')
            .addSelect('f.centerName', 'facilityName')
            .addSelect('COUNT(*)', 'totalScreenings')
            .addSelect('SUM(CASE WHEN s.status = "completed" THEN 1 ELSE 0 END)', 'completedScreenings')
            .groupBy('p.phcCenterId')
            .addGroupBy('f.centerName');
        if (startDate && endDate) {
            query.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const results = await query.getRawMany();
        return results.map(r => ({
            facilityId: r.facilityId,
            facilityName: r.facilityName || 'Unknown Facility',
            totalScreenings: parseInt(r.totalScreenings),
            completedScreenings: parseInt(r.completedScreenings),
            completionRate: r.totalScreenings > 0
                ? Math.round((parseInt(r.completedScreenings) / parseInt(r.totalScreenings)) * 100 * 100) / 100
                : 0,
        }));
    }
    async getAbnormalResults(filters = {}) {
        const { facilityId, startDate, endDate } = filters;
        const abnormalResults = [];
        const htQuery = this.hypertensionRepository
            .createQueryBuilder('ht')
            .leftJoinAndSelect('ht.screening', 's')
            .leftJoinAndSelect('s.patient', 'p')
            .where('ht.screeningResult IN (:...results)', {
            results: ['high_stage1', 'high_stage2', 'crisis'],
        });
        if (facilityId) {
            htQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        if (startDate && endDate) {
            htQuery.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const htResults = await htQuery.getMany();
        htResults.forEach(ht => {
            abnormalResults.push({
                type: 'Hypertension',
                patientName: `${ht.screening?.patient?.firstName || ''} ${ht.screening?.patient?.lastName || ''}`.trim(),
                date: ht.screening?.screeningDate,
                result: ht.screeningResult,
                details: `BP: ${ht.systolicBp1}/${ht.diastolicBp1}`,
                referral: ht.referToDoctor,
            });
        });
        const dbQuery = this.diabetesRepository
            .createQueryBuilder('db')
            .leftJoinAndSelect('db.screening', 's')
            .leftJoinAndSelect('s.patient', 'p')
            .where('db.screeningResult IN (:...results)', {
            results: ['pre_diabetic', 'diabetic'],
        });
        if (facilityId) {
            dbQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        if (startDate && endDate) {
            dbQuery.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const dbResults = await dbQuery.getMany();
        dbResults.forEach(db => {
            abnormalResults.push({
                type: 'Diabetes',
                patientName: `${db.screening?.patient?.firstName || ''} ${db.screening?.patient?.lastName || ''}`.trim(),
                date: db.screening?.screeningDate,
                result: db.screeningResult,
                details: `Blood Sugar: ${db.bloodSugarLevel} ${db.unit || 'mg/dL'}`,
                referral: db.referToDoctor,
            });
        });
        const cvQuery = this.cervicalRepository
            .createQueryBuilder('cv')
            .leftJoinAndSelect('cv.screening', 's')
            .leftJoinAndSelect('s.patient', 'p')
            .where('cv.screeningResult IN (:...results)', {
            results: ['positive', 'suspicious'],
        });
        if (facilityId) {
            cvQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        if (startDate && endDate) {
            cvQuery.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const cvResults = await cvQuery.getMany();
        cvResults.forEach(cv => {
            abnormalResults.push({
                type: 'Cervical Cancer',
                patientName: `${cv.screening?.patient?.firstName || ''} ${cv.screening?.patient?.lastName || ''}`.trim(),
                date: cv.screening?.screeningDate,
                result: cv.screeningResult,
                details: `Method: ${cv.screeningMethod}`,
                referral: cv.followUpRequired,
            });
        });
        const brQuery = this.breastRepository
            .createQueryBuilder('br')
            .leftJoinAndSelect('br.screening', 's')
            .leftJoinAndSelect('s.patient', 'p')
            .where('br.riskAssessment IN (:...results)', {
            results: ['moderate', 'high'],
        });
        if (facilityId) {
            brQuery.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        if (startDate && endDate) {
            brQuery.andWhere('s.screeningDate BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const brResults = await brQuery.getMany();
        brResults.forEach(br => {
            abnormalResults.push({
                type: 'Breast Cancer',
                patientName: `${br.screening?.patient?.firstName || ''} ${br.screening?.patient?.lastName || ''}`.trim(),
                date: br.screening?.screeningDate,
                result: br.riskAssessment,
                details: br.summaryFindings,
                referral: br.referralRequired,
            });
        });
        return abnormalResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    async getTrendData(facilityId, period = 'daily', days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        let dateFormat;
        let groupBy;
        switch (period) {
            case 'weekly':
                dateFormat = '%Y-%U';
                groupBy = 'YEARWEEK(s.screening_date)';
                break;
            case 'monthly':
                dateFormat = '%Y-%m';
                groupBy = 'DATE_FORMAT(s.screening_date, "%Y-%m")';
                break;
            default:
                dateFormat = '%Y-%m-%d';
                groupBy = 'DATE(s.screening_date)';
        }
        const query = this.screeningsRepository
            .createQueryBuilder('s')
            .leftJoin('s.patient', 'p')
            .select(`DATE_FORMAT(s.screeningDate, '${dateFormat}')`, 'date')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(CASE WHEN s.status = "completed" THEN 1 ELSE 0 END)', 'completed')
            .where('s.screeningDate >= :startDate', { startDate })
            .groupBy(groupBy)
            .orderBy('date', 'ASC');
        if (facilityId) {
            query.andWhere('p.phcCenterId = :facilityId', { facilityId });
        }
        const results = await query.getRawMany();
        return results.map(r => ({
            date: r.date,
            count: parseInt(r.count),
            completed: parseInt(r.completed),
        }));
    }
    async exportToCSV(filters = {}) {
        const data = await this.getScreeningDetails(filters);
        if (data.length === 0) {
            return 'No data available for the selected filters';
        }
        const headers = [
            'ID',
            'Date',
            'Time',
            'Patient Name',
            'Patient ID',
            'Screening Type',
            'Status',
            'Conducted By',
            'Facility',
            'Blood Pressure',
            'Temperature',
            'Pulse Rate',
            'Weight',
            'Result',
            'Referral',
        ];
        const rows = data.map(d => [
            d.id,
            d.date,
            d.time,
            d.patientName,
            d.patientId,
            d.screeningType,
            d.status,
            d.conductedBy,
            d.facility,
            d.vitals.bp || '',
            d.vitals.temperature || '',
            d.vitals.pulseRate || '',
            d.vitals.weight || '',
            d.result || '',
            d.referral || '',
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
        ].join('\n');
        return csvContent;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(screening_entity_1.Screening)),
    __param(1, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(2, (0, typeorm_1.InjectRepository)(hypertension_screening_entity_1.HypertensionScreening)),
    __param(3, (0, typeorm_1.InjectRepository)(diabetes_screening_entity_1.DiabetesScreening)),
    __param(4, (0, typeorm_1.InjectRepository)(cervical_screening_entity_1.CervicalScreening)),
    __param(5, (0, typeorm_1.InjectRepository)(breast_screening_entity_1.BreastScreening)),
    __param(6, (0, typeorm_1.InjectRepository)(psa_screening_entity_1.PsaScreening)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map
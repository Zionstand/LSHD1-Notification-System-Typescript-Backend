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
exports.PathwayScreeningsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const screening_entity_1 = require("./entities/screening.entity");
const hypertension_screening_entity_1 = require("./entities/hypertension-screening.entity");
const diabetes_screening_entity_1 = require("./entities/diabetes-screening.entity");
const cervical_screening_entity_1 = require("./entities/cervical-screening.entity");
const breast_screening_entity_1 = require("./entities/breast-screening.entity");
const psa_screening_entity_1 = require("./entities/psa-screening.entity");
let PathwayScreeningsService = class PathwayScreeningsService {
    constructor(screeningsRepository, hypertensionRepository, diabetesRepository, cervicalRepository, breastRepository, psaRepository) {
        this.screeningsRepository = screeningsRepository;
        this.hypertensionRepository = hypertensionRepository;
        this.diabetesRepository = diabetesRepository;
        this.cervicalRepository = cervicalRepository;
        this.breastRepository = breastRepository;
        this.psaRepository = psaRepository;
    }
    calculateHypertensionResult(systolic, diastolic) {
        if (systolic >= 180 || diastolic >= 120)
            return 'crisis';
        if (systolic >= 140 || diastolic >= 90)
            return 'high_stage2';
        if (systolic >= 130 || diastolic >= 80)
            return 'high_stage1';
        if (systolic >= 120 && diastolic < 80)
            return 'elevated';
        return 'normal';
    }
    calculateDiabetesResult(bloodSugar, testType) {
        if (testType === 'fasting') {
            if (bloodSugar >= 126)
                return 'diabetes';
            if (bloodSugar >= 100)
                return 'prediabetes';
            return 'normal';
        }
        else {
            if (bloodSugar >= 200)
                return 'diabetes';
            if (bloodSugar >= 140)
                return 'prediabetes';
            return 'normal';
        }
    }
    calculatePsaResult(psaLevel, normalRangeMax) {
        if (psaLevel > normalRangeMax * 1.5)
            return 'elevated';
        if (psaLevel > normalRangeMax)
            return 'borderline';
        return 'normal';
    }
    async createHypertensionScreening(dto, userId) {
        const screening = await this.screeningsRepository.findOne({
            where: { id: dto.screeningId },
        });
        if (!screening) {
            throw new common_1.NotFoundException('Screening session not found');
        }
        if (screening.screeningType !== 'Hypertension Screening') {
            throw new common_1.BadRequestException('This screening is not for hypertension');
        }
        const existing = await this.hypertensionRepository.findOne({
            where: { screeningId: dto.screeningId },
        });
        if (existing) {
            throw new common_1.BadRequestException('Hypertension screening data already exists for this session');
        }
        const avgSystolic = dto.systolicBp2 && dto.systolicBp3
            ? Math.round((dto.systolicBp1 + dto.systolicBp2 + dto.systolicBp3) / 3)
            : dto.systolicBp2
                ? Math.round((dto.systolicBp1 + dto.systolicBp2) / 2)
                : dto.systolicBp1;
        const avgDiastolic = dto.diastolicBp2 && dto.diastolicBp3
            ? Math.round((dto.diastolicBp1 + dto.diastolicBp2 + dto.diastolicBp3) / 3)
            : dto.diastolicBp2
                ? Math.round((dto.diastolicBp1 + dto.diastolicBp2) / 2)
                : dto.diastolicBp1;
        const screeningResult = this.calculateHypertensionResult(avgSystolic, avgDiastolic);
        const hypertensionData = this.hypertensionRepository.create({
            screeningId: dto.screeningId,
            systolicBp1: dto.systolicBp1,
            diastolicBp1: dto.diastolicBp1,
            position1: dto.position1,
            armUsed1: dto.armUsed1,
            systolicBp2: dto.systolicBp2 || null,
            diastolicBp2: dto.diastolicBp2 || null,
            position2: dto.position2 || null,
            armUsed2: dto.armUsed2 || null,
            systolicBp3: dto.systolicBp3 || null,
            diastolicBp3: dto.diastolicBp3 || null,
            position3: dto.position3 || null,
            armUsed3: dto.armUsed3 || null,
            screeningResult,
            clinicalObservations: dto.clinicalObservations || null,
            recommendations: dto.recommendations || null,
            referToDoctor: dto.referToDoctor || false,
            referralReason: dto.referralReason || null,
            conductedBy: userId,
        });
        const saved = await this.hypertensionRepository.save(hypertensionData);
        screening.status = 'completed';
        screening.bloodPressureSystolic = avgSystolic;
        screening.bloodPressureDiastolic = avgDiastolic;
        screening.diagnosis = `Hypertension Screening Result: ${screeningResult.replace('_', ' ')}`;
        await this.screeningsRepository.save(screening);
        return {
            message: 'Hypertension screening completed',
            data: {
                id: saved.id,
                screeningResult,
                averageBp: `${avgSystolic}/${avgDiastolic}`,
                referToDoctor: saved.referToDoctor,
            },
        };
    }
    async getHypertensionScreening(screeningId) {
        const data = await this.hypertensionRepository.findOne({
            where: { screeningId },
            relations: ['screening', 'conductedByUser'],
        });
        if (!data) {
            return null;
        }
        return data;
    }
    async updateHypertensionScreening(screeningId, dto) {
        const data = await this.hypertensionRepository.findOne({
            where: { screeningId },
        });
        if (!data) {
            throw new common_1.NotFoundException('Hypertension screening data not found');
        }
        Object.assign(data, dto);
        if (dto.systolicBp1 || dto.diastolicBp1) {
            const avgSystolic = data.systolicBp2 && data.systolicBp3
                ? Math.round((data.systolicBp1 + data.systolicBp2 + data.systolicBp3) / 3)
                : data.systolicBp2
                    ? Math.round((data.systolicBp1 + data.systolicBp2) / 2)
                    : data.systolicBp1;
            const avgDiastolic = data.diastolicBp2 && data.diastolicBp3
                ? Math.round((data.diastolicBp1 + data.diastolicBp2 + data.diastolicBp3) / 3)
                : data.diastolicBp2
                    ? Math.round((data.diastolicBp1 + data.diastolicBp2) / 2)
                    : data.diastolicBp1;
            data.screeningResult = this.calculateHypertensionResult(avgSystolic, avgDiastolic);
        }
        await this.hypertensionRepository.save(data);
        return { message: 'Hypertension screening updated' };
    }
    async createDiabetesScreening(dto, userId) {
        const screening = await this.screeningsRepository.findOne({
            where: { id: dto.screeningId },
        });
        if (!screening) {
            throw new common_1.NotFoundException('Screening session not found');
        }
        if (screening.screeningType !== 'Diabetes Screening') {
            throw new common_1.BadRequestException('This screening is not for diabetes');
        }
        const existing = await this.diabetesRepository.findOne({
            where: { screeningId: dto.screeningId },
        });
        if (existing) {
            throw new common_1.BadRequestException('Diabetes screening data already exists for this session');
        }
        const screeningResult = this.calculateDiabetesResult(dto.bloodSugarLevel, dto.testType);
        const diabetesData = this.diabetesRepository.create({
            screeningId: dto.screeningId,
            testType: dto.testType,
            bloodSugarLevel: dto.bloodSugarLevel,
            unit: dto.unit || 'mg/dL',
            fastingDurationHours: dto.fastingDurationHours || null,
            testTime: dto.testTime,
            screeningResult,
            clinicalObservations: dto.clinicalObservations || null,
            referToDoctor: dto.referToDoctor || false,
            referralReason: dto.referralReason || null,
            conductedBy: userId,
        });
        const saved = await this.diabetesRepository.save(diabetesData);
        screening.status = 'completed';
        if (dto.testType === 'fasting') {
            screening.bloodSugarFasting = dto.bloodSugarLevel;
        }
        else {
            screening.bloodSugarRandom = dto.bloodSugarLevel;
        }
        screening.diagnosis = `Diabetes Screening Result: ${screeningResult}`;
        await this.screeningsRepository.save(screening);
        return {
            message: 'Diabetes screening completed',
            data: {
                id: saved.id,
                screeningResult,
                bloodSugarLevel: dto.bloodSugarLevel,
                referToDoctor: saved.referToDoctor,
            },
        };
    }
    async getDiabetesScreening(screeningId) {
        return this.diabetesRepository.findOne({
            where: { screeningId },
            relations: ['screening', 'conductedByUser'],
        });
    }
    async updateDiabetesScreening(screeningId, dto) {
        const data = await this.diabetesRepository.findOne({
            where: { screeningId },
        });
        if (!data) {
            throw new common_1.NotFoundException('Diabetes screening data not found');
        }
        Object.assign(data, dto);
        if (dto.bloodSugarLevel || dto.testType) {
            data.screeningResult = this.calculateDiabetesResult(data.bloodSugarLevel, data.testType);
        }
        await this.diabetesRepository.save(data);
        return { message: 'Diabetes screening updated' };
    }
    async createCervicalScreening(dto, userId) {
        const screening = await this.screeningsRepository.findOne({
            where: { id: dto.screeningId },
        });
        if (!screening) {
            throw new common_1.NotFoundException('Screening session not found');
        }
        if (screening.screeningType !== 'Cervical Cancer Screening') {
            throw new common_1.BadRequestException('This screening is not for cervical cancer');
        }
        const existing = await this.cervicalRepository.findOne({
            where: { screeningId: dto.screeningId },
        });
        if (existing) {
            throw new common_1.BadRequestException('Cervical screening data already exists for this session');
        }
        const cervicalData = this.cervicalRepository.create({
            screeningId: dto.screeningId,
            screeningPerformed: dto.screeningPerformed !== false,
            screeningMethod: dto.screeningMethod,
            otherMethodDetails: dto.otherMethodDetails || null,
            visualInspectionFindings: dto.visualInspectionFindings || null,
            specimenCollected: dto.specimenCollected || false,
            specimenType: dto.specimenType || null,
            screeningResult: dto.screeningResult,
            clinicalObservations: dto.clinicalObservations || null,
            remarks: dto.remarks || null,
            followUpRequired: dto.followUpRequired || false,
            followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : null,
            followUpNotes: dto.followUpNotes || null,
            conductedBy: userId,
        });
        const saved = await this.cervicalRepository.save(cervicalData);
        screening.status = 'completed';
        screening.diagnosis = `Cervical Screening Result: ${dto.screeningResult}`;
        await this.screeningsRepository.save(screening);
        return {
            message: 'Cervical cancer screening completed',
            data: {
                id: saved.id,
                screeningResult: dto.screeningResult,
                followUpRequired: saved.followUpRequired,
            },
        };
    }
    async getCervicalScreening(screeningId) {
        return this.cervicalRepository.findOne({
            where: { screeningId },
            relations: ['screening', 'conductedByUser'],
        });
    }
    async updateCervicalScreening(screeningId, dto) {
        const data = await this.cervicalRepository.findOne({
            where: { screeningId },
        });
        if (!data) {
            throw new common_1.NotFoundException('Cervical screening data not found');
        }
        Object.assign(data, dto);
        if (dto.followUpDate) {
            data.followUpDate = new Date(dto.followUpDate);
        }
        await this.cervicalRepository.save(data);
        return { message: 'Cervical screening updated' };
    }
    async createBreastScreening(dto, userId) {
        const screening = await this.screeningsRepository.findOne({
            where: { id: dto.screeningId },
        });
        if (!screening) {
            throw new common_1.NotFoundException('Screening session not found');
        }
        if (screening.screeningType !== 'Breast Cancer Screening') {
            throw new common_1.BadRequestException('This screening is not for breast cancer');
        }
        const existing = await this.breastRepository.findOne({
            where: { screeningId: dto.screeningId },
        });
        if (existing) {
            throw new common_1.BadRequestException('Breast screening data already exists for this session');
        }
        const breastData = this.breastRepository.create({
            screeningId: dto.screeningId,
            lumpPresent: dto.lumpPresent,
            lumpLocation: dto.lumpLocation || null,
            lumpSize: dto.lumpSize || null,
            lumpCharacteristics: dto.lumpCharacteristics || null,
            dischargePresent: dto.dischargePresent,
            dischargeType: dto.dischargeType || null,
            dischargeLocation: dto.dischargeLocation || null,
            nippleInversion: dto.nippleInversion,
            nippleInversionLaterality: dto.nippleInversionLaterality || null,
            lymphNodeStatus: dto.lymphNodeStatus,
            lymphNodeLocation: dto.lymphNodeLocation || null,
            skinChanges: dto.skinChanges || null,
            breastSymmetry: dto.breastSymmetry || null,
            summaryFindings: dto.summaryFindings,
            riskAssessment: dto.riskAssessment,
            recommendations: dto.recommendations || null,
            referralRequired: dto.referralRequired || false,
            referralFacility: dto.referralFacility || null,
            referralReason: dto.referralReason || null,
            conductedBy: userId,
        });
        const saved = await this.breastRepository.save(breastData);
        screening.status = 'completed';
        screening.diagnosis = `Breast Screening - Risk Assessment: ${dto.riskAssessment}`;
        screening.recommendations = dto.summaryFindings;
        await this.screeningsRepository.save(screening);
        return {
            message: 'Breast cancer screening completed',
            data: {
                id: saved.id,
                riskAssessment: dto.riskAssessment,
                referralRequired: saved.referralRequired,
            },
        };
    }
    async getBreastScreening(screeningId) {
        return this.breastRepository.findOne({
            where: { screeningId },
            relations: ['screening', 'conductedByUser'],
        });
    }
    async updateBreastScreening(screeningId, dto) {
        const data = await this.breastRepository.findOne({
            where: { screeningId },
        });
        if (!data) {
            throw new common_1.NotFoundException('Breast screening data not found');
        }
        Object.assign(data, dto);
        await this.breastRepository.save(data);
        return { message: 'Breast screening updated' };
    }
    async createPsaScreening(dto, userId) {
        const screening = await this.screeningsRepository.findOne({
            where: { id: dto.screeningId },
        });
        if (!screening) {
            throw new common_1.NotFoundException('Screening session not found');
        }
        if (screening.screeningType !== 'PSA Screening') {
            throw new common_1.BadRequestException('This screening is not for PSA');
        }
        const existing = await this.psaRepository.findOne({
            where: { screeningId: dto.screeningId },
        });
        if (existing) {
            throw new common_1.BadRequestException('PSA screening data already exists for this session');
        }
        const screeningResult = this.calculatePsaResult(dto.psaLevel, dto.normalRangeMax);
        const psaData = this.psaRepository.create({
            screeningId: dto.screeningId,
            psaLevel: dto.psaLevel,
            unit: dto.unit || 'ng/mL',
            testMethod: dto.testMethod || null,
            testKit: dto.testKit || null,
            collectionTime: dto.collectionTime,
            sampleQuality: dto.sampleQuality || 'adequate',
            sampleQualityNotes: dto.sampleQualityNotes || null,
            patientAge: dto.patientAge,
            normalRangeMin: dto.normalRangeMin || 0,
            normalRangeMax: dto.normalRangeMax,
            screeningResult,
            resultInterpretation: dto.resultInterpretation || null,
            clinicalObservations: dto.clinicalObservations || null,
            referToDoctor: dto.referToDoctor || false,
            referralReason: dto.referralReason || null,
            conductedBy: userId,
        });
        const saved = await this.psaRepository.save(psaData);
        screening.status = 'completed';
        screening.diagnosis = `PSA Screening Result: ${screeningResult} (${dto.psaLevel} ng/mL)`;
        await this.screeningsRepository.save(screening);
        return {
            message: 'PSA screening completed',
            data: {
                id: saved.id,
                screeningResult,
                psaLevel: dto.psaLevel,
                referToDoctor: saved.referToDoctor,
            },
        };
    }
    async getPsaScreening(screeningId) {
        return this.psaRepository.findOne({
            where: { screeningId },
            relations: ['screening', 'conductedByUser'],
        });
    }
    async updatePsaScreening(screeningId, dto) {
        const data = await this.psaRepository.findOne({
            where: { screeningId },
        });
        if (!data) {
            throw new common_1.NotFoundException('PSA screening data not found');
        }
        Object.assign(data, dto);
        if (dto.psaLevel || dto.normalRangeMax) {
            data.screeningResult = this.calculatePsaResult(data.psaLevel, data.normalRangeMax);
        }
        await this.psaRepository.save(data);
        return { message: 'PSA screening updated' };
    }
    async getPathwayData(screeningId, pathway) {
        switch (pathway) {
            case 'hypertension':
                return this.getHypertensionScreening(screeningId);
            case 'diabetes':
                return this.getDiabetesScreening(screeningId);
            case 'cervical':
                return this.getCervicalScreening(screeningId);
            case 'breast':
                return this.getBreastScreening(screeningId);
            case 'psa':
                return this.getPsaScreening(screeningId);
            default:
                return null;
        }
    }
};
exports.PathwayScreeningsService = PathwayScreeningsService;
exports.PathwayScreeningsService = PathwayScreeningsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(screening_entity_1.Screening)),
    __param(1, (0, typeorm_1.InjectRepository)(hypertension_screening_entity_1.HypertensionScreening)),
    __param(2, (0, typeorm_1.InjectRepository)(diabetes_screening_entity_1.DiabetesScreening)),
    __param(3, (0, typeorm_1.InjectRepository)(cervical_screening_entity_1.CervicalScreening)),
    __param(4, (0, typeorm_1.InjectRepository)(breast_screening_entity_1.BreastScreening)),
    __param(5, (0, typeorm_1.InjectRepository)(psa_screening_entity_1.PsaScreening)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PathwayScreeningsService);
//# sourceMappingURL=pathway-screenings.service.js.map
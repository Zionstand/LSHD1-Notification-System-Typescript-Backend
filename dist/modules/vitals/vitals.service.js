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
exports.VitalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vital_record_entity_1 = require("./entities/vital-record.entity");
const screening_entity_1 = require("../screenings/entities/screening.entity");
let VitalsService = class VitalsService {
    constructor(vitalRecordsRepository, screeningsRepository) {
        this.vitalRecordsRepository = vitalRecordsRepository;
        this.screeningsRepository = screeningsRepository;
    }
    async create(createDto, recordedBy) {
        let bmi;
        if (createDto.weight && createDto.height) {
            const heightInMeters = createDto.height / 100;
            bmi = parseFloat((createDto.weight / (heightInMeters * heightInMeters)).toFixed(2));
        }
        const vitalRecord = new vital_record_entity_1.VitalRecord();
        vitalRecord.patientId = createDto.patientId;
        vitalRecord.screeningId = createDto.screeningId ?? null;
        vitalRecord.bloodPressureSystolic = createDto.systolicBp;
        vitalRecord.bloodPressureDiastolic = createDto.diastolicBp;
        vitalRecord.temperature = createDto.temperature ?? null;
        vitalRecord.pulseRate = createDto.pulseRate ?? null;
        vitalRecord.respiratoryRate = createDto.respiratoryRate ?? null;
        vitalRecord.weight = createDto.weight ?? null;
        vitalRecord.height = createDto.height ?? null;
        vitalRecord.bmi = bmi ?? null;
        vitalRecord.bloodSugarRandom = createDto.bloodSugarRandom ?? null;
        vitalRecord.bloodSugarFasting = createDto.bloodSugarFasting ?? null;
        vitalRecord.notes = createDto.notes ?? null;
        vitalRecord.recordedBy = recordedBy;
        vitalRecord.recordedAt = new Date();
        const saved = await this.vitalRecordsRepository.save(vitalRecord);
        if (createDto.screeningId) {
            const screening = await this.screeningsRepository.findOne({
                where: { id: createDto.screeningId },
            });
            if (screening) {
                screening.bloodPressureSystolic = createDto.systolicBp;
                screening.bloodPressureDiastolic = createDto.diastolicBp;
                if (createDto.temperature)
                    screening.temperature = createDto.temperature;
                if (createDto.pulseRate)
                    screening.pulseRate = createDto.pulseRate;
                if (createDto.respiratoryRate)
                    screening.respiratoryRate = createDto.respiratoryRate;
                if (createDto.weight)
                    screening.weight = createDto.weight;
                if (createDto.height)
                    screening.height = createDto.height;
                if (bmi)
                    screening.bmi = bmi;
                if (createDto.bloodSugarRandom)
                    screening.bloodSugarRandom = createDto.bloodSugarRandom;
                if (createDto.bloodSugarFasting)
                    screening.bloodSugarFasting = createDto.bloodSugarFasting;
                if (screening.status === 'pending') {
                    screening.status = 'in_progress';
                }
                await this.screeningsRepository.save(screening);
            }
        }
        return saved;
    }
    async findByPatient(patientId) {
        return this.vitalRecordsRepository.find({
            where: { patientId },
            relations: ['recordedByUser', 'screening'],
            order: { recordedAt: 'DESC' },
        });
    }
    async findByScreening(screeningId) {
        return this.vitalRecordsRepository.find({
            where: { screeningId },
            relations: ['recordedByUser'],
            order: { recordedAt: 'DESC' },
        });
    }
    async findOne(id) {
        const record = await this.vitalRecordsRepository.findOne({
            where: { id },
            relations: ['recordedByUser', 'patient', 'screening'],
        });
        if (!record) {
            throw new common_1.NotFoundException('Vital record not found');
        }
        return record;
    }
    async getLatestByPatient(patientId) {
        return this.vitalRecordsRepository.findOne({
            where: { patientId },
            relations: ['recordedByUser'],
            order: { recordedAt: 'DESC' },
        });
    }
    async getLatestByScreening(screeningId) {
        return this.vitalRecordsRepository.findOne({
            where: { screeningId },
            relations: ['recordedByUser'],
            order: { recordedAt: 'DESC' },
        });
    }
    formatVitalRecord(record) {
        return {
            id: record.id,
            patientId: record.patientId,
            screeningId: record.screeningId,
            bloodPressure: {
                systolic: record.bloodPressureSystolic,
                diastolic: record.bloodPressureDiastolic,
                formatted: record.bloodPressureSystolic && record.bloodPressureDiastolic
                    ? `${record.bloodPressureSystolic}/${record.bloodPressureDiastolic} mmHg`
                    : null,
            },
            temperature: record.temperature,
            pulseRate: record.pulseRate,
            respiratoryRate: record.respiratoryRate,
            weight: record.weight,
            height: record.height,
            bmi: record.bmi,
            bloodSugar: {
                random: record.bloodSugarRandom,
                fasting: record.bloodSugarFasting,
            },
            notes: record.notes,
            recordedBy: record.recordedByUser ? {
                id: record.recordedByUser.id,
                name: record.recordedByUser.fullName,
            } : null,
            recordedAt: record.recordedAt,
            createdAt: record.createdAt,
        };
    }
};
exports.VitalsService = VitalsService;
exports.VitalsService = VitalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vital_record_entity_1.VitalRecord)),
    __param(1, (0, typeorm_1.InjectRepository)(screening_entity_1.Screening)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VitalsService);
//# sourceMappingURL=vitals.service.js.map
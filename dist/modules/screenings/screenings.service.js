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
var ScreeningsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const screening_entity_1 = require("./entities/screening.entity");
const SCREENING_TYPES = {
    1: { name: "Hypertension Screening", pathway: "hypertension" },
    2: { name: "Diabetes Screening", pathway: "diabetes" },
    3: { name: "Cervical Cancer Screening", pathway: "cervical" },
    4: { name: "Breast Cancer Screening", pathway: "breast" },
    5: { name: "PSA Screening", pathway: "psa" },
};
const SCREENING_TYPE_IDS = {
    "Hypertension Screening": 1,
    "Diabetes Screening": 2,
    "Cervical Cancer Screening": 3,
    "Breast Cancer Screening": 4,
    "PSA Screening": 5,
};
let ScreeningsService = ScreeningsService_1 = class ScreeningsService {
    constructor(screeningsRepository) {
        this.screeningsRepository = screeningsRepository;
        this.logger = new common_1.Logger(ScreeningsService_1.name);
    }
    async findAll(facilityId, status) {
        const queryBuilder = this.screeningsRepository
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.patient", "p")
            .leftJoinAndSelect("s.conductedByUser", "u")
            .orderBy("s.screeningDate", "DESC")
            .addOrderBy("s.screeningTime", "DESC")
            .take(100);
        if (status && status !== "all") {
            queryBuilder.andWhere("s.status = :status", { status });
        }
        const screenings = await queryBuilder.getMany();
        return screenings.map((s) => {
            const typeId = SCREENING_TYPE_IDS[s.screeningType] || 1;
            const typeInfo = SCREENING_TYPES[typeId] || {
                name: s.screeningType || "General Screening",
                pathway: "general",
            };
            return {
                id: s.id,
                sessionId: `SCR-${String(s.id).padStart(5, "0")}`,
                status: s.status,
                createdAt: s.createdAt,
                screeningDate: s.screeningDate,
                screeningTime: s.screeningTime,
                client: {
                    id: s.patientId,
                    clientId: `PAT-${String(s.patientId).padStart(5, "0")}`,
                    firstName: s.patient?.firstName,
                    lastName: s.patient?.lastName,
                },
                notificationType: {
                    id: typeId,
                    name: typeInfo.name,
                    pathway: typeInfo.pathway,
                },
                conductedBy: s.conductedByUser?.fullName || null,
                vitals: {
                    bloodPressureSystolic: s.bloodPressureSystolic,
                    bloodPressureDiastolic: s.bloodPressureDiastolic,
                    temperature: s.temperature,
                    pulseRate: s.pulseRate,
                    respiratoryRate: s.respiratoryRate,
                    weight: s.weight,
                    height: s.height,
                    bmi: s.bmi,
                },
                results: {
                    diagnosis: s.diagnosis,
                    prescription: s.prescription,
                    recommendations: s.recommendations,
                    nextAppointment: s.nextAppointment,
                },
            };
        });
    }
    async findOne(id) {
        const screening = await this.screeningsRepository.findOne({
            where: { id },
            relations: ["patient", "conductedByUser"],
        });
        if (!screening) {
            throw new common_1.NotFoundException("Screening not found");
        }
        const typeId = SCREENING_TYPE_IDS[screening.screeningType] || 1;
        const typeInfo = SCREENING_TYPES[typeId] || {
            name: screening.screeningType || "General Screening",
            pathway: "general",
        };
        return {
            id: screening.id,
            sessionId: `SCR-${String(screening.id).padStart(5, "0")}`,
            status: screening.status,
            createdAt: screening.createdAt,
            screeningDate: screening.screeningDate,
            screeningTime: screening.screeningTime,
            client: {
                id: screening.patientId,
                clientId: `PAT-${String(screening.patientId).padStart(5, "0")}`,
                firstName: screening.patient?.firstName,
                lastName: screening.patient?.lastName,
            },
            notificationType: {
                id: typeId,
                name: typeInfo.name,
                pathway: typeInfo.pathway,
            },
            conductedBy: screening.conductedByUser?.fullName || null,
            vitals: {
                bloodPressureSystolic: screening.bloodPressureSystolic,
                bloodPressureDiastolic: screening.bloodPressureDiastolic,
                temperature: screening.temperature,
                pulseRate: screening.pulseRate,
                respiratoryRate: screening.respiratoryRate,
                weight: screening.weight,
                height: screening.height,
                bmi: screening.bmi,
            },
            results: {
                diagnosis: screening.diagnosis,
                prescription: screening.prescription,
                recommendations: screening.recommendations,
                nextAppointment: screening.nextAppointment,
            },
        };
    }
    async create(createDto, userId, facilityId) {
        const typeInfo = SCREENING_TYPES[createDto.notificationTypeId] || {
            name: "General Screening",
            pathway: "general",
        };
        const now = new Date();
        const screeningDate = now.toISOString().split("T")[0];
        const screeningTime = now.toTimeString().split(" ")[0];
        const screening = this.screeningsRepository.create({
            patientId: createDto.clientId,
            screeningType: typeInfo.name,
            screeningDate: new Date(screeningDate),
            screeningTime: screeningTime,
            conductedBy: userId,
            status: "pending",
        });
        const saved = await this.screeningsRepository.save(screening);
        return {
            message: "Screening session created",
            session: {
                id: saved.id,
                sessionId: `SCR-${String(saved.id).padStart(5, "0")}`,
                status: saved.status,
            },
        };
    }
    async updateVitals(id, updateDto) {
        const screening = await this.screeningsRepository.findOne({
            where: { id },
        });
        if (!screening) {
            throw new common_1.NotFoundException("Screening not found");
        }
        if (updateDto.systolicBp !== undefined)
            screening.bloodPressureSystolic = updateDto.systolicBp;
        if (updateDto.diastolicBp !== undefined)
            screening.bloodPressureDiastolic = updateDto.diastolicBp;
        if (updateDto.weight !== undefined)
            screening.weight = updateDto.weight;
        if (updateDto.pulseRate !== undefined)
            screening.pulseRate = updateDto.pulseRate;
        if (updateDto.temperature !== undefined)
            screening.temperature = updateDto.temperature;
        if (screening.status === "pending") {
            screening.status = "in_progress";
        }
        await this.screeningsRepository.save(screening);
        return { message: "Vital signs recorded" };
    }
    async complete(id, completeDto) {
        const screening = await this.screeningsRepository.findOne({
            where: { id },
        });
        if (!screening) {
            throw new common_1.NotFoundException("Screening not found");
        }
        screening.status = "completed";
        if (completeDto.data) {
            if (completeDto.data.result) {
                screening.diagnosis = completeDto.data.result;
            }
            if (completeDto.data.notes) {
                screening.recommendations = completeDto.data.notes;
            }
            if (completeDto.data.bloodSugar) {
                screening.bloodSugarRandom = completeDto.data.bloodSugar;
            }
            if (completeDto.data.systolic) {
                screening.bloodPressureSystolic = completeDto.data.systolic;
            }
            if (completeDto.data.diastolic) {
                screening.bloodPressureDiastolic = completeDto.data.diastolic;
            }
        }
        await this.screeningsRepository.save(screening);
        return { message: "Screening completed" };
    }
    async addDoctorAssessment(id, dto, doctorId) {
        const screening = await this.screeningsRepository.findOne({
            where: { id },
        });
        if (!screening) {
            throw new common_1.NotFoundException("Screening not found");
        }
        screening.diagnosis = dto.clinicalAssessment;
        if (dto.recommendations)
            screening.recommendations = dto.recommendations;
        if (dto.prescription)
            screening.prescription = dto.prescription;
        if (dto.patientStatus)
            screening.patientStatus = dto.patientStatus;
        if (dto.referralFacility)
            screening.referralFacility = dto.referralFacility;
        if (dto.nextAppointment)
            screening.nextAppointment = new Date(dto.nextAppointment);
        screening.doctorId = doctorId;
        screening.doctorAssessedAt = new Date();
        if (dto.patientStatus === "requires_followup") {
            screening.status = "follow_up";
        }
        else {
            screening.status = "completed";
        }
        await this.screeningsRepository.save(screening);
        return {
            message: "Doctor assessment saved successfully",
            screening: {
                id: screening.id,
                patientStatus: screening.patientStatus,
                status: screening.status,
                doctorAssessedAt: screening.doctorAssessedAt,
            },
        };
    }
    async findPendingDoctorReview(facilityId) {
        const queryBuilder = this.screeningsRepository
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.patient", "p")
            .leftJoinAndSelect("s.conductedByUser", "u")
            .where("s.doctorId IS NULL")
            .andWhere("s.status IN (:...statuses)", {
            statuses: ["pending", "follow_up"],
        })
            .orderBy("s.screeningDate", "DESC")
            .addOrderBy("s.screeningTime", "DESC")
            .take(100);
        const screenings = await queryBuilder.getMany();
        return screenings.map((s) => {
            const typeId = SCREENING_TYPE_IDS[s.screeningType] || 1;
            const typeInfo = SCREENING_TYPES[typeId] || {
                name: s.screeningType || "General Screening",
                pathway: "general",
            };
            return {
                id: s.id,
                sessionId: `SCR-${String(s.id).padStart(5, "0")}`,
                status: s.status,
                createdAt: s.createdAt,
                screeningDate: s.screeningDate,
                screeningTime: s.screeningTime,
                client: {
                    id: s.patientId,
                    clientId: `PAT-${String(s.patientId).padStart(5, "0")}`,
                    firstName: s.patient?.firstName,
                    lastName: s.patient?.lastName,
                },
                notificationType: {
                    id: typeId,
                    name: typeInfo.name,
                    pathway: typeInfo.pathway,
                },
                conductedBy: s.conductedByUser?.fullName || null,
                vitals: {
                    bloodPressureSystolic: s.bloodPressureSystolic,
                    bloodPressureDiastolic: s.bloodPressureDiastolic,
                    temperature: s.temperature,
                    pulseRate: s.pulseRate,
                    weight: s.weight,
                },
            };
        });
    }
    async findByPatient(patientId) {
        const screenings = await this.screeningsRepository
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.patient", "p")
            .leftJoinAndSelect("s.conductedByUser", "u")
            .where("s.patientId = :patientId", { patientId })
            .orderBy("s.screeningDate", "DESC")
            .addOrderBy("s.screeningTime", "DESC")
            .getMany();
        return screenings.map((s) => {
            const typeId = SCREENING_TYPE_IDS[s.screeningType] || 1;
            const typeInfo = SCREENING_TYPES[typeId] || {
                name: s.screeningType || "General Screening",
                pathway: "general",
            };
            return {
                id: s.id,
                sessionId: `SCR-${String(s.id).padStart(5, "0")}`,
                status: s.status,
                createdAt: s.createdAt,
                screeningDate: s.screeningDate,
                screeningTime: s.screeningTime,
                notificationType: {
                    id: typeId,
                    name: typeInfo.name,
                    pathway: typeInfo.pathway,
                },
                conductedBy: s.conductedByUser?.fullName || null,
                vitals: {
                    bloodPressureSystolic: s.bloodPressureSystolic,
                    bloodPressureDiastolic: s.bloodPressureDiastolic,
                    temperature: s.temperature,
                    pulseRate: s.pulseRate,
                    respiratoryRate: s.respiratoryRate,
                    weight: s.weight,
                    height: s.height,
                    bmi: s.bmi,
                },
                results: {
                    diagnosis: s.diagnosis,
                    prescription: s.prescription,
                    recommendations: s.recommendations,
                    nextAppointment: s.nextAppointment,
                },
            };
        });
    }
};
exports.ScreeningsService = ScreeningsService;
exports.ScreeningsService = ScreeningsService = ScreeningsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(screening_entity_1.Screening)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ScreeningsService);
//# sourceMappingURL=screenings.service.js.map
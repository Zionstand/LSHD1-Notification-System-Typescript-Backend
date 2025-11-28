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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("./entities/patient.entity");
let PatientsService = class PatientsService {
    constructor(patientsRepository) {
        this.patientsRepository = patientsRepository;
    }
    formatPatient(p) {
        const fullName = p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim();
        const nameParts = fullName?.split(' ') || [];
        const firstName = p.firstName || nameParts[0] || '';
        const lastName = p.lastName || nameParts.slice(1).join(' ') || '';
        let age = p.age;
        if (age === null || age === undefined) {
            if (p.dateOfBirth) {
                const birthDate = new Date(p.dateOfBirth);
                const today = new Date();
                age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
            }
            else {
                age = 0;
            }
        }
        return {
            id: p.id,
            client_id: p.patientNumber,
            full_name: fullName,
            first_name: firstName,
            last_name: lastName,
            age: age,
            date_of_birth: p.dateOfBirth,
            gender: p.gender,
            phone: p.phone,
            address: p.address,
            next_of_kin: p.nextOfKin || p.emergencyContact || '',
            next_of_kin_phone: p.nextOfKinPhone || p.emergencyPhone || '',
            facility_id: p.phcCenterId,
            facility_name: p.phcCenter?.centerName || null,
            lga: p.lga,
            created_at: p.createdAt,
        };
    }
    async findAll(facilityId) {
        const queryBuilder = this.patientsRepository
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.phcCenter', 'c')
            .leftJoinAndSelect('p.registeredByUser', 'u')
            .orderBy('p.createdAt', 'DESC');
        if (facilityId && facilityId > 0) {
            queryBuilder.where('p.phcCenterId = :facilityId', { facilityId });
        }
        const patients = await queryBuilder.getMany();
        return patients.map((p) => this.formatPatient(p));
    }
    async findOne(id) {
        const patient = await this.patientsRepository.findOne({
            where: { id },
            relations: ['phcCenter'],
        });
        if (!patient) {
            throw new common_1.NotFoundException('Client not found');
        }
        return this.formatPatient(patient);
    }
    async create(createPatientDto, userId) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        const patientNumber = `PAT-${timestamp}-${random}`;
        const nameParts = createPatientDto.fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        const patient = this.patientsRepository.create({
            patientNumber,
            fullName: createPatientDto.fullName.trim(),
            firstName,
            lastName,
            age: createPatientDto.age,
            gender: createPatientDto.gender.toLowerCase(),
            phone: createPatientDto.phone,
            address: createPatientDto.address,
            phcCenterId: createPatientDto.phcCenterId,
            nextOfKin: createPatientDto.nextOfKin,
            nextOfKinPhone: createPatientDto.nextOfKinPhone,
            lga: createPatientDto.lga || null,
            email: createPatientDto.email || null,
            altPhone: createPatientDto.altPhone || null,
            registeredBy: userId,
        });
        const saved = await this.patientsRepository.save(patient);
        const savedPatient = Array.isArray(saved) ? saved[0] : saved;
        return {
            message: 'Client registered successfully',
            client: this.formatPatient(savedPatient),
            screeningTypeId: createPatientDto.screeningTypeId,
        };
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PatientsService);
//# sourceMappingURL=patients.service.js.map
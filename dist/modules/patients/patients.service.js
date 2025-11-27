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
    async findAll(facilityId) {
        const queryBuilder = this.patientsRepository
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.phcCenter', 'c')
            .leftJoinAndSelect('p.registeredByUser', 'u')
            .orderBy('p.createdAt', 'DESC');
        if (facilityId) {
            queryBuilder.where('p.phcCenterId = :facilityId', { facilityId });
        }
        const patients = await queryBuilder.getMany();
        return patients.map((p) => ({
            id: p.id,
            client_id: p.patientNumber,
            first_name: p.firstName,
            last_name: p.lastName,
            date_of_birth: p.dateOfBirth,
            gender: p.gender,
            phone: p.phone,
            address: p.address,
            facility_name: p.phcCenter?.centerName || null,
            created_at: p.createdAt,
        }));
    }
    async findOne(id) {
        const patient = await this.patientsRepository.findOne({
            where: { id },
            relations: ['phcCenter'],
        });
        if (!patient) {
            throw new common_1.NotFoundException('Client not found');
        }
        return {
            id: patient.id,
            client_id: patient.patientNumber,
            first_name: patient.firstName,
            last_name: patient.lastName,
            date_of_birth: patient.dateOfBirth,
            gender: patient.gender,
            phone: patient.phone,
            address: patient.address,
            facility_name: patient.phcCenter?.centerName || null,
        };
    }
    async create(createPatientDto, userId, facilityId) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        const patientNumber = `PAT-${timestamp}-${random}`;
        const patient = this.patientsRepository.create({
            patientNumber,
            firstName: createPatientDto.firstName,
            lastName: createPatientDto.lastName,
            dateOfBirth: new Date(createPatientDto.dateOfBirth),
            gender: createPatientDto.gender.toLowerCase(),
            phone: createPatientDto.phone || 'N/A',
            address: createPatientDto.address || 'N/A',
            phcCenterId: facilityId || 1,
            registeredBy: userId,
        });
        const saved = await this.patientsRepository.save(patient);
        return {
            message: 'Client created',
            client: {
                id: saved.id,
                client_id: saved.patientNumber,
                first_name: saved.firstName,
                last_name: saved.lastName,
                date_of_birth: saved.dateOfBirth,
                gender: saved.gender,
                phone: saved.phone,
            },
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
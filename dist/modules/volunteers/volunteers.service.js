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
var VolunteersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const volunteer_entity_1 = require("./entities/volunteer.entity");
let VolunteersService = VolunteersService_1 = class VolunteersService {
    constructor(volunteersRepository) {
        this.volunteersRepository = volunteersRepository;
        this.logger = new common_1.Logger(VolunteersService_1.name);
    }
    generateVolunteerCode() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `VOL-${timestamp}-${random}`;
    }
    splitName(fullName) {
        const parts = fullName.trim().split(/\s+/);
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';
        return { firstName, lastName };
    }
    async create(createVolunteerDto, registeredBy, phcCenterId) {
        const volunteerCode = this.generateVolunteerCode();
        const { firstName, lastName } = this.splitName(createVolunteerDto.fullName);
        const volunteer = this.volunteersRepository.create({
            volunteerCode,
            fullName: createVolunteerDto.fullName,
            firstName,
            lastName,
            phone: createVolunteerDto.phone,
            altPhone: createVolunteerDto.altPhone || null,
            email: createVolunteerDto.email || null,
            gender: createVolunteerDto.gender,
            age: createVolunteerDto.age || null,
            dateOfBirth: createVolunteerDto.dateOfBirth ? new Date(createVolunteerDto.dateOfBirth) : null,
            address: createVolunteerDto.address || null,
            lga: createVolunteerDto.lga || null,
            ward: createVolunteerDto.ward || null,
            community: createVolunteerDto.community || null,
            occupation: createVolunteerDto.occupation || null,
            educationLevel: createVolunteerDto.educationLevel || null,
            nextOfKin: createVolunteerDto.nextOfKin || null,
            nextOfKinPhone: createVolunteerDto.nextOfKinPhone || null,
            skills: createVolunteerDto.skills || null,
            notes: createVolunteerDto.notes || null,
            status: 'pending',
            trainingCompleted: 0,
            registeredBy,
            phcCenterId: phcCenterId || null,
        });
        const savedVolunteer = await this.volunteersRepository.save(volunteer);
        this.logger.log(`Volunteer registered: ${savedVolunteer.volunteerCode} by user ${registeredBy}`);
        return this.findOne(savedVolunteer.id);
    }
    async findAll(filters) {
        const query = this.volunteersRepository.createQueryBuilder('volunteer')
            .leftJoinAndSelect('volunteer.phcCenter', 'phcCenter')
            .leftJoinAndSelect('volunteer.registeredByUser', 'registeredByUser');
        if (filters?.phcCenterId) {
            query.andWhere('volunteer.phcCenterId = :phcCenterId', { phcCenterId: filters.phcCenterId });
        }
        if (filters?.status) {
            query.andWhere('volunteer.status = :status', { status: filters.status });
        }
        if (filters?.gender) {
            query.andWhere('volunteer.gender = :gender', { gender: filters.gender });
        }
        if (filters?.trainingCompleted !== undefined) {
            query.andWhere('volunteer.trainingCompleted = :trainingCompleted', {
                trainingCompleted: filters.trainingCompleted ? 1 : 0,
            });
        }
        if (filters?.search) {
            query.andWhere('(volunteer.fullName LIKE :search OR volunteer.volunteerCode LIKE :search OR volunteer.phone LIKE :search)', { search: `%${filters.search}%` });
        }
        const total = await query.getCount();
        query.orderBy('volunteer.createdAt', 'DESC');
        if (filters?.limit) {
            query.take(filters.limit);
        }
        if (filters?.offset) {
            query.skip(filters.offset);
        }
        const volunteers = await query.getMany();
        return { volunteers, total };
    }
    async findOne(id) {
        const volunteer = await this.volunteersRepository.findOne({
            where: { id },
            relations: ['phcCenter', 'registeredByUser'],
        });
        if (!volunteer) {
            throw new common_1.NotFoundException(`Volunteer with ID ${id} not found`);
        }
        return volunteer;
    }
    async update(id, updateVolunteerDto) {
        const volunteer = await this.findOne(id);
        if (updateVolunteerDto.fullName) {
            volunteer.fullName = updateVolunteerDto.fullName;
            const { firstName, lastName } = this.splitName(updateVolunteerDto.fullName);
            volunteer.firstName = firstName;
            volunteer.lastName = lastName;
        }
        if (updateVolunteerDto.phone)
            volunteer.phone = updateVolunteerDto.phone;
        if (updateVolunteerDto.altPhone !== undefined)
            volunteer.altPhone = updateVolunteerDto.altPhone || null;
        if (updateVolunteerDto.email !== undefined)
            volunteer.email = updateVolunteerDto.email || null;
        if (updateVolunteerDto.gender)
            volunteer.gender = updateVolunteerDto.gender;
        if (updateVolunteerDto.age !== undefined)
            volunteer.age = updateVolunteerDto.age || null;
        if (updateVolunteerDto.dateOfBirth !== undefined) {
            volunteer.dateOfBirth = updateVolunteerDto.dateOfBirth ? new Date(updateVolunteerDto.dateOfBirth) : null;
        }
        if (updateVolunteerDto.address !== undefined)
            volunteer.address = updateVolunteerDto.address || null;
        if (updateVolunteerDto.lga !== undefined)
            volunteer.lga = updateVolunteerDto.lga || null;
        if (updateVolunteerDto.ward !== undefined)
            volunteer.ward = updateVolunteerDto.ward || null;
        if (updateVolunteerDto.community !== undefined)
            volunteer.community = updateVolunteerDto.community || null;
        if (updateVolunteerDto.occupation !== undefined)
            volunteer.occupation = updateVolunteerDto.occupation || null;
        if (updateVolunteerDto.educationLevel !== undefined)
            volunteer.educationLevel = updateVolunteerDto.educationLevel || null;
        if (updateVolunteerDto.nextOfKin !== undefined)
            volunteer.nextOfKin = updateVolunteerDto.nextOfKin || null;
        if (updateVolunteerDto.nextOfKinPhone !== undefined)
            volunteer.nextOfKinPhone = updateVolunteerDto.nextOfKinPhone || null;
        if (updateVolunteerDto.skills !== undefined)
            volunteer.skills = updateVolunteerDto.skills || null;
        if (updateVolunteerDto.notes !== undefined)
            volunteer.notes = updateVolunteerDto.notes || null;
        if (updateVolunteerDto.status)
            volunteer.status = updateVolunteerDto.status;
        if (updateVolunteerDto.trainingCompleted !== undefined) {
            volunteer.trainingCompleted = updateVolunteerDto.trainingCompleted ? 1 : 0;
        }
        if (updateVolunteerDto.trainingDate !== undefined) {
            volunteer.trainingDate = updateVolunteerDto.trainingDate ? new Date(updateVolunteerDto.trainingDate) : null;
        }
        await this.volunteersRepository.save(volunteer);
        return this.findOne(id);
    }
    async activate(id) {
        const volunteer = await this.findOne(id);
        volunteer.status = 'active';
        await this.volunteersRepository.save(volunteer);
        return this.findOne(id);
    }
    async deactivate(id) {
        const volunteer = await this.findOne(id);
        volunteer.status = 'inactive';
        await this.volunteersRepository.save(volunteer);
        return this.findOne(id);
    }
    async markTrainingCompleted(id, trainingDate) {
        const volunteer = await this.findOne(id);
        volunteer.trainingCompleted = 1;
        volunteer.trainingDate = trainingDate ? new Date(trainingDate) : new Date();
        await this.volunteersRepository.save(volunteer);
        return this.findOne(id);
    }
    async getStats(phcCenterId) {
        const query = this.volunteersRepository.createQueryBuilder('volunteer');
        if (phcCenterId) {
            query.andWhere('volunteer.phcCenterId = :phcCenterId', { phcCenterId });
        }
        const [total, active, inactive, pending, trained, untrained] = await Promise.all([
            query.clone().getCount(),
            query.clone().andWhere('volunteer.status = :status', { status: 'active' }).getCount(),
            query.clone().andWhere('volunteer.status = :status', { status: 'inactive' }).getCount(),
            query.clone().andWhere('volunteer.status = :status', { status: 'pending' }).getCount(),
            query.clone().andWhere('volunteer.trainingCompleted = :trained', { trained: 1 }).getCount(),
            query.clone().andWhere('volunteer.trainingCompleted = :trained', { trained: 0 }).getCount(),
        ]);
        return { total, active, inactive, pending, trained, untrained };
    }
};
exports.VolunteersService = VolunteersService;
exports.VolunteersService = VolunteersService = VolunteersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(volunteer_entity_1.Volunteer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VolunteersService);
//# sourceMappingURL=volunteers.service.js.map
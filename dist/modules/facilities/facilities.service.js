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
exports.FacilitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const phc_center_entity_1 = require("./entities/phc-center.entity");
let FacilitiesService = class FacilitiesService {
    constructor(facilitiesRepository) {
        this.facilitiesRepository = facilitiesRepository;
    }
    async findAllPublic() {
        const facilities = await this.facilitiesRepository.find({
            where: { status: 'active' },
            order: { centerName: 'ASC' },
            select: ['id', 'centerName'],
        });
        return facilities.map((f) => ({
            id: f.id,
            name: f.centerName,
        }));
    }
    async findAll(includeInactive = false) {
        const queryBuilder = this.facilitiesRepository.createQueryBuilder('f');
        if (!includeInactive) {
            queryBuilder.where('f.status = :status', { status: 'active' });
        }
        queryBuilder.orderBy('f.centerName', 'ASC');
        const facilities = await queryBuilder.getMany();
        return facilities.map((f) => ({
            id: f.id,
            name: f.centerName,
            address: f.address,
            phone: f.phone,
            email: f.email,
            lga: f.lga,
            status: f.status,
            isActive: f.status === 'active',
            createdAt: f.createdAt,
        }));
    }
    async findOne(id) {
        const facility = await this.facilitiesRepository.findOne({ where: { id } });
        if (!facility) {
            throw new common_1.NotFoundException('Facility not found');
        }
        return {
            id: facility.id,
            name: facility.centerName,
            address: facility.address,
            phone: facility.phone,
            email: facility.email,
            lga: facility.lga,
            status: facility.status,
            isActive: facility.status === 'active',
            createdAt: facility.createdAt,
        };
    }
    async create(createDto) {
        const facility = this.facilitiesRepository.create({
            centerName: createDto.centerName,
            address: createDto.address,
            phone: createDto.phone || null,
            email: createDto.email || null,
            lga: createDto.lga || null,
            status: 'active',
        });
        const saved = await this.facilitiesRepository.save(facility);
        return {
            message: 'Facility created successfully',
            facility: {
                id: saved.id,
                name: saved.centerName,
                address: saved.address,
                status: saved.status,
            },
        };
    }
    async update(id, updateDto) {
        const facility = await this.facilitiesRepository.findOne({ where: { id } });
        if (!facility) {
            throw new common_1.NotFoundException('Facility not found');
        }
        if (updateDto.centerName)
            facility.centerName = updateDto.centerName;
        if (updateDto.address)
            facility.address = updateDto.address;
        if (updateDto.phone !== undefined)
            facility.phone = updateDto.phone;
        if (updateDto.email !== undefined)
            facility.email = updateDto.email;
        if (updateDto.lga !== undefined)
            facility.lga = updateDto.lga;
        if (updateDto.status)
            facility.status = updateDto.status;
        await this.facilitiesRepository.save(facility);
        return { message: 'Facility updated successfully' };
    }
    async activate(id) {
        const facility = await this.facilitiesRepository.findOne({ where: { id } });
        if (!facility) {
            throw new common_1.NotFoundException('Facility not found');
        }
        facility.status = 'active';
        await this.facilitiesRepository.save(facility);
        return { message: 'Facility activated' };
    }
    async deactivate(id) {
        const facility = await this.facilitiesRepository.findOne({ where: { id } });
        if (!facility) {
            throw new common_1.NotFoundException('Facility not found');
        }
        facility.status = 'inactive';
        await this.facilitiesRepository.save(facility);
        return { message: 'Facility deactivated' };
    }
    getNotificationTypes() {
        return [
            { id: 1, name: 'Hypertension Screening', pathway: 'hypertension' },
            { id: 2, name: 'Diabetes Screening', pathway: 'diabetes' },
            { id: 3, name: 'Cervical Cancer Screening', pathway: 'cervical' },
            { id: 4, name: 'Breast Cancer Screening', pathway: 'breast' },
            { id: 5, name: 'PSA Screening', pathway: 'psa' },
        ];
    }
};
exports.FacilitiesService = FacilitiesService;
exports.FacilitiesService = FacilitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(phc_center_entity_1.PhcCenter)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FacilitiesService);
//# sourceMappingURL=facilities.service.js.map
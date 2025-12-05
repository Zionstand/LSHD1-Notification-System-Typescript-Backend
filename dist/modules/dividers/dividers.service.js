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
var DividersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DividersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const divider_entity_1 = require("./entities/divider.entity");
let DividersService = DividersService_1 = class DividersService {
    constructor(dividersRepository) {
        this.dividersRepository = dividersRepository;
        this.logger = new common_1.Logger(DividersService_1.name);
    }
    generateDividerCode() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `DIV-${timestamp}-${random}`;
    }
    async create(createDividerDto, capturedBy, phcCenterId) {
        const dividerCode = this.generateDividerCode();
        const divider = this.dividersRepository.create({
            dividerCode,
            fullName: createDividerDto.fullName,
            phone: createDividerDto.phone || null,
            address: createDividerDto.address || null,
            lga: createDividerDto.lga || null,
            ward: createDividerDto.ward || null,
            community: createDividerDto.community || null,
            notes: createDividerDto.notes || null,
            status: 'active',
            capturedBy,
            phcCenterId: phcCenterId || null,
        });
        const savedDivider = await this.dividersRepository.save(divider);
        this.logger.log(`Divider created: ${savedDivider.dividerCode} by user ${capturedBy}`);
        return this.findOne(savedDivider.id);
    }
    async findAll(filters) {
        const query = this.dividersRepository.createQueryBuilder('divider')
            .leftJoinAndSelect('divider.phcCenter', 'phcCenter')
            .leftJoinAndSelect('divider.capturedByUser', 'capturedByUser');
        if (filters?.phcCenterId) {
            query.andWhere('divider.phcCenterId = :phcCenterId', { phcCenterId: filters.phcCenterId });
        }
        if (filters?.status) {
            query.andWhere('divider.status = :status', { status: filters.status });
        }
        if (filters?.search) {
            query.andWhere('(divider.fullName LIKE :search OR divider.dividerCode LIKE :search OR divider.phone LIKE :search)', { search: `%${filters.search}%` });
        }
        const total = await query.getCount();
        query.orderBy('divider.createdAt', 'DESC');
        if (filters?.limit) {
            query.take(filters.limit);
        }
        if (filters?.offset) {
            query.skip(filters.offset);
        }
        const dividers = await query.getMany();
        return { dividers, total };
    }
    async findOne(id) {
        const divider = await this.dividersRepository.findOne({
            where: { id },
            relations: ['phcCenter', 'capturedByUser'],
        });
        if (!divider) {
            throw new common_1.NotFoundException(`Divider with ID ${id} not found`);
        }
        return divider;
    }
    async update(id, updateDividerDto) {
        const divider = await this.findOne(id);
        if (updateDividerDto.fullName)
            divider.fullName = updateDividerDto.fullName;
        if (updateDividerDto.phone !== undefined)
            divider.phone = updateDividerDto.phone || null;
        if (updateDividerDto.address !== undefined)
            divider.address = updateDividerDto.address || null;
        if (updateDividerDto.lga !== undefined)
            divider.lga = updateDividerDto.lga || null;
        if (updateDividerDto.ward !== undefined)
            divider.ward = updateDividerDto.ward || null;
        if (updateDividerDto.community !== undefined)
            divider.community = updateDividerDto.community || null;
        if (updateDividerDto.notes !== undefined)
            divider.notes = updateDividerDto.notes || null;
        if (updateDividerDto.status)
            divider.status = updateDividerDto.status;
        await this.dividersRepository.save(divider);
        return this.findOne(id);
    }
    async deactivate(id) {
        const divider = await this.findOne(id);
        divider.status = 'inactive';
        await this.dividersRepository.save(divider);
        return this.findOne(id);
    }
    async activate(id) {
        const divider = await this.findOne(id);
        divider.status = 'active';
        await this.dividersRepository.save(divider);
        return this.findOne(id);
    }
    async getStats(phcCenterId) {
        const query = this.dividersRepository.createQueryBuilder('divider');
        if (phcCenterId) {
            query.andWhere('divider.phcCenterId = :phcCenterId', { phcCenterId });
        }
        const [total, active, inactive] = await Promise.all([
            query.clone().getCount(),
            query.clone().andWhere('divider.status = :status', { status: 'active' }).getCount(),
            query.clone().andWhere('divider.status = :status', { status: 'inactive' }).getCount(),
        ]);
        return { total, active, inactive };
    }
};
exports.DividersService = DividersService;
exports.DividersService = DividersService = DividersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(divider_entity_1.Divider)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DividersService);
//# sourceMappingURL=dividers.service.js.map
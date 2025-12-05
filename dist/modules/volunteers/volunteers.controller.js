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
exports.VolunteersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_constant_1 = require("../auth/constants/roles.constant");
const volunteers_service_1 = require("./volunteers.service");
const create_volunteer_dto_1 = require("./dto/create-volunteer.dto");
const update_volunteer_dto_1 = require("./dto/update-volunteer.dto");
let VolunteersController = class VolunteersController {
    constructor(volunteersService) {
        this.volunteersService = volunteersService;
    }
    async create(createVolunteerDto, req) {
        const volunteer = await this.volunteersService.create(createVolunteerDto, req.user.id, req.user.facility_id);
        return {
            message: 'Volunteer registered successfully',
            volunteer: this.formatVolunteer(volunteer),
        };
    }
    async findAll(req, status, gender, trained, search, limit, offset) {
        const phcCenterId = req.user.role === 'admin' ? undefined : req.user.facility_id;
        const { volunteers, total } = await this.volunteersService.findAll({
            phcCenterId,
            status,
            gender,
            trainingCompleted: trained ? trained === 'true' : undefined,
            search,
            limit: limit ? parseInt(limit) : 50,
            offset: offset ? parseInt(offset) : 0,
        });
        return {
            total,
            volunteers: volunteers.map(v => this.formatVolunteer(v)),
        };
    }
    async getStats(req) {
        const phcCenterId = req.user.role === 'admin' ? undefined : req.user.facility_id;
        return this.volunteersService.getStats(phcCenterId);
    }
    async findOne(id) {
        const volunteer = await this.volunteersService.findOne(id);
        return this.formatVolunteer(volunteer);
    }
    async update(id, updateVolunteerDto) {
        const volunteer = await this.volunteersService.update(id, updateVolunteerDto);
        return {
            message: 'Volunteer updated successfully',
            volunteer: this.formatVolunteer(volunteer),
        };
    }
    async activate(id) {
        const volunteer = await this.volunteersService.activate(id);
        return {
            message: 'Volunteer activated',
            volunteer: this.formatVolunteer(volunteer),
        };
    }
    async deactivate(id) {
        const volunteer = await this.volunteersService.deactivate(id);
        return {
            message: 'Volunteer deactivated',
            volunteer: this.formatVolunteer(volunteer),
        };
    }
    async markTrainingCompleted(id, trainingDate) {
        const volunteer = await this.volunteersService.markTrainingCompleted(id, trainingDate);
        return {
            message: 'Training marked as completed',
            volunteer: this.formatVolunteer(volunteer),
        };
    }
    formatVolunteer(volunteer) {
        return {
            id: volunteer.id,
            volunteerCode: volunteer.volunteerCode,
            fullName: volunteer.fullName,
            firstName: volunteer.firstName,
            lastName: volunteer.lastName,
            phone: volunteer.phone,
            altPhone: volunteer.altPhone,
            email: volunteer.email,
            gender: volunteer.gender,
            age: volunteer.age,
            dateOfBirth: volunteer.dateOfBirth,
            address: volunteer.address,
            lga: volunteer.lga,
            ward: volunteer.ward,
            community: volunteer.community,
            occupation: volunteer.occupation,
            educationLevel: volunteer.educationLevel,
            nextOfKin: volunteer.nextOfKin,
            nextOfKinPhone: volunteer.nextOfKinPhone,
            skills: volunteer.skills,
            notes: volunteer.notes,
            status: volunteer.status,
            trainingCompleted: volunteer.trainingCompleted === 1,
            trainingDate: volunteer.trainingDate,
            facility: volunteer.phcCenter ? {
                id: volunteer.phcCenter.id,
                name: volunteer.phcCenter.centerName,
            } : null,
            registeredBy: volunteer.registeredByUser ? {
                id: volunteer.registeredByUser.id,
                name: volunteer.registeredByUser.fullName,
            } : null,
            createdAt: volunteer.createdAt,
            updatedAt: volunteer.updatedAt,
        };
    }
};
exports.VolunteersController = VolunteersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_volunteer_dto_1.CreateVolunteerDto, Object]),
    __metadata("design:returntype", Promise)
], VolunteersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('gender')),
    __param(3, (0, common_1.Query)('trained')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('limit')),
    __param(6, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VolunteersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VolunteersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VolunteersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_volunteer_dto_1.UpdateVolunteerDto]),
    __metadata("design:returntype", Promise)
], VolunteersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/activate'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VolunteersController.prototype, "activate", null);
__decorate([
    (0, common_1.Put)(':id/deactivate'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VolunteersController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Put)(':id/training-completed'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('trainingDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], VolunteersController.prototype, "markTrainingCompleted", null);
exports.VolunteersController = VolunteersController = __decorate([
    (0, common_1.Controller)('volunteers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [volunteers_service_1.VolunteersService])
], VolunteersController);
//# sourceMappingURL=volunteers.controller.js.map
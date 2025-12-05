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
exports.DividersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_constant_1 = require("../auth/constants/roles.constant");
const dividers_service_1 = require("./dividers.service");
const create_divider_dto_1 = require("./dto/create-divider.dto");
const update_divider_dto_1 = require("./dto/update-divider.dto");
let DividersController = class DividersController {
    constructor(dividersService) {
        this.dividersService = dividersService;
    }
    async create(createDividerDto, req) {
        const divider = await this.dividersService.create(createDividerDto, req.user.id, req.user.facility_id);
        return {
            message: 'Divider captured successfully',
            divider: this.formatDivider(divider),
        };
    }
    async findAll(req, status, search, limit, offset) {
        const phcCenterId = req.user.role === 'admin' ? undefined : req.user.facility_id;
        const { dividers, total } = await this.dividersService.findAll({
            phcCenterId,
            status,
            search,
            limit: limit ? parseInt(limit) : 50,
            offset: offset ? parseInt(offset) : 0,
        });
        return {
            total,
            dividers: dividers.map(d => this.formatDivider(d)),
        };
    }
    async getStats(req) {
        const phcCenterId = req.user.role === 'admin' ? undefined : req.user.facility_id;
        return this.dividersService.getStats(phcCenterId);
    }
    async findOne(id) {
        const divider = await this.dividersService.findOne(id);
        return this.formatDivider(divider);
    }
    async update(id, updateDividerDto) {
        const divider = await this.dividersService.update(id, updateDividerDto);
        return {
            message: 'Divider updated successfully',
            divider: this.formatDivider(divider),
        };
    }
    async deactivate(id) {
        const divider = await this.dividersService.deactivate(id);
        return {
            message: 'Divider deactivated',
            divider: this.formatDivider(divider),
        };
    }
    async activate(id) {
        const divider = await this.dividersService.activate(id);
        return {
            message: 'Divider activated',
            divider: this.formatDivider(divider),
        };
    }
    formatDivider(divider) {
        return {
            id: divider.id,
            dividerCode: divider.dividerCode,
            fullName: divider.fullName,
            phone: divider.phone,
            address: divider.address,
            lga: divider.lga,
            ward: divider.ward,
            community: divider.community,
            notes: divider.notes,
            status: divider.status,
            facility: divider.phcCenter ? {
                id: divider.phcCenter.id,
                name: divider.phcCenter.centerName,
            } : null,
            capturedBy: divider.capturedByUser ? {
                id: divider.capturedByUser.id,
                name: divider.capturedByUser.fullName,
            } : null,
            createdAt: divider.createdAt,
            updatedAt: divider.updatedAt,
        };
    }
};
exports.DividersController = DividersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_divider_dto_1.CreateDividerDto, Object]),
    __metadata("design:returntype", Promise)
], DividersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DividersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DividersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DividersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_divider_dto_1.UpdateDividerDto]),
    __metadata("design:returntype", Promise)
], DividersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/deactivate'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DividersController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Put)(':id/activate'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.CHO, roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DividersController.prototype, "activate", null);
exports.DividersController = DividersController = __decorate([
    (0, common_1.Controller)('dividers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [dividers_service_1.DividersService])
], DividersController);
//# sourceMappingURL=dividers.controller.js.map
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
exports.NotificationTypesController = exports.FacilitiesController = exports.PublicFacilitiesController = void 0;
const common_1 = require("@nestjs/common");
const facilities_service_1 = require("./facilities.service");
const create_facility_dto_1 = require("./dto/create-facility.dto");
const update_facility_dto_1 = require("./dto/update-facility.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_constant_1 = require("../auth/constants/roles.constant");
let PublicFacilitiesController = class PublicFacilitiesController {
    constructor(facilitiesService) {
        this.facilitiesService = facilitiesService;
    }
    async findAllPublic() {
        return this.facilitiesService.findAllPublic();
    }
};
exports.PublicFacilitiesController = PublicFacilitiesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicFacilitiesController.prototype, "findAllPublic", null);
exports.PublicFacilitiesController = PublicFacilitiesController = __decorate([
    (0, common_1.Controller)('facilities/public'),
    __metadata("design:paramtypes", [facilities_service_1.FacilitiesService])
], PublicFacilitiesController);
let FacilitiesController = class FacilitiesController {
    constructor(facilitiesService) {
        this.facilitiesService = facilitiesService;
    }
    async findAll(includeInactive) {
        return this.facilitiesService.findAll(includeInactive === 'true');
    }
    async findOne(id) {
        return this.facilitiesService.findOne(+id);
    }
    async create(createDto) {
        return this.facilitiesService.create(createDto);
    }
    async update(id, updateDto) {
        return this.facilitiesService.update(+id, updateDto);
    }
    async activate(id) {
        return this.facilitiesService.activate(+id);
    }
    async deactivate(id) {
        return this.facilitiesService.deactivate(+id);
    }
};
exports.FacilitiesController = FacilitiesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacilitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacilitiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_facility_dto_1.CreateFacilityDto]),
    __metadata("design:returntype", Promise)
], FacilitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_facility_dto_1.UpdateFacilityDto]),
    __metadata("design:returntype", Promise)
], FacilitiesController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/activate'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacilitiesController.prototype, "activate", null);
__decorate([
    (0, common_1.Put)(':id/deactivate'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacilitiesController.prototype, "deactivate", null);
exports.FacilitiesController = FacilitiesController = __decorate([
    (0, common_1.Controller)('facilities'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [facilities_service_1.FacilitiesService])
], FacilitiesController);
let NotificationTypesController = class NotificationTypesController {
    constructor(facilitiesService) {
        this.facilitiesService = facilitiesService;
    }
    async getNotificationTypes() {
        return this.facilitiesService.getNotificationTypes();
    }
};
exports.NotificationTypesController = NotificationTypesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationTypesController.prototype, "getNotificationTypes", null);
exports.NotificationTypesController = NotificationTypesController = __decorate([
    (0, common_1.Controller)('notification-types'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [facilities_service_1.FacilitiesService])
], NotificationTypesController);
//# sourceMappingURL=facilities.controller.js.map
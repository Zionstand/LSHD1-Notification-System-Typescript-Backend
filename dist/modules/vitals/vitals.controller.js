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
exports.VitalsController = void 0;
const common_1 = require("@nestjs/common");
const vitals_service_1 = require("./vitals.service");
const create_vital_record_dto_1 = require("./dto/create-vital-record.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_constant_1 = require("../auth/constants/roles.constant");
let VitalsController = class VitalsController {
    constructor(vitalsService) {
        this.vitalsService = vitalsService;
    }
    async create(createDto, req) {
        const record = await this.vitalsService.create(createDto, req.user.id);
        return {
            message: 'Vital signs recorded successfully',
            vitalRecord: this.vitalsService.formatVitalRecord(record),
        };
    }
    async findByPatient(patientId) {
        const records = await this.vitalsService.findByPatient(+patientId);
        return {
            count: records.length,
            records: records.map((r) => this.vitalsService.formatVitalRecord(r)),
        };
    }
    async getLatestByPatient(patientId) {
        const record = await this.vitalsService.getLatestByPatient(+patientId);
        if (!record) {
            return { record: null };
        }
        return { record: this.vitalsService.formatVitalRecord(record) };
    }
    async findByScreening(screeningId) {
        const records = await this.vitalsService.findByScreening(+screeningId);
        return {
            count: records.length,
            records: records.map((r) => this.vitalsService.formatVitalRecord(r)),
        };
    }
    async getLatestByScreening(screeningId) {
        const record = await this.vitalsService.getLatestByScreening(+screeningId);
        if (!record) {
            return { record: null };
        }
        return { record: this.vitalsService.formatVitalRecord(record) };
    }
    async findOne(id) {
        const record = await this.vitalsService.findOne(+id);
        return { record: this.vitalsService.formatVitalRecord(record) };
    }
};
exports.VitalsController = VitalsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.NURSE, roles_constant_1.Role.DOCTOR, roles_constant_1.Role.CHO, roles_constant_1.Role.MLS),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vital_record_dto_1.CreateVitalRecordDto, Object]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "findByPatient", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/latest'),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "getLatestByPatient", null);
__decorate([
    (0, common_1.Get)('screening/:screeningId'),
    __param(0, (0, common_1.Param)('screeningId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "findByScreening", null);
__decorate([
    (0, common_1.Get)('screening/:screeningId/latest'),
    __param(0, (0, common_1.Param)('screeningId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "getLatestByScreening", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "findOne", null);
exports.VitalsController = VitalsController = __decorate([
    (0, common_1.Controller)('vitals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [vitals_service_1.VitalsService])
], VitalsController);
//# sourceMappingURL=vitals.controller.js.map
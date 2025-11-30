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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_constant_1 = require("../auth/constants/roles.constant");
const audit_service_1 = require("../audit/audit.service");
let ReportsController = class ReportsController {
    constructor(reportsService, auditService) {
        this.reportsService = reportsService;
        this.auditService = auditService;
    }
    async getSummary(req, facilityId, screeningType, startDate, endDate, status) {
        const filters = this.buildFilters(req, facilityId, screeningType, startDate, endDate, status);
        return this.reportsService.getScreeningSummary(filters);
    }
    async getDetails(req, facilityId, screeningType, startDate, endDate, status) {
        const filters = this.buildFilters(req, facilityId, screeningType, startDate, endDate, status);
        return this.reportsService.getScreeningDetails(filters);
    }
    async getFacilityComparison(startDate, endDate) {
        return this.reportsService.getFacilityComparison(startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async getAbnormalResults(req, facilityId, startDate, endDate) {
        const filters = {};
        if (req.user.role !== 'admin' && req.user.facility_id) {
            filters.facilityId = req.user.facility_id;
        }
        else if (facilityId) {
            filters.facilityId = parseInt(facilityId);
        }
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        return this.reportsService.getAbnormalResults(filters);
    }
    async getTrends(req, facilityId, period, days) {
        let facility;
        if (req.user.role !== 'admin' && req.user.facility_id) {
            facility = req.user.facility_id;
        }
        else if (facilityId) {
            facility = parseInt(facilityId);
        }
        return this.reportsService.getTrendData(facility, period || 'daily', days ? parseInt(days) : 30);
    }
    async exportCSV(req, res, facilityId, screeningType, startDate, endDate, status) {
        const filters = this.buildFilters(req, facilityId, screeningType, startDate, endDate, status);
        const csvData = await this.reportsService.exportToCSV(filters);
        await this.auditService.log({
            userId: req.user.id,
            action: 'EXPORT',
            resource: 'REPORT',
            details: { format: 'CSV', filters },
            facilityId: req.user.facility_id,
        });
        const filename = `screening-report-${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvData);
    }
    buildFilters(req, facilityId, screeningType, startDate, endDate, status) {
        const filters = {};
        if (req.user.role !== 'admin' && req.user.facility_id) {
            filters.facilityId = req.user.facility_id;
        }
        else if (facilityId) {
            filters.facilityId = parseInt(facilityId);
        }
        if (screeningType)
            filters.screeningType = screeningType;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        if (status)
            filters.status = status;
        return filters;
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER, roles_constant_1.Role.DOCTOR),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('facilityId')),
    __param(2, (0, common_1.Query)('screeningType')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('details'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER, roles_constant_1.Role.DOCTOR),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('facilityId')),
    __param(2, (0, common_1.Query)('screeningType')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Get)('facility-comparison'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getFacilityComparison", null);
__decorate([
    (0, common_1.Get)('abnormal-results'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.DOCTOR),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('facilityId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAbnormalResults", null);
__decorate([
    (0, common_1.Get)('trends'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER, roles_constant_1.Role.DOCTOR),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('facilityId')),
    __param(2, (0, common_1.Query)('period')),
    __param(3, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTrends", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    (0, roles_decorator_1.Roles)(roles_constant_1.Role.ADMIN, roles_constant_1.Role.HIM_OFFICER),
    (0, common_1.Header)('Content-Type', 'text/csv'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('facilityId')),
    __param(3, (0, common_1.Query)('screeningType')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportCSV", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        audit_service_1.AuditService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map
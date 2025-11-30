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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("./entities/audit-log.entity");
let AuditService = class AuditService {
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async log(params) {
        const auditLog = this.auditLogRepository.create({
            userId: params.userId ?? null,
            action: params.action,
            resource: params.resource,
            resourceId: params.resourceId ?? null,
            details: typeof params.details === 'object'
                ? JSON.stringify(params.details)
                : params.details ?? null,
            ipAddress: params.ipAddress ?? null,
            userAgent: params.userAgent ?? null,
            facilityId: params.facilityId ?? null,
        });
        return this.auditLogRepository.save(auditLog);
    }
    async findAll(filters = {}) {
        const { userId, action, resource, resourceId, facilityId, startDate, endDate, limit = 50, offset = 0, } = filters;
        const where = {};
        if (userId)
            where.userId = userId;
        if (action)
            where.action = action;
        if (resource)
            where.resource = resource;
        if (resourceId)
            where.resourceId = resourceId;
        if (facilityId)
            where.facilityId = facilityId;
        if (startDate && endDate) {
            where.createdAt = (0, typeorm_2.Between)(startDate, endDate);
        }
        else if (startDate) {
            where.createdAt = (0, typeorm_2.MoreThanOrEqual)(startDate);
        }
        else if (endDate) {
            where.createdAt = (0, typeorm_2.LessThanOrEqual)(endDate);
        }
        const [data, total] = await this.auditLogRepository.findAndCount({
            where,
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
        return { data, total };
    }
    async findByUser(userId, limit = 50) {
        return this.auditLogRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async findByResource(resource, resourceId, limit = 50) {
        return this.auditLogRepository.find({
            where: { resource, resourceId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async getStats(facilityId) {
        const baseWhere = facilityId ? { facilityId } : {};
        const totalLogs = await this.auditLogRepository.count({ where: baseWhere });
        const actionStats = await this.auditLogRepository
            .createQueryBuilder('log')
            .select('log.action', 'action')
            .addSelect('COUNT(*)', 'count')
            .where(facilityId ? 'log.facilityId = :facilityId' : '1=1', { facilityId })
            .groupBy('log.action')
            .getRawMany();
        const logsByAction = {};
        actionStats.forEach((stat) => {
            logsByAction[stat.action] = parseInt(stat.count);
        });
        const resourceStats = await this.auditLogRepository
            .createQueryBuilder('log')
            .select('log.resource', 'resource')
            .addSelect('COUNT(*)', 'count')
            .where(facilityId ? 'log.facilityId = :facilityId' : '1=1', { facilityId })
            .groupBy('log.resource')
            .getRawMany();
        const logsByResource = {};
        resourceStats.forEach((stat) => {
            logsByResource[stat.resource] = parseInt(stat.count);
        });
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentLogins = await this.auditLogRepository.count({
            where: {
                action: 'LOGIN',
                createdAt: (0, typeorm_2.MoreThanOrEqual)(oneDayAgo),
                ...(facilityId ? { facilityId } : {}),
            },
        });
        const failedLogins = await this.auditLogRepository.count({
            where: {
                action: 'LOGIN_FAILED',
                createdAt: (0, typeorm_2.MoreThanOrEqual)(oneDayAgo),
                ...(facilityId ? { facilityId } : {}),
            },
        });
        return {
            totalLogs,
            logsByAction,
            logsByResource,
            recentLogins,
            failedLogins,
        };
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditService);
//# sourceMappingURL=audit.service.js.map
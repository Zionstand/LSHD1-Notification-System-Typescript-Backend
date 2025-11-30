import { Repository } from 'typeorm';
import { AuditLog, AuditAction, AuditResource } from './entities/audit-log.entity';
export interface AuditLogParams {
    userId?: number | null;
    action: AuditAction;
    resource: AuditResource;
    resourceId?: number | null;
    details?: string | object | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    facilityId?: number | null;
}
export interface AuditLogFilters {
    userId?: number;
    action?: AuditAction;
    resource?: AuditResource;
    resourceId?: number;
    facilityId?: number;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}
export declare class AuditService {
    private auditLogRepository;
    constructor(auditLogRepository: Repository<AuditLog>);
    log(params: AuditLogParams): Promise<AuditLog>;
    findAll(filters?: AuditLogFilters): Promise<{
        data: AuditLog[];
        total: number;
    }>;
    findByUser(userId: number, limit?: number): Promise<AuditLog[]>;
    findByResource(resource: AuditResource, resourceId: number, limit?: number): Promise<AuditLog[]>;
    getStats(facilityId?: number): Promise<{
        totalLogs: number;
        logsByAction: Record<string, number>;
        logsByResource: Record<string, number>;
        recentLogins: number;
        failedLogins: number;
    }>;
}

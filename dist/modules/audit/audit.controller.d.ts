import { AuditService } from './audit.service';
import { AuditAction, AuditResource } from './entities/audit-log.entity';
export declare class AuditController {
    private auditService;
    constructor(auditService: AuditService);
    findAll(req: any, userId?: string, action?: AuditAction, resource?: AuditResource, resourceId?: string, startDate?: string, endDate?: string, limit?: string, offset?: string): Promise<{
        data: import("./entities/audit-log.entity").AuditLog[];
        total: number;
    }>;
    getStats(req: any): Promise<{
        totalLogs: number;
        logsByAction: Record<string, number>;
        logsByResource: Record<string, number>;
        recentLogins: number;
        failedLogins: number;
    }>;
    findByUser(userId: string, limit?: string): Promise<import("./entities/audit-log.entity").AuditLog[]>;
}

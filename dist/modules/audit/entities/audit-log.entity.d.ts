import { User } from '../../users/entities/user.entity';
export type AuditAction = 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'APPROVE' | 'REJECT' | 'SUSPEND';
export type AuditResource = 'USER' | 'PATIENT' | 'SCREENING' | 'APPOINTMENT' | 'FACILITY' | 'REPORT' | 'VITALS' | 'HYPERTENSION_SCREENING' | 'DIABETES_SCREENING' | 'CERVICAL_SCREENING' | 'BREAST_SCREENING' | 'PSA_SCREENING';
export declare class AuditLog {
    id: number;
    userId: number | null;
    action: AuditAction;
    resource: AuditResource;
    resourceId: number | null;
    details: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    facilityId: number | null;
    createdAt: Date;
    user: User;
}

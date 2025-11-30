import { SmsService } from './sms.service';
import { SmsType, SmsStatus } from './entities/sms-log.entity';
import { AuditService } from '../audit/audit.service';
declare class SendScreeningResultDto {
    patientId: number;
    screeningType: string;
    result: string;
}
declare class SendFollowUpReminderDto {
    patientId: number;
    screeningType: string;
    dueDate: string;
}
declare class SendGeneralSmsDto {
    phoneNumber: string;
    message: string;
    patientId?: number;
}
declare class SendManualSmsDto {
    patientId: number;
    message: string;
}
export declare class SmsController {
    private smsService;
    private auditService;
    constructor(smsService: SmsService, auditService: AuditService);
    findAll(req: any, patientId?: string, smsType?: SmsType, status?: SmsStatus, startDate?: string, endDate?: string, limit?: string, offset?: string): Promise<{
        logs: import("./entities/sms-log.entity").SmsLog[];
        total: number;
    }>;
    getStats(req: any): Promise<{
        total: number;
        sent: number;
        failed: number;
        pending: number;
        byType: Record<string, number>;
    }>;
    sendScreeningResult(req: any, dto: SendScreeningResultDto): Promise<import("./entities/sms-log.entity").SmsLog | null>;
    sendAppointmentReminder(req: any, appointmentId: string): Promise<import("./entities/sms-log.entity").SmsLog | null>;
    sendAppointmentConfirmation(req: any, appointmentId: string): Promise<import("./entities/sms-log.entity").SmsLog | null>;
    sendFollowUpReminder(req: any, dto: SendFollowUpReminderDto): Promise<import("./entities/sms-log.entity").SmsLog | null>;
    sendGeneralSms(req: any, dto: SendGeneralSmsDto): Promise<import("./entities/sms-log.entity").SmsLog>;
    processReminders(req: any): Promise<{
        message: string;
        processed: number;
        sent: number;
        failed: number;
    }>;
    sendManualSms(req: any, dto: SendManualSmsDto): Promise<{
        success: boolean;
        message: string;
    }>;
    sendScreeningSms(req: any, screeningId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendFollowupSms(req: any, appointmentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendReminderSms(req: any, appointmentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getPatientSmsHistory(req: any, patientId: string): Promise<{
        count: number;
        data: {
            id: number;
            phoneNumber: string;
            message: string;
            type: SmsType;
            status: SmsStatus;
            sentAt: Date | null;
            createdAt: Date;
            sentBy: {
                id: number;
                name: string;
            } | null;
        }[];
    }>;
    getSmsLogs(req: any, status?: SmsStatus, type?: SmsType, limit?: string): Promise<{
        count: number;
        data: {
            id: number;
            patientId: number | null;
            patientName: string | null;
            phoneNumber: string;
            message: string;
            type: SmsType;
            status: SmsStatus;
            sentAt: Date | null;
            createdAt: Date;
            sentBy: {
                id: number;
                name: string;
            } | null;
            errorMessage: string | null;
        }[];
    }>;
}
export {};

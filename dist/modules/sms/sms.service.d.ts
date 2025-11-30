import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SmsLog, SmsType, SmsStatus } from './entities/sms-log.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Screening } from '../screenings/entities/screening.entity';
interface SendSmsParams {
    phoneNumber: string;
    message: string;
    smsType: SmsType;
    patientId?: number;
    sentBy?: number;
    facilityId?: number;
    relatedEntity?: string;
    relatedEntityId?: number;
}
export declare class SmsService {
    private smsLogRepository;
    private patientRepository;
    private appointmentRepository;
    private screeningRepository;
    private configService;
    private readonly logger;
    private readonly baseUrl;
    private readonly apiKey;
    private readonly senderName;
    constructor(smsLogRepository: Repository<SmsLog>, patientRepository: Repository<Patient>, appointmentRepository: Repository<Appointment>, screeningRepository: Repository<Screening>, configService: ConfigService);
    sendSms(params: SendSmsParams): Promise<SmsLog>;
    sendScreeningResultSms(patientId: number, screeningType: string, result: string, sentBy: number, facilityId?: number): Promise<SmsLog | null>;
    sendAppointmentReminderSms(appointmentId: number): Promise<SmsLog | null>;
    sendAppointmentConfirmationSms(appointmentId: number, sentBy?: number): Promise<SmsLog | null>;
    sendFollowUpReminderSms(patientId: number, screeningType: string, dueDate: Date, facilityId?: number): Promise<SmsLog | null>;
    processPendingAppointmentReminders(): Promise<number>;
    findAll(filters: {
        patientId?: number;
        smsType?: SmsType;
        status?: SmsStatus;
        facilityId?: number;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
    }): Promise<{
        logs: SmsLog[];
        total: number;
    }>;
    getStats(facilityId?: number): Promise<{
        total: number;
        sent: number;
        failed: number;
        pending: number;
        byType: Record<string, number>;
    }>;
    private formatPhoneNumber;
    private getResultText;
    private getScreeningName;
    sendManualSmsToPatient(patientId: number, message: string, sentBy: number, facilityId?: number): Promise<SmsLog | null>;
    sendScreeningSmsById(screeningId: number, sentBy: number, facilityId?: number): Promise<SmsLog | null>;
    sendFollowupSmsById(appointmentId: number, sentBy: number, facilityId?: number): Promise<SmsLog | null>;
}
export {};

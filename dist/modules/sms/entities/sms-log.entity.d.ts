import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';
export type SmsType = 'SCREENING_RESULT' | 'APPOINTMENT_REMINDER' | 'FOLLOW_UP_REMINDER' | 'APPOINTMENT_CONFIRMATION' | 'GENERAL';
export type SmsStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
export declare class SmsLog {
    id: number;
    patientId: number | null;
    phoneNumber: string;
    message: string;
    smsType: SmsType;
    status: SmsStatus;
    sendchampReference: string | null;
    errorMessage: string | null;
    sentBy: number | null;
    facilityId: number | null;
    relatedEntity: string | null;
    relatedEntityId: number | null;
    createdAt: Date;
    sentAt: Date | null;
    patient: Patient;
    sentByUser: User;
}

import { Patient } from '../../patients/entities/patient.entity';
import { PhcCenter } from '../../facilities/entities/phc-center.entity';
import { User } from '../../users/entities/user.entity';
import { Screening } from '../../screenings/entities/screening.entity';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export declare class Appointment {
    id: number;
    patientId: number;
    phcCenterId: number;
    screeningId: number | null;
    appointmentDate: Date;
    appointmentTime: string;
    appointmentType: string;
    reason: string;
    isFollowup: number;
    followupInstructions: string | null;
    status: AppointmentStatus;
    reminderSent: number;
    sendSmsReminder: number;
    reminderDaysBefore: number;
    reminderScheduledDate: Date | null;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
    patient: Patient;
    phcCenter: PhcCenter;
    createdByUser: User;
    screening: Screening;
}

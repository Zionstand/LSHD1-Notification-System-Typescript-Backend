import { Patient } from '../../patients/entities/patient.entity';
import { PhcCenter } from '../../facilities/entities/phc-center.entity';
import { User } from '../../users/entities/user.entity';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export declare class Appointment {
    id: number;
    patientId: number;
    phcCenterId: number;
    appointmentDate: Date;
    appointmentTime: string;
    appointmentType: string;
    reason: string;
    status: AppointmentStatus;
    reminderSent: number;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
    patient: Patient;
    phcCenter: PhcCenter;
    createdByUser: User;
}

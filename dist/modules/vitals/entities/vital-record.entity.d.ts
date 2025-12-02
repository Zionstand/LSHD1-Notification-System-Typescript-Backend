import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';
import { Screening } from '../../screenings/entities/screening.entity';
export declare class VitalRecord {
    id: number;
    patientId: number;
    screeningId: number | null;
    bloodPressureSystolic: number | null;
    bloodPressureDiastolic: number | null;
    temperature: number | null;
    pulseRate: number | null;
    respiratoryRate: number | null;
    weight: number | null;
    height: number | null;
    bmi: number | null;
    bloodSugarRandom: number | null;
    bloodSugarFasting: number | null;
    notes: string | null;
    recordedBy: number;
    recordedAt: Date;
    createdAt: Date;
    patient: Patient;
    screening: Screening;
    recordedByUser: User;
}

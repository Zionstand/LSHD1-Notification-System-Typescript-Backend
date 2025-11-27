import { Screening } from './screening.entity';
import { User } from '../../users/entities/user.entity';
export type DiabetesTestType = 'random' | 'fasting';
export type DiabetesResult = 'normal' | 'prediabetes' | 'diabetes';
export declare class DiabetesScreening {
    id: number;
    screeningId: number;
    screening: Screening;
    testType: DiabetesTestType;
    bloodSugarLevel: number;
    unit: string;
    fastingDurationHours: number | null;
    testTime: string;
    screeningResult: DiabetesResult;
    clinicalObservations: string | null;
    referToDoctor: boolean;
    referralReason: string | null;
    conductedBy: number;
    conductedByUser: User;
    createdAt: Date;
    updatedAt: Date;
}

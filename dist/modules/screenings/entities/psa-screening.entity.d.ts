import { Screening } from './screening.entity';
import { User } from '../../users/entities/user.entity';
export type PsaResult = 'normal' | 'borderline' | 'elevated';
export declare class PsaScreening {
    id: number;
    screeningId: number;
    screening: Screening;
    psaLevel: number;
    unit: string;
    testMethod: string | null;
    testKit: string | null;
    collectionTime: string;
    sampleQuality: string;
    sampleQualityNotes: string | null;
    patientAge: number;
    normalRangeMin: number;
    normalRangeMax: number;
    screeningResult: PsaResult;
    resultInterpretation: string | null;
    clinicalObservations: string | null;
    referToDoctor: boolean;
    referralReason: string | null;
    conductedBy: number;
    conductedByUser: User;
    createdAt: Date;
    updatedAt: Date;
}

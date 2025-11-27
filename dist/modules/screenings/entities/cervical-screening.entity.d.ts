import { Screening } from './screening.entity';
import { User } from '../../users/entities/user.entity';
export type CervicalScreeningMethod = 'via' | 'vili' | 'pap_smear' | 'hpv_test' | 'other';
export type CervicalResult = 'negative' | 'positive' | 'suspicious' | 'inconclusive';
export declare class CervicalScreening {
    id: number;
    screeningId: number;
    screening: Screening;
    screeningPerformed: boolean;
    screeningMethod: CervicalScreeningMethod;
    otherMethodDetails: string | null;
    visualInspectionFindings: string | null;
    specimenCollected: boolean;
    specimenType: string | null;
    screeningResult: CervicalResult;
    clinicalObservations: string | null;
    remarks: string | null;
    followUpRequired: boolean;
    followUpDate: Date | null;
    followUpNotes: string | null;
    conductedBy: number;
    conductedByUser: User;
    createdAt: Date;
    updatedAt: Date;
}

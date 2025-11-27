export declare class CreateCervicalScreeningDto {
    screeningId: number;
    screeningPerformed?: boolean;
    screeningMethod: 'via' | 'vili' | 'pap_smear' | 'hpv_test' | 'other';
    otherMethodDetails?: string;
    visualInspectionFindings?: string;
    specimenCollected?: boolean;
    specimenType?: string;
    screeningResult: 'negative' | 'positive' | 'suspicious' | 'inconclusive';
    clinicalObservations?: string;
    remarks?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
    followUpNotes?: string;
}
export declare class UpdateCervicalScreeningDto {
    screeningPerformed?: boolean;
    screeningMethod?: 'via' | 'vili' | 'pap_smear' | 'hpv_test' | 'other';
    otherMethodDetails?: string;
    visualInspectionFindings?: string;
    specimenCollected?: boolean;
    specimenType?: string;
    screeningResult?: 'negative' | 'positive' | 'suspicious' | 'inconclusive';
    clinicalObservations?: string;
    remarks?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
    followUpNotes?: string;
}

export declare class CreateDiabetesScreeningDto {
    screeningId: number;
    testType: 'random' | 'fasting';
    bloodSugarLevel: number;
    unit?: 'mg/dL' | 'mmol/L';
    fastingDurationHours?: number;
    testTime: string;
    clinicalObservations?: string;
    referToDoctor?: boolean;
    referralReason?: string;
}
export declare class UpdateDiabetesScreeningDto {
    testType?: 'random' | 'fasting';
    bloodSugarLevel?: number;
    unit?: 'mg/dL' | 'mmol/L';
    fastingDurationHours?: number;
    testTime?: string;
    clinicalObservations?: string;
    referToDoctor?: boolean;
    referralReason?: string;
}

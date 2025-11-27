export declare class CreatePsaScreeningDto {
    screeningId: number;
    psaLevel: number;
    unit?: string;
    testMethod?: string;
    testKit?: string;
    collectionTime: string;
    sampleQuality?: string;
    sampleQualityNotes?: string;
    patientAge: number;
    normalRangeMin?: number;
    normalRangeMax: number;
    resultInterpretation?: string;
    clinicalObservations?: string;
    referToDoctor?: boolean;
    referralReason?: string;
}
export declare class UpdatePsaScreeningDto {
    psaLevel?: number;
    unit?: string;
    testMethod?: string;
    testKit?: string;
    collectionTime?: string;
    sampleQuality?: string;
    sampleQualityNotes?: string;
    patientAge?: number;
    normalRangeMin?: number;
    normalRangeMax?: number;
    resultInterpretation?: string;
    clinicalObservations?: string;
    referToDoctor?: boolean;
    referralReason?: string;
}

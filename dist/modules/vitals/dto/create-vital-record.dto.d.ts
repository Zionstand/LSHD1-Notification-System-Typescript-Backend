export declare class CreateVitalRecordDto {
    patientId: number;
    screeningId?: number;
    systolicBp: number;
    diastolicBp: number;
    temperature?: number;
    pulseRate?: number;
    respiratoryRate?: number;
    weight?: number;
    height?: number;
    bloodSugarRandom?: number;
    bloodSugarFasting?: number;
    notes?: string;
}

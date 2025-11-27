export declare class CreateBreastScreeningDto {
    screeningId: number;
    lumpPresent: boolean;
    lumpLocation?: string;
    lumpSize?: string;
    lumpCharacteristics?: string;
    dischargePresent: boolean;
    dischargeType?: string;
    dischargeLocation?: 'left' | 'right' | 'bilateral' | 'none';
    nippleInversion: boolean;
    nippleInversionLaterality?: 'left' | 'right' | 'bilateral' | 'none';
    lymphNodeStatus: 'normal' | 'enlarged';
    lymphNodeLocation?: string;
    skinChanges?: string;
    breastSymmetry?: string;
    summaryFindings: string;
    riskAssessment: 'low' | 'moderate' | 'high';
    recommendations?: string;
    referralRequired?: boolean;
    referralFacility?: string;
    referralReason?: string;
}
export declare class UpdateBreastScreeningDto {
    lumpPresent?: boolean;
    lumpLocation?: string;
    lumpSize?: string;
    lumpCharacteristics?: string;
    dischargePresent?: boolean;
    dischargeType?: string;
    dischargeLocation?: 'left' | 'right' | 'bilateral' | 'none';
    nippleInversion?: boolean;
    nippleInversionLaterality?: 'left' | 'right' | 'bilateral' | 'none';
    lymphNodeStatus?: 'normal' | 'enlarged';
    lymphNodeLocation?: string;
    skinChanges?: string;
    breastSymmetry?: string;
    summaryFindings?: string;
    riskAssessment?: 'low' | 'moderate' | 'high';
    recommendations?: string;
    referralRequired?: boolean;
    referralFacility?: string;
    referralReason?: string;
}

import { IsNumber, IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class CreateBreastScreeningDto {
  @IsNumber()
  screeningId: number;

  // Lump assessment
  @IsBoolean()
  lumpPresent: boolean;

  @IsOptional()
  @IsString()
  lumpLocation?: string;

  @IsOptional()
  @IsString()
  lumpSize?: string;

  @IsOptional()
  @IsString()
  lumpCharacteristics?: string;

  // Discharge
  @IsBoolean()
  dischargePresent: boolean;

  @IsOptional()
  @IsString()
  dischargeType?: string;

  @IsOptional()
  @IsIn(['left', 'right', 'bilateral', 'none'])
  dischargeLocation?: 'left' | 'right' | 'bilateral' | 'none';

  // Nipple inversion
  @IsBoolean()
  nippleInversion: boolean;

  @IsOptional()
  @IsIn(['left', 'right', 'bilateral', 'none'])
  nippleInversionLaterality?: 'left' | 'right' | 'bilateral' | 'none';

  // Lymph nodes
  @IsIn(['normal', 'enlarged'])
  lymphNodeStatus: 'normal' | 'enlarged';

  @IsOptional()
  @IsString()
  lymphNodeLocation?: string;

  // Other findings
  @IsOptional()
  @IsString()
  skinChanges?: string;

  @IsOptional()
  @IsString()
  breastSymmetry?: string;

  // Summary
  @IsString()
  summaryFindings: string;

  @IsIn(['low', 'moderate', 'high'])
  riskAssessment: 'low' | 'moderate' | 'high';

  @IsOptional()
  @IsString()
  recommendations?: string;

  // Referral
  @IsOptional()
  @IsBoolean()
  referralRequired?: boolean;

  @IsOptional()
  @IsString()
  referralFacility?: string;

  @IsOptional()
  @IsString()
  referralReason?: string;
}

export class UpdateBreastScreeningDto {
  @IsOptional()
  @IsBoolean()
  lumpPresent?: boolean;

  @IsOptional()
  @IsString()
  lumpLocation?: string;

  @IsOptional()
  @IsString()
  lumpSize?: string;

  @IsOptional()
  @IsString()
  lumpCharacteristics?: string;

  @IsOptional()
  @IsBoolean()
  dischargePresent?: boolean;

  @IsOptional()
  @IsString()
  dischargeType?: string;

  @IsOptional()
  @IsIn(['left', 'right', 'bilateral', 'none'])
  dischargeLocation?: 'left' | 'right' | 'bilateral' | 'none';

  @IsOptional()
  @IsBoolean()
  nippleInversion?: boolean;

  @IsOptional()
  @IsIn(['left', 'right', 'bilateral', 'none'])
  nippleInversionLaterality?: 'left' | 'right' | 'bilateral' | 'none';

  @IsOptional()
  @IsIn(['normal', 'enlarged'])
  lymphNodeStatus?: 'normal' | 'enlarged';

  @IsOptional()
  @IsString()
  lymphNodeLocation?: string;

  @IsOptional()
  @IsString()
  skinChanges?: string;

  @IsOptional()
  @IsString()
  breastSymmetry?: string;

  @IsOptional()
  @IsString()
  summaryFindings?: string;

  @IsOptional()
  @IsIn(['low', 'moderate', 'high'])
  riskAssessment?: 'low' | 'moderate' | 'high';

  @IsOptional()
  @IsString()
  recommendations?: string;

  @IsOptional()
  @IsBoolean()
  referralRequired?: boolean;

  @IsOptional()
  @IsString()
  referralFacility?: string;

  @IsOptional()
  @IsString()
  referralReason?: string;
}

import { IsNumber, IsString, IsOptional, IsIn, IsBoolean, IsDateString } from 'class-validator';

export class CreateCervicalScreeningDto {
  @IsNumber()
  screeningId: number;

  @IsOptional()
  @IsBoolean()
  screeningPerformed?: boolean;

  @IsIn(['via', 'vili', 'pap_smear', 'hpv_test', 'other'])
  screeningMethod: 'via' | 'vili' | 'pap_smear' | 'hpv_test' | 'other';

  @IsOptional()
  @IsString()
  otherMethodDetails?: string;

  @IsOptional()
  @IsString()
  visualInspectionFindings?: string;

  @IsOptional()
  @IsBoolean()
  specimenCollected?: boolean;

  @IsOptional()
  @IsString()
  specimenType?: string;

  @IsIn(['negative', 'positive', 'suspicious', 'inconclusive'])
  screeningResult: 'negative' | 'positive' | 'suspicious' | 'inconclusive';

  @IsOptional()
  @IsString()
  clinicalObservations?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @IsOptional()
  @IsString()
  followUpNotes?: string;
}

export class UpdateCervicalScreeningDto {
  @IsOptional()
  @IsBoolean()
  screeningPerformed?: boolean;

  @IsOptional()
  @IsIn(['via', 'vili', 'pap_smear', 'hpv_test', 'other'])
  screeningMethod?: 'via' | 'vili' | 'pap_smear' | 'hpv_test' | 'other';

  @IsOptional()
  @IsString()
  otherMethodDetails?: string;

  @IsOptional()
  @IsString()
  visualInspectionFindings?: string;

  @IsOptional()
  @IsBoolean()
  specimenCollected?: boolean;

  @IsOptional()
  @IsString()
  specimenType?: string;

  @IsOptional()
  @IsIn(['negative', 'positive', 'suspicious', 'inconclusive'])
  screeningResult?: 'negative' | 'positive' | 'suspicious' | 'inconclusive';

  @IsOptional()
  @IsString()
  clinicalObservations?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @IsOptional()
  @IsString()
  followUpNotes?: string;
}

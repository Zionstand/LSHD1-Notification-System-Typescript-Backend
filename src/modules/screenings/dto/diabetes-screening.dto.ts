import { IsNumber, IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class CreateDiabetesScreeningDto {
  @IsNumber()
  screeningId: number;

  @IsIn(['random', 'fasting'])
  testType: 'random' | 'fasting';

  @IsNumber()
  bloodSugarLevel: number;

  @IsOptional()
  @IsIn(['mg/dL', 'mmol/L'])
  unit?: 'mg/dL' | 'mmol/L';

  @IsOptional()
  @IsNumber()
  fastingDurationHours?: number;

  @IsString()
  testTime: string;

  @IsOptional()
  @IsString()
  clinicalObservations?: string;

  @IsOptional()
  @IsBoolean()
  referToDoctor?: boolean;

  @IsOptional()
  @IsString()
  referralReason?: string;

  // Personnel tracking - who performed the lab test
  @IsOptional()
  @IsNumber()
  labPersonnelId?: number;
}

export class UpdateDiabetesScreeningDto {
  @IsOptional()
  @IsIn(['random', 'fasting'])
  testType?: 'random' | 'fasting';

  @IsOptional()
  @IsNumber()
  bloodSugarLevel?: number;

  @IsOptional()
  @IsIn(['mg/dL', 'mmol/L'])
  unit?: 'mg/dL' | 'mmol/L';

  @IsOptional()
  @IsNumber()
  fastingDurationHours?: number;

  @IsOptional()
  @IsString()
  testTime?: string;

  @IsOptional()
  @IsString()
  clinicalObservations?: string;

  @IsOptional()
  @IsBoolean()
  referToDoctor?: boolean;

  @IsOptional()
  @IsString()
  referralReason?: string;
}

import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePsaScreeningDto {
  @IsNumber()
  screeningId: number;

  @IsNumber()
  psaLevel: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  testMethod?: string;

  @IsOptional()
  @IsString()
  testKit?: string;

  @IsString()
  collectionTime: string;

  @IsOptional()
  @IsString()
  sampleQuality?: string;

  @IsOptional()
  @IsString()
  sampleQualityNotes?: string;

  @IsNumber()
  patientAge: number;

  @IsOptional()
  @IsNumber()
  normalRangeMin?: number;

  @IsNumber()
  normalRangeMax: number;

  @IsOptional()
  @IsString()
  resultInterpretation?: string;

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

export class UpdatePsaScreeningDto {
  @IsOptional()
  @IsNumber()
  psaLevel?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  testMethod?: string;

  @IsOptional()
  @IsString()
  testKit?: string;

  @IsOptional()
  @IsString()
  collectionTime?: string;

  @IsOptional()
  @IsString()
  sampleQuality?: string;

  @IsOptional()
  @IsString()
  sampleQualityNotes?: string;

  @IsOptional()
  @IsNumber()
  patientAge?: number;

  @IsOptional()
  @IsNumber()
  normalRangeMin?: number;

  @IsOptional()
  @IsNumber()
  normalRangeMax?: number;

  @IsOptional()
  @IsString()
  resultInterpretation?: string;

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

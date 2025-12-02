import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateVitalRecordDto {
  @IsNumber()
  patientId: number;

  @IsOptional()
  @IsNumber()
  screeningId?: number;

  @IsNumber()
  @Min(60)
  @Max(250)
  systolicBp: number;

  @IsNumber()
  @Min(40)
  @Max(150)
  diastolicBp: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(45)
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(200)
  pulseRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(8)
  @Max(60)
  respiratoryRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(300)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  bloodSugarRandom?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  bloodSugarFasting?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

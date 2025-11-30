import { IsNumber, IsOptional } from 'class-validator';

export class UpdateVitalsDto {
  @IsNumber()
  systolicBp: number;

  @IsNumber()
  diastolicBp: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  pulseRate?: number;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  respiratoryRate?: number;
}

import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CompleteScreeningDto {
  @IsString()
  pathway: string;

  @IsOptional()
  data?: {
    result?: string;
    notes?: string;
    bloodSugar?: number;
    systolic?: number;
    diastolic?: number;
    testType?: string;
  };
}

import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class DoctorAssessmentDto {
  @IsString()
  clinicalAssessment: string;

  @IsOptional()
  @IsString()
  recommendations?: string;

  @IsOptional()
  @IsString()
  prescription?: string;

  @IsOptional()
  @IsIn(['normal', 'abnormal', 'critical', 'requires_followup'])
  patientStatus?: string;

  @IsOptional()
  @IsString()
  referralFacility?: string;

  @IsOptional()
  @IsDateString()
  nextAppointment?: string;
}

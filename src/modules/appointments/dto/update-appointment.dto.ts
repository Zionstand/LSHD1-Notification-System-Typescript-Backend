import { IsString, IsDateString, IsOptional, IsIn } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  appointmentDate?: string;

  @IsOptional()
  @IsString()
  appointmentTime?: string;

  @IsOptional()
  @IsString()
  appointmentType?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsIn(['scheduled', 'completed', 'cancelled', 'no_show'])
  status?: string;
}

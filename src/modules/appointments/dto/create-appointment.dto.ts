import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsNumber()
  clientId: number;

  @IsDateString()
  appointmentDate: string;

  @IsString()
  appointmentTime: string;

  @IsString()
  appointmentType: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

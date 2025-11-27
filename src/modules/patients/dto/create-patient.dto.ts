import { IsString, IsDateString, IsIn, IsOptional } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsIn(['Male', 'Female', 'male', 'female'])
  gender: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

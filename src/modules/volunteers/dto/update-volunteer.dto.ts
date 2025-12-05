import { IsString, IsOptional, MaxLength, IsEmail, IsIn, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { VolunteerGender, VolunteerStatus } from '../entities/volunteer.entity';

export class UpdateVolunteerDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  altPhone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsIn(['male', 'female'])
  gender?: VolunteerGender;

  @IsOptional()
  @IsInt()
  @Min(16)
  @Max(80)
  age?: number;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lga?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  ward?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  community?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  occupation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  educationLevel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  nextOfKin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  nextOfKinPhone?: string;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsIn(['active', 'inactive', 'pending'])
  status?: VolunteerStatus;

  @IsOptional()
  @IsBoolean()
  trainingCompleted?: boolean;

  @IsOptional()
  @IsString()
  trainingDate?: string;
}

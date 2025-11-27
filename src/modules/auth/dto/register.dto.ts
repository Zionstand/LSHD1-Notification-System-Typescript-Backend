import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsNumber,
  Matches,
} from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[0-9+\-\s()]+$/, { message: 'Invalid phone number format' })
  phone: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsEnum(['admin', 'him_officer', 'nurse', 'doctor', 'lab_scientist'], {
    message: 'Invalid role selected',
  })
  role: UserRole;

  @IsOptional()
  @IsNumber()
  phcCenterId?: number;

  @IsOptional()
  @IsString()
  staffId?: string;
}

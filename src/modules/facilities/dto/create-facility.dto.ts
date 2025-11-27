import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateFacilityDto {
  @IsString()
  centerName: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  lga?: string;
}

import { IsString, IsOptional, IsEmail, IsIn } from 'class-validator';

export class UpdateFacilityDto {
  @IsOptional()
  @IsString()
  centerName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  lga?: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}

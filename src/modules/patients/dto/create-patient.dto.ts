import { IsString, IsIn, IsOptional, IsNumber, IsInt, Min, Max } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @IsIn(['Male', 'Female', 'male', 'female'])
  gender: string;

  @IsNumber()
  phcCenterId: number;

  @IsString()
  address: string;

  @IsNumber()
  screeningTypeId: number;

  @IsOptional()
  @IsString()
  nextOfKin?: string;

  @IsOptional()
  @IsString()
  nextOfKinPhone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  altPhone?: string;

  @IsOptional()
  @IsString()
  lga?: string;
}

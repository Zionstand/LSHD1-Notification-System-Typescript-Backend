import { IsNumber, IsString, IsDateString, IsOptional, IsBoolean, IsIn, Min, Max } from 'class-validator';

export class CreateFollowupDto {
  @IsNumber()
  clientId: number;

  @IsOptional()
  @IsNumber()
  screeningId?: number;

  @IsDateString()
  followupDate: string;

  @IsOptional()
  @IsString()
  followupTime?: string;

  @IsString()
  followupType: string;

  @IsOptional()
  @IsString()
  followupInstructions?: string;

  @IsOptional()
  @IsBoolean()
  sendSmsReminder?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  reminderDaysBefore?: number;
}

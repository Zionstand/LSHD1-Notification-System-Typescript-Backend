import { IsNumber, IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class CreateHypertensionScreeningDto {
  @IsNumber()
  screeningId: number;

  // BP Reading 1 (required)
  @IsNumber()
  systolicBp1: number;

  @IsNumber()
  diastolicBp1: number;

  @IsIn(['sitting', 'standing', 'lying'])
  position1: 'sitting' | 'standing' | 'lying';

  @IsIn(['left', 'right'])
  armUsed1: 'left' | 'right';

  // BP Reading 2 (optional)
  @IsOptional()
  @IsNumber()
  systolicBp2?: number;

  @IsOptional()
  @IsNumber()
  diastolicBp2?: number;

  @IsOptional()
  @IsIn(['sitting', 'standing', 'lying'])
  position2?: 'sitting' | 'standing' | 'lying';

  @IsOptional()
  @IsIn(['left', 'right'])
  armUsed2?: 'left' | 'right';

  // BP Reading 3 (optional)
  @IsOptional()
  @IsNumber()
  systolicBp3?: number;

  @IsOptional()
  @IsNumber()
  diastolicBp3?: number;

  @IsOptional()
  @IsIn(['sitting', 'standing', 'lying'])
  position3?: 'sitting' | 'standing' | 'lying';

  @IsOptional()
  @IsIn(['left', 'right'])
  armUsed3?: 'left' | 'right';

  // Result classification
  @IsIn(['normal', 'elevated', 'high_stage1', 'high_stage2', 'crisis'])
  screeningResult: 'normal' | 'elevated' | 'high_stage1' | 'high_stage2' | 'crisis';

  // Observations
  @IsOptional()
  @IsString()
  clinicalObservations?: string;

  @IsOptional()
  @IsString()
  recommendations?: string;

  @IsOptional()
  @IsBoolean()
  referToDoctor?: boolean;

  @IsOptional()
  @IsString()
  referralReason?: string;

  // Personnel tracking - who performed the screening (CHO or nurse)
  @IsOptional()
  @IsNumber()
  conductedById?: number;
}

export class UpdateHypertensionScreeningDto {
  @IsOptional()
  @IsIn(['normal', 'elevated', 'high_stage1', 'high_stage2', 'crisis'])
  screeningResult?: 'normal' | 'elevated' | 'high_stage1' | 'high_stage2' | 'crisis';

  @IsOptional()
  @IsNumber()
  systolicBp1?: number;

  @IsOptional()
  @IsNumber()
  diastolicBp1?: number;

  @IsOptional()
  @IsIn(['sitting', 'standing', 'lying'])
  position1?: 'sitting' | 'standing' | 'lying';

  @IsOptional()
  @IsIn(['left', 'right'])
  armUsed1?: 'left' | 'right';

  @IsOptional()
  @IsNumber()
  systolicBp2?: number;

  @IsOptional()
  @IsNumber()
  diastolicBp2?: number;

  @IsOptional()
  @IsIn(['sitting', 'standing', 'lying'])
  position2?: 'sitting' | 'standing' | 'lying';

  @IsOptional()
  @IsIn(['left', 'right'])
  armUsed2?: 'left' | 'right';

  @IsOptional()
  @IsNumber()
  systolicBp3?: number;

  @IsOptional()
  @IsNumber()
  diastolicBp3?: number;

  @IsOptional()
  @IsIn(['sitting', 'standing', 'lying'])
  position3?: 'sitting' | 'standing' | 'lying';

  @IsOptional()
  @IsIn(['left', 'right'])
  armUsed3?: 'left' | 'right';

  @IsOptional()
  @IsString()
  clinicalObservations?: string;

  @IsOptional()
  @IsString()
  recommendations?: string;

  @IsOptional()
  @IsBoolean()
  referToDoctor?: boolean;

  @IsOptional()
  @IsString()
  referralReason?: string;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Screening } from './screening.entity';
import { User } from '../../users/entities/user.entity';

export type HypertensionResult = 'normal' | 'elevated' | 'high_stage1' | 'high_stage2' | 'crisis';
export type BpPosition = 'sitting' | 'standing' | 'lying';
export type ArmUsed = 'left' | 'right';

@Entity('hypertension_screenings')
export class HypertensionScreening {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'screening_id' })
  screeningId: number;

  @ManyToOne(() => Screening)
  @JoinColumn({ name: 'screening_id' })
  screening: Screening;

  // BP Reading 1
  @Column({ name: 'systolic_bp_1', type: 'int' })
  systolicBp1: number;

  @Column({ name: 'diastolic_bp_1', type: 'int' })
  diastolicBp1: number;

  @Column({ name: 'position_1', type: 'varchar', length: 20 })
  position1: BpPosition;

  @Column({ name: 'arm_used_1', type: 'varchar', length: 10 })
  armUsed1: ArmUsed;

  // BP Reading 2 (optional)
  @Column({ name: 'systolic_bp_2', type: 'int', nullable: true })
  systolicBp2: number | null;

  @Column({ name: 'diastolic_bp_2', type: 'int', nullable: true })
  diastolicBp2: number | null;

  @Column({ name: 'position_2', type: 'varchar', length: 20, nullable: true })
  position2: BpPosition | null;

  @Column({ name: 'arm_used_2', type: 'varchar', length: 10, nullable: true })
  armUsed2: ArmUsed | null;

  // BP Reading 3 (optional)
  @Column({ name: 'systolic_bp_3', type: 'int', nullable: true })
  systolicBp3: number | null;

  @Column({ name: 'diastolic_bp_3', type: 'int', nullable: true })
  diastolicBp3: number | null;

  @Column({ name: 'position_3', type: 'varchar', length: 20, nullable: true })
  position3: BpPosition | null;

  @Column({ name: 'arm_used_3', type: 'varchar', length: 10, nullable: true })
  armUsed3: ArmUsed | null;

  // Result and observations
  @Column({ name: 'screening_result', type: 'varchar', length: 20 })
  screeningResult: HypertensionResult;

  @Column({ name: 'clinical_observations', type: 'text', nullable: true })
  clinicalObservations: string | null;

  @Column({ type: 'text', nullable: true })
  recommendations: string | null;

  @Column({ name: 'refer_to_doctor', type: 'tinyint', default: 0 })
  referToDoctor: boolean;

  @Column({ name: 'referral_reason', type: 'text', nullable: true })
  referralReason: string | null;

  // Personnel tracking
  @Column({ name: 'conducted_by' })
  conductedBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'conducted_by' })
  conductedByUser: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

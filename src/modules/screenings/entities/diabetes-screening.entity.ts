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

export type DiabetesTestType = 'random' | 'fasting';
export type DiabetesResult = 'normal' | 'prediabetes' | 'diabetes';

@Entity('diabetes_screenings')
export class DiabetesScreening {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'screening_id' })
  screeningId: number;

  @ManyToOne(() => Screening)
  @JoinColumn({ name: 'screening_id' })
  screening: Screening;

  // Test details
  @Column({ name: 'test_type', type: 'varchar', length: 20 })
  testType: DiabetesTestType;

  @Column({ name: 'blood_sugar_level', type: 'decimal', precision: 5, scale: 2 })
  bloodSugarLevel: number;

  @Column({ name: 'unit', type: 'varchar', length: 10, default: 'mg/dL' })
  unit: string;

  @Column({ name: 'fasting_duration_hours', type: 'int', nullable: true })
  fastingDurationHours: number | null;

  @Column({ name: 'test_time', type: 'time' })
  testTime: string;

  // Result
  @Column({ name: 'screening_result', type: 'varchar', length: 20 })
  screeningResult: DiabetesResult;

  @Column({ name: 'clinical_observations', type: 'text', nullable: true })
  clinicalObservations: string | null;

  // Referral
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

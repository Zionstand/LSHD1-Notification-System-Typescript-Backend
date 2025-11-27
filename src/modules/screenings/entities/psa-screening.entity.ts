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

export type PsaResult = 'normal' | 'borderline' | 'elevated';

@Entity('psa_screenings')
export class PsaScreening {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'screening_id' })
  screeningId: number;

  @ManyToOne(() => Screening)
  @JoinColumn({ name: 'screening_id' })
  screening: Screening;

  // PSA Test details
  @Column({ name: 'psa_level', type: 'decimal', precision: 6, scale: 3 })
  psaLevel: number;

  @Column({ name: 'unit', type: 'varchar', length: 10, default: 'ng/mL' })
  unit: string;

  @Column({ name: 'test_method', type: 'varchar', length: 100, nullable: true })
  testMethod: string | null;

  @Column({ name: 'test_kit', type: 'varchar', length: 100, nullable: true })
  testKit: string | null;

  @Column({ name: 'collection_time', type: 'time' })
  collectionTime: string;

  // Sample quality
  @Column({ name: 'sample_quality', type: 'varchar', length: 50, default: 'adequate' })
  sampleQuality: string;

  @Column({ name: 'sample_quality_notes', type: 'text', nullable: true })
  sampleQualityNotes: string | null;

  // Reference range (age-specific)
  @Column({ name: 'patient_age', type: 'int' })
  patientAge: number;

  @Column({ name: 'normal_range_min', type: 'decimal', precision: 5, scale: 2, default: 0 })
  normalRangeMin: number;

  @Column({ name: 'normal_range_max', type: 'decimal', precision: 5, scale: 2 })
  normalRangeMax: number;

  // Result
  @Column({ name: 'screening_result', type: 'varchar', length: 20 })
  screeningResult: PsaResult;

  @Column({ name: 'result_interpretation', type: 'text', nullable: true })
  resultInterpretation: string | null;

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

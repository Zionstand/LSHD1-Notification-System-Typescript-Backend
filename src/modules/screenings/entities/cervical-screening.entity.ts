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

export type CervicalScreeningMethod = 'via' | 'vili' | 'pap_smear' | 'hpv_test' | 'other';
export type CervicalResult = 'negative' | 'positive' | 'suspicious' | 'inconclusive';

@Entity('cervical_screenings')
export class CervicalScreening {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'screening_id' })
  screeningId: number;

  @ManyToOne(() => Screening)
  @JoinColumn({ name: 'screening_id' })
  screening: Screening;

  // Screening status
  @Column({ name: 'screening_performed', type: 'tinyint', default: 1 })
  screeningPerformed: boolean;

  @Column({ name: 'screening_method', type: 'varchar', length: 50 })
  screeningMethod: CervicalScreeningMethod;

  @Column({ name: 'other_method_details', type: 'varchar', length: 100, nullable: true })
  otherMethodDetails: string | null;

  // Findings
  @Column({ name: 'visual_inspection_findings', type: 'text', nullable: true })
  visualInspectionFindings: string | null;

  @Column({ name: 'specimen_collected', type: 'tinyint', default: 0 })
  specimenCollected: boolean;

  @Column({ name: 'specimen_type', type: 'varchar', length: 50, nullable: true })
  specimenType: string | null;

  // Result
  @Column({ name: 'screening_result', type: 'varchar', length: 20 })
  screeningResult: CervicalResult;

  @Column({ name: 'clinical_observations', type: 'text', nullable: true })
  clinicalObservations: string | null;

  @Column({ type: 'text', nullable: true })
  remarks: string | null;

  // Follow-up
  @Column({ name: 'follow_up_required', type: 'tinyint', default: 0 })
  followUpRequired: boolean;

  @Column({ name: 'follow_up_date', type: 'date', nullable: true })
  followUpDate: Date | null;

  @Column({ name: 'follow_up_notes', type: 'text', nullable: true })
  followUpNotes: string | null;

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

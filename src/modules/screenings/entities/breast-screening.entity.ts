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

export type BreastRiskLevel = 'low' | 'moderate' | 'high';
export type LymphNodeStatus = 'normal' | 'enlarged';
export type Laterality = 'left' | 'right' | 'bilateral' | 'none';

@Entity('breast_screenings')
export class BreastScreening {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'screening_id' })
  screeningId: number;

  @ManyToOne(() => Screening)
  @JoinColumn({ name: 'screening_id' })
  screening: Screening;

  // Lump assessment
  @Column({ name: 'lump_present', type: 'tinyint', default: 0 })
  lumpPresent: boolean;

  @Column({ name: 'lump_location', type: 'varchar', length: 100, nullable: true })
  lumpLocation: string | null;

  @Column({ name: 'lump_size', type: 'varchar', length: 50, nullable: true })
  lumpSize: string | null;

  @Column({ name: 'lump_characteristics', type: 'text', nullable: true })
  lumpCharacteristics: string | null;

  // Breast discharge
  @Column({ name: 'discharge_present', type: 'tinyint', default: 0 })
  dischargePresent: boolean;

  @Column({ name: 'discharge_type', type: 'varchar', length: 50, nullable: true })
  dischargeType: string | null;

  @Column({ name: 'discharge_location', type: 'varchar', length: 20, nullable: true })
  dischargeLocation: Laterality | null;

  // Nipple inversion
  @Column({ name: 'nipple_inversion', type: 'tinyint', default: 0 })
  nippleInversion: boolean;

  @Column({ name: 'nipple_inversion_laterality', type: 'varchar', length: 20, nullable: true })
  nippleInversionLaterality: Laterality | null;

  // Lymph nodes
  @Column({ name: 'lymph_node_status', type: 'varchar', length: 20, default: 'normal' })
  lymphNodeStatus: LymphNodeStatus;

  @Column({ name: 'lymph_node_location', type: 'varchar', length: 100, nullable: true })
  lymphNodeLocation: string | null;

  // Other findings
  @Column({ name: 'skin_changes', type: 'text', nullable: true })
  skinChanges: string | null;

  @Column({ name: 'breast_symmetry', type: 'varchar', length: 100, nullable: true })
  breastSymmetry: string | null;

  // Summary
  @Column({ name: 'summary_findings', type: 'text' })
  summaryFindings: string;

  @Column({ name: 'risk_assessment', type: 'varchar', length: 20 })
  riskAssessment: BreastRiskLevel;

  @Column({ type: 'text', nullable: true })
  recommendations: string | null;

  // Referral
  @Column({ name: 'referral_required', type: 'tinyint', default: 0 })
  referralRequired: boolean;

  @Column({ name: 'referral_facility', type: 'varchar', length: 200, nullable: true })
  referralFacility: string | null;

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

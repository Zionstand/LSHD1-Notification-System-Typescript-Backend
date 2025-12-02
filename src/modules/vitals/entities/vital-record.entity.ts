import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';
import { Screening } from '../../screenings/entities/screening.entity';

@Entity('vital_records')
export class VitalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'screening_id', nullable: true })
  screeningId: number | null;

  // Vital signs
  @Column({ name: 'blood_pressure_systolic', type: 'int', nullable: true })
  bloodPressureSystolic: number | null;

  @Column({ name: 'blood_pressure_diastolic', type: 'int', nullable: true })
  bloodPressureDiastolic: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  temperature: number | null;

  @Column({ name: 'pulse_rate', type: 'int', nullable: true })
  pulseRate: number | null;

  @Column({ name: 'respiratory_rate', type: 'int', nullable: true })
  respiratoryRate: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  bmi: number | null;

  // Blood sugar
  @Column({ name: 'blood_sugar_random', type: 'decimal', precision: 5, scale: 2, nullable: true })
  bloodSugarRandom: number | null;

  @Column({ name: 'blood_sugar_fasting', type: 'decimal', precision: 5, scale: 2, nullable: true })
  bloodSugarFasting: number | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'recorded_by' })
  recordedBy: number;

  @Column({ name: 'recorded_at', type: 'datetime' })
  recordedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Screening, { nullable: true })
  @JoinColumn({ name: 'screening_id' })
  screening: Screening;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recorded_by' })
  recordedByUser: User;
}

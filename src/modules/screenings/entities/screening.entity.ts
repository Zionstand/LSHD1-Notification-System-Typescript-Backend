import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';

export type ScreeningStatus = 'completed' | 'pending' | 'follow_up';

@Entity('screenings')
export class Screening {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'screening_date', type: 'date' })
  screeningDate: Date;

  @Column({ name: 'screening_time', type: 'time' })
  screeningTime: string;

  @Column({ name: 'conducted_by' })
  conductedBy: number;

  @Column({ name: 'screening_type', length: 100 })
  screeningType: string;

  // Vital signs
  @Column({ name: 'blood_pressure_systolic', type: 'int', nullable: true })
  bloodPressureSystolic: number;

  @Column({ name: 'blood_pressure_diastolic', type: 'int', nullable: true })
  bloodPressureDiastolic: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  temperature: number;

  @Column({ name: 'pulse_rate', type: 'int', nullable: true })
  pulseRate: number;

  @Column({ name: 'respiratory_rate', type: 'int', nullable: true })
  respiratoryRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  bmi: number;

  // Blood sugar
  @Column({ name: 'blood_sugar_random', type: 'decimal', precision: 5, scale: 2, nullable: true })
  bloodSugarRandom: number;

  @Column({ name: 'blood_sugar_fasting', type: 'decimal', precision: 5, scale: 2, nullable: true })
  bloodSugarFasting: number;

  @Column({ name: 'cholesterol_level', type: 'decimal', precision: 5, scale: 2, nullable: true })
  cholesterolLevel: number;

  // Results
  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  prescription: string;

  @Column({ type: 'text', nullable: true })
  recommendations: string;

  @Column({ name: 'next_appointment', type: 'date', nullable: true })
  nextAppointment: Date;

  @Column({ name: 'patient_status', length: 50, nullable: true })
  patientStatus: string;

  @Column({ name: 'referral_facility', length: 255, nullable: true })
  referralFacility: string;

  @Column({ name: 'doctor_id', nullable: true })
  doctorId: number;

  @Column({ name: 'doctor_assessed_at', type: 'datetime', nullable: true })
  doctorAssessedAt: Date;

  @Column({
    type: 'enum',
    enum: ['completed', 'pending', 'follow_up'],
    default: 'completed',
    nullable: true,
  })
  status: ScreeningStatus;

  @Column({ name: 'sms_sent', type: 'tinyint', default: 0, nullable: true })
  smsSent: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'conducted_by' })
  conductedByUser: User;
}

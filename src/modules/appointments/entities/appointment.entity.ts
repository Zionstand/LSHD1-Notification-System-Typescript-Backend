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
import { PhcCenter } from '../../facilities/entities/phc-center.entity';
import { User } from '../../users/entities/user.entity';
import { Screening } from '../../screenings/entities/screening.entity';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'phc_center_id' })
  phcCenterId: number;

  @Column({ name: 'screening_id', nullable: true })
  screeningId: number | null;

  @Column({ name: 'appointment_date', type: 'date' })
  appointmentDate: Date;

  @Column({ name: 'appointment_time', type: 'time' })
  appointmentTime: string;

  @Column({ name: 'appointment_type', length: 100 })
  appointmentType: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ name: 'is_followup', type: 'tinyint', default: 0 })
  isFollowup: number;

  @Column({ name: 'followup_instructions', type: 'text', nullable: true })
  followupInstructions: string | null;

  @Column({
    type: 'enum',
    enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled',
    nullable: true,
  })
  status: AppointmentStatus;

  @Column({ name: 'reminder_sent', type: 'tinyint', default: 0, nullable: true })
  reminderSent: number;

  @Column({ name: 'send_sms_reminder', type: 'tinyint', default: 1 })
  sendSmsReminder: number;

  @Column({ name: 'reminder_days_before', type: 'int', default: 1 })
  reminderDaysBefore: number;

  @Column({ name: 'reminder_scheduled_date', type: 'date', nullable: true })
  reminderScheduledDate: Date | null;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => PhcCenter)
  @JoinColumn({ name: 'phc_center_id' })
  phcCenter: PhcCenter;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @ManyToOne(() => Screening)
  @JoinColumn({ name: 'screening_id' })
  screening: Screening;
}

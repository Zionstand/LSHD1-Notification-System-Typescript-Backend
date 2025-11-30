import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';

export type SmsType =
  | 'SCREENING_RESULT'
  | 'APPOINTMENT_REMINDER'
  | 'FOLLOW_UP_REMINDER'
  | 'APPOINTMENT_CONFIRMATION'
  | 'GENERAL';

export type SmsStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';

@Entity('sms_logs')
export class SmsLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id', type: 'int', nullable: true })
  patientId: number | null;

  @Column({ name: 'phone_number', type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'sms_type', type: 'varchar', length: 50 })
  smsType: SmsType;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: SmsStatus;

  @Column({ name: 'sendchamp_reference', type: 'varchar', length: 100, nullable: true })
  sendchampReference: string | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'sent_by', type: 'int', nullable: true })
  sentBy: number | null;

  @Column({ name: 'facility_id', type: 'int', nullable: true })
  facilityId: number | null;

  @Column({ name: 'related_entity', type: 'varchar', length: 50, nullable: true })
  relatedEntity: string | null;

  @Column({ name: 'related_entity_id', type: 'int', nullable: true })
  relatedEntityId: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'sent_at', type: 'datetime', nullable: true })
  sentAt: Date | null;

  @ManyToOne(() => Patient, { nullable: true })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'sent_by' })
  sentByUser: User;
}

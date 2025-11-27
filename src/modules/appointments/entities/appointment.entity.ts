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

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'phc_center_id' })
  phcCenterId: number;

  @Column({ name: 'appointment_date', type: 'date' })
  appointmentDate: Date;

  @Column({ name: 'appointment_time', type: 'time' })
  appointmentTime: string;

  @Column({ name: 'appointment_type', length: 100 })
  appointmentType: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({
    type: 'enum',
    enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled',
    nullable: true,
  })
  status: AppointmentStatus;

  @Column({ name: 'reminder_sent', type: 'tinyint', default: 0, nullable: true })
  reminderSent: number;

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
}

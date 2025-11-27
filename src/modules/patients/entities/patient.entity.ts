import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PhcCenter } from '../../facilities/entities/phc-center.entity';
import { User } from '../../users/entities/user.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'phc_center_id' })
  phcCenterId: number;

  @Column({ name: 'patient_number', length: 50 })
  patientNumber: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ name: 'alt_phone', length: 20, nullable: true })
  altPhone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 100, nullable: true })
  lga: string;

  @Column({ name: 'blood_group', length: 5, nullable: true })
  bloodGroup: string;

  @Column({ length: 5, nullable: true })
  genotype: string;

  @Column({ name: 'emergency_contact', length: 150, nullable: true })
  emergencyContact: string;

  @Column({ name: 'emergency_phone', length: 20, nullable: true })
  emergencyPhone: string;

  @Column({ name: 'registered_by' })
  registeredBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => PhcCenter)
  @JoinColumn({ name: 'phc_center_id' })
  phcCenter: PhcCenter;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'registered_by' })
  registeredByUser: User;
}

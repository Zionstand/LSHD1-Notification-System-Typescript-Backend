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

  // New field - nullable until migration is run
  @Column({ name: 'full_name', length: 200, nullable: true })
  fullName: string;

  // Keep for backwards compatibility
  @Column({ name: 'first_name', length: 100, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName: string;

  // New field - nullable until migration is run
  @Column({ type: 'int', nullable: true })
  age: number;

  // Keep for backwards compatibility, nullable
  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
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

  // New field - nullable until migration is run
  @Column({ name: 'next_of_kin', length: 150, nullable: true })
  nextOfKin: string;

  // New field - nullable until migration is run
  @Column({ name: 'next_of_kin_phone', length: 20, nullable: true })
  nextOfKinPhone: string;

  // Keep old columns for backwards compatibility
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

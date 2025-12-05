import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PhcCenter } from '../../facilities/entities/phc-center.entity';

export type VolunteerStatus = 'active' | 'inactive' | 'pending';
export type VolunteerGender = 'male' | 'female';

@Entity('volunteers')
export class Volunteer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'volunteer_code', type: 'varchar', length: 50, unique: true })
  volunteerCode: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ name: 'alt_phone', type: 'varchar', length: 20, nullable: true })
  altPhone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 10 })
  gender: VolunteerGender;

  @Column({ type: 'int', nullable: true })
  age: number | null;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lga: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ward: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  community: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  occupation: string | null;

  @Column({ name: 'education_level', type: 'varchar', length: 100, nullable: true })
  educationLevel: string | null;

  @Column({ name: 'next_of_kin', type: 'varchar', length: 255, nullable: true })
  nextOfKin: string | null;

  @Column({ name: 'next_of_kin_phone', type: 'varchar', length: 20, nullable: true })
  nextOfKinPhone: string | null;

  @Column({ type: 'text', nullable: true })
  skills: string | null;

  @Column({ name: 'training_completed', type: 'tinyint', default: 0 })
  trainingCompleted: number;

  @Column({ name: 'training_date', type: 'date', nullable: true })
  trainingDate: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: VolunteerStatus;

  @Column({ name: 'phc_center_id', type: 'int', nullable: true })
  phcCenterId: number | null;

  @Column({ name: 'registered_by', type: 'int' })
  registeredBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => PhcCenter, { nullable: true })
  @JoinColumn({ name: 'phc_center_id' })
  phcCenter: PhcCenter;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'registered_by' })
  registeredByUser: User;
}

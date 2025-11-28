import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { PhcCenter } from '../../facilities/entities/phc-center.entity';

export type UserRole = 'admin' | 'him_officer' | 'nurse' | 'doctor' | 'mls' | 'cho';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'phc_center_id', nullable: true })
  phcCenterId: number;

  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'him_officer', 'nurse', 'doctor', 'mls', 'cho'],
  })
  role: UserRole;

  @Column({ name: 'staff_id', length: 50, nullable: true, unique: true })
  staffId: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
  })
  status: UserStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'approved_at', nullable: true })
  approvedAt: Date;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: number;

  @ManyToOne(() => PhcCenter, { nullable: true })
  @JoinColumn({ name: 'phc_center_id' })
  phcCenter: PhcCenter;

  // Helper to get first name
  get firstName(): string {
    const parts = this.fullName?.split(' ') || [''];
    return parts[0] || '';
  }

  // Helper to get last name
  get lastName(): string {
    const parts = this.fullName?.split(' ') || ['', ''];
    return parts.slice(1).join(' ') || '';
  }
}

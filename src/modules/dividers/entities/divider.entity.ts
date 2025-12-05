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

export type DividerStatus = 'active' | 'inactive';

@Entity('dividers')
export class Divider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'divider_code', type: 'varchar', length: 50, unique: true })
  dividerCode: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lga: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ward: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  community: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: DividerStatus;

  @Column({ name: 'phc_center_id', type: 'int', nullable: true })
  phcCenterId: number | null;

  @Column({ name: 'captured_by', type: 'int' })
  capturedBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => PhcCenter, { nullable: true })
  @JoinColumn({ name: 'phc_center_id' })
  phcCenter: PhcCenter;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'captured_by' })
  capturedByUser: User;
}

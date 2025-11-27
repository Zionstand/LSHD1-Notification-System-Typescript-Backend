import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export type PhcCenterStatus = 'active' | 'inactive';

@Entity('phc_centers')
export class PhcCenter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'center_name', length: 200 })
  centerName: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 100, nullable: true })
  lga: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: PhcCenterStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

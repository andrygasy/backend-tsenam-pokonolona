import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';

export type ServiceStatus = 'active' | 'inactive' | 'pending';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ fulltext: true })
  name: string;

  @Column('text')
  @Index({ fulltext: true })
  description: string;

  @Column('float')
  price: number;

  @Column({ type: 'uuid', nullable: true })
  categoryId?: string | null;

  @Column({ type: 'int', nullable: true })
  userId?: number | null;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  category?: Category | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  user?: User | null;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'pending'], default: 'pending' })
  status: ServiceStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

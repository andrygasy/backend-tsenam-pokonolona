import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';

export type ProductStatus = 'active' | 'inactive' | 'pending';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
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

  @Column('text', { array: true, default: '{}' })
  images: string[];

  @Column('int')
  stock: number;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'pending'], default: 'pending' })
  status: ProductStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column('jsonb')
  items: OrderItem[];

  @Column('float')
  total: number;

  @Column({ nullable: true })
  trackingNumber?: string;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'shipped', 'delivered'], default: 'pending' })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

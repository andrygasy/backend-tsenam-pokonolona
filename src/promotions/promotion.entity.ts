import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export interface PromotionConditions {
  minAmount?: number;
  categories?: string[];
  maxUsage?: number;
}

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: DiscountType })
  discountType: DiscountType;

  @Column('float')
  discountValue: number;

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp')
  endDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  conditions?: PromotionConditions;

  @Column({ default: true })
  isActive: boolean;

  @Column('int', { default: 0 })
  usageCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

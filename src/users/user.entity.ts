import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type UserRole = 'user' | 'professional' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: UserRole;

  @Column({ default: 'active' })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date | null;

  @Column({ default: 0 })
  orderCount: number;

  @Column({ type: 'float', default: 0 })
  totalSpent: number;

  @Column({ default: false })
  isProfessional: boolean;

  @Column({ nullable: true })
  professionalType: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;
}

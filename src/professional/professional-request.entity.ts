import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type ProfessionalRequestStatus = 'pending' | 'approved' | 'rejected';

@Entity()
export class ProfessionalRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  companyName: string;

  @Column()
  accountType: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: ProfessionalRequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

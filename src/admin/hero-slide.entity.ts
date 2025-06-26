import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class HeroSlide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  buttonText?: string;

  @Column({ nullable: true })
  buttonLink?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('int')
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

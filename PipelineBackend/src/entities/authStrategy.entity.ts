import { AuthStrategy } from '@/interfaces/authStrategy.inteface';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AuthStrategyEntity extends BaseEntity implements AuthStrategy {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  profileId: string;

  @Column()
  type: string;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}

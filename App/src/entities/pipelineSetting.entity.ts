import { PipelineEntity } from './pipeline.entity';
import { PipelineSetting } from '../interfaces/pipeline.interface';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class PipelineSettingEntity extends BaseEntity implements PipelineSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  branch: string;

  @Column()
  pipeline_id: number;

  @Column({
    type: 'longtext',
  })
  service_config: string;

  @Column({
    type: 'longtext',
  })
  config_to_use: string;

  @ManyToOne(() => PipelineEntity, pipeline => pipeline.settings)
  pipeline: PipelineEntity;

  @Column()
  pipelineUuid: string;

  @Column({
    nullable: true,
  })
  pipelineId: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}

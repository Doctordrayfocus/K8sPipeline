import { PipelineBuild } from './../interfaces/pipeline.interface';
import { PipelineEntity } from './pipeline.entity';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class PipelineBuildEntity extends BaseEntity implements PipelineBuild {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column()
  status: string;

  @Column()
  branch: string;

  @Column({
    type: 'longtext',
  })
  content: string;

  @Column()
  commit_id: string;

  @Column()
  started_at: Date;

  @Column()
  ended_at: Date;

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

import { PipelineSettingEntity } from './pipelineSetting.entity';
import { Pipeline } from '../interfaces/pipeline.interface';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PipelineBuildEntity } from './pipelineBuild.entity';

@Entity()
export class PipelineEntity extends BaseEntity implements Pipeline {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  repo_url: string;

  @Column()
  repo_id: string;

  @Column()
  lang: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column()
  full_name: string;

  @OneToMany(() => PipelineSettingEntity, piplineSetting => piplineSetting.pipeline)
  settings: PipelineSettingEntity[];

  @OneToMany(() => PipelineBuildEntity, piplineBuild => piplineBuild.pipeline)
  builds: PipelineBuildEntity[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  lang_config_folders: string;
}

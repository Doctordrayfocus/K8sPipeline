import PipelineRepository from '@/repositories/pipeline.repository';
import { CreatePipelineDto } from '@/dtos/pipeline.dto';
import { Schema } from 'bitbucket';
import { PipelineEntity } from '@/entities/pipeline.entity';
import { PipelineBuildEntity } from '@/entities/pipelineBuild.entity';

export class pipelineResolver extends PipelineRepository {
  async workspaces(): Promise<Schema.Workspace[]> {
    const paginatedWorkpaces = await this.getWorkspaces();
    return paginatedWorkpaces.data.values;
  }

  async repositories(workspaceId: string): Promise<Schema.Repository[]> {
    const paginatedRepositories = await this.getRespository(workspaceId);
    const repositories = paginatedRepositories.data.values;
    return repositories;
  }

  async pipelines(): Promise<PipelineEntity[]> {
    const pipelines = await this.getPipelines();
    return pipelines;
  }

  async createPipelineTemplate(createPipelineData: CreatePipelineDto): Promise<PipelineEntity> {
    const pipeline = await this.createServicePipeline(createPipelineData);
    return pipeline;
  }

  async getPipelineData(pipelineUuid: string): Promise<PipelineEntity> {
    const pipeline = await this.getPipeline(pipelineUuid);
    return pipeline;
  }

  async getBuildData(buildUuid: string): Promise<PipelineBuildEntity> {
    const pipelineBuild = await this.getPipelineBuild(buildUuid);
    return pipelineBuild;
  }

  async updateSetting(settingsUpdateData: { settingUuid: string; configToUse: string; serviceConfig: string }): Promise<boolean> {
    const response = await this.updatePipelineSetting(
      settingsUpdateData.settingUuid,
      settingsUpdateData.configToUse,
      settingsUpdateData.serviceConfig,
    );

    return response;
  }
}

import { Pipeline as PipelineData, CreatePipelineDto, SettingsUpdateData, PipelineBuild } from './../gql/graphql';
import { Repository, Workspace } from '@/gql/graphql';
import Common from './Common';
import { $api } from '@/services';

export default class Pipeline extends Common {
  constructor() {
    super();
  }

  public Workspaces: Workspace[] | undefined = undefined;
  public Repositories: Repository[] | undefined = undefined;
  public EachPipeline: PipelineData | undefined = undefined;
  public Pipelines: PipelineData[] | undefined = undefined;
  public PipelineBuildData: PipelineBuild | undefined = undefined;
  public CreatePipelineForm: CreatePipelineDto = {
    lang: '',
    repo_name: '',
    repoDescription: '',
    repoId: '',
    workspaceId: '',
  };
  public UpdatePipelineSettingForm: SettingsUpdateData = {
    configToUse: '',
    serviceConfig: '',
    settingUuid: '',
  };

  public pipelineStatusLabel = (pipelineStatus: string) => {
    let status = 'Active';
    let color = 'gray';

    switch (pipelineStatus) {
      case 'inactive':
        status = 'Inactive';
        color = 'newgray';
        break;
      case 'started':
        status = 'Started';
        color = 'blue';
        break;
      case 'completed':
        status = 'Completed';
        color = 'green';
        break;
      case 'successful':
        status = 'Successful';
        color = 'green';
        break;
      case 'failed':
        status = 'Failed';
        color = 'red';
        break;
      case 'in_progress':
        status = 'In Progress';
        color = 'blue';
        break;
      default:
        break;
    }

    return {
      status,
      color,
    };
  };

  public GetWorkspaces = () => {
    return $api.pipeline.GetWorkspaces().then(response => {
      this.Workspaces = response.data?.workspaces;
    });
  };

  public GetPipelines = () => {
    return $api.pipeline.GetPipelines().then(response => {
      this.Pipelines = response.data?.pipelines;
    });
  };

  public GetRepositories = (workspaceId: string) => {
    return $api.pipeline.GetRepositories(workspaceId).then(response => {
      this.Repositories = response.data?.repositories;
    });
  };

  public CreateServicePipeline = (formIsValid: boolean) => {
    if (formIsValid) {
      return $api.pipeline
        .createServicePipeline(this.CreatePipelineForm)
        .then(response => [(this.EachPipeline = response.data?.createPipelineTemplate)]);
    }
  };

  public GetPipeline = (pipelineUuid: string) => {
    return $api.pipeline.GetPipeline(pipelineUuid).then(response => {
      this.EachPipeline = response.data?.getPipelineData;
    });
  };

  public GetPipelineBuild = (buildUuid: string) => {
    return $api.pipeline.GetBuildPipeline(buildUuid).then(response => {
      this.PipelineBuildData = response.data?.getBuildData;
    });
  };

  public UpdatePipelineSetting = (pipelineUuid: string) => {
    return $api.pipeline.updatePipelineSetting(this.UpdatePipelineSettingForm).then(() => {
      this.GetPipeline(pipelineUuid);
    });
  };
}

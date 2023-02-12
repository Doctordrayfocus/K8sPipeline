export interface Pipeline {
  id?: number;
  uuid?: string;
  repo_url: string;
  repo_id: string;
  lang?: string;
  description: string;
  status: string;
  full_name: string;
  lang_config_folders?: string;
}

export interface PipelineSetting {
  id?: number;
  uuid?: string;
  branch: string;
  pipeline_id: number;
  service_config: string;
  config_to_use: string;
  pipelineUuid: string;
  pipeline?: Pipeline;
  pipelineId?: number;
}

export interface Workspace {
  uuid: string;
  name: string;
}

export interface Repository {
  full_name: string;
  name: string;
  slug: string;
  description: string;
  uuid: string;
}

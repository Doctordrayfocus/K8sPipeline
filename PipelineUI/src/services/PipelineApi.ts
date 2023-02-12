import { CreatePipelineDto, Pipeline, SettingsUpdateData } from './../gql/graphql';
import { OperationResult } from "urql";
import { BaseApiService } from "./common/BaseService";
import { Repository, Workspace } from "@/gql/graphql";

export default class PipelineApi extends BaseApiService {
   
   public GetWorkspaces = () => {
        const requestData = `
        query GetWorkspaces {
            workspaces {
              name
              slug
              uuid
            }
          }
        `;
    
    const response: Promise<
      OperationResult<{
        workspaces: Workspace[];
      }>
    > = this.query(requestData,{}); 
    return response;
    }


    public GetRepositories =  (workspaceId: string) => {
        const requestData = `
        query GetRepositories($workspaceId: String!) {
            repositories(workspaceId: $workspaceId) {
              full_name
              name
              slug
              uuid
            }
          }
        `;
    
    const response: Promise<
      OperationResult<{
        repositories: Repository[];
      }>
    > = this.query(requestData,{
        workspaceId
    }); 
    return response;
    }

    public GetPipelines =  () => {
      const requestData = `
      query Pipelines {
        pipelines {
          createdAt
          full_name
          id
          uuid
          status
          updatedAt
          lang
          repo_id
          settings {
            branch
            uuid
          }
        }
      }
      `;
  
  const response: Promise<
    OperationResult<{
      pipelines: Pipeline[];
    }>
  > = this.query(requestData,{
      
  }); 
  return response;
  }

  public GetPipeline =  (pipelineUuid: string) => {
    const requestData = `
    query Pipelines($pipelineUuid: String!) {
      getPipelineData(pipelineUuid: $pipelineUuid) {
        createdAt
        full_name
        id
        lang
        repo_id
        status
        uuid
        updatedAt
        lang_config_folders
        settings {
          branch
          config_to_use
          uuid
          service_config
        }
      }
    }
    `;

const response: Promise<
  OperationResult<{
    getPipelineData: Pipeline;
  }>
> = this.query(requestData,{
  pipelineUuid
}); 
return response;
}

    public createServicePipeline = (createPipelineData: CreatePipelineDto) => {
        const requestData = `
        mutation CreatePipelineTemplate($createPipelineData: CreatePipelineDto!) {
            createPipelineTemplate(createPipelineData: $createPipelineData) {
              createdAt
              full_name
              uuid
              status
              updatedAt
              repo_id
              lang 
            }
          }
        `;
    
    const response: Promise<
      OperationResult<{
        createPipelineTemplate: Pipeline;
      }>
    > = this.mutation(requestData,{
        createPipelineData
    }); 
    return response;
    }



  public updatePipelineSetting = (settingsUpdateData: SettingsUpdateData) => {
      const requestData = `
      mutation UpdateSetting($settingsUpdateData: settingsUpdateData) {
        updateSetting(settingsUpdateData: $settingsUpdateData)
      }
      `;
  
  const response: Promise<
    OperationResult<{
      updateSetting: boolean;
    }>
  > = this.mutation(requestData,{
    settingsUpdateData
  }); 
  return response;
  }
    
} 
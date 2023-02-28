import { IsString } from 'class-validator';

export class CreatePipelineDto {
  @IsString()
  workspaceId: string;

  @IsString()
  repoId: string;

  @IsString()
  repoDescription: string;

  @IsString()
  repo_name: string;

  @IsString()
  repo_url: string;

  @IsString()
  lang: string;
}

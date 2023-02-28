import { PipelineBuildEntity } from './../entities/pipelineBuild.entity';
import { CreatePipelineDto } from './../dtos/pipeline.dto';
import { AuthStrategyEntity } from '@/entities/authStrategy.entity';
import { PipelineEntity } from '@/entities/pipeline.entity';
import { PipelineSettingEntity } from '@/entities/pipelineSetting.entity';
import VariableExtractor from '@/helpers/VariableExtractor';
import { BuildUpdateData, CommitData, Pipeline, PipelineBuild, PipelineSetting } from '@/interfaces/pipeline.interface';
import { APIClient, Bitbucket } from 'bitbucket';
import path from 'path';
import { EntityRepository } from 'typeorm';
import shell from 'shelljs';
import AuthStrategyRepository from './authStrategy.repository';
import { APP_URL, DOCKER_REGISTRY } from '@/config';

@EntityRepository(PipelineEntity)
export default class PipelineRepository {
  private bitbucketClient: APIClient;

  private configureBitbucket = () => {
    return AuthStrategyEntity.findOne({
      where: {
        type: 'bitbucket',
      },
    }).then(async strategy => {
      let newToken = '';
      if (strategy) {
        const AuthStrategy = new AuthStrategyRepository();
        const newAccessToken: string = await AuthStrategy.requestNewAccessToken('bitbucket', strategy.refresh_token);
        newToken = newAccessToken;
        const clientOptions = {
          auth: {
            token: newAccessToken ? newAccessToken : strategy.access_token,
          },
        };
        this.bitbucketClient = new Bitbucket(clientOptions);
      }

      return newToken;
    });
  };

  private getAccessToken = async (strategy: string) => {
    if (strategy == 'bitbucket') {
      const newAccessToken = await this.configureBitbucket();
      return newAccessToken;
    }
  };

  private getLanguageRepo = (lang: string) => {
    let pipelineTemplateRepo = '';

    if (lang == 'php') {
      pipelineTemplateRepo = 'github.com/Doctordrayfocus/K8PipelinePHP';
    } else if (lang == 'nodejs') {
      pipelineTemplateRepo = 'github.com/Doctordrayfocus/K8PipelineNodeJs';
    }

    return pipelineTemplateRepo;
  };

  public getWorkspaces = () => {
    return this.configureBitbucket().then(() => {
      return this.bitbucketClient.workspaces.getWorkspaces({
        pagelen: 30,
      });
    });
  };

  public getRespository = (workspaceId: string) => {
    return this.configureBitbucket().then(() => {
      return this.bitbucketClient.repositories.list({
        workspace: workspaceId,
        pagelen: 100,
      });
    });
  };

  public getRepositoryBranches = (workspaceId: string, repoId: string) => {
    return this.configureBitbucket().then(() => {
      return this.bitbucketClient.repositories.listBranches({
        workspace: workspaceId,
        pagelen: 100,
        repo_slug: repoId,
      });
    });
  };

  public setRepositoryWebhook = (workspaceId: string, repo_slug: string) => {
    this.configureBitbucket().then(() => {
      return this.bitbucketClient.webhooks.create({
        repo_slug: repo_slug,
        workspace: workspaceId,
        _body: {
          name: 'K8sPipelineHook',
          url: `https://${APP_URL}/bitbucket-webhook`,
          active: true,
          events: ['repo:push'],
        },
      });
    });
  };

  public createPipeline = (pipelineData: Pipeline) => {
    return PipelineEntity.create({ ...pipelineData })
      .save()
      .then(pipeline => {
        return pipeline;
      });
  };

  public createPipelineSetting = async (pipelineSetting: PipelineSetting, pipeline: PipelineEntity) => {
    const settings = await PipelineSettingEntity.create({ ...pipelineSetting }).save();
    settings.pipeline = pipeline;
    return settings;
  };

  public updatePipelineBuild = async (data: BuildUpdateData) => {
    const buildData = await PipelineBuildEntity.findOne({
      where: {
        uuid: data.uuid,
      },
    });

    PipelineBuildEntity.getRepository()
      .createQueryBuilder()
      .update()
      .set({
        status: data.status,
        ended_at: new Date(),
        content: buildData.content + data.content,
      })
      .where('uuid = :uuid', {
        uuid: data.uuid,
      })
      .execute();

    global.SocketServer.emit(`status-${data.uuid}`, {
      status: data.status,
      percentageCompleted: data.percentageCompleted,
    });
  };

  public runBuildPipeline = async (build: PipelineBuild, pipeline: PipelineEntity, commitData: CommitData, template: string) => {
    // run pipeline
    const buildTemplateFolder = path.join(__dirname, `../services-build-templates/${pipeline.repo_id}`);

    const repoVariables = `--service=${pipeline.repo_id} --version=${build.id} --docker_registry=${DOCKER_REGISTRY} --env=${
      commitData.branch
    } --apptype=${pipeline.lang} --authToken=${await this.getAccessToken('bitbucket')} --repoGitUrl=${commitData.repoUrl} --template="${template}"`;

    const earthly = () => {
      return `docker run -t -v $(pwd):/workspace -v /var/run/docker.sock:/var/run/docker.sock -e NO_BUILDKIT=1 earthly/earthly:v0.6.30`;
    };

    const updateBuildProgress = (data: BuildUpdateData) => {
      return `curl --location 'http://localhost:8080/update-build' \
      --form 'uuid="${data.uuid}"' \
      --form 'status="${data.status}"' \
      --form 'percentageCompleted="${data.percentageCompleted}"'`;
    };

    const childProcess = shell.cd(buildTemplateFolder).exec(
      `${earthly()} +setup --no-cache ${repoVariables} && \
${updateBuildProgress({
  status: 'in_progress',
  uuid: build.uuid,
  percentageCompleted: 30,
})} && \
${earthly()} +build --push ${repoVariables} && \
${updateBuildProgress({
  status: 'in_progress',
  uuid: build.uuid,
  percentageCompleted: 60,
})} && \
${earthly()} +deploy --no-cache ${repoVariables} && \
${updateBuildProgress({
  status: 'completed',
  uuid: build.uuid,
  percentageCompleted: 100,
})}
      `,
      {
        async: true,
      },
    );

    childProcess.stdout.on('data', function (data) {
      global.SocketServer.emit(`${build.uuid}`, data);
      this.updatePipelineBuild({
        status: 'in_progress',
        uuid: build.uuid,
        content: data,
      });
    });

    childProcess.on('error', () => {
      this.updatePipelineBuild({
        percentageCompleted: 100,
        status: 'failed',
        uuid: build.uuid,
      });
    });
  };

  public createPipelineBuild = async (pipelineBuild: PipelineBuild, pipeline: PipelineEntity) => {
    const build = await PipelineBuildEntity.create({ ...pipelineBuild }).save();
    build.pipeline = pipeline;

    global.SocketServer.emit(`new-build`, build);

    return build;
  };

  public getTemplateVariables = async (lang: string) => {
    const variableExtractor = new VariableExtractor();

    const templateInfo: {
      templateVariables: any;
      folders: string[];
    } = await variableExtractor.extractTemplateVariables(lang);

    return templateInfo;
  };

  public setupServiceTemplate = (repoSlug: string, lang: string, branches: string[]) => {
    const buildTemplateFolder = path.join(__dirname, `../services-build-templates`);

    const childProcess = shell
      .cd(buildTemplateFolder)
      .exec(
        `docker run -t -v $(pwd):/workspace -v /var/run/docker.sock:/var/run/docker.sock -e NO_BUILDKIT=1 earthly/earthly:v0.6.30 ${this.getLanguageRepo(
          lang,
        )}+install --service=${repoSlug} --envs=${branches.toString()}`,
        {
          async: true,
        },
      );

    childProcess.stdout.on('data', function (data) {
      global.SocketServer.emit(`${repoSlug}`, data);
    });
  };

  public createServicePipeline = async (createPipelineData: CreatePipelineDto) => {
    const pipelineData = await PipelineEntity.find({
      where: [
        {
          repo_id: createPipelineData.repoId,
        },
      ],
    });

    let pipeline: PipelineEntity;

    if (pipelineData.length == 0) {
      // create pipeline
      pipeline = await this.createPipeline({
        description: createPipelineData.repoDescription,
        repo_id: createPipelineData.repoId,
        repo_url: createPipelineData.repo_url,
        status: 'inactive',
        lang: createPipelineData.lang,
        full_name: createPipelineData.repo_name,
      });
      // setup a webhook for the repo
      await this.setRepositoryWebhook(createPipelineData.workspaceId, createPipelineData.repoId);
    } else {
      pipeline = pipelineData[0];
    }

    // get repository branches
    const paginatedBranches = await this.getRepositoryBranches(createPipelineData.workspaceId, createPipelineData.repoId);
    const branches = paginatedBranches.data.values;
    const branchArray = [];

    // create pipeline settings for each branches
    const templateConfigData = await this.getTemplateVariables(createPipelineData.lang);
    branches.forEach(branch => {
      branchArray.push(branch.name);
      if (pipelineData.length == 0) {
        this.createPipelineSetting(
          {
            branch: branch.name,
            pipeline_id: pipeline.id,
            config_to_use: JSON.stringify([]),
            service_config: JSON.stringify(templateConfigData.templateVariables),
            pipelineUuid: pipeline.uuid,
            pipelineId: pipeline.id,
          },
          pipeline,
        ).then(() => {
          //
        });
      }
    });
    // generate pipeline build template
    this.setupServiceTemplate(createPipelineData.repoId, createPipelineData.lang, branchArray);

    return pipeline;
  };

  public getPipelines = async () => {
    const pipelineData = await PipelineEntity.getRepository()
      .createQueryBuilder('pipeline')
      .leftJoinAndSelect('pipeline.settings', 'settings')
      .getMany();
    return pipelineData;
  };

  public getPipeline = async (pipelineUuid: string) => {
    const pipelineData = await PipelineEntity.getRepository().findOne({
      where: {
        uuid: pipelineUuid,
      },
      relations: ['settings', 'builds'],
    });

    const templateConfig = await this.getTemplateVariables(pipelineData.lang);

    pipelineData.lang_config_folders = JSON.stringify(templateConfig.folders);

    return pipelineData;
  };

  public getPipelineBuild = async (buildUuid: string) => {
    const pipelineBuildData = await PipelineBuildEntity.getRepository().findOne({
      where: {
        uuid: buildUuid,
      },
    });
    return pipelineBuildData;
  };

  public getPipelineBySlug = async (repoId: string, branch: string) => {
    const pipelineData = await PipelineEntity.getRepository().findOne({
      where: {
        repo_id: repoId,
      },
      relations: ['settings'],
    });

    const pipelineSetting = await PipelineSettingEntity.getRepository().findOne({
      where: {
        pipelineUuid: pipelineData.uuid,
        branch,
      },
    });

    const templateConfigs = JSON.parse(pipelineSetting.config_to_use);
    const templateVariables = JSON.parse(pipelineSetting.service_config);

    return {
      pipeline: pipelineData,
      templateConfigs,
      templateVariables,
      branch,
    };
  };

  public updatePipelineSetting = async (settingUuid: string, configToUse: string, serviceConfig: string) => {
    await PipelineSettingEntity.getRepository()
      .createQueryBuilder()
      .update()
      .set({
        config_to_use: configToUse,
        service_config: serviceConfig,
      })
      .where('uuid = :uuid', {
        uuid: settingUuid,
      })
      .execute();

    return true;
  };
}

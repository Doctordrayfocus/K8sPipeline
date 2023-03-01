import { dbConnection } from './../databases/index';
import { PipelineBuildEntity } from './../entities/pipelineBuild.entity';
import { CreatePipelineDto } from './../dtos/pipeline.dto';
import { AuthStrategyEntity } from '../entities/authStrategy.entity';
import { PipelineEntity } from '../entities/pipeline.entity';
import { PipelineSettingEntity } from '../entities/pipelineSetting.entity';
import VariableExtractor from '../helpers/VariableExtractor';
import { BuildUpdateData, CommitData, Pipeline, PipelineBuild, PipelineSetting } from '../interfaces/pipeline.interface';
import { APIClient, Bitbucket } from 'bitbucket';
import path from 'path';
import { EntityRepository } from 'typeorm';
import shell from 'shelljs';
import AuthStrategyRepository from './authStrategy.repository';
import { APP_URL, DOCKER_REGISTRY, UPLOAD_URL } from '../config';
import { promises as fs, createReadStream } from 'fs';
import { Response } from 'express';
import unzipper from 'unzipper';

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
    try {
      const buildRepository = dbConnection.getRepository(PipelineBuildEntity);

      buildRepository
        .findOneBy({
          uuid: data.uuid,
        })
        .then(buildData => {
          if (buildData) {
            buildData.status = data.status;
            buildData.ended_at = new Date();
            buildData.content = buildData.content + data.content;

            buildRepository
              .save(buildData)
              .then()
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.log(error);
        });

      if (data.percentageCompleted) {
        global.SocketServer.emit(`status-${data.uuid}`, {
          status: data.status,
          percentageCompleted: data.percentageCompleted,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  public runBuildPipeline = async (build: PipelineBuild, pipeline: PipelineEntity, commitData: CommitData, template: string) => {
    // run pipeline
    const buildTemplateFolder = path.join(__dirname, `../../services-build-templates/${pipeline.repo_id}/setup-arena/${pipeline.repo_id}`);

    const repoVariables = `--service=${pipeline.repo_id} --version=${build.id} --docker_registry=${DOCKER_REGISTRY} --env=${commitData.branch} --apptype=${pipeline.lang}  --repoGitUrl=${commitData.repoUrl} --template="${template}"`;

    const earthly = () => {
      return `docker run -t -v $(pwd):/workspace -v /var/run/docker.sock:/var/run/docker.sock -e NO_BUILDKIT=1 earthly/earthly:v0.6.30`;
    };

    const updateBuildProgress = (data: string) => {
      return `curl --location --request POST 'http://localhost:8080/update-build' \
      --header 'Content-Type: application/json' \
      --data '${data}'`;
    };

    const cloneProject = async () => {
      fs.unlink(buildTemplateFolder + '/template/docker/app')
        .then(() => {
          //
        })
        .catch(() => {
          // do nothing
        });
      return `git -c "http.extraHeader=Authorization: Bearer ${await this.getAccessToken('bitbucket')}" clone ${
        commitData.repoUrl
      } template/docker/app`;
    };

    const childProcess = shell.cd(buildTemplateFolder).exec(
      `${await cloneProject()} && \
        ${updateBuildProgress(
          JSON.stringify({
            status: 'in_progress',
            uuid: build.uuid,
            percentageCompleted: 30,
          }),
        )} && \
        ${earthly()} +build --push ${repoVariables} && \
        ${updateBuildProgress(
          JSON.stringify({
            status: 'in_progress',
            uuid: build.uuid,
            percentageCompleted: 60,
          }),
        )} && \
        ${earthly()} +deploy --no-cache ${repoVariables} && \
        ${updateBuildProgress(
          JSON.stringify({
            status: 'completed',
            uuid: build.uuid,
            percentageCompleted: 100,
          }),
        )}`,
      {
        async: true,
        silent: true,
      },
    );

    childProcess.stdout.on('data', async data => {
      global.SocketServer.emit(`${build.uuid}`, data);
      await fs.appendFile(path.join(__dirname, `../../build_logs/${build.uuid}.log`), data);
    });

    childProcess.stderr.on('error', async () => {
      const buildLogs = await fs.readFile(path.join(__dirname, `../../build_logs/${build.uuid}.log`), 'base64');
      const stringifiedData = JSON.stringify({
        uuid: build.uuid || '',
        status: 'failed',
        content: buildLogs,
      });
      shell.cd(buildTemplateFolder).exec(
        `${updateBuildProgress(stringifiedData)}
        `,
        {
          async: true,
          silent: true,
        },
      );

      fs.unlink(path.join(__dirname, `../../build_logs/${build.uuid}.log`))
        .then(() => {
          //
        })
        .catch(() => {
          // do nothing
        });
    });

    childProcess.stderr.on('close', async () => {
      const buildLogs = await fs.readFile(path.join(__dirname, `../../build_logs/${build.uuid}.log`), 'base64');
      const stringifiedData = JSON.stringify({
        uuid: build.uuid || '',
        status: 'failed',
        content: buildLogs,
      });
      shell.cd(buildTemplateFolder).exec(
        `${updateBuildProgress(stringifiedData)}
        `,
        {
          async: true,
          silent: true,
        },
      );

      fs.unlink(path.join(__dirname, `../../build_logs/${build.uuid}.log`))
        .then(() => {
          //
        })
        .catch(() => {
          // do nothing
        });
    });

    childProcess.stdout.on('end', async () => {
      fs.unlink(path.join(__dirname, `../../build_logs/${build.uuid}.log`))
        .then(() => {
          //
        })
        .catch(() => {
          // do nothing
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
    const buildTemplateFolder = path.join(__dirname, `../../services-build-templates`);

    const childProcess = shell
      .cd(buildTemplateFolder)
      .exec(
        `docker run -t -v $(pwd):/workspace -v /var/run/docker.sock:/var/run/docker.sock -e NO_BUILDKIT=1 earthly/earthly:v0.6.30 ${this.getLanguageRepo(
          lang,
        )}+install --service=${repoSlug} --envs=${branches.toString()} --upload_url=${UPLOAD_URL}`,
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
    this.setupServiceTemplate(pipeline.repo_id, createPipelineData.lang, branchArray);

    return pipeline;
  };

  public extractServiceFolder = (data: any, res: Response) => {
    const uploadPath = path.join(__dirname, `../../temp_archive/`) + data.name;
    const serviceTemplatePath = path.join(__dirname, `../../services-build-templates/${data.name.split('.')[0]}`);

    // Use the mv() method to place the file somewhere on your server
    data.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);

      createReadStream(uploadPath).pipe(unzipper.Extract({ path: serviceTemplatePath }));
      fs.unlink(uploadPath);
      res.send('File saved!');
    });
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
    if (!pipelineBuildData.content) {
      fs.readFile(path.join(__dirname, `../../build_logs/${pipelineBuildData.uuid}.log`), 'base64')
        .then(data => {
          pipelineBuildData.content = data;
        })
        .catch(() => {
          pipelineBuildData.content = '';
        });
    }
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

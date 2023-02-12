"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const authStrategy_entity_1 = require("@/entities/authStrategy.entity");
const pipeline_entity_1 = require("@/entities/pipeline.entity");
const pipelineSetting_entity_1 = require("@/entities/pipelineSetting.entity");
const VariableExtractor_1 = tslib_1.__importDefault(require("@/helpers/VariableExtractor"));
const bitbucket_1 = require("bitbucket");
const path_1 = tslib_1.__importDefault(require("path"));
const typeorm_1 = require("typeorm");
const shelljs_1 = tslib_1.__importDefault(require("shelljs"));
const authStrategy_repository_1 = tslib_1.__importDefault(require("./authStrategy.repository"));
let PipelineRepository = class PipelineRepository {
    constructor() {
        this.configureBitbucket = () => {
            return authStrategy_entity_1.AuthStrategyEntity.findOne({
                where: {
                    type: 'bitbucket',
                },
            }).then(async (strategy) => {
                if (strategy) {
                    const AuthStrategy = new authStrategy_repository_1.default();
                    const newAccessToken = await AuthStrategy.requestNewAccessToken('bitbucket', strategy.refresh_token);
                    const clientOptions = {
                        auth: {
                            token: newAccessToken ? newAccessToken : strategy.access_token,
                        },
                    };
                    this.bitbucketClient = new bitbucket_1.Bitbucket(clientOptions);
                }
            });
        };
        this.getWorkspaces = () => {
            return this.configureBitbucket().then(() => {
                return this.bitbucketClient.workspaces.getWorkspaces({
                    pagelen: 30,
                });
            });
        };
        this.getRespository = (workspaceId) => {
            return this.configureBitbucket().then(() => {
                return this.bitbucketClient.repositories.list({
                    workspace: workspaceId,
                    pagelen: 100,
                });
            });
        };
        this.getRepositoryBranches = (workspaceId, repoId) => {
            return this.configureBitbucket().then(() => {
                return this.bitbucketClient.repositories.listBranches({
                    workspace: workspaceId,
                    pagelen: 100,
                    repo_slug: repoId,
                });
            });
        };
        this.setRepositoryWebhook = (workspaceId, repo_slug) => {
            this.configureBitbucket().then(() => {
                return this.bitbucketClient.webhooks.create({
                    repo_slug: repo_slug,
                    workspace: workspaceId,
                    _body: {
                        name: 'K8sPipelineHook',
                        url: 'http://localhost:3000/bitbucket-webhook',
                        active: true,
                        events: ['repo:push'],
                    },
                });
            });
        };
        this.createPipeline = (pipelineData) => {
            return pipeline_entity_1.PipelineEntity.create(Object.assign({}, pipelineData))
                .save()
                .then(pipeline => {
                return pipeline;
            });
        };
        this.createPipelineSetting = async (pipelineSetting, pipeline) => {
            const settings = await pipelineSetting_entity_1.PipelineSettingEntity.create(Object.assign({}, pipelineSetting)).save();
            settings.pipeline = pipeline;
            return settings;
        };
        this.getTemplateVariables = async (lang) => {
            const variableExtractor = new VariableExtractor_1.default();
            const templateInfo = await variableExtractor.extractTemplateVariables(lang);
            return templateInfo;
        };
        this.setupServiceTemplate = (repoSlug, lang, branches) => {
            const buildTemplateFolder = path_1.default.join(__dirname, `../services-build-templates`);
            let pipelineTemplateRepo = '';
            if (lang == 'php') {
                pipelineTemplateRepo = 'github.com/Doctordrayfocus/K8PipelinePHP';
            }
            else if (lang == 'nodejs') {
                pipelineTemplateRepo = 'github.com/Doctordrayfocus/K8PipelineNodeJs';
            }
            const childProcess = shelljs_1.default
                .cd(buildTemplateFolder)
                .exec(`docker run -t -v $(pwd):/workspace -v /var/run/docker.sock:/var/run/docker.sock -e NO_BUILDKIT=1 earthly/earthly:v0.6.30 ${pipelineTemplateRepo}+install --service=${repoSlug} --envs=${branches.toString()}`, {
                async: true,
            });
            childProcess.stdout.on('data', function (data) {
                global.SocketServer.emit(`${repoSlug}`, data);
            });
        };
        this.createServicePipeline = async (createPipelineData) => {
            const pipelineData = await pipeline_entity_1.PipelineEntity.find({
                where: [
                    {
                        repo_id: createPipelineData.repoId,
                    },
                ],
            });
            let pipeline;
            if (pipelineData.length == 0) {
                // create pipeline
                pipeline = await this.createPipeline({
                    description: createPipelineData.repoDescription,
                    repo_id: createPipelineData.repoId,
                    repo_url: 'empty',
                    status: 'inactive',
                    lang: createPipelineData.lang,
                    full_name: createPipelineData.repo_name,
                });
                // setup a webhook for the repo
                await this.setRepositoryWebhook(createPipelineData.workspaceId, createPipelineData.repoId);
            }
            else {
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
                    this.createPipelineSetting({
                        branch: branch.name,
                        pipeline_id: pipeline.id,
                        config_to_use: JSON.stringify([]),
                        service_config: JSON.stringify(templateConfigData.templateVariables),
                        pipelineUuid: pipeline.uuid,
                        pipelineId: pipeline.id,
                    }, pipeline).then(() => {
                        //
                    });
                }
            });
            // generate pipeline build template
            this.setupServiceTemplate(createPipelineData.repoId, createPipelineData.lang, branchArray);
            return pipeline;
        };
        this.getPipelines = async () => {
            const pipelineData = await pipeline_entity_1.PipelineEntity.getRepository()
                .createQueryBuilder('pipeline')
                .leftJoinAndSelect('pipeline.settings', 'settings')
                .getMany();
            return pipelineData;
        };
        this.getPipeline = async (pipelineUuid) => {
            const pipelineData = await pipeline_entity_1.PipelineEntity.getRepository().findOne({
                where: {
                    uuid: pipelineUuid,
                },
                relations: ['settings'],
            });
            const templateConfig = await this.getTemplateVariables(pipelineData.lang);
            pipelineData.lang_config_folders = JSON.stringify(templateConfig.folders);
            return pipelineData;
        };
        this.updatePipelineSetting = async (settingUuid, configToUse, serviceConfig) => {
            await pipelineSetting_entity_1.PipelineSettingEntity.getRepository()
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
};
PipelineRepository = tslib_1.__decorate([
    (0, typeorm_1.EntityRepository)(pipeline_entity_1.PipelineEntity)
], PipelineRepository);
exports.default = PipelineRepository;
//# sourceMappingURL=pipeline.repository.js.map
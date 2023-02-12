"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>PipelineRepository
});
const _authStrategyEntity = require("../entities/authStrategy.entity");
const _pipelineEntity = require("../entities/pipeline.entity");
const _pipelineSettingEntity = require("../entities/pipelineSetting.entity");
const _variableExtractor = _interopRequireDefault(require("../helpers/VariableExtractor"));
const _bitbucket = require("bitbucket");
const _path = _interopRequireDefault(require("path"));
const _typeorm = require("typeorm");
const _shelljs = _interopRequireDefault(require("shelljs"));
const _authStrategyRepository = _interopRequireDefault(require("./authStrategy.repository"));
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
var __decorate = (void 0) && (void 0).__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let PipelineRepository = class PipelineRepository {
    constructor(){
        this.configureBitbucket = ()=>{
            return _authStrategyEntity.AuthStrategyEntity.findOne({
                where: {
                    type: 'bitbucket'
                }
            }).then(async (strategy)=>{
                if (strategy) {
                    const AuthStrategy = new _authStrategyRepository.default();
                    const newAccessToken = await AuthStrategy.requestNewAccessToken('bitbucket', strategy.refresh_token);
                    const clientOptions = {
                        auth: {
                            token: newAccessToken ? newAccessToken : strategy.access_token
                        }
                    };
                    this.bitbucketClient = new _bitbucket.Bitbucket(clientOptions);
                }
            });
        };
        this.getWorkspaces = ()=>{
            return this.configureBitbucket().then(()=>{
                return this.bitbucketClient.workspaces.getWorkspaces({
                    pagelen: 30
                });
            });
        };
        this.getRespository = (workspaceId)=>{
            return this.configureBitbucket().then(()=>{
                return this.bitbucketClient.repositories.list({
                    workspace: workspaceId,
                    pagelen: 100
                });
            });
        };
        this.getRepositoryBranches = (workspaceId, repoId)=>{
            return this.configureBitbucket().then(()=>{
                return this.bitbucketClient.repositories.listBranches({
                    workspace: workspaceId,
                    pagelen: 100,
                    repo_slug: repoId
                });
            });
        };
        this.setRepositoryWebhook = (workspaceId, repo_slug)=>{
            this.configureBitbucket().then(()=>{
                return this.bitbucketClient.webhooks.create({
                    repo_slug: repo_slug,
                    workspace: workspaceId,
                    _body: {
                        name: 'K8sPipelineHook',
                        url: 'http://localhost:3000/bitbucket-webhook',
                        active: true,
                        events: [
                            'repo:push'
                        ]
                    }
                });
            });
        };
        this.createPipeline = (pipelineData)=>{
            return _pipelineEntity.PipelineEntity.create(_objectSpread({}, pipelineData)).save().then((pipeline)=>{
                return pipeline;
            });
        };
        this.createPipelineSetting = async (pipelineSetting, pipeline)=>{
            const settings = await _pipelineSettingEntity.PipelineSettingEntity.create(_objectSpread({}, pipelineSetting)).save();
            settings.pipeline = pipeline;
            return settings;
        };
        this.getTemplateVariables = async (lang)=>{
            const variableExtractor = new _variableExtractor.default();
            const templateInfo = await variableExtractor.extractTemplateVariables(lang);
            return templateInfo;
        };
        this.setupServiceTemplate = (repoSlug, lang, branches)=>{
            const buildTemplateFolder = _path.default.join(__dirname, `../services-build-templates`);
            let pipelineTemplateRepo = '';
            if (lang == 'php') {
                pipelineTemplateRepo = 'github.com/Doctordrayfocus/K8PipelinePHP';
            } else if (lang == 'nodejs') {
                pipelineTemplateRepo = 'github.com/Doctordrayfocus/K8PipelineNodeJs';
            }
            const childProcess = _shelljs.default.cd(buildTemplateFolder).exec(`docker run -t -v $(pwd):/workspace -v /var/run/docker.sock:/var/run/docker.sock -e NO_BUILDKIT=1 earthly/earthly:v0.6.30 ${pipelineTemplateRepo}+install --service=${repoSlug} --envs=${branches.toString()}`, {
                async: true
            });
            childProcess.stdout.on('data', function(data) {
                global.SocketServer.emit(`${repoSlug}`, data);
            });
        };
        this.createServicePipeline = async (createPipelineData)=>{
            const pipelineData = await _pipelineEntity.PipelineEntity.find({
                where: [
                    {
                        repo_id: createPipelineData.repoId
                    }
                ]
            });
            let pipeline;
            if (pipelineData.length == 0) {
                pipeline = await this.createPipeline({
                    description: createPipelineData.repoDescription,
                    repo_id: createPipelineData.repoId,
                    repo_url: 'empty',
                    status: 'inactive',
                    lang: createPipelineData.lang,
                    full_name: createPipelineData.repo_name
                });
                await this.setRepositoryWebhook(createPipelineData.workspaceId, createPipelineData.repoId);
            } else {
                pipeline = pipelineData[0];
            }
            const paginatedBranches = await this.getRepositoryBranches(createPipelineData.workspaceId, createPipelineData.repoId);
            const branches = paginatedBranches.data.values;
            const branchArray = [];
            const templateConfigData = await this.getTemplateVariables(createPipelineData.lang);
            branches.forEach((branch)=>{
                branchArray.push(branch.name);
                if (pipelineData.length == 0) {
                    this.createPipelineSetting({
                        branch: branch.name,
                        pipeline_id: pipeline.id,
                        config_to_use: JSON.stringify([]),
                        service_config: JSON.stringify(templateConfigData.templateVariables),
                        pipelineUuid: pipeline.uuid,
                        pipelineId: pipeline.id
                    }, pipeline).then(()=>{});
                }
            });
            this.setupServiceTemplate(createPipelineData.repoId, createPipelineData.lang, branchArray);
            return pipeline;
        };
        this.getPipelines = async ()=>{
            const pipelineData = await _pipelineEntity.PipelineEntity.getRepository().createQueryBuilder('pipeline').leftJoinAndSelect('pipeline.settings', 'settings').getMany();
            return pipelineData;
        };
        this.getPipeline = async (pipelineUuid)=>{
            const pipelineData = await _pipelineEntity.PipelineEntity.getRepository().findOne({
                where: {
                    uuid: pipelineUuid
                },
                relations: [
                    'settings'
                ]
            });
            const templateConfig = await this.getTemplateVariables(pipelineData.lang);
            console.log(templateConfig.folders);
            pipelineData.lang_config_folders = JSON.stringify(templateConfig.folders);
            return pipelineData;
        };
        this.updatePipelineSetting = async (settingUuid, configToUse, serviceConfig)=>{
            await _pipelineSettingEntity.PipelineSettingEntity.getRepository().createQueryBuilder().update().set({
                config_to_use: configToUse,
                service_config: serviceConfig
            }).where('uuid = :uuid', {
                uuid: settingUuid
            }).execute();
            return true;
        };
    }
};
PipelineRepository = __decorate([
    (0, _typeorm.EntityRepository)(_pipelineEntity.PipelineEntity)
], PipelineRepository);

//# sourceMappingURL=pipeline.repository.js.map
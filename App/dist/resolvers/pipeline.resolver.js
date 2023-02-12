"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "pipelineResolver", {
    enumerable: true,
    get: ()=>pipelineResolver
});
const _pipelineRepository = _interopRequireDefault(require("../repositories/pipeline.repository"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let pipelineResolver = class pipelineResolver extends _pipelineRepository.default {
    async workspaces() {
        const paginatedWorkpaces = await this.getWorkspaces();
        return paginatedWorkpaces.data.values;
    }
    async repositories(workspaceId) {
        const paginatedRepositories = await this.getRespository(workspaceId);
        const repositories = paginatedRepositories.data.values;
        return repositories;
    }
    async pipelines() {
        const pipelines = await this.getPipelines();
        return pipelines;
    }
    async createPipelineTemplate(createPipelineData) {
        const pipeline = await this.createServicePipeline(createPipelineData);
        return pipeline;
    }
    async getPipelineData(pipelineUuid) {
        const pipeline = await this.getPipeline(pipelineUuid);
        return pipeline;
    }
    async updateSetting(settingsUpdateData) {
        const response = await this.updatePipelineSetting(settingsUpdateData.settingUuid, settingsUpdateData.configToUse, settingsUpdateData.serviceConfig);
        return response;
    }
};

//# sourceMappingURL=pipeline.resolver.js.map
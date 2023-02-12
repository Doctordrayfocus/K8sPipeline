"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelineResolver = void 0;
const tslib_1 = require("tslib");
const pipeline_repository_1 = tslib_1.__importDefault(require("@/repositories/pipeline.repository"));
class pipelineResolver extends pipeline_repository_1.default {
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
}
exports.pipelineResolver = pipelineResolver;
//# sourceMappingURL=pipeline.resolver.js.map
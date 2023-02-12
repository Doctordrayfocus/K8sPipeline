"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineSettingEntity = void 0;
const tslib_1 = require("tslib");
const pipeline_entity_1 = require("./pipeline.entity");
const typeorm_1 = require("typeorm");
let PipelineSettingEntity = class PipelineSettingEntity extends typeorm_1.BaseEntity {
};
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], PipelineSettingEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], PipelineSettingEntity.prototype, "uuid", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PipelineSettingEntity.prototype, "branch", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], PipelineSettingEntity.prototype, "pipeline_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'longtext',
    }),
    tslib_1.__metadata("design:type", String)
], PipelineSettingEntity.prototype, "service_config", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'longtext',
    }),
    tslib_1.__metadata("design:type", String)
], PipelineSettingEntity.prototype, "config_to_use", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => pipeline_entity_1.PipelineEntity, pipeline => pipeline.settings),
    tslib_1.__metadata("design:type", pipeline_entity_1.PipelineEntity)
], PipelineSettingEntity.prototype, "pipeline", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PipelineSettingEntity.prototype, "pipelineUuid", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PipelineSettingEntity.prototype, "pipelineId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], PipelineSettingEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], PipelineSettingEntity.prototype, "updatedAt", void 0);
PipelineSettingEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], PipelineSettingEntity);
exports.PipelineSettingEntity = PipelineSettingEntity;
//# sourceMappingURL=pipelineSetting.entity.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineEntity = void 0;
const tslib_1 = require("tslib");
const pipelineSetting_entity_1 = require("./pipelineSetting.entity");
const typeorm_1 = require("typeorm");
let PipelineEntity = class PipelineEntity extends typeorm_1.BaseEntity {
};
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], PipelineEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], PipelineEntity.prototype, "uuid", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PipelineEntity.prototype, "repo_url", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PipelineEntity.prototype, "repo_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PipelineEntity.prototype, "lang", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PipelineEntity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PipelineEntity.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PipelineEntity.prototype, "full_name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => pipelineSetting_entity_1.PipelineSettingEntity, piplineSetting => piplineSetting.pipeline),
    tslib_1.__metadata("design:type", Array)
], PipelineEntity.prototype, "settings", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], PipelineEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], PipelineEntity.prototype, "updatedAt", void 0);
PipelineEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], PipelineEntity);
exports.PipelineEntity = PipelineEntity;
//# sourceMappingURL=pipeline.entity.js.map
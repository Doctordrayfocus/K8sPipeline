"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PipelineSettingEntity", {
    enumerable: true,
    get: ()=>PipelineSettingEntity
});
const _pipelineEntity = require("./pipeline.entity");
const _typeorm = require("typeorm");
var __decorate = (void 0) && (void 0).__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (void 0) && (void 0).__metadata || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let PipelineSettingEntity = class PipelineSettingEntity extends _typeorm.BaseEntity {
};
__decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PipelineSettingEntity.prototype, "id", void 0);
__decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PipelineSettingEntity.prototype, "uuid", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", String)
], PipelineSettingEntity.prototype, "branch", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", Number)
], PipelineSettingEntity.prototype, "pipeline_id", void 0);
__decorate([
    (0, _typeorm.Column)({
        type: 'longtext'
    }),
    __metadata("design:type", String)
], PipelineSettingEntity.prototype, "service_config", void 0);
__decorate([
    (0, _typeorm.Column)({
        type: 'longtext'
    }),
    __metadata("design:type", String)
], PipelineSettingEntity.prototype, "config_to_use", void 0);
__decorate([
    (0, _typeorm.ManyToOne)(()=>_pipelineEntity.PipelineEntity, (pipeline)=>pipeline.settings),
    __metadata("design:type", typeof _pipelineEntity.PipelineEntity === "undefined" ? Object : _pipelineEntity.PipelineEntity)
], PipelineSettingEntity.prototype, "pipeline", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", String)
], PipelineSettingEntity.prototype, "pipelineUuid", void 0);
__decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    __metadata("design:type", Number)
], PipelineSettingEntity.prototype, "pipelineId", void 0);
__decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.CreateDateColumn)(),
    __metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PipelineSettingEntity.prototype, "createdAt", void 0);
__decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.UpdateDateColumn)(),
    __metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PipelineSettingEntity.prototype, "updatedAt", void 0);
PipelineSettingEntity = __decorate([
    (0, _typeorm.Entity)()
], PipelineSettingEntity);

//# sourceMappingURL=pipelineSetting.entity.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PipelineEntity", {
    enumerable: true,
    get: ()=>PipelineEntity
});
const _pipelineSettingEntity = require("./pipelineSetting.entity");
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
let PipelineEntity = class PipelineEntity extends _typeorm.BaseEntity {
};
__decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PipelineEntity.prototype, "id", void 0);
__decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PipelineEntity.prototype, "uuid", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", String)
], PipelineEntity.prototype, "repo_url", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", String)
], PipelineEntity.prototype, "repo_id", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", String)
], PipelineEntity.prototype, "lang", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", String)
], PipelineEntity.prototype, "description", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", String)
], PipelineEntity.prototype, "status", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", String)
], PipelineEntity.prototype, "full_name", void 0);
__decorate([
    (0, _typeorm.OneToMany)(()=>_pipelineSettingEntity.PipelineSettingEntity, (piplineSetting)=>piplineSetting.pipeline),
    __metadata("design:type", Array)
], PipelineEntity.prototype, "settings", void 0);
__decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.CreateDateColumn)(),
    __metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PipelineEntity.prototype, "createdAt", void 0);
__decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.UpdateDateColumn)(),
    __metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PipelineEntity.prototype, "updatedAt", void 0);
PipelineEntity = __decorate([
    (0, _typeorm.Entity)()
], PipelineEntity);

//# sourceMappingURL=pipeline.entity.js.map
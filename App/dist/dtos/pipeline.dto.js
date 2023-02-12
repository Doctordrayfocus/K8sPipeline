"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePipelineDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreatePipelineDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreatePipelineDto.prototype, "workspaceId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreatePipelineDto.prototype, "repoId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreatePipelineDto.prototype, "repoDescription", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreatePipelineDto.prototype, "repo_name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreatePipelineDto.prototype, "lang", void 0);
exports.CreatePipelineDto = CreatePipelineDto;
//# sourceMappingURL=pipeline.dto.js.map
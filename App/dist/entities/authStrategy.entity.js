"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStrategyEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let AuthStrategyEntity = class AuthStrategyEntity extends typeorm_1.BaseEntity {
};
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], AuthStrategyEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], AuthStrategyEntity.prototype, "uuid", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], AuthStrategyEntity.prototype, "profileId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], AuthStrategyEntity.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], AuthStrategyEntity.prototype, "access_token", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], AuthStrategyEntity.prototype, "refresh_token", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], AuthStrategyEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], AuthStrategyEntity.prototype, "updatedAt", void 0);
AuthStrategyEntity = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], AuthStrategyEntity);
exports.AuthStrategyEntity = AuthStrategyEntity;
//# sourceMappingURL=authStrategy.entity.js.map
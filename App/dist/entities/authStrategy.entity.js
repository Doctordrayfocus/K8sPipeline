"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthStrategyEntity", {
    enumerable: true,
    get: ()=>AuthStrategyEntity
});
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
let AuthStrategyEntity = class AuthStrategyEntity extends _typeorm.BaseEntity {
};
__decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AuthStrategyEntity.prototype, "id", void 0);
__decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuthStrategyEntity.prototype, "uuid", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", String)
], AuthStrategyEntity.prototype, "profileId", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", String)
], AuthStrategyEntity.prototype, "type", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", String)
], AuthStrategyEntity.prototype, "access_token", void 0);
__decorate([
    (0, _typeorm.Column)(),
    __metadata("design:type", String)
], AuthStrategyEntity.prototype, "refresh_token", void 0);
__decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.CreateDateColumn)(),
    __metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AuthStrategyEntity.prototype, "createdAt", void 0);
__decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.UpdateDateColumn)(),
    __metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AuthStrategyEntity.prototype, "updatedAt", void 0);
AuthStrategyEntity = __decorate([
    (0, _typeorm.Entity)()
], AuthStrategyEntity);

//# sourceMappingURL=authStrategy.entity.js.map
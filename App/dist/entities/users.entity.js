"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserEntity", {
    enumerable: true,
    get: ()=>UserEntity
});
const _classValidator = require("class-validator");
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
let UserEntity = class UserEntity extends _typeorm.BaseEntity {
};
__decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, _typeorm.Column)(),
    (0, _classValidator.IsNotEmpty)(),
    (0, _typeorm.Unique)([
        'email'
    ]),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, _typeorm.Column)(),
    (0, _classValidator.IsNotEmpty)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.CreateDateColumn)(),
    __metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.UpdateDateColumn)(),
    __metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserEntity.prototype, "updatedAt", void 0);
UserEntity = __decorate([
    (0, _typeorm.Entity)()
], UserEntity);

//# sourceMappingURL=users.entity.js.map
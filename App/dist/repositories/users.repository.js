"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>UserRepository
});
const _bcrypt = require("bcrypt");
const _typeorm = require("typeorm");
const _usersEntity = require("../entities/users.entity");
const _httpException = require("../exceptions/HttpException");
const _util = require("../utils/util");
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
var __decorate = (void 0) && (void 0).__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let UserRepository = class UserRepository {
    async userFindAll() {
        const users = await _usersEntity.UserEntity.find();
        return users;
    }
    async userFindById(userId) {
        if ((0, _util.isEmpty)(userId)) throw new _httpException.HttpException(400, 'UserId is empty');
        const user = await _usersEntity.UserEntity.findOne({
            where: {
                id: userId
            }
        });
        if (!user) throw new _httpException.HttpException(409, "User doesn't exist");
        return user;
    }
    async userCreate(userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        const findUser = await _usersEntity.UserEntity.findOne({
            where: {
                email: userData.email
            }
        });
        if (findUser) throw new _httpException.HttpException(409, `This email ${userData.email} already exists`);
        const hashedPassword = await (0, _bcrypt.hash)(userData.password, 10);
        const createUserData = await _usersEntity.UserEntity.create(_objectSpreadProps(_objectSpread({}, userData), {
            password: hashedPassword
        })).save();
        return createUserData;
    }
    async userUpdate(userId, userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        const findUser = await _usersEntity.UserEntity.findOne({
            where: {
                id: userId
            }
        });
        if (!findUser) throw new _httpException.HttpException(409, "User doesn't exist");
        const hashedPassword = await (0, _bcrypt.hash)(userData.password, 10);
        await _usersEntity.UserEntity.update(userId, _objectSpreadProps(_objectSpread({}, userData), {
            password: hashedPassword
        }));
        const updateUser = await _usersEntity.UserEntity.findOne({
            where: {
                id: userId
            }
        });
        return updateUser;
    }
    async userDelete(userId) {
        if ((0, _util.isEmpty)(userId)) throw new _httpException.HttpException(400, "User doesn't existId");
        const findUser = await _usersEntity.UserEntity.findOne({
            where: {
                id: userId
            }
        });
        if (!findUser) throw new _httpException.HttpException(409, "User doesn't exist");
        await _usersEntity.UserEntity.delete({
            id: userId
        });
        return findUser;
    }
};
UserRepository = __decorate([
    (0, _typeorm.EntityRepository)()
], UserRepository);

//# sourceMappingURL=users.repository.js.map
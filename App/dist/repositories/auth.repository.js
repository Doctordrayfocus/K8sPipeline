"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>AuthRepository
});
const _bcrypt = require("bcrypt");
const _jsonwebtoken = require("jsonwebtoken");
const _typeorm = require("typeorm");
const _config = require("../config");
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
let AuthRepository = class AuthRepository {
    async userSignUp(userData) {
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
    async userLogIn(userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        const findUser = await _usersEntity.UserEntity.findOne({
            where: {
                email: userData.email
            }
        });
        if (!findUser) throw new _httpException.HttpException(409, `This email ${userData.email} was not found`);
        const isPasswordMatching = await (0, _bcrypt.compare)(userData.password, findUser.password);
        if (!isPasswordMatching) throw new _httpException.HttpException(409, 'Password is not matching');
        const tokenData = this.createToken(findUser);
        const cookie = this.createCookie(tokenData);
        return {
            cookie,
            findUser
        };
    }
    async userLogOut(userId) {
        if ((0, _util.isEmpty)(userId)) throw new _httpException.HttpException(400, 'userId is empty');
        const findUser = await _usersEntity.UserEntity.findOne({
            where: {
                id: userId
            }
        });
        if (!findUser) throw new _httpException.HttpException(409, "User doesn't exist");
        return findUser;
    }
    createToken(user) {
        const dataStoredInToken = {
            id: user.id
        };
        const secretKey = _config.SECRET_KEY;
        const expiresIn = 60 * 60;
        return {
            expiresIn,
            token: (0, _jsonwebtoken.sign)(dataStoredInToken, secretKey, {
                expiresIn
            })
        };
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
    }
};
AuthRepository = __decorate([
    (0, _typeorm.EntityRepository)(_usersEntity.UserEntity)
], AuthRepository);

//# sourceMappingURL=auth.repository.js.map
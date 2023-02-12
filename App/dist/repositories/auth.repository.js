"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const _config_1 = require("@config");
const users_entity_1 = require("@entities/users.entity");
const HttpException_1 = require("@exceptions/HttpException");
const util_1 = require("@utils/util");
let AuthRepository = class AuthRepository {
    async userSignUp(userData) {
        if ((0, util_1.isEmpty)(userData))
            throw new HttpException_1.HttpException(400, 'userData is empty');
        const findUser = await users_entity_1.UserEntity.findOne({ where: { email: userData.email } });
        if (findUser)
            throw new HttpException_1.HttpException(409, `This email ${userData.email} already exists`);
        const hashedPassword = await (0, bcrypt_1.hash)(userData.password, 10);
        const createUserData = await users_entity_1.UserEntity.create(Object.assign(Object.assign({}, userData), { password: hashedPassword })).save();
        return createUserData;
    }
    async userLogIn(userData) {
        if ((0, util_1.isEmpty)(userData))
            throw new HttpException_1.HttpException(400, 'userData is empty');
        const findUser = await users_entity_1.UserEntity.findOne({ where: { email: userData.email } });
        if (!findUser)
            throw new HttpException_1.HttpException(409, `This email ${userData.email} was not found`);
        const isPasswordMatching = await (0, bcrypt_1.compare)(userData.password, findUser.password);
        if (!isPasswordMatching)
            throw new HttpException_1.HttpException(409, 'Password is not matching');
        const tokenData = this.createToken(findUser);
        const cookie = this.createCookie(tokenData);
        return { cookie, findUser };
    }
    async userLogOut(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 'userId is empty');
        const findUser = await users_entity_1.UserEntity.findOne({ where: { id: userId } });
        if (!findUser)
            throw new HttpException_1.HttpException(409, "User doesn't exist");
        return findUser;
    }
    createToken(user) {
        const dataStoredInToken = { id: user.id };
        const secretKey = _config_1.SECRET_KEY;
        const expiresIn = 60 * 60;
        return { expiresIn, token: (0, jsonwebtoken_1.sign)(dataStoredInToken, secretKey, { expiresIn }) };
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
    }
};
AuthRepository = tslib_1.__decorate([
    (0, typeorm_1.EntityRepository)(users_entity_1.UserEntity)
], AuthRepository);
exports.default = AuthRepository;
//# sourceMappingURL=auth.repository.js.map
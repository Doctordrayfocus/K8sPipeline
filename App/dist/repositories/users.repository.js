"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcrypt_1 = require("bcrypt");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("@entities/users.entity");
const HttpException_1 = require("@exceptions/HttpException");
const util_1 = require("@utils/util");
let UserRepository = class UserRepository {
    async userFindAll() {
        const users = await users_entity_1.UserEntity.find();
        return users;
    }
    async userFindById(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 'UserId is empty');
        const user = await users_entity_1.UserEntity.findOne({ where: { id: userId } });
        if (!user)
            throw new HttpException_1.HttpException(409, "User doesn't exist");
        return user;
    }
    async userCreate(userData) {
        if ((0, util_1.isEmpty)(userData))
            throw new HttpException_1.HttpException(400, 'userData is empty');
        const findUser = await users_entity_1.UserEntity.findOne({ where: { email: userData.email } });
        if (findUser)
            throw new HttpException_1.HttpException(409, `This email ${userData.email} already exists`);
        const hashedPassword = await (0, bcrypt_1.hash)(userData.password, 10);
        const createUserData = await users_entity_1.UserEntity.create(Object.assign(Object.assign({}, userData), { password: hashedPassword })).save();
        return createUserData;
    }
    async userUpdate(userId, userData) {
        if ((0, util_1.isEmpty)(userData))
            throw new HttpException_1.HttpException(400, 'userData is empty');
        const findUser = await users_entity_1.UserEntity.findOne({ where: { id: userId } });
        if (!findUser)
            throw new HttpException_1.HttpException(409, "User doesn't exist");
        const hashedPassword = await (0, bcrypt_1.hash)(userData.password, 10);
        await users_entity_1.UserEntity.update(userId, Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        const updateUser = await users_entity_1.UserEntity.findOne({ where: { id: userId } });
        return updateUser;
    }
    async userDelete(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, "User doesn't existId");
        const findUser = await users_entity_1.UserEntity.findOne({ where: { id: userId } });
        if (!findUser)
            throw new HttpException_1.HttpException(409, "User doesn't exist");
        await users_entity_1.UserEntity.delete({ id: userId });
        return findUser;
    }
};
UserRepository = tslib_1.__decorate([
    (0, typeorm_1.EntityRepository)()
], UserRepository);
exports.default = UserRepository;
//# sourceMappingURL=users.repository.js.map
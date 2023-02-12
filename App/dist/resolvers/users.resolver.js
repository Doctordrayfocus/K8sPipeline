"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = void 0;
const tslib_1 = require("tslib");
const users_repository_1 = tslib_1.__importDefault(require("@repositories/users.repository"));
class userResolver extends users_repository_1.default {
    async getUsers() {
        const users = await this.userFindAll();
        return users;
    }
    async getUserById(userId) {
        const user = await this.userFindById(userId);
        return user;
    }
    async createUser(userData) {
        const user = await this.userCreate(userData);
        return user;
    }
    async updateUser(userId, userData) {
        const user = await this.userUpdate(userId, userData);
        return user;
    }
    async deleteUser(userId) {
        const user = await this.userDelete(userId);
        return user;
    }
}
exports.userResolver = userResolver;
//# sourceMappingURL=users.resolver.js.map
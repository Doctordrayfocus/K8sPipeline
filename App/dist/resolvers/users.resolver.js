"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "userResolver", {
    enumerable: true,
    get: ()=>userResolver
});
const _usersRepository = _interopRequireDefault(require("../repositories/users.repository"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let userResolver = class userResolver extends _usersRepository.default {
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
};

//# sourceMappingURL=users.resolver.js.map
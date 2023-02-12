"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResolver = void 0;
const tslib_1 = require("tslib");
const auth_repository_1 = tslib_1.__importDefault(require("@repositories/auth.repository"));
class authResolver extends auth_repository_1.default {
    async signup(userData) {
        const user = await this.userSignUp(userData);
        return user;
    }
    async login(userData) {
        const { findUser } = await this.userLogIn(userData);
        return findUser;
    }
    async logout(userData) {
        const user = await this.userLogOut(userData);
        return user;
    }
}
exports.authResolver = authResolver;
//# sourceMappingURL=auth.resolver.js.map
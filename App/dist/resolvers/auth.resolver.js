"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "authResolver", {
    enumerable: true,
    get: ()=>authResolver
});
const _authRepository = _interopRequireDefault(require("../repositories/auth.repository"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let authResolver = class authResolver extends _authRepository.default {
    async signup(userData) {
        const user = await this.userSignUp(userData);
        return user;
    }
    async login(userData) {
        const { findUser  } = await this.userLogIn(userData);
        return findUser;
    }
    async logout(userData) {
        const user = await this.userLogOut(userData);
        return user;
    }
};

//# sourceMappingURL=auth.resolver.js.map
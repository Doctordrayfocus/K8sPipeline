"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authChecker = exports.authMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const _config_1 = require("@config");
const users_entity_1 = require("@entities/users.entity");
const HttpException_1 = require("@exceptions/HttpException");
const authMiddleware = async (req) => {
    try {
        const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
        if (Authorization) {
            const secretKey = _config_1.SECRET_KEY;
            const { id } = (await (0, jsonwebtoken_1.verify)(Authorization, secretKey));
            const userRepository = (0, typeorm_1.getRepository)(users_entity_1.UserEntity);
            const findUser = await userRepository.findOne(id, { select: ['id', 'email', 'password'] });
            return findUser;
        }
        return null;
    }
    catch (error) {
        throw new HttpException_1.HttpException(401, 'Wrong authentication token');
    }
};
exports.authMiddleware = authMiddleware;
const authChecker = async ({ context: { user } }) => {
    if (!user) {
        throw new HttpException_1.HttpException(404, 'Authentication token missing');
    }
    return true;
};
exports.authChecker = authChecker;
//# sourceMappingURL=auth.middleware.js.map
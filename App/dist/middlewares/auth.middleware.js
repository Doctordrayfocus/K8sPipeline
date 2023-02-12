"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    authMiddleware: ()=>authMiddleware,
    authChecker: ()=>authChecker
});
const _jsonwebtoken = require("jsonwebtoken");
const _typeorm = require("typeorm");
const _config = require("../config");
const _usersEntity = require("../entities/users.entity");
const _httpException = require("../exceptions/HttpException");
const authMiddleware = async (req)=>{
    try {
        const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
        if (Authorization) {
            const secretKey = _config.SECRET_KEY;
            const { id  } = await (0, _jsonwebtoken.verify)(Authorization, secretKey);
            const userRepository = (0, _typeorm.getRepository)(_usersEntity.UserEntity);
            const findUser = await userRepository.findOne(id, {
                select: [
                    'id',
                    'email',
                    'password'
                ]
            });
            return findUser;
        }
        return null;
    } catch (error) {
        throw new _httpException.HttpException(401, 'Wrong authentication token');
    }
};
const authChecker = async ({ context: { user  }  })=>{
    if (!user) {
        throw new _httpException.HttpException(404, 'Authentication token missing');
    }
    return true;
};

//# sourceMappingURL=auth.middleware.js.map
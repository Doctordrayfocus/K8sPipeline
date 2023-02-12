"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>AuthStrategyRepository
});
const _authStrategyEntity = require("../entities/authStrategy.entity");
const _typeorm = require("typeorm");
const _passport = _interopRequireDefault(require("passport"));
const _passportGithub2 = require("passport-github2");
const _config = require("../config");
const _passportGitlab2 = require("passport-gitlab2");
const _passportBitbucketOauth2 = require("passport-bitbucket-oauth2");
const _passportOauth2Refresh = _interopRequireDefault(require("passport-oauth2-refresh"));
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
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
var __decorate = (void 0) && (void 0).__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let AuthStrategyRepository = class AuthStrategyRepository {
    saveAuthStrategy(accessToken, refreshToken, profileId, type) {
        const strategyData = {
            access_token: accessToken,
            profileId: profileId,
            refresh_token: refreshToken,
            type
        };
        _authStrategyEntity.AuthStrategyEntity.find({
            where: [
                {
                    profileId: profileId
                }
            ]
        }).then((strategy)=>{
            if (strategy.length > 0) {
                strategy[0].access_token = strategyData.access_token;
                strategy[0].refresh_token = strategyData.refresh_token;
                strategy[0].type = strategyData.type;
                strategy[0].save();
            } else {
                _authStrategyEntity.AuthStrategyEntity.create(_objectSpread({}, strategyData)).save().then(()=>{
                    console.log(`${type} strategy saved`);
                }).catch((error)=>{
                    console.log(error);
                });
            }
        });
    }
    configureGithub() {
        _passport.default.use(new _passportGithub2.GitLabStrategy({
            clientID: _config.GITHUB_CLIENT_ID,
            clientSecret: _config.GITHUB_CLIENT_SECRET,
            callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
        }, (accessToken, refreshToken, profile)=>{
            this.saveAuthStrategy(accessToken, refreshToken, profile.id, 'github');
        }));
    }
    configureGitlab() {
        _passport.default.use(new _passportGitlab2.Strategy({
            clientID: _config.GITLAB_APP_ID,
            clientSecret: _config.GITLAB_APP_SECRET,
            callbackURL: 'http://localhost:3000/auth/gitlab/callback'
        }, (accessToken, refreshToken, profile)=>{
            this.saveAuthStrategy(accessToken, refreshToken, profile.id, 'gitlab');
        }));
    }
    configureBitbucket() {
        const strategy = new _passportBitbucketOauth2.Strategy({
            clientID: _config.BITBUCKET_CLIENT_ID,
            clientSecret: _config.BITBUCKET_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/bitbucket/callback'
        }, (accessToken, refreshToken, profile)=>{
            this.saveAuthStrategy(accessToken, refreshToken, profile.username, 'bitbucket');
        });
        _passport.default.use(strategy);
        _passportOauth2Refresh.default.use(strategy);
    }
    authenticateStategy(type) {
        if (type == 'github') {
            this.configureGithub();
            return _passport.default.authenticate('github', {
                scope: [
                    'repo'
                ]
            });
        }
        if (type == 'gitlab') {
            this.configureGitlab();
            return _passport.default.authenticate('gitlab', {
                scope: [
                    'api'
                ]
            });
        }
        if (type == 'bitbucket') {
            this.configureBitbucket();
            return _passport.default.authenticate('bitbucket', {
                scope: [
                    'repository:admin',
                    'webhook'
                ]
            });
        }
    }
    handleGithubCallback(type) {
        if (type == 'github') {
            this.configureGithub();
            return _passport.default.authenticate('github', {
                failureRedirect: '/'
            });
        }
        if (type == 'gitlab') {
            this.configureGitlab();
            return _passport.default.authenticate('gitlab', {
                failureRedirect: '/'
            });
        }
        if (type == 'bitbucket') {
            this.configureBitbucket();
            return _passport.default.authenticate('bitbucket', {
                failureRedirect: '/'
            });
        }
    }
    constructor(){
        this.requestNewAccessToken = (strategy, refreshToken)=>{
            return new Promise((resolve)=>{
                _passportOauth2Refresh.default.requestNewAccessToken(strategy, refreshToken, (err, accessToken)=>{
                    resolve(accessToken);
                });
            });
        };
    }
};
AuthStrategyRepository = __decorate([
    (0, _typeorm.EntityRepository)(_authStrategyEntity.AuthStrategyEntity)
], AuthStrategyRepository);

//# sourceMappingURL=authStrategy.repository.js.map
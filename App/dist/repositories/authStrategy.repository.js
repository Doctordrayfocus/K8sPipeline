"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const authStrategy_entity_1 = require("@/entities/authStrategy.entity");
const typeorm_1 = require("typeorm");
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
const config_1 = require("@/config");
const passport_gitlab2_1 = require("passport-gitlab2");
const passport_bitbucket_oauth2_1 = require("passport-bitbucket-oauth2");
const passport_oauth2_refresh_1 = tslib_1.__importDefault(require("passport-oauth2-refresh"));
let AuthStrategyRepository = class AuthStrategyRepository {
    constructor() {
        this.requestNewAccessToken = (strategy, refreshToken) => {
            return new Promise(resolve => {
                passport_oauth2_refresh_1.default.requestNewAccessToken(strategy, refreshToken, (err, accessToken) => {
                    resolve(accessToken);
                });
            });
        };
    }
    saveAuthStrategy(accessToken, refreshToken, profileId, type) {
        const strategyData = {
            access_token: accessToken,
            profileId: profileId,
            refresh_token: refreshToken,
            type,
        };
        authStrategy_entity_1.AuthStrategyEntity.find({
            where: [
                {
                    profileId: profileId,
                },
            ],
        }).then(strategy => {
            if (strategy.length > 0) {
                strategy[0].access_token = strategyData.access_token;
                strategy[0].refresh_token = strategyData.refresh_token;
                strategy[0].type = strategyData.type;
                strategy[0].save();
            }
            else {
                authStrategy_entity_1.AuthStrategyEntity.create(Object.assign({}, strategyData))
                    .save()
                    .then(() => {
                    console.log(`${type} strategy saved`);
                })
                    .catch(error => {
                    console.log(error);
                });
            }
        });
    }
    configureGithub() {
        passport_1.default.use(new passport_github2_1.GitLabStrategy({
            clientID: config_1.GITHUB_CLIENT_ID,
            clientSecret: config_1.GITHUB_CLIENT_SECRET,
            callbackURL: 'http://127.0.0.1:3000/auth/github/callback',
        }, (accessToken, refreshToken, profile) => {
            this.saveAuthStrategy(accessToken, refreshToken, profile.id, 'github');
        }));
    }
    configureGitlab() {
        passport_1.default.use(new passport_gitlab2_1.Strategy({
            clientID: config_1.GITLAB_APP_ID,
            clientSecret: config_1.GITLAB_APP_SECRET,
            callbackURL: 'http://localhost:3000/auth/gitlab/callback',
        }, (accessToken, refreshToken, profile) => {
            this.saveAuthStrategy(accessToken, refreshToken, profile.id, 'gitlab');
        }));
    }
    configureBitbucket() {
        const strategy = new passport_bitbucket_oauth2_1.Strategy({
            clientID: config_1.BITBUCKET_CLIENT_ID,
            clientSecret: config_1.BITBUCKET_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/bitbucket/callback',
        }, (accessToken, refreshToken, profile) => {
            this.saveAuthStrategy(accessToken, refreshToken, profile.username, 'bitbucket');
        });
        passport_1.default.use(strategy);
        passport_oauth2_refresh_1.default.use(strategy);
    }
    authenticateStategy(type) {
        if (type == 'github') {
            this.configureGithub();
            return passport_1.default.authenticate('github', { scope: ['repo'] });
        }
        if (type == 'gitlab') {
            this.configureGitlab();
            return passport_1.default.authenticate('gitlab', { scope: ['api'] });
        }
        if (type == 'bitbucket') {
            this.configureBitbucket();
            return passport_1.default.authenticate('bitbucket', { scope: ['repository:admin', 'webhook'] });
        }
    }
    handleGithubCallback(type) {
        if (type == 'github') {
            this.configureGithub();
            return passport_1.default.authenticate('github', { failureRedirect: '/' });
        }
        if (type == 'gitlab') {
            this.configureGitlab();
            return passport_1.default.authenticate('gitlab', { failureRedirect: '/' });
        }
        if (type == 'bitbucket') {
            this.configureBitbucket();
            return passport_1.default.authenticate('bitbucket', { failureRedirect: '/' });
        }
    }
};
AuthStrategyRepository = tslib_1.__decorate([
    (0, typeorm_1.EntityRepository)(authStrategy_entity_1.AuthStrategyEntity)
], AuthStrategyRepository);
exports.default = AuthStrategyRepository;
//# sourceMappingURL=authStrategy.repository.js.map
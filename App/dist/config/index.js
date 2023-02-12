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
    CREDENTIALS: ()=>CREDENTIALS,
    ORIGIN: ()=>ORIGIN,
    NODE_ENV: ()=>NODE_ENV,
    PORT: ()=>PORT,
    DB_HOST: ()=>DB_HOST,
    DB_PORT: ()=>DB_PORT,
    DB_USER: ()=>DB_USER,
    DB_PASSWORD: ()=>DB_PASSWORD,
    DB_DATABASE: ()=>DB_DATABASE,
    SECRET_KEY: ()=>SECRET_KEY,
    LOG_FORMAT: ()=>LOG_FORMAT,
    LOG_DIR: ()=>LOG_DIR,
    GITHUB_CLIENT_ID: ()=>GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: ()=>GITHUB_CLIENT_SECRET,
    GITLAB_APP_ID: ()=>GITLAB_APP_ID,
    GITLAB_APP_SECRET: ()=>GITLAB_APP_SECRET,
    BITBUCKET_CLIENT_ID: ()=>BITBUCKET_CLIENT_ID,
    BITBUCKET_CLIENT_SECRET: ()=>BITBUCKET_CLIENT_SECRET,
    TEMPLATE_CONFIG_REPO_URL: ()=>TEMPLATE_CONFIG_REPO_URL,
    TEMPLATE_SYNC_INTERVAL: ()=>TEMPLATE_SYNC_INTERVAL
});
const _dotenv = require("dotenv");
(0, _dotenv.config)({
    path: `.env.${process.env.NODE_ENV || 'development'}.local`
});
const CREDENTIALS = process.env.CREDENTIALS === 'true';
const ORIGIN = process.env.ORIGIN === 'true';
const { NODE_ENV , PORT , DB_HOST , DB_PORT , DB_USER , DB_PASSWORD , DB_DATABASE , SECRET_KEY , LOG_FORMAT , LOG_DIR , GITHUB_CLIENT_ID , GITHUB_CLIENT_SECRET , GITLAB_APP_ID , GITLAB_APP_SECRET , BITBUCKET_CLIENT_ID , BITBUCKET_CLIENT_SECRET , TEMPLATE_CONFIG_REPO_URL , TEMPLATE_SYNC_INTERVAL  } = process.env;

//# sourceMappingURL=index.js.map
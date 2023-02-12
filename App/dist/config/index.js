"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATE_SYNC_INTERVAL = exports.TEMPLATE_CONFIG_REPO_URL = exports.BITBUCKET_CLIENT_SECRET = exports.BITBUCKET_CLIENT_ID = exports.GITLAB_APP_SECRET = exports.GITLAB_APP_ID = exports.GITHUB_CLIENT_SECRET = exports.GITHUB_CLIENT_ID = exports.LOG_DIR = exports.LOG_FORMAT = exports.SECRET_KEY = exports.DB_DATABASE = exports.DB_PASSWORD = exports.DB_USER = exports.DB_PORT = exports.DB_HOST = exports.PORT = exports.NODE_ENV = exports.ORIGIN = exports.CREDENTIALS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
exports.CREDENTIALS = process.env.CREDENTIALS === 'true';
exports.ORIGIN = process.env.ORIGIN === 'true';
_a = process.env, exports.NODE_ENV = _a.NODE_ENV, exports.PORT = _a.PORT, exports.DB_HOST = _a.DB_HOST, exports.DB_PORT = _a.DB_PORT, exports.DB_USER = _a.DB_USER, exports.DB_PASSWORD = _a.DB_PASSWORD, exports.DB_DATABASE = _a.DB_DATABASE, exports.SECRET_KEY = _a.SECRET_KEY, exports.LOG_FORMAT = _a.LOG_FORMAT, exports.LOG_DIR = _a.LOG_DIR, exports.GITHUB_CLIENT_ID = _a.GITHUB_CLIENT_ID, exports.GITHUB_CLIENT_SECRET = _a.GITHUB_CLIENT_SECRET, exports.GITLAB_APP_ID = _a.GITLAB_APP_ID, exports.GITLAB_APP_SECRET = _a.GITLAB_APP_SECRET, exports.BITBUCKET_CLIENT_ID = _a.BITBUCKET_CLIENT_ID, exports.BITBUCKET_CLIENT_SECRET = _a.BITBUCKET_CLIENT_SECRET, exports.TEMPLATE_CONFIG_REPO_URL = _a.TEMPLATE_CONFIG_REPO_URL, exports.TEMPLATE_SYNC_INTERVAL = _a.TEMPLATE_SYNC_INTERVAL;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const shelljs_1 = tslib_1.__importDefault(require("shelljs"));
const path_1 = tslib_1.__importDefault(require("path"));
const config_1 = require("@/config");
class TemplateSyncer {
    constructor() {
        this.syncRemoteFiles = () => {
            const configFolder = path_1.default.join(__dirname, `../`);
            // clone config repo on initiation
            shelljs_1.default.cd(configFolder).exec(`git clone ${config_1.TEMPLATE_CONFIG_REPO_URL} templates`);
            // sync repo in interval
            setInterval(async () => {
                shelljs_1.default.cd(configFolder).exec(`git pull origin main`);
            }, 1000 * parseInt(config_1.TEMPLATE_SYNC_INTERVAL));
        };
    }
}
exports.default = TemplateSyncer;
//# sourceMappingURL=TemplateSyncer.js.map
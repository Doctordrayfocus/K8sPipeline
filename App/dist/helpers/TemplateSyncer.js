"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>TemplateSyncer
});
const _shelljs = _interopRequireDefault(require("shelljs"));
const _path = _interopRequireDefault(require("path"));
const _config = require("../config");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let TemplateSyncer = class TemplateSyncer {
    constructor(){
        this.syncRemoteFiles = ()=>{
            const configFolder = _path.default.join(__dirname, `../`);
            _shelljs.default.cd(configFolder).exec(`git clone ${_config.TEMPLATE_CONFIG_REPO_URL} templates`);
            setInterval(async ()=>{
                _shelljs.default.cd(configFolder).exec(`git pull`);
            }, 1000 * parseInt(_config.TEMPLATE_SYNC_INTERVAL));
        };
    }
};

//# sourceMappingURL=TemplateSyncer.js.map
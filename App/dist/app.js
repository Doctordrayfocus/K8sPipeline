"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
require("reflect-metadata");
const _express4 = require("@apollo/server/express4");
const _drainHttpServer = require("@apollo/server/plugin/drainHttpServer");
const _server = require("@apollo/server");
const _compression = _interopRequireDefault(require("compression"));
const _cookieParser = _interopRequireDefault(require("cookie-parser"));
const _cors = _interopRequireDefault(require("cors"));
const _express = _interopRequireDefault(require("express"));
const _helmet = _interopRequireDefault(require("helmet"));
const _hpp = _interopRequireDefault(require("hpp"));
const _typeorm = require("typeorm");
const _config = require("./config");
const _databases = require("./databases");
const _errorMiddleware = _interopRequireDefault(require("./middlewares/error.middleware"));
const _logger = require("./utils/logger");
const _authStrategyRepository = _interopRequireDefault(require("./repositories/authStrategy.repository"));
const _pipelineRepository = _interopRequireDefault(require("./repositories/pipeline.repository"));
const _templateSyncer = _interopRequireDefault(require("./helpers/TemplateSyncer"));
const _socketIo = require("socket.io");
const _http = _interopRequireDefault(require("http"));
const _bodyParser = require("body-parser");
const _typedefs = require("./typedefs/index");
const _resolvers = require("./resolvers/index");
const _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let App = class App {
    async listen() {
        this.httpServer.listen(this.port, ()=>{
            _logger.logger.info(`=================================`);
            _logger.logger.info(`======= ENV: ${this.env} =======`);
            _logger.logger.info(`🚀 App listening on the port ${this.port}`);
            _logger.logger.info(`🎮 http://localhost:${this.port}/graphql`);
            _logger.logger.info(`=================================`);
        });
    }
    getServer() {
        return this.app;
    }
    registerRestRoute() {
        try {
            const authStrategyRepo = new _authStrategyRepository.default();
            const pipelineRepo = new _pipelineRepository.default();
            this.app.get('/auth/bitbucket', authStrategyRepo.authenticateStategy('bitbucket'));
            this.app.get('/auth/bitbucket/callback', authStrategyRepo.handleGithubCallback('bitbucket'), (req, res)=>{
                res.sendFile(__dirname + '/static/close.html');
            });
            this.app.get('/testing', async (req, res)=>{
                try {
                    const pipelineData = await pipelineRepo.getPipelines();
                    return res.send(pipelineData);
                } catch (error) {
                    console.log(error);
                }
            });
            this.app.use(_express.default.static(_path.default.join(__dirname, '../frontend/dist')));
            this.app.get('/*', (req, res)=>{
                res.sendFile(_path.default.join(__dirname, '../frontend/dist/index.html'));
            });
        } catch (error) {
            console.error(error);
        }
    }
    connectToDatabase() {
        (0, _typeorm.createConnection)(_databases.dbConnection).then(()=>{
            console.log('DB connection successful');
        }).catch((error)=>{
            console.log(error);
        });
    }
    initializeMiddlewares() {
        if (this.env === 'production') {
            this.app.use((0, _hpp.default)());
            this.app.use((0, _helmet.default)());
        }
        this.app.use((0, _cors.default)({
            origin: _config.ORIGIN,
            credentials: _config.CREDENTIALS
        }));
        this.app.use((0, _compression.default)());
        this.app.use(_express.default.json());
        this.app.use(_express.default.urlencoded({
            extended: true
        }));
        this.app.use((0, _cookieParser.default)());
    }
    async initApolloServer() {
        try {
            const apolloServer = new _server.ApolloServer({
                resolvers: _resolvers.resolvers,
                typeDefs: _typedefs.typeDefs,
                plugins: [
                    (0, _drainHttpServer.ApolloServerPluginDrainHttpServer)({
                        httpServer: this.httpServer
                    })
                ],
                formatError: (error)=>{
                    (0, _logger.errorLogger)(error);
                    return error;
                }
            });
            await apolloServer.start().then(()=>{
                console.log('Apollo Server connected');
            }).catch((error)=>{
                console.log(error);
            });
            this.app.use('/graphql', (0, _cors.default)(), (0, _bodyParser.json)(), (0, _express4.expressMiddleware)(apolloServer, {
                context: async ({ req  })=>({
                        token: req.headers.token
                    })
            }));
        } catch (error) {
            console.log(error);
        }
    }
    initializeErrorHandling() {
        this.app.use(_errorMiddleware.default);
    }
    constructor(){
        this.syncAppTemplate = ()=>{
            const templateSyncer = new _templateSyncer.default();
            templateSyncer.syncRemoteFiles();
        };
        this.setSocketServe = ()=>{
            this.httpServer = _http.default.createServer(this.app);
            this.socketIo = new _socketIo.Server(this.httpServer);
            global.SocketServer = this.socketIo;
            this.socketIo.on('connection', ()=>{
                console.log('a user connected');
            });
        };
        this.app = (0, _express.default)();
        this.env = _config.NODE_ENV || 'development';
        this.port = _config.PORT || 8080;
        this.connectToDatabase();
        this.setSocketServe();
        this.initializeMiddlewares();
        this.initApolloServer();
        this.initializeErrorHandling();
        this.registerRestRoute();
        this.syncAppTemplate();
    }
};
const _default = App;

//# sourceMappingURL=app.js.map
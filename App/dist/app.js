"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const server_1 = require("@apollo/server");
const compression_1 = tslib_1.__importDefault(require("compression"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const express_1 = tslib_1.__importDefault(require("express"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const hpp_1 = tslib_1.__importDefault(require("hpp"));
const typeorm_1 = require("typeorm");
const _config_1 = require("@config");
const _databases_1 = require("@databases");
const error_middleware_1 = tslib_1.__importDefault(require("@middlewares/error.middleware"));
const logger_1 = require("@utils/logger");
const authStrategy_repository_1 = tslib_1.__importDefault(require("./repositories/authStrategy.repository"));
const pipeline_repository_1 = tslib_1.__importDefault(require("./repositories/pipeline.repository"));
const TemplateSyncer_1 = tslib_1.__importDefault(require("./helpers/TemplateSyncer"));
const socket_io_1 = require("socket.io");
const http_1 = tslib_1.__importDefault(require("http"));
const body_parser_1 = require("body-parser");
const typedefs_1 = require("./typedefs");
const resolvers_1 = require("./resolvers");
const path_1 = tslib_1.__importDefault(require("path"));
class App {
    constructor() {
        this.syncAppTemplate = () => {
            const templateSyncer = new TemplateSyncer_1.default();
            templateSyncer.syncRemoteFiles();
        };
        this.setSocketServe = () => {
            this.httpServer = http_1.default.createServer(this.app);
            this.socketIo = new socket_io_1.Server(this.httpServer);
            global.SocketServer = this.socketIo;
            this.socketIo.on('connection', () => {
                console.log('a user connected');
            });
        };
        this.app = (0, express_1.default)();
        this.env = _config_1.NODE_ENV || 'development';
        this.port = _config_1.PORT || 8080;
        this.connectToDatabase();
        this.setSocketServe();
        this.initializeMiddlewares();
        this.initApolloServer();
        this.initializeErrorHandling();
        this.registerRestRoute();
        this.syncAppTemplate();
    }
    async listen() {
        this.httpServer.listen(this.port, () => {
            logger_1.logger.info(`=================================`);
            logger_1.logger.info(`======= ENV: ${this.env} =======`);
            logger_1.logger.info(`🚀 App listening on the port ${this.port}`);
            logger_1.logger.info(`🎮 http://localhost:${this.port}/graphql`);
            logger_1.logger.info(`=================================`);
        });
    }
    getServer() {
        return this.app;
    }
    registerRestRoute() {
        try {
            const authStrategyRepo = new authStrategy_repository_1.default();
            const pipelineRepo = new pipeline_repository_1.default();
            this.app.get('/auth/bitbucket', authStrategyRepo.authenticateStategy('bitbucket'));
            // this.app.get('/auth/giblab', authStrategyRepo.authenticateStategy('gitlab'));
            // this.app.get('/auth/github', authStrategyRepo.authenticateStategy('github'));
            this.app.get('/auth/bitbucket/callback', authStrategyRepo.handleGithubCallback('bitbucket'), (req, res) => {
                res.sendFile(__dirname + '/static/close.html');
            });
            this.app.get('/testing', async (req, res) => {
                // return pipelineRepo.getRepositoryBranches('cc-portfolio', 'RoofWallet', res);
                try {
                    const pipelineData = await pipelineRepo.getPipelines();
                    return res.send(pipelineData);
                }
                catch (error) {
                    console.log(error);
                }
            });
            // this.app.post('/auth/giblab/callback', authStrategyRepo.handleGithubCallback('gitlab'), (req, res) => {
            //   res.sendFile('../static/close.html');
            // });
            // this.app.post('/auth/github/callback', authStrategyRepo.handleGithubCallback('github'), (req, res) => {
            //   res.sendFile('../static/close.html');
            // });
            this.app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend/dist')));
            this.app.get('/*', (req, res) => {
                res.sendFile(path_1.default.join(__dirname, '../frontend/dist/index.html'));
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    connectToDatabase() {
        (0, typeorm_1.createConnection)(_databases_1.dbConnection)
            .then(() => {
            console.log('DB connection successful');
        })
            .catch(error => {
            console.log(error);
        });
    }
    initializeMiddlewares() {
        if (this.env === 'production') {
            this.app.use((0, hpp_1.default)());
            this.app.use((0, helmet_1.default)());
        }
        this.app.use((0, cors_1.default)({ origin: _config_1.ORIGIN, credentials: _config_1.CREDENTIALS }));
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cookie_parser_1.default)());
    }
    async initApolloServer() {
        try {
            const apolloServer = new server_1.ApolloServer({
                resolvers: resolvers_1.resolvers,
                typeDefs: typedefs_1.typeDefs,
                plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer: this.httpServer })],
                formatError: error => {
                    (0, logger_1.errorLogger)(error);
                    return error;
                },
            });
            await apolloServer
                .start()
                .then(() => {
                console.log('Apollo Server connected');
            })
                .catch(error => {
                console.log(error);
            });
            this.app.use('/graphql', (0, cors_1.default)(), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(apolloServer, {
                context: async ({ req }) => ({ token: req.headers.token }),
            }));
        }
        catch (error) {
            console.log(error);
        }
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.default);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map
import 'reflect-metadata';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServer } from '@apollo/server';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
// import helmet from 'helmet';
// import hpp from 'hpp';
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from './config';
import { dbConnection } from './databases';
import errorMiddleware from './middlewares/error.middleware';
import { logger, errorLogger } from './utils/logger';
import AuthStrategyRepository from './repositories/authStrategy.repository';
import PipelineRepository from './repositories/pipeline.repository';
import TemplateSyncer from './helpers/TemplateSyncer';
import { Server } from 'socket.io';
import http from 'http';
import { json } from 'body-parser';
import { typeDefs } from './typedefs';
import { resolvers } from './resolvers';
import path from 'path';
import WebhookHandler from './helpers/WebhookHandler';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      SocketServer: Server;
    }
  }
}

interface MyContext {
  token?: String;
}

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public socketIo: Server;
  public httpServer: http.Server;

  constructor() {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 8080;

    this.connectToDatabase();
    this.setSocketServe();
    this.initializeMiddlewares();
    this.initApolloServer();
    this.initializeErrorHandling();
    this.registerRestRoute();
    // this.syncAppTemplate();
  }

  public async listen() {
    this.httpServer.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`🎮 http://localhost:${this.port}/graphql`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private syncAppTemplate = () => {
    const templateSyncer = new TemplateSyncer();

    templateSyncer.syncRemoteFiles();
  };

  private setSocketServe = () => {
    this.httpServer = http.createServer(this.app);
    this.socketIo = new Server(this.httpServer);
    global.SocketServer = this.socketIo;
  };

  private registerRestRoute() {
    try {
      const authStrategyRepo = new AuthStrategyRepository();
      const pipelineRepo = new PipelineRepository();

      this.app.get('/auth/bitbucket', authStrategyRepo.authenticateStategy('bitbucket'));

      const webhookHandler = new WebhookHandler();
      this.app.post('/bitbucket-webhook', async (req, res) => {
        try {
          await webhookHandler.bitbucket(req.body);
          res.send('done');
        } catch (error) {
          console.error(error);
        }
      });

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
        } catch (error) {
          console.log(error);
        }
      });

      // this.app.post('/auth/giblab/callback', authStrategyRepo.handleGithubCallback('gitlab'), (req, res) => {
      //   res.sendFile('../static/close.html');
      // });
      // this.app.post('/auth/github/callback', authStrategyRepo.handleGithubCallback('github'), (req, res) => {
      //   res.sendFile('../static/close.html');
      // });

      this.app.get('/testing', (req, res) => {
        res.send('Testing');
      });

      this.app.post('/update-build', async (req, res) => {
        await pipelineRepo.updatePipelineBuild(req.body);
        res.send('Build updated');
      });

      this.app.use(express.static(path.join(__dirname, '../frontend/dist')));

      this.app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
      });
    } catch (error) {
      console.error(error);
    }
  }

  private connectToDatabase() {
    dbConnection
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch(err => {
        console.error('Error during Data Source initialization', err);
      });
  }

  private initializeMiddlewares() {
    // if (this.env === 'production') {
    //   this.app.use(hpp());
    //   this.app.use(helmet());
    // }

    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private async initApolloServer() {
    try {
      const apolloServer = new ApolloServer<MyContext>({
        resolvers: resolvers,
        typeDefs: typeDefs,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer })],
        formatError: error => {
          errorLogger(error);

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
      this.app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        json(),
        expressMiddleware(apolloServer, {
          context: async ({ req }) => ({ token: req.headers.token }),
        }),
      );
    } catch (error) {
      console.log(error);
    }
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;

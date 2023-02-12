"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const path_1 = require("path");
const _config_1 = require("@config");
exports.dbConnection = {
    type: 'mysql',
    host: _config_1.DB_HOST,
    port: parseInt(_config_1.DB_PORT),
    username: _config_1.DB_USER,
    password: _config_1.DB_PASSWORD,
    database: _config_1.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [(0, path_1.join)(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [(0, path_1.join)(__dirname, '../**/*.migration{.ts,.js}')],
    subscribers: [(0, path_1.join)(__dirname, '../**/*.subscriber{.ts,.js}')],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
    },
};
//# sourceMappingURL=index.js.map
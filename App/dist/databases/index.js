"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "dbConnection", {
    enumerable: true,
    get: ()=>dbConnection
});
const _path = require("path");
const _config = require("../config");
const dbConnection = {
    type: 'mysql',
    host: _config.DB_HOST,
    port: parseInt(_config.DB_PORT),
    username: _config.DB_USER,
    password: _config.DB_PASSWORD,
    database: _config.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        (0, _path.join)(__dirname, '../**/*.entity{.ts,.js}')
    ],
    migrations: [
        (0, _path.join)(__dirname, '../**/*.migration{.ts,.js}')
    ],
    subscribers: [
        (0, _path.join)(__dirname, '../**/*.subscriber{.ts,.js}')
    ],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber'
    }
};

//# sourceMappingURL=index.js.map
import * as Hapi from '@hapi/hapi';
import { Model, Sequelize } from 'sequelize';
import { getRoutes } from './api/v1/routes';
import { user } from './models/userModel';


const port = 8000;
export const server: Hapi.Server = new Hapi.Server({
    host: 'localhost',
    port: port
});

export const sequelize = new Sequelize({
    database: 'usersdb',
    dialect: 'postgres',
    username: 'jakub',
    password: '1234',
    port: 2003,
});

export class User extends Model { }
User.init(user, { sequelize, modelName: 'Users' });

async function initializeDb() {
    await sequelize.sync({ alter: true });
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

const routes = getRoutes();
console.log(routes)

server.route(routes, {
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        },
    },
});

const startServer = async () => {
    try {
        await initializeDb();
        await server.start();

        console.log("Server listening on Port:", port);

    } catch (err) {
        console.log(err);
    }
}
startServer();
export const startDate = Date();
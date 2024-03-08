'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';


class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/kinalShop/v1/users';
        this.userPath = '/kinalShop/v1/auth';

        this.connectDB();
        this.middlewares();

    }

    middlewares(){
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    async connectDB(){
        await dbConnection();
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }
}

export default Server;
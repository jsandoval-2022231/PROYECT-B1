const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');
const exp = require('constants');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.connectDB();
        this.middlewares();
    }

    middlewares(){
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
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

module.exports = Server;
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? ".env.test" : '.env'
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

class ApplicationController {
    constructor() {
        this.express = express();

        mongoose.connect(
            `mongodb://localhost:27017/${process.env.DB_NAME}`,
            { useNewUrlParser: true, useUnifiedTopology: true },
        );

        this.middlewares();
        this.routes();
        this.websocket();
    }

    middlewares() {
        this.express.use(cors());
        this.express.use(express.json());
    }

    routes() {
        this.express.use(require('../routes'));
        this.express.use('/results', express.static('results'));
    }

    websocket() {
        this.server = require('http').createServer(this.express);
        const io = require('socket.io')(this.server, {origins: '*:*'});

        io.on('connection', socket => {
            console.log(socket.id)

            socket.on('disconnect', () => {
                console.log('Connection closed!');
            })
        });

        // server.listen(8080);
    }
}

module.exports = new ApplicationController();
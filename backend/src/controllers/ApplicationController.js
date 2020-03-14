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
    }

    middlewares() {
        this.express.use(cors());
        this.express.use(express.json());
    }

    routes() {
        this.express.use(require('../routes'));
        this.express.use('/results', express.static('results'));
    }
}

module.exports = new ApplicationController().express;
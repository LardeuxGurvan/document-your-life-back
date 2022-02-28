const { config } = require('dotenv');
const { Pool } = require('pg');

config = {};

if (process.env.NODE_ENV === 'production') {
    config.connectionString = process.env.DATABASE_URL;
    config.ssl = {
        rejectUnauthorizid: false,
    };
}

const pool = new Pool(config);

module.exports = {
    originalClient: pool,

    async query(...params) {
        console.log(...params);

        return this.originalClient.query(...params);
    },
};

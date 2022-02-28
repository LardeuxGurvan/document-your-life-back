const debug = require('debug')('SQL:log');
const { Pool } = require('pg');

const config = {};

if (process.env.NODE_ENV === 'production') {
    config.connectionString = process.env.DATABASE_URL;
    config.ssl = {
        rejectUnauthorized: false,
    };
}

const pool = new Pool(config);

module.exports = {
    originalClient: pool,

    async query(...params) {
        debug(...params);

        return this.originalClient.query(...params);
    },
};

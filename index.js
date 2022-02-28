const http = require('http');
const debug = require('debug')('app:server');
const app = require('./app');

const port = process.env.PORT ?? 3000;

const server = http.createServer(app);

server.listen(port, () => {
    debug(`Listening on http://localhost:${port}`);
});

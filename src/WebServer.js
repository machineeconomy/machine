const fs = require('fs');
const http = require('http');
const https = require('https');
const cors = require('cors')
const { log } = require('./Logger.js')

const app = require('express')();
let server;

const PORT = process.env.PORT
const NAME = process.env.NAME

if (!process.env.DEVELOPMENT) {
    server = https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/akita.einfach-iota.de/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/akita.einfach-iota.de/cert.pem', 'utf8'),
        ca: fs.readFileSync('/etc/letsencrypt/live/akita.einfach-iota.de/chain.pem', 'utf8')
    }, app);
} else {
    server = http.createServer(app);
}

app.use(cors())



module.exports = {
    router: app,
    WebServer: server
}

server.listen(PORT, function () {
    log(`Machine ${NAME} is ready and listening on port: ${PORT}`);
    status = "waiting_for_order"
});


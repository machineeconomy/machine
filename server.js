const dotenv = require('dotenv');
dotenv.config();
const path = require('path');

const { router } = require('./src/WebServer.js')
const { socketServer } = require('./src/WebSockets.js')
const { fetchAndBroadcastBalanceFrom, getNewIotaAddress, getCurrentAddress} = require('./src/WebTangle.js')
const { log } = require('./src/Logger.js')
const { getCurrentBalance, getCurrentIndex  } = require('./src/Database.js')

const NAME = process.env.NAME
const IS_PROVIDER = process.env.IS_PROVIDER
const PROVIDER_URL = process.env.PROVIDER_URL

router.get('/', (req, res) => res.sendFile(path.join(__dirname + '/frontend/index.html')));

router.post('/orders', function (request, response) {
    log("New incoming order... generate new address.")
    let address = getNewIotaAddress()

    // send reponse with address.
    response.send(address)
});

socketServer.on('connection', function (socket) {
    log(`User '${socket.id}' connected`);
    let object = {
        name: NAME,
        status: status
    }
    socketServer.emit('init', object);
    fetchAndBroadcastBalanceFrom(getCurrentAddress());
});





log(`Machine ${NAME} is booting.`)
log(`Machine is a ${IS_PROVIDER == "true" ? 'provider' : 'robot'}.`)
log(`Machine provider: ${PROVIDER_URL ? PROVIDER_URL : 'none'}`)
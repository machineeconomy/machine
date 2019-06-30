const dotenv = require('dotenv');
dotenv.config();

const { router } = require('./src/WebServer.js')
const { socketServer } = require('./src/WebSockets.js')
const { fetchAndBroadcastBalance, watchAddressOnNode } = require('./src/WebTangle.js')
const { log } = require('./src/Logger.js')

const iotaLibrary = require('@iota/core')

// Local node to connect to;
const provider = 'https://nodes.devnet.thetangle.org:443';

const iota = iotaLibrary.composeAPI({
    provider: provider
})

const NAME = process.env.NAME
const IS_PROVIDER = process.env.IS_PROVIDER
const PROVIDER_URL = process.env.PROVIDER_URL
const SEED = process.env.SEED;


router.get('/', (req, res) => res.send(`I AM ${NAME}`))

router.post('/orders', function (request, response) {
    log("New incoming order... generate new address.")

    // Generates and returns a new address by calling findTransactions until the first unused address is detected. 
    // This stops working after a snapshot.
    iota.getNewAddress(SEED)
        .then(address => {
            log("order address: " + address)
            let order = {
                address: address,
                name: NAME,
                status: "waiting_for_tx",
                message: 'Thank you for the order. Please transfer 1000 IOTA to this address.'
            }
            // Watch for incoming address.
            watchAddressOnNode(address);

            // send message to "orders" channel.
            socketServer.emit('status', order);
            // send reponse with address.
            response.send(address)


        })
        .catch(err => {
            console.log("getNewAddress error", err)
        })


});

socketServer.on('connection', function (socket) {
    log(`User '${socket.id}' connected`);
    let object = {
        name: NAME,
        status: status
    }
    socketServer.emit('init', object);
    fetchAndBroadcastBalance();
});


log(`Machine ${NAME} is booting.`)
log(`Machine is a ${IS_PROVIDER == "true" ? 'provider' : 'robot'}.`)
log(`Machine provider: ${PROVIDER_URL ? PROVIDER_URL : 'none'}`)
var app = require('express')();
var io = require('socket.io');
var server = require('http').createServer(app);
var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
var socket_path = '/socket';
var cors = require('cors')

let zmq = require('zeromq')
let sock = zmq.socket('sub')

// Connect to the devnet node's ZMQ port
sock.connect('tcp://zmq.devnet.iota.org:5556')

const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');

const iotaLibrary = require('@iota/core')

const PORT = process.env.PORT
const NAME = process.env.NAME

// if the machine has no proivder, this const is empty.
const PROVIDER_URL = process.env.PROVIDER_URL


let status = "booting";

var sio_server = io(server, {
    origins: allowedOrigins,
    path: socket_path
});

const SEED = process.env.SEED;

console.log("seed", SEED)

// Local node to connect to;
const provider = 'https://nodes.devnet.thetangle.org:443';

const iota = iotaLibrary.composeAPI({
    provider: provider
})

app.use(cors())

app.get('/', (req, res) => res.send(`I AM ${NAME}`))

app.get('/payout_service', (req, res) => {
    let payoutaddress = req.query.address
    transferIOTA(payoutaddress)
    res.send(`I AM ${NAME} and im sending transaction to ${payoutaddress}`)
})

app.post('/orders', function (request, response) {
    //var query1 = request.body.var1;
    // Generates and returns a new address by calling findTransactions until the first unused address is detected. 
    // This stops working after a snapshot.
    iota.getNewAddress(SEED)
        .then(address => {
            console.log("new order address: ", address)
            let order = {
                address: address,
                name: NAME,
                status: "waiting_for_tx",
                message: 'Thank you for the order. Please transfer 1000 IOTA to this address.'
            }
            // Watch for incoming address.
            watchAddressOnNode(address);
            // send message to "orders" channel. <-- why?
            sio_server.emit('status', order); // <-- why?
            // send reponse with address.
            response.send(address)
        })
        .catch(err => {
            console.log("getNewAddress error", err)
        })
});

var counter = 0;

var should_balance = 1;

var checkForBalanceUpdate = function (address) {
    watched_address = address
    var intervat = setInterval(function () {
        console.log("check for balance: ", address);
        counter++
        console.log("counter: ", counter);
        iota.getBalances([address], 100)
            .then(({ balances }) => {
                console.log("balance:", balances[0])
                let msg = {};

                if (balances[0] && balances[0] >= should_balance) {

                    // Check, if machine has a provider
                    if (PROVIDER_URL) {
                        // if yes - payout the provider
                        payoutService()
                        msg = {
                            status: "payout_provider",
                            message: 'The payment was successful. I will pay my provider!'
                        }
                    } else {
                        // if no, just start working
                        msg = {
                            status: "working",
                            message: 'The payment was successful. I go to work now!'
                        }
                    }
                    clearInterval(intervat);
                } else {
                    // send message every 5 checks (15 seconds)
                    if(counter % 5 == 0) {
                        msg = {
                            status: "waiting_for_tx",
                            message: '... still waiting for confirmation.'
                        }
                    }
                }
                // send update to websocket channel.
                sio_server.emit('status', msg);

            })
            .catch(err => {
                // handle error
                console.log("error getBalances: ", err);

            })
    }, 3000);
}

const watchAddressOnNode = function (address) {
    console.log("watchAddressOnNode")
    sock.subscribe('tx')
    sock.on('message', msg => {
        const data = msg.toString().split(' ') // Split to get topic & data

        if (data[0] == 'tx' && address.includes(data[2])) {
            console.log("tx on watched address", data[2])
            let msg = {
                status: "waiting_for_tx_confirm",
                message: 'The transaction has arrived. Wait for confirmation.'
            }
            sio_server.emit('status', msg);
            checkForBalanceUpdate(address)
        }
    })
}

const payoutService = function () {

    console.log("PROVIDER ORDER REQUEST: ", PROVIDER_URL)
    axios
        .post(PROVIDER_URL + "/orders/", {})
        .then(function (response) {
            console.log(response);
            if (response.status == 200) {
                let address = response.data;
                console.log("address", address)
                transferIOTA(address);
            }
        })
        .catch(function (error) {
            console.log("PROVIDER ORDER REQUEST ERROR: ", error)
        });

}

const transferIOTA = function (address) {
    console.log('send 1 iota to ', address);

    const transfers = [
        {
            address: address,
            value: 1, // 1 iota
            tag: "AKITA9MACHINE", // optional tag of `0-27` trytes
            message: "" // optional message in trytes
        }
    ];

    // Depth or how far to go for tip selection entry point.
    const depth = 3;

    // Difficulty of Proof-of-Work required to attach transaction to tangle.
    // Minimum value on mainnet is `14`, `7` on spamnet and `9` on devnet and other testnets.
    const minWeightMagnitude = 9;

    // Prepare a bundle and signs it.
    iota
        .prepareTransfers(SEED, transfers)
        .then(trytes => {
            // Persist trytes locally before sending to network.
            // This allows for reattachments and prevents key reuse if trytes can't
            // be recovered by querying the network after broadcasting.

            // Does tip selection, attaches to tangle by doing PoW and broadcasts.
            return iota.sendTrytes(trytes, depth, minWeightMagnitude);
        })
        .then(bundle => {
            console.log(
                `Published transaction with tail hash: ${bundle[0].hash}`
            );
            console.log(`Bundle: ${bundle}`);
            let msg = {
                status: "working",
                message: 'Send IOTA to the provider. I go to work now!'
            }
            sio_server.emit('status', msg);
        })
        .catch(err => {
            // handle errors here
            console.log("error sending transation: ", err)
        });
}

sio_server.on('connection', function (socket) {
    console.log('a user connected');
    iota.getAccountData(SEED, {
        start: 0,
        security: 2
    })
        .then(accountData => {
            const { balance } = accountData
            let object = {
                name: NAME,
                status: status,
                balance: balance
            }
            sio_server.emit('init', object);

        })
        .catch(err => {
            console.log("get machine account data error: ", err)
        })
});

server.listen(PORT, function () {
    console.log(`${NAME} listening on port: ${PORT}`);
    status = "waiting_for_order"
});


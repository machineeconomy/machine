//in node.js
var app = require('express')();
var io = require('socket.io');
var server = require('http').createServer(app);
var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
var socket_path = '/socket'; // you need this if you want to connect to something other than the default socket.io path
var cors = require('cors')

let zmq = require('zeromq')
let sock = zmq.socket('sub')

// Connect to the devnet node's ZMQ port
sock.connect('tcp://zmq.devnet.iota.org:5556')

const dotenv = require('dotenv');
dotenv.config();

const iotaLibrary = require('@iota/core')

const PORT = process.env.PORT
const NAME = process.env.NAME

let status = "booting";


var sio_server = io(server, {
    origins: allowedOrigins,
    path: socket_path
});

const { createAccount } = require('@iota/account')
const Converter = require('@iota/converter')

const SEED = process.env.SEED;

console.log("seed", SEED)

// Local node to connect to;
const provider = 'https://nodes.devnet.thetangle.org:443';

const iota = iotaLibrary.composeAPI({
    provider: provider
})

const account = createAccount({
    seed: Converter.trits(SEED),
    provider
});
console.log("account", account)

app.use(cors())


app.get('/', (req, res) => res.send(`I AM ${NAME}`))

app.post('/orders', function (request, response) {
    console.log("request");
    //var query1 = request.body.var1;
    let data = {
        name: "headphone"
    }

    console.log('a user ordered', data);
    account.generateCDA({
        timeoutAt: Math.floor(new Date('7-16-2186').getTime() / 1000), // Date in seconds
        expectedAmount: 1000,
        security: 2
    })
        .then(cda => {
            // Do something with the CDA
            console.log(JSON.stringify(cda, null, 1));
            let order = {
                payment_cda: cda,
                name: NAME,
                status: "waiting for payment",
                message: 'Thank you for the order. Please transfer 1000 IOTA to this address.'
            }
            sio_server.emit('orders', order);
            let address = cda.address;
            console.log("address", address)

            
            
            // TODO: WATCH ADDRESS AND EMIT TO "ORDERS"
            watchAddressOnNode(address);

            response.send(address)
            

        })
        .catch(error => {
            // Handle errors here
            console.log(error);
        })
});

var counter = 0;

var watched_address = '';

var should_balance = 1;

var checkForBalanceUpdate = function(address) {
    console.log("jetzt=", address)
    watched_address = address
    var intervat = setInterval(function () {
        console.log("check for balance: ", watched_address);
        counter++
        console.log("counter: ", counter);
        iota.getBalances([watched_address], 100)
            .then(({balances}) => {
                console.log("balance:", balances[0])
                if (balances[0] && balances[0] >= should_balance) {
                    let msg = {
                        status: "working",
                        message: 'The payment was successful. I go to work now!'
                    }
                    sio_server.emit('tx_confirmed', msg);
                    clearInterval(intervat);
                    return;
                }
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
            sio_server.emit('tx_income', "wait for confirmation");
            // TODO: check if transaction is confirmed and send information
            checkForBalanceUpdate(address)
        }
    })

}





sio_server.on('connection', function (socket) {
    console.log('a user connected');
    let object = {
        name: NAME,
        status: status
    }
    sio_server.emit('welcome', object);
    socket.on('order', function (data) {
        console.log('a user ordered', data);
        account.generateCDA({
            timeoutAt: Math.floor(new Date('7-16-2186').getTime() / 1000), // Date in seconds
            expectedAmount: 1000,
            security: 2
        })
            .then(cda => {
                // Do something with the CDA
                console.log(JSON.stringify(cda, null, 1));
                let order = {
                    payment_cda: cda,
                    name: NAME,
                    status: "waiting for payment",
                    message: 'Thank you for the order. Please transfer 1000 IOTA to this address.'
                }
                sio_server.emit('ordered', order);
                let address = cda.address;
                console.log("address", address)
                sock.subscribe('tx')
                sock.on('message', msg => {
                    const data = msg.toString().split(' ') // Split to get topic & data
                    
                    if (data[0] == 'tx' && address.includes(data[2])) {
                        console.log("tx on watched address", data[2])
                        sio_server.emit('tx_income', "wait for confirmation");

                    }
                })

            })
            .catch(error => {
                // Handle errors here
                console.log(error);
            })
       

    });
});

server.listen(PORT, function () {
    console.log(`${NAME} listening on port: ${PORT}`);
    status = "waiting for order"

});


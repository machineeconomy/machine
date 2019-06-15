//in node.js
var app = require('express')();
var io = require('socket.io');
var server = require('http').createServer(app);
var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
var socket_path = '/socket'; // you need this if you want to connect to something other than the default socket.io path

let zmq = require('zeromq')
let sock = zmq.socket('sub')

// Connect to the devnet node's ZMQ port
sock.connect('tcp://zmq.devnet.iota.org:5556')

const dotenv = require('dotenv');
dotenv.config();

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

const account = createAccount({
    seed: Converter.trits(SEED),
    provider
});
console.log("account", account)


app.get('/', (req, res) => res.send(`I AM ${NAME}`))

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


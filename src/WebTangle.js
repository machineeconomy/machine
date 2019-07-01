const iotaCore = require('@iota/core')

// Local node to connect to;
const provider = 'https://nodes.devnet.thetangle.org:443';

const iota = iotaCore.composeAPI({
    provider: provider
})

const { socketServer } = require('./WebSockets.js')

const { log } = require('./Logger.js')
const { nextIndex, getCurrentIndex, saveCurrentBalance, getCurrentBalance } = require('./Database.js')

const SEED = process.env.SEED;
const NAME = process.env.NAME


const zmq = require('zeromq')
const sock = zmq.socket('sub')

// Connect to the devnet node's ZMQ port
sock.connect('tcp://zmq.devnet.iota.org:5556')

const axios = require('axios');


// if the machine has no proivder, this const is empty.
const PROVIDER_URL = process.env.PROVIDER_URL

let status = "booting";

let counter = 0;

const should_balance = 1;


const fetchAndBroadcastBalanceFrom = async function (address) {

    log("fetchAndBroadcastBalanceFrom: " + address)
    let startTime = new Date();

    iota.getBalances([address], 100)
        .then(({ balances }) => {
            // ...
            let balance = balances[0]
            saveCurrentBalance(balance)
            socketServer.emit('new_balance', { balance: balance});
            let endTime = new Date();
            var timeDiff = endTime - startTime; //in ms
            // strip the ms
            timeDiff /= 1000;

            // get seconds 
            var seconds = Math.round(timeDiff);
            log(`Time to fetch balance(${balance} iota): ${seconds} seconds`)
        })
        .catch(err => {
            log("ERROR fetchAndBroadcastBalanceFrom: " + err)
        })
    /**
        let startTime = new Date();
        iota.getAccountData(SEED, {
            start: 0,
            security: 2
        })
            .then(accountData => {
                const { balance } = accountData
                let object = {
                    balance: balance
                }
                socketServer.emit('new_balance', object);
                let endTime = new Date();
                var timeDiff = endTime - startTime; //in ms
                // strip the ms
                timeDiff /= 1000;

                // get seconds 
                var seconds = Math.round(timeDiff);
                log(`Time to fetch balance: ${seconds} seconds`)
            })
            .catch(err => {
                log("get machine account data error: " + err)
            })


    */
}

const transferTokensTo = function (address) {

    let iota_amount = 1
    log('Send 1 IOTA token to: ' + address);

    let currentBalance = getCurrentBalance()

    let options = {
        'inputs': [{
            address: getCurrentAddress(),
            keyIndex: getCurrentIndex(),
            balance: currentBalance,
            security: 2,
        }]
    }

    const transfers = [
        {
            address: address,
            value: iota_amount, // 1 iota
            tag: "AKITA9MACHINE", // optional tag of `0-27` trytes
            message: "" // optional message in trytes
        }
    ];

    let newAddress = getNewIotaAddress()

    if (currentBalance > 1) {
        log('current balance is: ${}. Send them to new address.  ')
        transfers.push(
            {
                address: newAddress,
                value: currentBalance - iota_amount,
                tag: "AKITA9MACHINE", // optional tag of `0-27` trytes
                message: "" // optional message in trytes
            }
        );
    }


    iota
        .prepareTransfers(SEED, transfers, options)
        .then(trytes => iota.sendTrytes(trytes, 3, 9))
        .then(bundle => {
            log('Transfer sent: https://devnet.thetangle.org/transaction/' + bundle[0].hash)
            let data = {
                status: "working",
                message: 'Sent IOTA to the energy provider. I wait for energy now.'
            }
            socketServer.emit('status', data);
            log(data.message);
            fetchAndBroadcastBalanceFrom(newAddress)
        })
        .catch(err => {
            log("ERROR transferTokensTo" + err)
        })
}

var checkForBalanceUpdateOn = function (address) {
    var intervat = setInterval(function () {
        counter++
        iota.getBalances([address], 100)
            .then(({ balances }) => {
                let data = {};

                if (balances[0] && balances[0] >= should_balance) {
                    saveCurrentBalance(balances[0])
                    // Check, if machine has a provider
                    if (PROVIDER_URL && PROVIDER_URL != "false") {
                        // if yes - payout the provider
                        payoutProvider()
                        data = {
                            status: "payout_provider",
                            message: 'The payment was successful. I will pay my provider!'
                        }
                    } else {
                        // if no, just start working
                        data = {
                            status: "working",
                            message: 'The payment was successful. I will provide energy.!'
                        }

                    }
                    clearInterval(intervat);
                    // send update to websocket channel.
                    socketServer.emit('status', data);
                    log(data.message);
                    counter = 0;

                } else {
                    // send message every 5 checks (15 seconds)
                    if (counter % 5 == 0) {
                        msg = {
                            status: "waiting_for_tx_confirm",
                            message: '... still waiting for confirmation.'
                        }
                        // send update to websocket channel.
                        socketServer.emit('status', msg);
                        log(`Balance is ${balances[0]}, still waiting for confirmation.`)
                    }
                }

            })
            .catch(err => {
                // handle error
                console.log("error getBalances: ", err);

            })
    }, 3000);
}


const payoutProvider = function () {

    log("Payout provider: " + PROVIDER_URL)
    axios
        .post(PROVIDER_URL + "/orders/", {})
        .then(function (response) {
            if (response.status == 200) {
                let address = response.data;
                transferTokensTo(address);
            }
        })
        .catch(function (error) {
            log("PROVIDER ORDER REQUEST ERROR: " + error)
        });

}


const watchAddressOnNode = function (address) {
    log("watchAddressOnNode: " + address)
    sock.subscribe('tx')
    sock.on('message', msg => {
        const data = msg.toString().split(' ') // Split to get topic & data

        if (data[0] == 'tx' && address.includes(data[2])) {
            log("tx found on: " + data[2])
            let msg = {
                status: "waiting_for_tx_confirm",
                message: 'The transaction has arrived. Wait for confirmation.'
            }
            socketServer.emit('status', msg);
            checkForBalanceUpdateOn(address)
        }
    })
}



const getNewIotaAddress = function () {
    let address = iotaCore.generateAddress(SEED, nextIndex(), 2)
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
    return address;
}
const getCurrentAddress = function () {
    return iotaCore.generateAddress(SEED, getCurrentIndex(), 2);
}


module.exports = {
    fetchAndBroadcastBalanceFrom,
    checkForBalanceUpdateOn,
    watchAddressOnNode,
    getNewIotaAddress,
    getCurrentAddress
}
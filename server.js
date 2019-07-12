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

const sh = require('shelljs');
const ps = require('python-shell');
const js = require('./hello_scripts/hello_javascript.js');


router.get('/', (req, res) => res.sendFile(path.join(__dirname + '/frontend/index.html')));

router.post('/orders', function (request, response) {
    log("New incoming order... generate new address.")
    let address = getNewIotaAddress()

    // send reponse with address.
    response.send(address)
});

router.post('/hello_shell', function (request, response) {

    const { stdout, stderr, code } = sh.exec('./hello_scripts/hello_shell.sh', { silent: true })
    console.log("stdout", stdout)
    console.log("stderr", stderr)
    console.log("code", code)

    response.send(stdout)
});

router.post('/hello_python', function (request, response) {

    ps.PythonShell.run('.hello_scripts/hello_python.py', {}, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        response.send(results[0])

    });
});

router.post('/hello_javascript', function (request, response) {
    let result = js.hello_javascript();
    response.send(result)

});

router.post('/hello_rust', function (request, response) {
    const { stdout, stderr, code } = sh.exec('./hello_scripts/hello_rust', { silent: true })
    console.log("stdout", stdout)
    console.log("stderr", stderr)
    console.log("code", code)

    response.send(stdout)
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